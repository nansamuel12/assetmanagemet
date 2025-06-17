import React from 'react';
import { Asset } from '../types';
import { formatDate } from '../utils/assetUtils';
import { Monitor, Smartphone, Printer, HardDrive, User, Calendar, Building } from 'lucide-react';
import Barcode from 'react-barcode';

interface AssetCardProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onCheckInOut?: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onEdit, onCheckInOut }) => {
  const getAssetIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'computer':
      case 'laptop':
        return Monitor;
      case 'phone':
      case 'mobile':
        return Smartphone;
      case 'printer':
        return Printer;
      default:
        return HardDrive;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const Icon = getAssetIcon(asset.assetType);

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{asset.assetName}</h3>
            <p className="text-sm text-gray-500">{asset.assetId}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
          {asset.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>{asset.employeeName} ({asset.employeeType})</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="h-4 w-4 mr-2" />
          <span>{asset.department}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(asset.registerDate)}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Barcode:</p>
        <div className="bg-white p-2 border rounded">
          <Barcode value={asset.barcode} width={1} height={30} fontSize={10} />
        </div>
      </div>

      {asset.serialNumber && (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Serial:</span> {asset.serialNumber}
        </p>
      )}

      <div className="flex space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(asset)}
            className="btn-secondary flex-1"
          >
            Edit
          </button>
        )}
        {onCheckInOut && (
          <button
            onClick={() => onCheckInOut(asset)}
            className="btn-primary flex-1"
          >
            {asset.status === 'checked-out' ? 'Check In' : 'Check Out'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssetCard;