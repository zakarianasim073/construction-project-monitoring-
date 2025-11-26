
export enum Unit {
  SQM = 'SQM',
  CUM = 'CUM',
  KG = 'KG',
  NOS = 'NOS',
  RMT = 'RMT',
  CFT = 'CFT'
}

export type UserRole = 'DIRECTOR' | 'MANAGER' | 'ACCOUNTANT' | 'ENGINEER';

export interface User {
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface CostBreakdown {
  material: number;
  labor: number;
  equipment: number;
  overhead: number;
}

export interface CostAnalysis {
  unitCost: number; // Actual cost per unit
  breakdown: CostBreakdown;
}

export interface BOQItem {
  id: string;
  description: string;
  unit: Unit;
  rate: number;
  plannedQty: number;
  executedQty: number; // From Site Execution
  costAnalysis?: CostAnalysis;
}

export interface DPR {
  id: string;
  date: string;
  activity: string;
  location: string;
  laborCount: number;
  remarks: string;
  linkedBoqId?: string; // Optional link to BOQ
  workDoneQty?: number; // Quantity achieved today
}

export interface Bill {
  id: string;
  type: 'CLIENT_RA' | 'VENDOR_INVOICE';
  entityName: string; // Client or Vendor Name
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING';
}

export interface Liability {
  id: string;
  description: string;
  type: 'RETENTION' | 'PENDING_PO' | 'UNBILLED_WORK';
  amount: number;
  dueDate: string;
}

export type DocumentCategory = 'CONTRACT' | 'DRAWING' | 'PERMIT' | 'REPORT' | 'BILL' | 'OTHER';
export type ModuleType = 'MASTER' | 'SITE' | 'FINANCE' | 'LIABILITY' | 'GENERAL';

export interface ProjectDocument {
  id: string;
  name: string;
  type: string; // e.g., 'PDF', 'JPG', 'XLSX'
  category: DocumentCategory;
  module: ModuleType;
  uploadDate: string;
  size: string;
  url?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  contractValue: number;
  startDate: string;
  endDate: string;
  boq: BOQItem[];
  dprs: DPR[];
  bills: Bill[];
  liabilities: Liability[];
  documents: ProjectDocument[];
}
