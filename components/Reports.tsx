
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line, ComposedChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  FileText, Download, Printer, TrendingUp, Users, DollarSign, Package, Activity, Target, LayoutGrid, ArrowUpRight, Filter, Calendar, X, FileJson, FileSpreadsheet, Wallet, CreditCard, ShieldCheck, Zap, Layers, AlertCircle, CheckCircle2, ChevronRight, ListTodo, ClipboardCheck, Search
} from 'lucide-react';
import { Influencer, Delivery, Project, Transaction, Task } from '../types';

// Helper Components
const StatBox: React.FC<{ icon: any, label: string, value: any, color: string, trend?: string, subtitle?: string }> = ({ icon: Icon, label, value, color, trend, subtitle }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] transition-all shadow-sm hover:shadow-md group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-').replace('600', '500/10').replace('500', '500/10')}`}>
        <Icon className={color} size={22} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={10} className="mr-0.5" /> {trend}
        </span>
      )}
    </div>
    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{value}</div>
    {subtitle && <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase mt-1">{subtitle}</div>}
  </div>
);

interface ReportSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  summary?: React.ReactNode;
}

const ReportSection: React.FC<ReportSectionProps> = ({ id, title, subtitle, icon, children, summary }) => {
  const handlePrint = () => {
    const printContent = document.getElementById(`section-${id}`);
    const summaryContent = document.getElementById(`summary-${id}`);
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CreatorFlow Report - ${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
              @media print {
                body { background: white !important; color: black !important; padding: 0; font-family: 'Inter', sans-serif; }
                .no-print { display: none !important; }
                table { border-collapse: collapse; width: 100%; page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                th, td { border: 1px solid #e2e8f0; padding: 12px; font-size: 10px; }
                .header-accent { background: #0ea5e9 !important; -webkit-print-color-adjust: exact; color: white !important; }
                .status-badge { border: 1px solid #cbd5e1; padding: 2px 6px; border-radius: 4px; font-size: 8px; text-transform: uppercase; font-weight: bold; }
              }
              body { padding: 40px; font-family: 'Inter', sans-serif; background: #f8fafc; }
            </style>
          </head>
          <body>
            <div class="mb-10 border-b-8 border-slate-900 pb-8 flex justify-between items-end">
              <div>
                <h1 class="text-4xl font-black uppercase tracking-tighter text-slate-900">CreatorFlow</h1>
                <p class="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-1">Operational Intelligence Document</p>
                <div class="mt-6">
                   <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">${title}</h2>
                   <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest">${subtitle}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Generated</p>
                <p class="text-sm font-black text-slate-900">${new Date().toLocaleString()}</p>
              </div>
            </div>
            ${summaryContent ? `<div class="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl">${summaryContent.innerHTML}</div>` : ''}
            <div class="print-content">
              ${printContent.innerHTML}
            </div>
            <div class="mt-20 pt-8 border-t border-slate-200 flex justify-between items-center opacity-40">
               <span class="text-[8px] font-black uppercase tracking-widest">Confidential • CreatorFlow Internal Audit System</span>
               <span class="text-[8px] font-black uppercase tracking-widest">Page 1 of 1</span>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 750);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-cyan-600 dark:text-cyan-400">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">{title}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
        >
          <Printer size={16} />
          <span>Print Section</span>
        </button>
      </div>
      
      {summary && (
        <div id={`summary-${id}`} className="px-8 py-8 bg-white dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 no-print">
          {summary}
        </div>
      )}

      <div id={`section-${id}`} className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

interface ReportsProps {
  influencers: Influencer[];
  deliveries: Delivery[];
  projects: Project[];
  transactions: Transaction[];
  tasks: Task[];
}

type ReportType = 'all' | 'influencers' | 'tracking' | 'payouts' | 'deliveries' | 'expenses' | 'tasks';

const Reports: React.FC<ReportsProps> = ({ 
  influencers = [], 
  deliveries = [], 
  projects = [], 
  transactions = [], 
  tasks = [] 
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const totalCap = influencers.reduce((s, i) => s + (i.salary || 0), 0);
    const paidCap = influencers.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + (i.salary || 0), 0);
    const pendingCap = influencers.filter(i => i.paymentStatus === 'pending').reduce((s, i) => s + (i.salary || 0), 0);
    
    const totalVids = influencers.reduce((s, i) => s + (i.targetVideos || 0), 0);
    const doneVids = influencers.reduce((s, i) => s + (i.completedVideos || 0), 0);

    const totalExp = projects.reduce((s, p) => s + (p.expenses || []).reduce((es, e) => es + (e.price * e.qty), 0), 0);
    const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);

    return { totalCap, paidCap, pendingCap, totalVids, doneVids, totalExp, totalBudget };
  }, [influencers, projects]);

  const tabs: { id: ReportType, label: string, icon: any }[] = [
    { id: 'all', label: 'Master Audit', icon: Layers },
    { id: 'influencers', label: 'Partners', icon: Users },
    { id: 'tracking', label: 'Production', icon: ClipboardCheck },
    { id: 'payouts', label: 'Settlement', icon: Wallet },
    { id: 'deliveries', label: 'Logistics', icon: Package },
    { id: 'expenses', label: 'Capital Flow', icon: DollarSign },
    { id: 'tasks', label: 'Terminal', icon: ListTodo },
  ];

  const filteredInfluencers = influencers.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.handle.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDeliveries = deliveries.filter(d => d.influencerName.toLowerCase().includes(searchTerm.toLowerCase()) || d.productName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-20 transition-colors">
      {/* Global Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase transition-colors">Intelligence Terminal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Cross-platform campaign analytics and operational forecasting</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeReport === tab.id ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64 no-print">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Global Search Filter..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-100"
            />
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:opacity-90 shadow-xl"
          >
            <Printer size={16} />
            <span>Master Export</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* KPI DASHBOARD */}
        {(activeReport === 'all') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
            <StatBox icon={Users} label="Strategic Assets" value={influencers.length} color="text-cyan-600" subtitle="Influencer Partners" trend="+14%" />
            <StatBox icon={Zap} label="Production Yield" value={`${((stats.doneVids / (stats.totalVids || 1)) * 100).toFixed(0)}%`} color="text-pink-500" subtitle={`${stats.doneVids}/${stats.totalVids} Completed`} trend="+8%" />
            <StatBox icon={Wallet} label="Settlement Pipeline" value={`$${stats.pendingCap.toLocaleString()}`} color="text-amber-500" subtitle="Awaiting Verification" />
            <StatBox icon={DollarSign} label="Capital Allocation" value={`${((stats.totalExp / (stats.totalBudget || 1)) * 100).toFixed(0)}%`} color="text-emerald-600" subtitle={`$${stats.totalExp.toLocaleString()} Used`} trend="Audit Req" />
          </div>
        )}

        {/* INFLUENCERS */}
        {(activeReport === 'all' || activeReport === 'influencers') && (
          <ReportSection 
            id="influencers" 
            title="Influencer Performance Matrix" 
            subtitle="Partner network audit and engagement summary" 
            icon={<Users size={24} />}
            summary={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Reach</div>
                   <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{(influencers.reduce((s, i) => s + (i.followers || 0), 0) / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Network Interaction</div>
                   <div className="text-2xl font-black text-pink-600">{(influencers.reduce((s, i) => s + (i.engagementRate || 0), 0) / (influencers.length || 1)).toFixed(1)}%</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fixed Retainers</div>
                   <div className="text-2xl font-black text-emerald-600">${stats.totalCap.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dominant Platform</div>
                   <div className="text-2xl font-black text-cyan-600">TikTok</div>
                </div>
              </div>
            }
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Partner Name</th>
                  <th className="px-8 py-6">Handle</th>
                  <th className="px-8 py-6">Audience</th>
                  <th className="px-8 py-6">Engagement</th>
                  <th className="px-8 py-6">Mission Cohort</th>
                  <th className="px-8 py-6">Base Retainer</th>
                  <th className="px-8 py-6 text-right">Yield Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInfluencers.map(i => (
                  <tr key={i.id} className="text-xs">
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100">{i.name}</td>
                    <td className="px-8 py-5 text-slate-500 font-bold">{i.handle}</td>
                    <td className="px-8 py-5 text-slate-900 dark:text-slate-200 font-black">{(i.followers / 1000).toFixed(0)}k</td>
                    <td className="px-8 py-5"><span className="px-3 py-1 bg-pink-50 dark:bg-pink-500/10 text-pink-600 font-black text-[9px] uppercase rounded-lg border border-pink-100 dark:border-pink-500/20">{i.engagementRate}%</span></td>
                    <td className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">{i.niche}</td>
                    <td className="px-8 py-5 font-black text-emerald-600 tracking-tighter">${i.salary.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right font-black text-cyan-600">{((i.followers * (i.engagementRate / 100)) / (i.salary || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* TRACKING */}
        {(activeReport === 'all' || activeReport === 'tracking') && (
          <ReportSection 
            id="tracking" 
            title="Production Output Flow" 
            subtitle="Content creation progress and quota audit" 
            icon={<ClipboardCheck size={24} />}
            summary={
              <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-12">
                 <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
                       <span>Universal Production Yield</span>
                       <span className="text-slate-900 dark:text-slate-100">{stats.doneVids} / {stats.totalVids} Content Units</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000" style={{ width: `${(stats.doneVids / (stats.totalVids || 1)) * 100}%` }} />
                    </div>
                 </div>
                 <div className="hidden md:block h-12 w-px bg-slate-200 dark:bg-slate-800" />
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Velocity</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{(stats.doneVids / (stats.totalVids || 1) * 100).toFixed(1)}% Completed</div>
                 </div>
              </div>
            }
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Mission Partner</th>
                  <th className="px-8 py-6">Channel Platform</th>
                  <th className="px-8 py-6">Contract Mode</th>
                  <th className="px-8 py-6 text-center">Production Verification</th>
                  <th className="px-8 py-6">Pending Units</th>
                  <th className="px-8 py-6 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInfluencers.map(i => (
                  <tr key={i.id} className="text-xs">
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100">{i.name}</td>
                    <td className="px-8 py-5 text-slate-500 font-bold uppercase tracking-widest">{i.platform}</td>
                    <td className="px-8 py-5 font-bold text-slate-400 uppercase text-[9px]">{i.contractType}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center space-x-4">
                         <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-500" style={{ width: `${(i.completedVideos / (i.targetVideos || 1)) * 100}%` }} />
                         </div>
                         <span className="text-[10px] font-black text-slate-900 dark:text-slate-200">{i.completedVideos} / {i.targetVideos}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-rose-500 tracking-tighter">{Math.max(0, i.targetVideos - i.completedVideos)} Items Owed</td>
                    <td className="px-8 py-5 text-right">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${i.completedVideos >= i.targetVideos ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}>
                          {i.completedVideos >= i.targetVideos ? 'Quota Met' : 'Active Flow'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* PAYOUTS */}
        {(activeReport === 'all' || activeReport === 'payouts') && (
          <ReportSection 
            id="payouts" 
            title="Capital Settlement Audit" 
            subtitle="Fee distribution and verified payout registry" 
            icon={<Wallet size={24} />}
            summary={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cleared Retainers</div>
                   <div className="text-2xl font-black text-emerald-600">${stats.paidCap.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding Liability</div>
                   <div className="text-2xl font-black text-amber-600">${stats.pendingCap.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settled Partners</div>
                   <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{influencers.filter(i=>i.paymentStatus==='paid').length} Units</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Verification</div>
                   <div className="text-2xl font-black text-cyan-600">Secure Protocol</div>
                </div>
              </div>
            }
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Strategic Payee</th>
                  <th className="px-8 py-6">Mission Quota Audit</th>
                  <th className="px-8 py-6">Base Salary Owed</th>
                  <th className="px-8 py-6">Fee Structure</th>
                  <th className="px-8 py-6">Registry State</th>
                  <th className="px-8 py-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInfluencers.map(i => (
                  <tr key={i.id} className="text-xs">
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100">{i.name}</td>
                    <td className="px-8 py-5 text-slate-400 font-bold uppercase tracking-widest text-[9px]">{i.completedVideos} / {i.targetVideos} Verified</td>
                    <td className="px-8 py-5 font-black text-emerald-600 text-base tracking-tighter">${i.salary.toLocaleString()}</td>
                    <td className="px-8 py-5 font-bold text-slate-400 uppercase text-[9px] tracking-widest">Global Fixed Rate</td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${i.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {i.paymentStatus}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-300 uppercase text-[8px] tracking-[0.25em]">Validated Ops</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* DELIVERIES */}
        {(activeReport === 'all' || activeReport === 'deliveries') && (
          <ReportSection 
            id="deliveries" 
            title="Logistics Strategic Registry" 
            subtitle="Seeding dispatch and physical inventory audit" 
            icon={<Package size={24} />}
            summary={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Missions</div>
                   <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{deliveries.length} Operations</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Deliveries</div>
                   <div className="text-2xl font-black text-emerald-600">{deliveries.filter(d=>d.status==='Delivered').length} Units</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dispatch Capital</div>
                   <div className="text-2xl font-black text-cyan-600">${deliveries.reduce((s,d)=>s+d.price, 0).toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearing Rate</div>
                   <div className="text-2xl font-black text-amber-600">{((deliveries.filter(d=>d.paymentStatus==='Paid').length / (deliveries.length || 1)) * 100).toFixed(0)}%</div>
                </div>
              </div>
            }
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Mission Identity</th>
                  <th className="px-8 py-6">Strategic Asset</th>
                  <th className="px-8 py-6 text-center">Qty</th>
                  <th className="px-8 py-6">Dispatch Date</th>
                  <th className="px-8 py-6">Finance Audit</th>
                  <th className="px-8 py-6">Logistics Flow</th>
                  <th className="px-8 py-6 text-right">Inventory Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDeliveries.map(d => (
                  <tr key={d.id} className="text-xs">
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100">{d.influencerName}</td>
                    <td className="px-8 py-5 text-slate-500 font-bold uppercase tracking-widest text-[9px]">{d.productName}</td>
                    <td className="px-8 py-5 text-center font-black text-slate-900 dark:text-slate-200">{d.quantity}</td>
                    <td className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">{new Date(d.dateSent).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-widest ${d.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                          {d.paymentStatus}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                         d.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         d.status === 'Sent' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {d.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-slate-50 tracking-tighter">${d.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* EXPENSES */}
        {(activeReport === 'all' || activeReport === 'expenses') && (
          <ReportSection 
            id="expenses" 
            title="Capital Flow Granularity" 
            subtitle="Project expenditure and budget consumption audit" 
            icon={<DollarSign size={24} />}
            summary={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Project Budget</div>
                   <div className="text-2xl font-black text-slate-900 dark:text-slate-100">${stats.totalBudget.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Universal Consumption</div>
                   <div className="text-2xl font-black text-rose-500">${stats.totalExp.toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cleared Transactions</div>
                   <div className="text-2xl font-black text-emerald-600">${projects.reduce((s,p)=>s+(p.paidAmount || 0), 0).toLocaleString()}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining Liquidity</div>
                   <div className="text-2xl font-black text-amber-600">${(stats.totalBudget - stats.totalExp).toLocaleString()}</div>
                </div>
              </div>
            }
          >
            <div className="space-y-12 p-8 bg-slate-50/40 dark:bg-slate-950/20">
              {filteredProjects.map(p => {
                const pTotal = (p.expenses || []).reduce((s,e) => s + (e.price * e.qty), 0);
                return (
                  <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                       <div>
                         <h4 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight text-lg">{p.title}</h4>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Audit Code: {p.id.toUpperCase()}</p>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">${p.budget.toLocaleString()}</div>
                       </div>
                    </div>
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/30 dark:bg-slate-950/20 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                         <tr>
                           <th className="px-8 py-4">Itemized Description</th>
                           <th className="px-8 py-4">Expense Cohort</th>
                           <th className="px-8 py-4 text-center">Units</th>
                           <th className="px-8 py-4 text-right">Unit Rate</th>
                           <th className="px-8 py-4 text-right">Accrued Liability</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                         {(p.expenses || []).map(e => (
                           <tr key={e.id} className="text-xs">
                             <td className="px-8 py-4 font-bold text-slate-800 dark:text-slate-200">{e.description}</td>
                             <td className="px-8 py-4 text-slate-400 font-black uppercase text-[9px] tracking-widest">{e.category}</td>
                             <td className="px-8 py-4 text-center font-bold text-slate-900 dark:text-slate-100">{e.qty}</td>
                             <td className="px-8 py-4 text-right text-slate-500 font-medium">${e.price.toLocaleString()}</td>
                             <td className="px-8 py-4 text-right font-black text-slate-900 dark:text-slate-50 tracking-tight">${(e.price * e.qty).toLocaleString()}</td>
                           </tr>
                         ))}
                       </tbody>
                       <tfoot className="bg-slate-50/30 dark:bg-slate-950/40 font-black border-t-2 border-slate-100 dark:border-slate-800">
                          <tr>
                            <td colSpan={4} className="px-8 py-6 text-right uppercase text-[10px] tracking-widest text-slate-400 font-black">Gross Expenditure Account</td>
                            <td className="px-8 py-6 text-right text-xl text-rose-500 tracking-tighter">${pTotal.toLocaleString()}</td>
                          </tr>
                          <tr className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                            <td colSpan={4} className="px-8 py-5 text-right uppercase text-[10px] font-black tracking-[0.3em]">Cleared Settlements (Verified)</td>
                            <td className="px-8 py-5 text-right text-xl tracking-tighter">-${(p.paidAmount || 0).toLocaleString()}</td>
                          </tr>
                          <tr className="bg-slate-100 dark:bg-slate-800">
                            <td colSpan={4} className="px-8 py-5 text-right uppercase text-[10px] font-black tracking-[0.4em] text-slate-500 dark:text-slate-400">Net Project Liability</td>
                            <td className="px-8 py-5 text-right text-2xl tracking-tighter text-amber-600 dark:text-amber-500">${Math.max(0, pTotal - (p.paidAmount || 0)).toLocaleString()}</td>
                          </tr>
                       </tfoot>
                    </table>
                  </div>
                )
              })}
            </div>
          </ReportSection>
        )}

        {/* TASK TERMINAL */}
        {(activeReport === 'all' || activeReport === 'tasks') && (
          <ReportSection 
            id="tasks" 
            title="Operational Terminal Log" 
            subtitle="Milestone audit and task execution verification" 
            icon={<ListTodo size={24} />}
            summary={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Directives</div>
                   <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{tasks.length} Operations</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Completion</div>
                   <div className="text-2xl font-black text-emerald-600">{tasks.filter(t=>t.status==='Done').length} Units</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategic Criticality</div>
                   <div className="text-2xl font-black text-rose-500">{tasks.filter(t=>t.priority==='High').length} High</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Velocity</div>
                   <div className="text-2xl font-black text-cyan-600">{((tasks.filter(t=>t.status==='Done').length / (tasks.length || 1)) * 100).toFixed(0)}%</div>
                </div>
              </div>
            }
          >
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Directive Strategic Title</th>
                  <th className="px-8 py-6">Timeline Milestone</th>
                  <th className="px-8 py-6 text-center">Priority Audit</th>
                  <th className="px-8 py-6">Notification Protocol</th>
                  <th className="px-8 py-6 text-right">Execution Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="text-xs">
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.title}</td>
                    <td className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[9px]">{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-center">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                         t.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 
                         t.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                       }`}>
                          {t.priority}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-slate-300 font-bold text-[9px] uppercase tracking-widest">{t.reminderTime ? 'Sync Active' : 'Passive Queue'}</td>
                    <td className="px-8 py-5 text-right">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'}`}>
                          {t.status === 'Done' ? 'Verified Done' : 'In Progress'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}
      </div>

      {/* FOOTER AUDIT */}
      <div className="pt-24 pb-12 text-center space-y-6 no-print transition-colors">
         <div className="flex items-center justify-center space-x-4 text-slate-300 dark:text-slate-700 transition-colors">
            <div className="h-px w-20 bg-current opacity-30" />
            <ShieldCheck size={32} />
            <div className="h-px w-20 bg-current opacity-30" />
         </div>
         <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-600 transition-colors">Operational Intelligence Feed</p>
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-700 opacity-40 uppercase tracking-widest transition-colors">System Integrity Secured • CreatorFlow v4.2.2 Professional</p>
         </div>
      </div>
    </div>
  );
};

export default Reports;
