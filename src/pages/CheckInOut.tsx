import React, { useState } from 'react';
import { Asset, CheckInOutRecord } from '../types';
import { Search, LogIn, LogOut, Clock } from 'lucide-react';

interface CheckInOutProps {
  assets: Asset[];
  onUpdateAsset: (asset: Asset) => void;
  checkInOutRecords: CheckInOutRecord[];
  onAddRecord: (record: CheckInOutRecord) => void;
}

const CheckInOut: React.FC<CheckInOutProps> = ({ 
  assets, 
  onUpdateAsset, 
  checkInOutRecords, 
  onAddRecord 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [action, setAction] = useState<'check-in' | 'check-out'>('check-out');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const filteredAssets = assets.filter(asset =>
    asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setAction(asset.status === 'checked-out' ? 'check-in' : 'check-out');
    setAssignedTo(asset.assignedTo || '');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const now = new Date().toISOString();
    
    const updatedAsset: Asset = {
      ...selectedAsset,
      status: action === 'check-out' ? 'checked-out' : 'checked-in',
      assignedTo: action === 'check-out' ? assignedTo : undefined,
      checkOutDate: action === 'check-out' ? now : selectedAsset.checkOutDate,
      checkInDate: action === 'check-in' ? now : undefined,
      notes: notes || selectedAsset.notes
    };

    const record: CheckInOutRecord = {
      id: Date.now().toString(),
      assetId: selectedAsset.assetId,
      employeeName: assignedTo || selectedAsset.employeeName,
      action,
      timestamp: now,
      notes: notes || undefined
    };

    onUpdateAsset(updatedAsset);
    onAddRecord(record);
    
    // Reset form
    setSelectedAsset(null);
    setAssignedTo('');
    setNotes('');
    setSearchTerm('');
  };

  const recentRecords = checkInOutRecords
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Check In/Out Assets</h1>
        <p className="text-gray-600">Manage asset assignments and returns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Asset</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Asset ID, Name, or Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleAssetSelect(asset)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAsset?.id === asset.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{asset.assetId}</p>
                    <p className="text-sm text-gray-600">{asset.assetName}</p>
                    <p className="text-xs text-gray-500">{asset.employeeName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    asset.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                    asset.status === 'checked-out' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check In/Out Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedAsset ? `${action === 'check-out' ? 'Check Out' : 'Check In'} Asset` : 'Select an Asset'}
          </h3>

          {selectedAsset ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{selectedAsset.assetId}</p>
                <p className="text-sm text-gray-600">{selectedAsset.assetName}</p>
                <p className="text-xs text-gray-500">Current: {selectedAsset.employeeName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="check-out"
                      checked={action === 'check-out'}
                      onChange={(e) => setAction(e.target.value as 'check-out')}
                      disabled={selectedAsset.status === 'checked-out'}
                      className="mr-2"
                    />
                    <LogOut className="h-4 w-4 mr-1" />
                    Check Out
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="check-in"
                      checked={action === 'check-in'}
                      onChange={(e) => setAction(e.target.value as 'check-in')}
                      disabled={selectedAsset.status === 'checked-in'}
                      className="mr-2"
                    />
                    <LogIn className="h-4 w-4 mr-1" />
                    Check In
                  </label>
                </div>
              </div>

              {action === 'check-out' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To *
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                    className="input-field"
                    placeholder="Employee name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Additional notes..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
              >
                {action === 'check-out' ? <LogOut className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                {action === 'check-out' ? 'Check Out Asset' : 'Check In Asset'}
              </button>
            </form>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Select an asset from the list to check in or out
            </p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.assetId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                      record.action === 'check-out' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {record.action === 'check-out' ? <LogOut className="h-3 w-3 mr-1" /> : <LogIn className="h-3 w-3 mr-1" />}
                      {record.action.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;