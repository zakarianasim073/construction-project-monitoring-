
import React, { useState } from 'react';
import { ProjectDocument, DocumentCategory, ModuleType } from '../types';
import { 
  FileText, 
  Image, 
  File, 
  Search, 
  Filter, 
  UploadCloud, 
  Download, 
  X,
  FileSpreadsheet,
  Paperclip,
  Calendar
} from 'lucide-react';

interface DocumentManagerProps {
  documents: ProjectDocument[];
  onAddDocument: (doc: ProjectDocument) => void;
  filterModule?: ModuleType; // If provided, only shows docs for this module and hides module filter
  compact?: boolean; // For embedded view
  allowUpload?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  documents, 
  onAddDocument, 
  filterModule,
  compact = false,
  allowUpload = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [selectedModule, setSelectedModule] = useState<ModuleType | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('PDF');
  const [newDocCategory, setNewDocCategory] = useState<DocumentCategory>('REPORT');
  const [newDocModule, setNewDocModule] = useState<ModuleType>(filterModule || 'GENERAL');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesModule = filterModule 
      ? doc.module === filterModule 
      : (selectedModule === 'ALL' || doc.module === selectedModule);
    
    const matchesDate = (!dateFrom || doc.uploadDate >= dateFrom) && 
                        (!dateTo || doc.uploadDate <= dateTo);

    return matchesSearch && matchesCategory && matchesModule && matchesDate;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: ProjectDocument = {
      id: `D${Date.now()}`,
      name: newDocName,
      type: newDocType,
      category: newDocCategory,
      module: newDocModule,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB` // Mock size
    };
    onAddDocument(newDoc);
    setIsUploadModalOpen(false);
    // Reset form
    setNewDocName('');
  };

  const getIcon = (type: string) => {
    if (type.includes('PDF')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('JPG') || type.includes('PNG')) return <Image className="w-5 h-5 text-blue-500" />;
    if (type.includes('XLS')) return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    if (type.includes('DWG')) return <Paperclip className="w-5 h-5 text-slate-500" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${compact ? '' : 'h-full flex flex-col'}`}>
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            {compact ? 'Related Documents' : 'Document Management'}
          </h3>
          {!compact && <p className="text-sm text-slate-500">Central repository for all project files</p>}
        </div>
        {allowUpload && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col gap-3">
        {/* Row 1: Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        
        {/* Row 2: Detailed Filters */}
        <div className="flex flex-col md:flex-row gap-2 overflow-x-auto pb-1 md:pb-0 items-center">
            <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Filter By:</span>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="flex-1 md:flex-none px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[140px]"
                >
                    <option value="ALL">All Categories</option>
                    <option value="CONTRACT">Contracts</option>
                    <option value="DRAWING">Drawings</option>
                    <option value="PERMIT">Permits</option>
                    <option value="REPORT">Reports</option>
                    <option value="BILL">Bills</option>
                    <option value="OTHER">Other</option>
                </select>

                {!filterModule && (
                    <select 
                    value={selectedModule} 
                    onChange={(e) => setSelectedModule(e.target.value as any)}
                    className="flex-1 md:flex-none px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[140px]"
                    >
                    <option value="ALL">All Modules</option>
                    <option value="MASTER">Master Control</option>
                    <option value="SITE">Site Execution</option>
                    <option value="FINANCE">Financial Control</option>
                    <option value="LIABILITY">Liability Tracker</option>
                    </select>
                )}
            </div>

            <div className="hidden md:block w-px h-6 bg-slate-300 mx-1"></div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Date:</span>
                <input 
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                    placeholder="From"
                />
                <span className="text-slate-400">-</span>
                <input 
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                    placeholder="To"
                />
                {(dateFrom || dateTo) && (
                    <button 
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="text-slate-400 hover:text-slate-600"
                        title="Clear Date Filter"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Document List */}
      <div className={`${compact ? 'max-h-[300px]' : 'flex-1'} overflow-y-auto`}>
        {filteredDocs.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3 hidden md:table-cell">Category</th>
                {!filterModule && <th className="px-6 py-3 hidden md:table-cell">Module</th>}
                <th className="px-6 py-3 text-right">Date</th>
                <th className="px-6 py-3 text-right">Size</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {getIcon(doc.type)}
                      <div>
                        <p className="font-medium text-slate-700">{doc.name}</p>
                        <p className="text-xs text-slate-400 md:hidden">{doc.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {doc.category}
                    </span>
                  </td>
                  {!filterModule && (
                    <td className="px-6 py-3 hidden md:table-cell">
                      <span className="text-xs font-medium text-slate-500">{doc.module}</span>
                    </td>
                  )}
                  <td className="px-6 py-3 text-right text-slate-500">{doc.uploadDate}</td>
                  <td className="px-6 py-3 text-right text-slate-500">{doc.size}</td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <File className="w-12 h-12 mb-3 opacity-20" />
            <p>No documents found</p>
            <p className="text-xs mt-1">Try adjusting filters or upload a new file.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Name</label>
                <input 
                  type="text" 
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g., Site Inspection Report.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="CONTRACT">Contract</option>
                    <option value="DRAWING">Drawing</option>
                    <option value="PERMIT">Permit</option>
                    <option value="REPORT">Report</option>
                    <option value="BILL">Bill</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File Type</label>
                  <select 
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="JPG">JPG/PNG</option>
                    <option value="XLSX">Excel</option>
                    <option value="DWG">AutoCAD (DWG)</option>
                  </select>
                </div>
              </div>

              {!filterModule && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Related Module</label>
                  <select 
                    value={newDocModule}
                    onChange={(e) => setNewDocModule(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="MASTER">Master Control</option>
                    <option value="SITE">Site Execution</option>
                    <option value="FINANCE">Financial Control</option>
                    <option value="LIABILITY">Liability Tracker</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
