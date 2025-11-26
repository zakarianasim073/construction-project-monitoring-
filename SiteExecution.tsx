
import React, { useState } from 'react';
import { ProjectState, ProjectDocument, DPR, UserRole } from '../types';
import DocumentManager from './DocumentManager';
import { MapPin, Users, Calendar, PlusCircle, X, ClipboardCheck, Lock } from 'lucide-react';

interface SiteExecutionProps {
  data: ProjectState;
  onAddDocument: (doc: ProjectDocument) => void;
  onAddDPR: (dpr: DPR) => void;
  userRole: UserRole;
}

const SiteExecution: React.FC<SiteExecutionProps> = ({ data, onAddDocument, onAddDPR, userRole }) => {
  const [isDprModalOpen, setIsDprModalOpen] = useState(false);
  
  const canAddDPR = userRole === 'ENGINEER' || userRole === 'DIRECTOR';
  const canUploadDoc = userRole === 'ENGINEER' || userRole === 'DIRECTOR';

  // DPR Form State
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityDesc, setActivityDesc] = useState('');
  const [location, setLocation] = useState('');
  const [laborCount, setLaborCount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [linkedBoqId, setLinkedBoqId] = useState('');
  const [workDoneQty, setWorkDoneQty] = useState(0);

  const handleCreateDPR = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate description if BOQ is selected and description is empty
    let finalDesc = activityDesc;
    if (linkedBoqId && !finalDesc) {
      const boqItem = data.boq.find(b => b.id === linkedBoqId);
      if (boqItem) finalDesc = boqItem.description;
    }

    const newDPR: DPR = {
      id: `DPR-${Date.now()}`,
      date: activityDate,
      activity: finalDesc || 'Site Activity',
      location: location || 'Site',
      laborCount: Number(laborCount),
      remarks,
      linkedBoqId: linkedBoqId || undefined,
      workDoneQty: Number(workDoneQty) > 0 ? Number(workDoneQty) : undefined
    };

    onAddDPR(newDPR);
    
    // Reset and Close
    setIsDprModalOpen(false);
    setActivityDesc('');
    setLocation('');
    setLaborCount(0);
    setRemarks('');
    setLinkedBoqId('');
    setWorkDoneQty(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Site Execution</h1>
          <p className="text-slate-500">Track Progress, Remaining Works & Daily Reports</p>
        </div>
        {canAddDPR ? (
          <button 
            onClick={() => setIsDprModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
          >
            <ClipboardCheck className="w-4 h-4" />
            Add Daily Progress
          </button>
        ) : (
           <div className="flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
             <Lock className="w-3 h-3" />
             <span>Read Only (Role: {userRole})</span>
           </div>
        )}
      </div>

      {/* Progress Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Physical Progress & Remaining Works</h3>
          <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
            Live from Site
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-1/3">Item Description</th>
                <th className="px-6 py-4 text-right">Planned Qty</th>
                <th className="px-6 py-4 text-right">Executed Qty</th>
                <th className="px-6 py-4 text-right font-semibold text-blue-700 bg-blue-50/50">Remaining Qty</th>
                <th className="px-6 py-4 text-right">Progress %</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.boq.map((item) => {
                const percent = Math.min(100, Math.round((item.executedQty / item.plannedQty) * 100));
                const remaining = Math.max(0, item.plannedQty - item.executedQty);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.description}
                      <div className="text-xs text-slate-400 font-normal mt-0.5">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">{item.plannedQty.toLocaleString()} <span className="text-xs">{item.unit}</span></td>
                    <td className="px-6 py-4 text-right text-slate-900 font-medium">{item.executedQty.toLocaleString()} <span className="text-xs">{item.unit}</span></td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 bg-blue-50/30">
                      {remaining.toLocaleString()} <span className="text-xs font-normal text-blue-400">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end gap-1">
                         <span className="text-xs font-bold text-slate-700">{percent}%</span>
                         <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${percent}%` }}></div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {percent >= 100 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Completed
                        </span>
                      ) : percent > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DPRs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Daily Progress Reports (DPR) Log</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white border border-blue-200 px-3 py-1 rounded-full">
              View History
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {data.dprs.map((dpr) => (
              <div key={dpr.id} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <h4 className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{dpr.activity}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{dpr.id}</span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dpr.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dpr.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dpr.laborCount} Workers</span>
                  </div>
                </div>
                
                {dpr.workDoneQty && dpr.linkedBoqId && (
                  <div className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
                    + {dpr.workDoneQty} Work Done Added
                  </div>
                )}
                
                {dpr.remarks && (
                  <div className="mt-3 text-xs text-slate-600 italic border-l-2 border-slate-200 pl-3">
                    "{dpr.remarks}"
                  </div>
                )}
              </div>
            ))}
            {data.dprs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No daily reports logged yet.</div>
            )}
          </div>
        </div>

        {/* Documents */}
        <DocumentManager 
          documents={data.documents} 
          onAddDocument={onAddDocument} 
          filterModule="SITE" 
          compact={true}
          allowUpload={canUploadDoc}
        />
      </div>

       {/* DPR Modal */}
       {isDprModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Add Daily Progress Report</h3>
              <button onClick={() => setIsDprModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateDPR} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Labor Count</label>
                   <input 
                    type="number"
                    min="0"
                    value={laborCount}
                    onChange={(e) => setLaborCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link to BOQ Item (Optional)</label>
                <select 
                  value={linkedBoqId}
                  onChange={(e) => setLinkedBoqId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">-- General Activity (No BOQ Update) --</option>
                  {data.boq.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.id} - {item.description.substring(0, 50)}...
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Select a BOQ item to update its Executed Quantity automatically.</p>
              </div>

              {linkedBoqId && (
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="block text-sm font-medium text-blue-800 mb-1">Work Done Today (Quantity)</label>
                    <div className="flex items-center gap-2">
                        <input 
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={workDoneQty}
                        onChange={(e) => setWorkDoneQty(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <span className="text-sm font-medium text-blue-600">
                            {data.boq.find(b => b.id === linkedBoqId)?.unit}
                        </span>
                    </div>
                 </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Description</label>
                <input 
                  type="text" 
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  placeholder={linkedBoqId ? "Auto-filled from BOQ if empty" : "e.g., Site Clearing, Mobilization"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Chainage 10+500"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks / Issues</label>
                <textarea 
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Any hindrances, material shortage, or general notes..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsDprModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteExecution;
