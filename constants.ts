
import { ProjectState, Unit } from './types';

export const MOCK_PROJECTS: ProjectState[] = [
  {
    id: 'P001',
    name: "Bank Protective Work at Munshirhat, Gaibandha (BWDB)",
    status: 'ACTIVE',
    contractValue: 181592188, // Based on Page 28 HB-NT JV quoted amount
    startDate: "2023-09-25", // From RA Bill header
    endDate: "2026-03-28", // From RA Bill header
    boq: [
      { 
        id: '40-920', 
        description: 'Earth work in cutting and filling of eroded bank', 
        unit: Unit.CUM, 
        rate: 123.59, 
        plannedQty: 27977, 
        executedQty: 27977,
        costAnalysis: {
          unitCost: 115.00,
          breakdown: { material: 80, labor: 25, equipment: 10, overhead: 0 }
        }
      },
      { 
        id: '40-370-20', 
        description: 'Supply, Filling and Dumping of Geo-bag', 
        unit: Unit.NOS, 
        rate: 295.00, 
        plannedQty: 20404, 
        executedQty: 20404,
        costAnalysis: {
          unitCost: 280.00,
          breakdown: { material: 220, labor: 40, equipment: 10, overhead: 10 }
        }
      },
      { 
        id: '40-190-35', 
        description: 'CC blocks(1:2.5:5): 40cm x 40cm x 40cm', 
        unit: Unit.NOS, 
        rate: 852.00, 
        plannedQty: 47000, 
        executedQty: 18896,
        costAnalysis: {
          unitCost: 910.00, // Loss making example
          breakdown: { material: 600, labor: 200, equipment: 80, overhead: 30 }
        }
      },
      { 
        id: '40-190-50', 
        description: 'CC blocks(1:2.5:5): 30cm x 30cm x 30cm', 
        unit: Unit.NOS, 
        rate: 362.00, 
        plannedQty: 70370, 
        executedQty: 32049,
        costAnalysis: {
          unitCost: 330.00, 
          breakdown: { material: 200, labor: 100, equipment: 20, overhead: 10 }
        }
      },
      { 
        id: '40-190-40', 
        description: 'CC blocks(1:2.5:5): 40cm x 40cm x 20cm', 
        unit: Unit.NOS, 
        rate: 432.00, 
        plannedQty: 118260, 
        executedQty: 15344,
        costAnalysis: {
          unitCost: 400.00,
          breakdown: { material: 280, labor: 100, equipment: 10, overhead: 10 }
        }
      },
      { 
        id: '40-290-10', 
        description: 'Dumping of stone/boulders/blocks by boat: Within 200m', 
        unit: Unit.CUM, 
        rate: 1638.00, 
        plannedQty: 3926.39, 
        executedQty: 981.60,
        costAnalysis: {
          unitCost: 1400.00,
          breakdown: { material: 1000, labor: 300, equipment: 100, overhead: 0 }
        }
      },
      { 
        id: '40-500-40', 
        description: 'Supply and laying geotex filter', 
        unit: Unit.SQM, 
        rate: 202.00, 
        plannedQty: 24187.50, 
        executedQty: 12500,
        costAnalysis: {
          unitCost: 180.00,
          breakdown: { material: 150, labor: 30, equipment: 0, overhead: 0 }
        }
      },
    ],
    dprs: [
      { id: '105', date: '2024-11-19', activity: 'CC Block Manufacturing (Package-Munshirhat 01)', location: 'Casting Yard', laborCount: 30, remarks: 'Produced 97 nos 50x50x50 and 246 nos 40x40x40 blocks. Cement consumption 138 bags.', linkedBoqId: '40-190-35', workDoneQty: 97 },
      { id: '106', date: '2024-11-19', activity: 'Geo-Bag Dumping by Boat', location: 'River Bank', laborCount: 19, remarks: 'Cumulative dumping progress 46.87%', linkedBoqId: '40-370-20', workDoneQty: 150 },
      { id: '107', date: '2024-12-30', activity: 'Monthly Reconciliation', location: 'Site Office', laborCount: 4, remarks: 'Gaibandha Munshirhat Block Casting Work Done Vol: 103385 cft' },
    ],
    bills: [
      { id: 'RA-08', type: 'CLIENT_RA', entityName: 'BWDB Gaibandha O&M Division', amount: 12500000, date: '2024-10-15', status: 'PAID' },
      { id: 'RA-09', type: 'CLIENT_RA', entityName: 'BWDB Gaibandha O&M Division', amount: 8599950, date: '2025-04-07', status: 'PENDING' },
      { id: 'SUP-01', type: 'VENDOR_INVOICE', entityName: 'Hassan & Brothers Ltd (Supplier)', amount: 450000, date: '2024-11-20', status: 'PAID' },
      { id: 'SUP-02', type: 'VENDOR_INVOICE', entityName: 'Sweet Chairman (Sub-contractor)', amount: 155762, date: '2024-11-19', status: 'PENDING' },
    ],
    liabilities: [
      { id: 'L001', description: 'Security Deposit (Retention 10%)', type: 'RETENTION', amount: 1250000, dueDate: '2026-03-28' },
      { id: 'L002', description: 'Pending PO - Stone Chips (Sylhet)', type: 'PENDING_PO', amount: 867802, dueDate: '2024-12-01' },
      { id: 'L003', description: 'Unbilled Labor (Nov)', type: 'UNBILLED_WORK', amount: 45000, dueDate: '2024-12-05' },
    ],
    documents: [
      { id: 'D001', name: 'Running Bill RA-09.pdf', type: 'PDF', category: 'BILL', module: 'FINANCE', uploadDate: '2025-04-07', size: '1.4 MB' },
      { id: 'D002', name: 'Daily Progress Report_19.11.25.pdf', type: 'PDF', category: 'REPORT', module: 'SITE', uploadDate: '2024-11-19', size: '2.1 MB' },
      { id: 'D003', name: 'Profit_Loss_Summary_30.12.2024.xlsx', type: 'XLSX', category: 'REPORT', module: 'FINANCE', uploadDate: '2024-12-30', size: '0.5 MB' },
      { id: 'D004', name: 'BOQ_Schedule.pdf', type: 'PDF', category: 'CONTRACT', module: 'MASTER', uploadDate: '2023-09-01', size: '3.8 MB' },
    ]
  },
  {
    id: 'P002',
    name: "River Bank Protection at Kurigram",
    status: 'ON_HOLD',
    contractValue: 95000000,
    startDate: "2024-01-10",
    endDate: "2025-06-30",
    boq: [
      { 
        id: 'K-01', 
        description: 'Excavation Work', 
        unit: Unit.CUM, 
        rate: 110.00, 
        plannedQty: 50000, 
        executedQty: 12000,
        costAnalysis: {
          unitCost: 95.00,
          breakdown: { material: 0, labor: 60, equipment: 35, overhead: 0 }
        }
      },
      { 
        id: 'K-02', 
        description: 'CC Block Casting', 
        unit: Unit.NOS, 
        rate: 450.00, 
        plannedQty: 80000, 
        executedQty: 0,
        costAnalysis: {
          unitCost: 400.00,
          breakdown: { material: 300, labor: 80, equipment: 10, overhead: 10 }
        }
      },
    ],
    dprs: [],
    bills: [],
    liabilities: [],
    documents: []
  }
];
