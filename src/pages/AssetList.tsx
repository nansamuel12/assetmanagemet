import React, { useState } from 'react';
import { Asset } from '../types';
import AssetCard from '../components/AssetCard';
import SearchFilter from '../components/SearchFilter';

interface AssetListProps {
  assets: Asset[];
  onEditAsset: (asset: Asset) => void;
  onCheckInOut: (asset: Asset) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, onEditAsset, onCheckInOut }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const departments = [...new Set(assets.map(asset => asset.department))];
  const assetTypes = [...new Set(assets.map(asset => asset.assetType))];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchTerm === '' || 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === '' || asset.assetType === filterType;
    const matchesDepartment = filterDepartment === '' || asset.department === filterDepartment;
    const matchesStatus = filterStatus === '' || asset.status === filterStatus;

    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600">Manage and track all your assets</p>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        filterDepartment={filterDepartment}
        onDepartmentChange={setFilterDepartment}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        departments={departments}
        assetTypes={assetTypes}
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredAssets.length} of {assets.length} assets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onEdit={onEditAsset}
            onCheckInOut={onCheckInOut}
          />
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No assets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AssetList;