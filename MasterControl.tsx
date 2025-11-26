
import React from 'react';
import { ProjectState, ProjectDocument, UserRole } from '../types';
import DocumentManager from './DocumentManager';

interface MasterControlProps {
  data: ProjectState;
  onAddDocument: (doc: ProjectDocument) => void;
  userRole: UserRole;
}

const MasterControl: React.FC<MasterControlProps> = ({ data, onAddDocument, userRole }) => {
  const canUploadDoc = userRole === 'DIRECTOR' || userRole === 'MANAGER';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Control (Baseline)</h1>
          <p className="text-slate-500">Fixed Contract Data, BOQ & Budget</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-500 uppercase">Project Name</h4>
          <p className="text-lg font-medium text-slate-900 mt-1">{data.name}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-500 uppercase">Contract Duration</h4>
          <p className="text-lg font-medium text-slate-900 mt-1">{data.startDate} to {data.endDate}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-500 uppercase">Total Contract Value</h4>
          <p className="text-lg font-medium text-slate-900 mt-1">৳{data.contractValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Bill of Quantities (BOQ)</h3>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">Rev 1.0</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Item ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4 text-right">Rate (৳)</th>
                <th className="px-6 py-4 text-right">Planned Qty</th>
                <th className="px-6 py-4 text-right">Planned Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.boq.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 text-slate-700">{item.description}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-bold bg-slate-100 rounded w-fit">{item.unit}</td>
                  <td className="px-6 py-4 text-right text-slate-700">{item.rate.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-slate-700">{item.plannedQty.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">{(item.rate * item.plannedQty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-800">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right">Total Budget</td>
                <td className="px-6 py-4 text-right">
                  ৳{data.boq.reduce((acc, item) => acc + (item.rate * item.plannedQty), 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <DocumentManager 
        documents={data.documents} 
        onAddDocument={onAddDocument} 
        filterModule="MASTER" 
        compact={true} 
        allowUpload={canUploadDoc}
      />
    </div>
  );
};

export default MasterControl;
