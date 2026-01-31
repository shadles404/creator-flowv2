
import React, { useMemo } from 'react';
import { Wallet, CheckCircle, Clock, Search, DollarSign, ArrowRight, UserCheck } from 'lucide-react';
import { Influencer } from '../types';

interface ConfirmedPaymentsProps {
  influencers: Influencer[];
  onUpdateInfluencer: (influencer: Influencer) => void;
}

const ConfirmedPayments: React.FC<ConfirmedPaymentsProps> = ({ influencers, onUpdateInfluencer }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const completedInfluencers = useMemo(() => {
    return influencers.filter(inf => 
      inf.completedVideos >= inf.targetVideos && 
      inf.targetVideos > 0 &&
      inf.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [influencers, searchTerm]);

  const stats = useMemo(() => {
    const pending = completedInfluencers.filter(i => i.paymentStatus === 'pending');
    const paid = completedInfluencers.filter(i => i.paymentStatus === 'paid');
    
    return {
      pendingCount: pending.length,
      pendingTotal: pending.reduce((sum, i) => sum + i.salary, 0),
      paidCount: paid.length,
      paidTotal: paid.reduce((sum, i) => sum + i.salary, 0)
    };
  }, [completedInfluencers]);

  const handleConfirmPayment = (inf: Influencer) => {
    onUpdateInfluencer({
      ...inf,
      paymentStatus: 'paid'
    });
  };

  const handleRevertPayment = (inf: Influencer) => {
    onUpdateInfluencer({
      ...inf,
      paymentStatus: 'pending'
    });
  };

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Payout Terminal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Settle balances for partners who fulfilled content quotas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg transition-colors">
          <div className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest font-black mb-1">Pending Payouts</div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{stats.pendingCount} Creators</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg transition-colors">
          <div className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest font-black mb-1">Owed Capital</div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">${stats.pendingTotal.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg transition-colors">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-black mb-1">Settled This Period</div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{stats.paidCount} Creators</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg transition-colors">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-black mb-1">Cleared Capital</div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">${stats.paidTotal.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter text-xl">Verification Registry</h3>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-2.5 text-slate-400 dark:text-slate-500" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search partner name..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-black bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
              <tr>
                <th className="px-8 py-6">Partner Identity</th>
                <th className="px-8 py-6">Niche / Ad Type</th>
                <th className="px-8 py-6 text-center">Work Audit</th>
                <th className="px-8 py-6">Amount Owed</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {completedInfluencers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 dark:text-slate-600 font-bold italic uppercase tracking-widest transition-colors">
                    No completed tasks detected in audit logs.
                  </td>
                </tr>
              ) : (
                completedInfluencers.map((inf) => (
                  <tr key={inf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                           <UserCheck size={18} className="text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-slate-100">{inf.name}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{inf.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-black uppercase transition-colors">{inf.niche}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-full border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-black uppercase transition-colors">
                         <CheckCircle size={10} className="mr-1.5" />
                         {inf.completedVideos} / {inf.targetVideos} Verified
                       </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-slate-100 text-lg transition-colors">
                      ${inf.salary.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                       {inf.paymentStatus === 'paid' ? (
                         <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-500/20 transition-colors">
                           Settled
                         </span>
                       ) : (
                         <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-500/20 transition-colors">
                           Awaiting
                         </span>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       {inf.paymentStatus === 'pending' ? (
                         <button 
                          onClick={() => handleConfirmPayment(inf)}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center ml-auto"
                         >
                           <DollarSign size={14} className="mr-1.5" /> Confirm Payout
                         </button>
                       ) : (
                         <button 
                          onClick={() => handleRevertPayment(inf)}
                          className="text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                         >
                           Revert Transaction
                         </button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedPayments;
