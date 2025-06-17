import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import RegisterAsset from './pages/RegisterAsset';
import CheckInOut from './pages/CheckInOut';
import Reports from './pages/Reports';
import { Asset, CheckInOutRecord } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

// Sample data for demonstration
const sampleAssets: Asset[] = [
  {
    id: '1',
    assetId: 'TOP-000001',
    employeeName: 'John Smith',
    department: 'IT Department',
    employeeType: 'employee',
    assetType: 'Computer',
    assetName: 'Dell OptiPlex 7090',
    serialNumber: 'DL123456789',
    registerDate: '2024-01-15T10:30:00Z',
    status: 'checked-in',
    barcode: 'TOP000001',
    notes: 'Primary workstation'
  },
  {
    id: '2',
    assetId: 'TOP-000002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    employeeType: 'employee',
    assetType: 'Laptop',
    assetName: 'MacBook Pro 16"',
    serialNumber: 'MB987654321',
    registerDate: '2024-01-16T14:20:00Z',
    status: 'checked-out',
    assignedTo: 'Sarah Johnson',
    checkOutDate: '2024-01-16T14:20:00Z',
    barcode: 'TOP000002',
    notes: 'For remote work'
  },
  {
    id: '3',
    assetId: 'TOP-000003',
    employeeName: 'Mike Wilson',
    department: 'Finance',
    employeeType: 'guest',
    assetType: 'Monitor',
    assetName: 'Samsung 27" 4K Monitor',
    serialNumber: 'SM456789123',
    registerDate: '2024-01-17T09:15:00Z',
    status: 'maintenance',
    barcode: 'TOP000003',
    notes: 'Screen flickering issue'
  }
];

const sampleRecords: CheckInOutRecord[] = [
  {
    id: '1',
    assetId: 'TOP-000002',
    employeeName: 'Sarah Johnson',
    action: 'check-out',
    timestamp: '2024-01-16T14:20:00Z',
    notes: 'For remote work setup'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [assets, setAssets] = useLocalStorage<Asset[]>('assets', sampleAssets);
  const [checkInOutRecords, setCheckInOutRecords] = useLocalStorage<CheckInOutRecord[]>('checkInOutRecords', sampleRecords);

  const handleAddAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ));
  };

  const handleEditAsset = (asset: Asset) => {
    // For now, just log the asset to edit
    console.log('Edit asset:', asset);
    // In a real app, you'd open an edit modal or navigate to an edit page
  };

  const handleCheckInOut = (asset: Asset) => {
    setCurrentPage('checkinout');
  };

  const handleAddRecord = (record: CheckInOutRecord) => {
    setCheckInOutRecords(prev => [...prev, record]);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard assets={assets} />;
      case 'assets':
        return (
          <AssetList
            assets={assets}
            onEditAsset={handleEditAsset}
            onCheckInOut={handleCheckInOut}
          />
        );
      case 'register':
        return (
          <RegisterAsset
            assets={assets}
            onAddAsset={handleAddAsset}
          />
        );
      case 'checkinout':
        return (
          <CheckInOut
            assets={assets}
            onUpdateAsset={handleUpdateAsset}
            checkInOutRecords={checkInOutRecords}
            onAddRecord={handleAddRecord}
          />
        );
      case 'reports':
        return (
          <Reports
            assets={assets}
            checkInOutRecords={checkInOutRecords}
          />
        );
      default:
        return <Dashboard assets={assets} />;
    }
  };

  return (
    <Router>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </Router>
  );
}

export default App;