
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  X, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  PlusCircle,
  CreditCard,
  Printer,
  Share2,
  Tag,
  Image as ImageIcon,
  BookOpen,
  Settings2,
  ListFilter,
  Percent,
  MapPin,
  Globe,
  Phone,
  CreditCard as BankIcon,
  Save,
  Check
} from 'lucide-react';
import { Project, ExpenseItem, InvoiceSettings } from '../types';

interface ExpenseFlowProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  invoiceSettings: InvoiceSettings;
  setInvoiceSettings: React.Dispatch<React.SetStateAction<InvoiceSettings>>;
}

const ExpenseFlow: React.FC<ExpenseFlowProps> = ({ 
  projects, 
  setProjects, 
  categories, 
  setCategories,
  invoiceSettings,
  setInvoiceSettings
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('0');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Local state for the current active invoice session
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    clientName: 'LOREM IPSUM',
    clientAddress: 'LOREM IPSUM DOLOR SIT AMET',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    discountAmount: '0',
    ...invoiceSettings // Load defaults from global settings
  });

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );

  // Sync with global settings when modal opens or settings change globally
  useEffect(() => {
    if (isInvoiceModalOpen) {
      setInvoiceData(prev => ({
        ...prev,
        ...invoiceSettings,
        invoiceNumber: prev.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        clientName: prev.clientName === 'LOREM IPSUM' && selectedProject ? selectedProject.title : prev.clientName,
        dueDate: prev.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
    }
  }, [isInvoiceModalOpen, selectedProject, invoiceSettings]);

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProjectTitle,
      budget: parseFloat(newProjectBudget) || 0,
      paidAmount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Unpaid',
      expenses: []
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setIsModalOpen(false);
    setNewProjectTitle('');
    setNewProjectBudget('0');
  };

  const handleSaveInvoiceSettings = () => {
    const updatedSettings: InvoiceSettings = {
      brandName: invoiceData.brandName,
      brandTagline: invoiceData.brandTagline,
      brandPhone: invoiceData.brandPhone,
      brandAddress: invoiceData.brandAddress,
      brandWebsite: invoiceData.brandWebsite,
      bankAccount: invoiceData.bankAccount,
      bankName: invoiceData.bankName,
      bankDetails: invoiceData.bankDetails,
      paymentTerms: invoiceData.paymentTerms,
      taxPercent: invoiceData.taxPercent,
    };
    setInvoiceSettings(updatedSettings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('Category already exists');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (catToDelete === 'Other') return; 
    setCategories(categories.filter(c => c !== catToDelete));
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0 || !selectedProjectId) return;

    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        const currentTotal = p.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const newPaidAmount = p.paidAmount + amount;
        return {
          ...p,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= currentTotal ? 'Paid' : 'Unpaid'
        };
      }
      return p;
    }));
    setIsPaymentModalOpen(false);
    setPaymentAmount('0');
  };

  const addExpenseItem = (projectId: string) => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      category: 'Other',
      qty: 1,
      price: 0
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, expenses: [...p.expenses, newItem] } : p
    ));
  };

  const updateExpenseItem = (projectId: string, itemId: string, updates: Partial<ExpenseItem>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? {
        ...p,
        expenses: p.expenses.map(item => item.id === itemId ? { ...item, ...updates } : item)
      } : p
    ));
  };

  const deleteExpenseItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? {
        ...p,
        expenses: p.expenses.filter(item => item.id !== itemId)
      } : p
    ));
  };

  const deleteProject = (projectId: string) => {
    if (!confirm('This will permanently erase the project and all associated expenses. Continue?')) return;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
  };

  const totalCost = selectedProject?.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0;
  const balance = totalCost - (selectedProject?.paidAmount || 0);
  const percentUsed = selectedProject?.budget ? (totalCost / selectedProject.budget) * 100 : 0;
  
  const subTotal = totalCost;
  const taxAmount = (subTotal * (parseFloat(invoiceData.taxPercent) || 0)) / 100;
  const discountAmount = parseFloat(invoiceData.discountAmount) || 0;
  const clearedPayments = selectedProject?.paidAmount || 0;
  const netPayable = subTotal + taxAmount - discountAmount - clearedPayments;

  const handlePrint = () => { window.print(); };

  const handleShare = async () => {
    const shareText = `Invoice #${invoiceData.invoiceNumber} for ${selectedProject?.title}\nNet Payable: $${netPayable.toLocaleString()}`;
    if (navigator.share) {
      try { await navigator.share({ title: `Invoice ${invoiceData.invoiceNumber}`, text: shareText, url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Invoice details copied to clipboard.');
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-50 uppercase transition-colors">Financial Expense Flow</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Real-time budget tracking & professional invoicing system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center space-x-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-3 rounded-2xl font-black uppercase text-[10px] transition-all border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl"
          >
            <Settings2 size={16} className="text-cyan-600 dark:text-cyan-400" />
            <span>Manage Categories</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] transition-all shadow-xl shadow-emerald-900/40"
          >
            <PlusCircle size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 no-print">
          {projects.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] animate-in fade-in duration-500 transition-colors">
              <PlusCircle size={64} className="mb-6 opacity-10 text-emerald-500" />
              <p className="font-bold text-lg">No active expense projects.</p>
              <p className="text-sm opacity-50">Create your first project to start tracking line items.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs"
              >
                Get Started
              </button>
            </div>
          ) : (
            projects.map(project => {
              const projectTotal = project.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0);
              return (
                <button 
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] text-left hover:border-emerald-500/50 transition-all group relative overflow-hidden shadow-sm dark:shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ChevronRight size={24} className="text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-widest">{project.status}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tighter group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-6 tracking-widest uppercase font-black opacity-60">Created {project.createdAt}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-black text-slate-900 dark:text-slate-100 transition-colors">${projectTotal.toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-500 transition-colors">of ${project.budget.toLocaleString()}</div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                      <div 
                        className={`h-full transition-all duration-700 ${projectTotal > project.budget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((projectTotal / project.budget) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 no-print transition-colors">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedProjectId(null)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center text-xs font-black uppercase tracking-widest transition-all hover:-translate-x-1"
            >
              <ChevronRight size={14} className="rotate-180 mr-2" /> Project Index
            </button>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 uppercase tracking-widest flex items-center transition-colors"
            >
              <ListFilter size={14} className="mr-2" /> Configure Categories
            </button>
          </div>

          {/* Project View Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 mb-3 tracking-tighter uppercase transition-colors">{selectedProject?.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors">
                  <span className="flex items-center bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                    <Calendar size={14} className="mr-2 text-cyan-600 dark:text-cyan-500" /> {selectedProject?.createdAt}
                  </span>
                  <span className="flex items-center bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                    <DollarSign size={14} className="mr-1 text-emerald-600 dark:text-emerald-500" /> Budget: ${selectedProject?.budget.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl shadow-emerald-900/40"
                >
                  <CreditCard size={14} className="mr-2" /> Record Payment
                </button>
                <button 
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-2xl text-[10px] font-black uppercase transition-all transition-colors"
                >
                  <FileText size={14} className="mr-2 text-cyan-600 dark:text-cyan-400" /> Build Invoice
                </button>
                <button 
                  onClick={() => deleteProject(selectedProject!.id)}
                  className="flex items-center px-6 py-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-500 rounded-2xl text-[10px] font-black uppercase transition-all border border-rose-200 dark:border-rose-500/20"
                >
                  <Trash2 size={14} className="mr-2" /> Terminate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-8 rounded-[32px] shadow-inner transition-colors">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-6 transition-colors">Execution Progress</h4>
                <div className="flex items-end justify-between mb-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-slate-900 dark:text-slate-100 transition-colors">${totalCost.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">Actual Expenses Reported</div>
                  </div>
                  <div className={`text-2xl font-black transition-colors ${percentUsed > 100 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{percentUsed.toFixed(1)}%</div>
                </div>
                <div className="h-2.5 w-full bg-white dark:bg-slate-900 rounded-full overflow-hidden shadow-inner transition-colors">
                  <div className={`h-full transition-all duration-1000 ${percentUsed > 100 ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`} style={{ width: `${Math.min(percentUsed, 100)}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-8 rounded-[32px] shadow-inner transition-colors">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-4 transition-colors">Finance Liquidity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white dark:border-slate-900 transition-colors">
                    <span className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase transition-colors">Total Accrued</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold transition-colors">${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white dark:border-slate-900 transition-colors">
                    <span className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase transition-colors">Cleared Payments</span>
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold transition-colors">${(selectedProject?.paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-slate-900 dark:text-slate-100 font-black text-[10px] uppercase tracking-widest transition-colors">Remaining Balance</span>
                    <span className={`text-2xl font-black transition-colors ${balance > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>${Math.max(0, balance).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between transition-colors">
               <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase transition-colors">Project Breakdown</h3>
               <button 
                onClick={() => addExpenseItem(selectedProject!.id)} 
                className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-600/10 hover:bg-emerald-100 dark:hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100 dark:border-emerald-500/20 flex items-center transition-colors"
               >
                 <Plus size={16} className="mr-2" /> Insert Line Item
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40 transition-colors">
                  <tr>
                    <th className="px-8 py-6">Detailed Description</th>
                    <th className="px-8 py-6 w-48">Expense Cohort</th>
                    <th className="px-8 py-6 w-24 text-center">Qty</th>
                    <th className="px-8 py-6 w-32">Unit Rate</th>
                    <th className="px-8 py-6 w-32">Amount</th>
                    <th className="px-8 py-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                  {selectedProject?.expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors group/row">
                      <td className="px-8 py-5">
                        <input 
                          value={item.description}
                          onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { description: e.target.value })}
                          placeholder="Line item description (e.g. Creator Fee, Production Cost)"
                          className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-800 font-bold text-sm transition-colors"
                        />
                      </td>
                      <td className="px-8 py-5">
                        <select 
                          value={item.category} 
                          onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { category: e.target.value })} 
                          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase px-3 py-2 outline-none text-slate-600 dark:text-slate-400 w-full focus:border-cyan-500 transition-all cursor-pointer transition-colors"
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-5">
                        <input type="number" value={item.qty} onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { qty: parseInt(e.target.value) || 0 })} className="bg-slate-100 dark:bg-slate-950/40 border-none rounded-lg text-center w-16 py-1 focus:ring-1 focus:ring-cyan-500 text-slate-800 dark:text-slate-200 font-black transition-colors" />
                      </td>
                      <td className="px-8 py-5">
                        <div className="relative">
                          <span className="absolute left-0 top-1.5 text-slate-400 dark:text-slate-600 text-[10px] transition-colors">$</span>
                          <input type="number" value={item.price} onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { price: parseFloat(e.target.value) || 0 })} className="bg-transparent border-none focus:ring-0 w-full pl-3 p-0 text-slate-800 dark:text-slate-200 font-bold transition-colors" />
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100 transition-colors">
                        ${(item.qty * item.price).toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <button onClick={() => deleteExpenseItem(selectedProject!.id, item.id)} className="text-slate-300 dark:text-slate-700 hover:text-rose-500 p-2 rounded-xl transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-row-hover:opacity-100"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {selectedProject?.expenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-slate-400 dark:text-slate-600 font-bold italic transition-colors">No line items recorded for this project yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-12 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-right transition-colors">
              <div className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-black mb-2 transition-colors">Total Project Liquidity Requirement</div>
              <div className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tighter transition-colors">${totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 no-print">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase flex items-center transition-colors"><Settings2 className="mr-3 text-cyan-600 dark:text-cyan-400" size={24} /> Cohort Management</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="mb-8">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase mb-3 block tracking-widest transition-colors">Create New Cohort</label>
              <div className="flex space-x-2">
                <input autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Travel, Tech, Gear..." className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-all transition-colors" />
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 rounded-2xl transition-all shadow-lg shadow-cyan-900/20"><Plus size={24} /></button>
              </div>
            </form>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase mb-2 block tracking-widest transition-colors">Active Expense Cohorts</label>
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl group transition-all hover:bg-white dark:hover:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">{cat}</span>
                  {cat !== 'Other' && (
                    <button 
                      onClick={() => handleDeleteCategory(cat)} 
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Invoice Modal stays as designed */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500 no-print" onClick={() => setIsInvoiceModalOpen(false)} />
          <div id="invoice-print-area" className="relative w-full max-w-6xl bg-white text-slate-900 rounded-[8px] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row my-auto overflow-hidden min-h-[1100px] print:m-0 print:shadow-none">
            {/* Sidebar Controls (Hidden during print) */}
            <div className="w-full md:w-96 p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col space-y-6 invoice-inputs bg-slate-50 no-print">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Invoice Engine</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Document Editor</p>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Brand Name</label>
                  <input value={invoiceData.brandName} onChange={(e) => setInvoiceData({...invoiceData, brandName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tagline</label>
                  <input value={invoiceData.brandTagline} onChange={(e) => setInvoiceData({...invoiceData, brandTagline: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Website</label>
                    <input value={invoiceData.brandWebsite} onChange={(e) => setInvoiceData({...invoiceData, brandWebsite: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Phone</label>
                    <input value={invoiceData.brandPhone} onChange={(e) => setInvoiceData({...invoiceData, brandPhone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-200">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Client Identity</label>
                  <input placeholder="Name" value={invoiceData.clientName} onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  <textarea placeholder="Address" rows={2} value={invoiceData.clientAddress} onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 mt-2" />
                </div>
                
                <div className="space-y-1.5 pt-4 border-t border-slate-200">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <BankIcon size={12} className="mr-2 text-orange-500" /> Payment & Bank Info
                  </label>
                  <input placeholder="Account No" value={invoiceData.bankAccount} onChange={(e) => setInvoiceData({...invoiceData, bankAccount: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  <input placeholder="A/C Name" value={invoiceData.bankName} onChange={(e) => setInvoiceData({...invoiceData, bankName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 mt-2" />
                  <input placeholder="Bank Details" value={invoiceData.bankDetails} onChange={(e) => setInvoiceData({...invoiceData, bankDetails: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tax %</label>
                    <input type="number" value={invoiceData.taxPercent} onChange={(e) => setInvoiceData({...invoiceData, taxPercent: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Discount $</label>
                    <input type="number" value={invoiceData.discountAmount} onChange={(e) => setInvoiceData({...invoiceData, discountAmount: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-200">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Terms & Conditions</label>
                  <textarea rows={4} value={invoiceData.paymentTerms} onChange={(e) => setInvoiceData({...invoiceData, paymentTerms: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] focus:ring-1 focus:ring-orange-500 leading-relaxed" />
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <button 
                  onClick={handleSaveInvoiceSettings}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center border ${
                    showSaveSuccess 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {showSaveSuccess ? <Check size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                  {showSaveSuccess ? 'Settings Saved' : 'Save as Default'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handlePrint} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center"><Printer size={16} className="mr-2" /> Print</button>
                  <button onClick={handleShare} className="w-full py-3 bg-[#f25c34] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center"><Share2 size={16} className="mr-2" /> Share</button>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 relative flex flex-col bg-white overflow-hidden print:w-full">
              {/* Top Complex Slanted Header */}
              <div className="h-44 flex relative overflow-hidden">
                 <div 
                    className="absolute inset-y-0 left-0 w-3/5 bg-[#f25c34] z-10 flex flex-col justify-center items-center text-white" 
                    style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
                 >
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white flex items-center justify-center rotate-45 mb-2">
                            <div className="w-6 h-6 border-4 border-white rotate-[-45deg]" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight leading-none">{invoiceData.brandName}</h2>
                        <p className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-80 mt-1">{invoiceData.brandTagline}</p>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-[#1e2235] flex flex-col justify-center items-end pr-12 text-white">
                    <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Invoice</h1>
                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-90">Invoice No : <span className="opacity-100">{invoiceData.invoiceNumber}</span></p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-90">Date : <span className="opacity-100">{new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                 </div>
              </div>

              <div className="p-12 flex-1 flex flex-col">
                {/* Recipient Section */}
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h4 className="text-sm font-black text-[#1e2235] uppercase tracking-widest mb-3">Invoice to</h4>
                    <p className="text-2xl font-black text-[#1e2235] leading-none mb-2">{invoiceData.clientName}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight max-w-[280px] leading-relaxed whitespace-pre-wrap">
                      {invoiceData.clientAddress}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end space-y-3">
                     <div className="flex items-center space-x-2 text-slate-600 font-bold text-xs uppercase tracking-tight">
                        <span>{invoiceData.brandWebsite}</span>
                        <Globe size={14} className="text-[#f25c34]" />
                     </div>
                     <div className="flex items-center space-x-2 text-slate-600 font-bold text-xs uppercase tracking-tight">
                        <span>{invoiceData.brandPhone}</span>
                        <Phone size={14} className="text-[#f25c34]" />
                     </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 mb-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f25c34] text-white">
                        <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest">Item Name</th>
                        <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-right">Price</th>
                        <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-center">Qty</th>
                        <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedProject?.expenses || []).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-6 px-6">
                            <p className="font-bold text-[#1e2235] text-sm uppercase">{item.description || 'Campaign Line Item'}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.category}</p>
                          </td>
                          <td className="py-6 px-6 font-bold text-[#1e2235] text-right text-sm">${item.price.toFixed(2)}</td>
                          <td className="py-6 px-6 font-bold text-[#1e2235] text-center text-sm">{item.qty}</td>
                          <td className="py-6 px-6 font-black text-[#1e2235] text-right text-sm">${(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                      {/* Visual filler rows */}
                      {(selectedProject?.expenses.length || 0) < 5 && Array.from({ length: 5 - (selectedProject?.expenses.length || 0) }).map((_, i) => (
                         <tr key={`filler-${i}`} className="h-16"><td colSpan={4} className="border-b border-slate-50"></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-2 gap-12 pt-12 items-start">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-black text-[#1e2235] uppercase tracking-widest mb-4">Payment Info:</h4>
                      <div className="text-[11px] font-bold text-slate-500 space-y-1 uppercase tracking-tight">
                         <div className="grid grid-cols-[100px_1fr]"><span>Account No :</span> <span className="text-slate-900">{invoiceData.bankAccount}</span></div>
                         <div className="grid grid-cols-[100px_1fr]"><span>A/C Name :</span> <span className="text-slate-900">{invoiceData.bankName}</span></div>
                         <div className="grid grid-cols-[100px_1fr]"><span>Bank Details :</span> <span className="text-slate-900">{invoiceData.bankDetails}</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-black text-[#1e2235] uppercase tracking-widest mb-2">Terms and Conditions</h4>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed whitespace-pre-wrap">{invoiceData.paymentTerms}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                     <div className="w-full max-w-[280px] space-y-4 mb-16">
                        <div className="flex justify-between items-center px-2">
                           <span className="text-xs font-black text-[#1e2235] uppercase tracking-widest">Sub Total</span>
                           <span className="text-sm font-black text-slate-900">${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-xs font-black text-[#1e2235] uppercase tracking-widest">Tax {invoiceData.taxPercent}%</span>
                           <span className="text-sm font-black text-slate-900">${taxAmount.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between items-center px-2">
                             <span className="text-xs font-black text-[#1e2235] uppercase tracking-widest">Discount</span>
                             <span className="text-sm font-black text-rose-500">-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center px-2">
                           <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Cleared Payments</span>
                           <span className="text-sm font-black text-emerald-600">-${clearedPayments.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-slate-200" />
                        <div className="bg-[#f25c34] p-4 flex justify-between items-center text-white">
                           <span className="text-sm font-black uppercase tracking-widest">Net Payable</span>
                           <span className="text-xl font-black">${netPayable.toFixed(2)}</span>
                        </div>
                     </div>

                     <div className="text-center w-full max-w-[180px] mt-auto">
                        <div className="border-t border-slate-900 pt-3">
                            <p className="text-[11px] font-black text-[#1e2235] uppercase tracking-widest">Authorised Sign</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Accents */}
              <div className="h-24 relative overflow-hidden mt-12">
                 <div 
                    className="absolute inset-y-0 right-0 w-[45%] bg-[#f25c34] z-10" 
                    style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
                 />
                 <div 
                    className="absolute inset-y-0 right-[35%] w-[15%] bg-[#1e2235] opacity-100" 
                    style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)' }}
                 />
              </div>
            </div>
            
            <button onClick={() => setIsInvoiceModalOpen(false)} className="absolute top-6 right-6 p-5 text-white hover:text-[#f25c34] transition-all z-[120] no-print"><X size={48} /></button>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-8 tracking-tighter uppercase transition-colors">Clear Payment</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-slate-400 dark:text-slate-600 font-black transition-colors">$</span>
                  <input autoFocus type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-5 py-4 text-slate-900 dark:text-slate-200 text-lg font-black focus:border-emerald-500 outline-none transition-colors" />
                </div>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl transition-colors">
                <div className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Remaining Balance</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight transition-colors">${Math.max(0, balance).toLocaleString()}</div>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
              <button onClick={handleRecordPayment} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-900/20 transition-colors">Clear Funds</button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-8 tracking-tighter uppercase transition-colors">New Project</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Project Title</label>
                <input autoFocus value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="e.g. Q4 TikTok Launch" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Capital Budget ($)</label>
                <input type="number" value={newProjectBudget} onChange={(e) => setNewProjectBudget(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-slate-200 font-black text-xl focus:border-cyan-500 outline-none transition-colors" />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
              <button onClick={handleCreateProject} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-900/20 transition-colors">Launch Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFlow;
