
import React, { useState } from 'react';
import { Edit, RefreshCw, Trash2, CheckSquare, Square, RotateCcw, Search } from 'lucide-react';
import { Influencer } from '../types';

interface TrackingInfluencerProps {
  influencers: Influencer[];
  onUpdateInfluencer: (influencer: Influencer) => void;
  onDeleteInfluencer: (id: string) => void;
  onResetAll?: () => void;
}

const TrackingInfluencer: React.FC<TrackingInfluencerProps> = ({ 
  influencers, 
  onUpdateInfluencer, 
  onDeleteInfluencer,
  onResetAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleProgress = (inf: Influencer, index: number) => {
    const newCount = index + 1;
    const updatedCount = inf.completedVideos === newCount ? index : newCount;
    
    onUpdateInfluencer({
      ...inf,
      completedVideos: updatedCount
    });
  };

  const handleReset = (inf: Influencer) => {
    onUpdateInfluencer({ ...inf, completedVideos: 0 });
  };

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Influencer Tracking</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor production progress for your partner creators</p>
        </div>
        {onResetAll && influencers.length > 0 && (
          <button 
            onClick={onResetAll}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-all"
          >
            <RotateCcw size={14} className="text-rose-500" />
            <span>Reset All Progress</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search influencers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-black bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5">No.</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Phone</th>
                <th className="px-6 py-5">Salary</th>
                <th className="px-6 py-5">Contract</th>
                <th className="px-6 py-5">Target</th>
                <th className="px-6 py-5">Progress</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Ad Types</th>
                <th className="px-6 py-5">Platform</th>
                <th className="px-6 py-5">Notes</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInfluencers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-20 text-center text-slate-400 dark:text-slate-500 italic">No influencers found.</td>
                </tr>
              ) : (
                filteredInfluencers.map((inf, idx) => (
                  <tr key={inf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-400 dark:text-slate-600">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{inf.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{inf.phone || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-500">${inf.salary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inf.contractType}</td>
                    <td className="px-6 py-4 text-center font-black text-slate-700 dark:text-slate-300">{inf.targetVideos}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 min-w-[120px]">
                        <div className="flex space-x-1">
                          {Array.from({ length: inf.targetVideos || 1 }).map((_, i) => (
                            <button 
                              key={i} 
                              onClick={() => handleToggleProgress(inf, i)}
                              className="transition-transform active:scale-90"
                            >
                              {i < inf.completedVideos ? (
                                <CheckSquare size={16} className="text-cyan-600 dark:text-cyan-400 fill-cyan-400/10" />
                              ) : (
                                <Square size={16} className="text-slate-300 dark:text-slate-700" />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
                          {inf.completedVideos} / {inf.targetVideos}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        inf.completedVideos === inf.targetVideos && inf.targetVideos > 0
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-500/20' 
                          : inf.completedVideos > 0 
                            ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-500/20'
                      }`}>
                        {inf.completedVideos === inf.targetVideos && inf.targetVideos > 0 ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {(inf.adTypes || []).map(t => (
                          <span key={t} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-50 dark:bg-black/20 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold">
                        {inf.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 dark:text-slate-500 truncate max-w-[150px]" title={inf.notes}>
                        {inf.notes || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-400/10">
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleReset(inf)}
                          className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-50 dark:hover:bg-amber-400/10"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteInfluencer(inf.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

export default TrackingInfluencer;
