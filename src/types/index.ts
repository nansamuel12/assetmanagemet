export interface Asset {
  id: string;
  assetId: string;
  employeeName: string;
  department: string;
  employeeType: 'employee' | 'guest';
  assetType: string;
  assetName: string;
  serialNumber?: string;
  registerDate: string;
  status: 'checked-in' | 'checked-out' | 'maintenance' | 'retired';
  assignedTo?: string;
  checkOutDate?: string;
  checkInDate?: string;
  notes?: string;
  barcode: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface AssetType {
  id: string;
  name: string;
  category: string;
}

export interface CheckInOutRecord {
  id: string;
  assetId: string;
  employeeName: string;
  action: 'check-in' | 'check-out';
  timestamp: string;
  notes?: string;
}