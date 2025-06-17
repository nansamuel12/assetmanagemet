import React, { useState } from 'react';
import { Asset, CheckInOutRecord } from '../types';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';
import { exportToPDF } from '../utils/assetUtils';

interface ReportsProps {
  assets: Asset[];
  checkInOutRecords: CheckInOutRecord[];
}

const Reports: React.FC<ReportsProps> = ({ assets, checkInOutRecords }) => {
  const [reportType, setReportType] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const departments = [...new Set(assets.map(asset => asset.department))];
  const assetTypes = [...new Set(assets.map(asset => asset.assetType))];

  const getFilteredAssets = () => {
    return assets.filter(asset => {
      const matchesDepartment = !selectedDepartment || asset.department === selectedDepartment;
      const matchesAssetType = !selectedAssetType || asset.assetType === selectedAssetType;
      return matchesDepartment && matchesAssetType;
    });
  };

  const generateOverviewReport = () => {
    const filteredAssets = getFilteredAssets();
    
    return {
      totalAssets: filteredAssets.length,
      checkedIn: filteredAssets.filter(a => a.status === 'checked-in').length,
      checkedOut: filteredAssets.filter(a => a.status === 'checked-out').length,
      maintenance: filteredAssets.filter(a => a.status === 'maintenance').length,
      retired: filteredAssets.filter(a => a.status === 'retired').length,
      byDepartment: filteredAssets.reduce((acc, asset) => {
        acc[asset.department] = (acc[asset.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byAssetType: filteredAssets.reduce((acc, asset) => {
        acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byEmployeeType: filteredAssets.reduce((acc, asset) => {
        acc[asset.employeeType] = (acc[asset.employeeType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const generateDepartmentReport = () => {
    const filteredAssets = getFilteredAssets();
    
    return departments.map(dept => {
      const deptAssets = filteredAssets.filter(asset => asset.department === dept);
      return {
        department: dept,
        totalAssets: deptAssets.length,
        checkedIn: deptAssets.filter(a => a.status === 'checked-in').length,
        checkedOut: deptAssets.filter(a => a.status === 'checked-out').length,
        maintenance: deptAssets.filter(a => a.status === 'maintenance').length,
        assetTypes: deptAssets.reduce((acc, asset) => {
          acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    });
  };

  const generateAssetTypeReport = () => {
    const filteredAssets = getFilteredAssets();
    
    return assetTypes.map(type => {
      const typeAssets = filteredAssets.filter(asset => asset.assetType === type);
      return {
        assetType: type,
        totalAssets: typeAssets.length,
        checkedIn: typeAssets.filter(a => a.status === 'checked-in').length,
        checkedOut: typeAssets.filter(a => a.status === 'checked-out').length,
        maintenance: typeAssets.filter(a => a.status === 'maintenance').length,
        departments: typeAssets.reduce((acc, asset) => {
          acc[asset.department] = (acc[asset.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    });
  };

  const handleExportPDF = () => {
    exportToPDF('report-content', `asset-report-${reportType}-${Date.now()}.pdf`);
  };

  const overviewData = generateOverviewReport();
  const departmentData = generateDepartmentReport();
  const assetTypeData = generateAssetTypeReport();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive asset reports</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="btn-primary flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="overview">Overview</option>
              <option value="department">By Department</option>
              <option value="assettype">By Asset Type</option>
              <option value="activity">Activity Log</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type
            </label>
            <select
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {assetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="space-y-6">
        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{overviewData.totalAssets}</div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">{overviewData.checkedIn}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">{overviewData.checkedOut}</div>
                <div className="text-sm text-gray-600">Checked Out</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-600">{overviewData.maintenance}</div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-red-600">{overviewData.retired}</div>
                <div className="text-sm text-gray-600">Retired</div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Department</h3>
              <div className="space-y-3">
                {Object.entries(overviewData.byDepartment).map(([dept, count]) => (
                  <div key={dept} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{dept}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(count / overviewData.totalAssets) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Type Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Type</h3>
              <div className="space-y-3">
                {Object.entries(overviewData.byAssetType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(count / overviewData.totalAssets) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'department' && (
          <div className="space-y-6">
            {departmentData.map((dept) => (
              <div key={dept.department} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{dept.department}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{dept.totalAssets}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{dept.checkedIn}</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{dept.checkedOut}</div>
                    <div className="text-xs text-gray-600">Checked Out</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600">{dept.maintenance}</div>
                    <div className="text-xs text-gray-600">Maintenance</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Asset Types:</h4>
                  {Object.entries(dept.assetTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-600">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {reportType === 'assettype' && (
          <div className="space-y-6">
            {assetTypeData.map((type) => (
              <div key={type.assetType} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{type.assetType}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{type.totalAssets}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{type.checkedIn}</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{type.checkedOut}</div>
                    <div className="text-xs text-gray-600">Checked Out</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600">{type.maintenance}</div>
                    <div className="text-xs text-gray-600">Maintenance</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">By Department:</h4>
                  {Object.entries(type.departments).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between text-sm">
                      <span className="text-gray-600">{dept}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {reportType === 'activity' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Log</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
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
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checkInOutRecords
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 50)
                    .map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.assetId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.action === 'check-out' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {record.action.replace('-', ' ').toUpperCase()}
                        </span>
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
        )}
      </div>
    </div>
  );
};

export default Reports;