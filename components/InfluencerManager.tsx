
import React, { useState } from 'react';
import { Plus, MoreVertical, ExternalLink, Activity, X, Phone, DollarSign, Target, Briefcase, Edit3, Trash2, User } from 'lucide-react';
import { Influencer } from '../types';

interface InfluencerManagerProps {
  influencers: Influencer[];
  onAddInfluencer: (influencer: Influencer) => void;
  onUpdateInfluencer: (influencer: Influencer) => void;
  onDeleteInfluencer: (id: string) => void;
}

const AD_TYPE_OPTIONS = ['Milk', 'Makeup', 'Perfume', 'Cream', 'Skincare', 'Other'];

const InfluencerManager: React.FC<InfluencerManagerProps> = ({ 
  influencers, 
  onAddInfluencer,
  onUpdateInfluencer,
  onDeleteInfluencer
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    phone: '',
    salary: '0',
    targetVideos: '1',
    contractType: 'Freelance',
    platform: 'TikTok',
    niche: 'Other',
    notes: '',
    adTypes: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAdType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      adTypes: prev.adTypes.includes(type)
        ? prev.adTypes.filter(t => t !== type)
        : [...prev.adTypes, type]
    }));
  };

  const openAddModal = () => {
    setEditingInfluencer(null);
    setFormData({
      name: '',
      handle: '',
      phone: '',
      salary: '0',
      targetVideos: '1',
      contractType: 'Freelance',
      platform: 'TikTok',
      niche: 'Other',
      notes: '',
      adTypes: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setFormData({
      name: influencer.name,
      handle: influencer.handle,
      phone: influencer.phone,
      salary: influencer.salary.toString(),
      targetVideos: influencer.targetVideos.toString(),
      contractType: influencer.contractType,
      platform: influencer.platform,
      niche: influencer.niche,
      notes: influencer.notes,
      adTypes: influencer.adTypes
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInfluencer) {
      const updatedInfluencer: Influencer = {
        ...editingInfluencer,
        name: formData.name,
        handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`,
        niche: formData.niche,
        phone: formData.phone,
        salary: parseFloat(formData.salary) || 0,
        contractType: formData.contractType,
        targetVideos: parseInt(formData.targetVideos) || 0,
        adTypes: formData.adTypes,
        platform: formData.platform,
        notes: formData.notes
      };
      onUpdateInfluencer(updatedInfluencer);
    } else {
      // Fix: Added missing required paymentStatus property to satisfy the Influencer interface
      const newInfluencer: Influencer = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`,
        followers: 0,
        engagementRate: 0,
        avgViews: 0,
        niche: formData.niche,
        status: 'active',
        phone: formData.phone,
        salary: parseFloat(formData.salary) || 0,
        contractType: formData.contractType,
        targetVideos: parseInt(formData.targetVideos) || 0,
        completedVideos: 0,
        adTypes: formData.adTypes,
        platform: formData.platform,
        notes: formData.notes,
        paymentStatus: 'pending'
      };
      onAddInfluencer(newInfluencer);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the network?`)) {
      onDeleteInfluencer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Influencer Network</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Managing {influencers.length} active partnerships</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-cyan-900/20"
        >
          <Plus size={18} />
          <span>Add Influencer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {influencers.map((creator) => (
          <div key={creator.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 dark:hover:border-slate-700 transition-all group shadow-sm dark:shadow-none">
            <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
               <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => openEditModal(creator)}
                  className="p-1.5 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md rounded-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors border border-slate-200 dark:border-slate-800"
                 >
                    <Edit3 size={14} />
                 </button>
                 <button 
                  onClick={() => handleDelete(creator.id, creator.name)}
                  className="p-1.5 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md rounded-lg text-rose-500 hover:text-rose-400 transition-colors border border-slate-200 dark:border-slate-800"
                 >
                    <Trash2 size={14} />
                 </button>
               </div>
            </div>
            
            <div className="px-6 pb-6 -mt-10 relative z-10">
              <div className="flex items-end justify-between">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <User size={32} />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                    creator.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div className="pb-2">
                   <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {creator.niche}
                   </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold flex items-center text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {creator.name}
                  <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">{creator.handle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="text-xs text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-400">Salary:</span> ${creator.salary}</div>
                 <div className="text-xs text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-400">Target:</span> {creator.targetVideos} vids</div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Activity size={14} className="mr-1 text-emerald-500" />
                  {creator.completedVideos} / {creator.targetVideos} Progress
                </div>
                <button 
                  onClick={() => openEditModal(creator)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
                >
                  View / Edit Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Influencer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg">
                  {editingInfluencer ? <Edit3 className="text-cyan-600 dark:text-cyan-400" size={20} /> : <Plus className="text-cyan-600 dark:text-cyan-400" size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{editingInfluencer ? 'Edit Influencer' : 'Add Influencer'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{editingInfluencer ? 'Update partner details' : 'Register a new influencer partnership'}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Influencer name" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Handle (e.g. @handle) *</label>
                  <input required name="handle" value={formData.handle} onChange={handleInputChange} placeholder="@handle" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={14} />
                    <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Niche</label>
                  <select name="niche" value={formData.niche} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200">
                    <option value="Technology">Technology</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Salary ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 text-slate-400" size={14} />
                    <input required type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Videos *</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-3.5 text-slate-400" size={14} />
                    <input required type="number" name="targetVideos" value={formData.targetVideos} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform</label>
                  <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200">
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contract Type</label>
                  <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200">
                    <option value="Freelance">Freelance</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Advertisement Types</label>
                <div className="flex flex-wrap gap-2">
                  {AD_TYPE_OPTIONS.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleAdType(type)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                        formData.adTypes.includes(type) ? 'bg-cyan-600 dark:bg-cyan-500 text-white border-cyan-600 dark:border-cyan-500 shadow-md shadow-cyan-900/20' : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-cyan-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Additional notes about the influencer..." rows={3} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200" />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold shadow-xl shadow-cyan-900/40">
                  {editingInfluencer ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerManager;
