import React, { useState } from 'react';
import { ProjectState } from '../types';
import { 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Wallet,
  Sparkles 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateProjectInsights } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  data: ProjectState;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculate high-level metrics
  const totalPlannedValue = data.boq.reduce((sum, item) => sum + (item.plannedQty * item.rate), 0);
  const totalExecutedValue = data.boq.reduce((sum, item) => sum + (item.executedQty * item.rate), 0);
  const progressPercentage = Math.round((totalExecutedValue / totalPlannedValue) * 100) || 0;
  
  const totalLiabilities = data.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalBilled = data.bills.filter(b => b.type === 'CLIENT_RA').reduce((sum, b) => sum + b.amount, 0);

  const chartData = [
    { name: 'Planned', amount: totalPlannedValue },
    { name: 'Executed', amount: totalExecutedValue },
    { name: 'Billed', amount: totalBilled },
    { name: 'Liabilities', amount: totalLiabilities },
  ];

  const handleGenerateInsights = async () => {
    setLoadingInsight(true);
    const result = await generateProjectInsights(data);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Project Overview</h1>
          <p className="text-slate-500">Welcome back to {data.name}</p>
        </div>
        <button 
          onClick={handleGenerateInsights}
          disabled={loadingInsight}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
        >
          <Sparkles className="w-4 h-4" />
          {loadingInsight ? 'Analyzing Project...' : 'Ask AI Analyst'}
        </button>
      </div>

      {insight && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Insight Report
          </h3>
          <div className="prose prose-indigo max-w-none text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{progressPercentage}%</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contract Value</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">৳{(data.contractValue / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Fixed Baseline</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Billed</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">৳{totalBilled.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Invoiced to Client</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Liabilities</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">৳{totalLiabilities.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Pending + Retention</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Financial Snapshot</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `৳${value/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => `৳${value.toLocaleString()}`}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#8b5cf6', '#f97316'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;