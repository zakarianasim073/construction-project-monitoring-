
import React, { useState } from 'react';
import { ProjectState, ProjectDocument, BOQItem, UserRole } from '../types';
import { Download, PlusCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Lock, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DocumentManager from './DocumentManager';

interface FinancialControlProps {
  data: ProjectState;
  onAddDocument: (doc: ProjectDocument) => void;
  userRole: UserRole;
}

const FinancialControl: React.FC<FinancialControlProps> = ({ data, onAddDocument, userRole }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const canAddClientBill = userRole === 'MANAGER' || userRole === 'DIRECTOR';
  const canAddVendorBill = userRole === 'ACCOUNTANT' || userRole === 'DIRECTOR';
  const canUploadDoc = canAddClientBill || canAddVendorBill;

  const clientBills = data.bills.filter(b => b.type === 'CLIENT_RA');
  const vendorBills = data.bills.filter(b => b.type === 'VENDOR_INVOICE');

  // Revenue & Expense Calculations
  const totalRevenue = clientBills.reduce((acc, b) => acc + b.amount, 0); // Total Billed
  const totalReceived = clientBills.filter(b => b.status === 'PAID').reduce((acc, b) => acc + b.amount, 0);
  const totalPending = clientBills.filter(b => b.status === 'PENDING').reduce((acc, b) => acc + b.amount, 0);
  
  const totalExpenses = vendorBills.reduce((acc, b) => acc + b.amount, 0); // Total Expenses
  const netFinancialPosition = totalRevenue - totalExpenses; // Billed Profit

  // Operational Profit Analysis (Based on BOQ Work Done)
  const analyzedItems = data.boq.filter(item => item.executedQty > 0 && item.costAnalysis);
  const totalOperationalProfit = analyzedItems.reduce((acc, item) => {
    const margin = item.rate - (item.costAnalysis?.unitCost || 0);
    return acc + (margin * item.executedQty);
  }, 0);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const BillTable = ({ bills, title }: { bills: typeof data.bills, title: string }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <button className="p-2 text-slate-400 hover:text-slate-600">
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Bill ID</th>
              <th className="px-6 py-3 whitespace-nowrap">Entity / Description</th>
              <th className="px-6 py-3 whitespace-nowrap">Date</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">Amount</th>
              <th className="px-6 py-3 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map(bill => (
              <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-700">{bill.id}</td>
                <td className="px-6 py-3 text-slate-600 truncate max-w-[200px]">{bill.entityName}</td>
                <td className="px-6 py-3 text-slate-500">{bill.date}</td>
                <td className="px-6 py-3 text-right font-medium text-slate-900">৳{bill.amount.toLocaleString()}</td>
                <td className="px-6 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    bill.status === 'PAID' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  No bills found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Control</h1>
          <p className="text-slate-500">Track Bills, Costs, and Profitability</p>
        </div>
        <div className="flex gap-2">
          {canAddVendorBill && (
             <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </button>
          )}
          {canAddClientBill && (
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
              <PlusCircle className="w-4 h-4" />
              Create Client Bill
            </button>
          )}
          {!canAddClientBill && !canAddVendorBill && (
            <div className="flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
             <Lock className="w-3 h-3" />
             <span>Read Only</span>
           </div>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Wallet className="w-5 h-5" />
             </div>
             <div className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
               Received: ৳{(totalReceived/1000000).toFixed(2)}M
             </div>
           </div>
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Revenue</p>
           <h2 className="text-2xl font-bold text-slate-800 mt-1">
             ৳{totalRevenue.toLocaleString()}
           </h2>
           <p className="text-xs text-slate-400 mt-1">Total Billed to Client</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <ArrowDownRight className="w-5 h-5" />
             </div>
           </div>
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Expenses</p>
           <h2 className="text-2xl font-bold text-slate-800 mt-1">
             ৳{totalExpenses.toLocaleString()}
           </h2>
           <p className="text-xs text-slate-400 mt-1">Vendor & Supplier Bills</p>
        </div>

        {/* Net Financial Profit */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
             <div className={`p-2 rounded-lg ${netFinancialPosition >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <ArrowUpRight className="w-5 h-5" />
             </div>
           </div>
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Net Financial P/L</p>
           <h2 className={`text-2xl font-bold mt-1 ${netFinancialPosition >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
             {netFinancialPosition >= 0 ? '+' : ''}৳{netFinancialPosition.toLocaleString()}
           </h2>
           <p className="text-xs text-slate-400 mt-1">Revenue - Expenses</p>
        </div>

        {/* Operational Profit (BOQ Analysis) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden border-l-4 border-l-violet-500">
           <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                <TrendingUp className="w-5 h-5" />
             </div>
           </div>
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Operational Profit</p>
           <h2 className={`text-2xl font-bold mt-1 ${totalOperationalProfit >= 0 ? 'text-violet-700' : 'text-red-600'}`}>
             {totalOperationalProfit >= 0 ? '+' : ''}৳{totalOperationalProfit.toLocaleString()}
           </h2>
           <p className="text-xs text-slate-400 mt-1">Based on BOQ Unit Margins</p>
        </div>
      </div>

      {/* Item-wise Profit & Loss Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Item-wise Cost & Profit Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Comparison of Quoted Rate vs. Actual Unit Cost</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 w-8"></th>
                <th className="px-6 py-3">Item Description</th>
                <th className="px-6 py-3 text-right">Executed Qty</th>
                <th className="px-6 py-3 text-right">Quoted Rate</th>
                <th className="px-6 py-3 text-right">Actual Unit Cost</th>
                <th className="px-6 py-3 text-right">Variance</th>
                <th className="px-6 py-3 text-right">Total P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.boq.map((item) => {
                if (!item.costAnalysis || item.executedQty === 0) return null;
                const margin = item.rate - item.costAnalysis.unitCost;
                const totalPL = margin * item.executedQty;
                const isProfit = margin >= 0;

                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedRow === item.id ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleRow(item.id)}
                    >
                      <td className="px-6 py-4 text-center">
                        {expandedRow === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {item.description}
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">{item.executedQty.toLocaleString()} <span className="text-xs text-slate-400">{item.unit}</span></td>
                      <td className="px-6 py-4 text-right text-slate-900">৳{item.rate.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-900">৳{item.costAnalysis.unitCost.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-right font-medium ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {margin > 0 ? '+' : ''}{margin.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                         {totalPL > 0 ? '+' : ''}{totalPL.toLocaleString()}
                      </td>
                    </tr>
                    {expandedRow === item.id && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="ml-8 bg-white p-4 rounded-lg border border-slate-200">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Cost Breakdown (Per Unit)</h4>
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-xs text-slate-500">Material</p>
                                <p className="font-medium text-slate-800">৳{item.costAnalysis.breakdown.material}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Labor</p>
                                <p className="font-medium text-slate-800">৳{item.costAnalysis.breakdown.labor}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Equipment</p>
                                <p className="font-medium text-slate-800">৳{item.costAnalysis.breakdown.equipment}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Overhead</p>
                                <p className="font-medium text-slate-800">৳{item.costAnalysis.breakdown.overhead}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <BillTable bills={clientBills} title="Client RA Bills" />
        <BillTable bills={vendorBills} title="Vendor Invoices (Payables)" />
      </div>

      <DocumentManager 
        documents={data.documents} 
        onAddDocument={onAddDocument} 
        filterModule="FINANCE" 
        compact={true}
        allowUpload={canUploadDoc}
      />
    </div>
  );
};

export default FinancialControl;
