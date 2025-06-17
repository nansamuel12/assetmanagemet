import React, { useState } from 'react';
import { Asset } from '../types';
import { generateAssetId, generateBarcode } from '../utils/assetUtils';
import { Plus, Save } from 'lucide-react';

interface RegisterAssetProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
}

const RegisterAsset: React.FC<RegisterAssetProps> = ({ assets, onAddAsset }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    employeeType: 'employee' as 'employee' | 'guest',
    assetType: '',
    assetName: '',
    serialNumber: '',
    notes: ''
  });

  const departments = [
    'IT Department',
    'Human Resources',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'Customer Service',
    'Administration'
  ];

  const assetTypes = [
    'Computer',
    'Laptop',
    'Monitor',
    'Printer',
    'Phone',
    'Tablet',
    'Keyboard',
    'Mouse',
    'Headset',
    'Camera',
    'Projector',
    'Scanner'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lastAsset = assets.sort((a, b) => 
      parseInt(b.assetId.split('-')[1]) - parseInt(a.assetId.split('-')[1])
    )[0];
    
    const newAssetId = generateAssetId(lastAsset?.assetId);
    const barcode = generateBarcode(newAssetId);
    
    const newAsset: Asset = {
      id: Date.now().toString(),
      assetId: newAssetId,
      employeeName: formData.employeeName,
      department: formData.department,
      employeeType: formData.employeeType,
      assetType: formData.assetType,
      assetName: formData.assetName,
      serialNumber: formData.serialNumber || undefined,
      registerDate: new Date().toISOString(),
      status: 'checked-in',
      notes: formData.notes || undefined,
      barcode: barcode
    };

    onAddAsset(newAsset);
    
    // Reset form
    setFormData({
      employeeName: '',
      department: '',
      employeeType: 'employee',
      assetType: '',
      assetName: '',
      serialNumber: '',
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register New Asset</h1>
        <p className="text-gray-600">Add a new asset to the management system</p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Full Name *
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter employee full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Type *
              </label>
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="employee">Employee</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type *
              </label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Dell Laptop XPS 13"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter serial number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Additional notes about the asset..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                employeeName: '',
                department: '',
                employeeType: 'employee',
                assetType: '',
                assetName: '',
                serialNumber: '',
                notes: ''
              })}
              className="btn-secondary"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Register Asset
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset ID Generation</h3>
        <p className="text-sm text-gray-600 mb-2">
          Asset IDs are automatically generated in the format: <code className="bg-gray-100 px-2 py-1 rounded">TOP-XXXXXX</code>
        </p>
        <p className="text-sm text-gray-600">
          Next Asset ID: <span className="font-medium text-primary-600">
            {generateAssetId(assets.sort((a, b) => 
              parseInt(b.assetId.split('-')[1]) - parseInt(a.assetId.split('-')[1])
            )[0]?.assetId)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterAsset;