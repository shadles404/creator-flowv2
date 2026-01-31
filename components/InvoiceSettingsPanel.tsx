
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  Building2, 
  CreditCard, 
  FileText, 
  Globe, 
  Phone, 
  MapPin,
  Tag
} from 'lucide-react';
import { InvoiceSettings } from '../types';

interface InvoiceSettingsPanelProps {
  settings: InvoiceSettings;
  onSave: (settings: InvoiceSettings) => void;
}

const InvoiceSettingsPanel: React.FC<InvoiceSettingsPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<InvoiceSettings>(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter transition-colors">Invoice Configuration</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Set persistent defaults for your professional billing documents</p>
        </div>
        <div className={`flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 transition-all duration-500 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
          <Check size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Defaults Updated</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand Identity */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-200 dark:text-white transition-colors">
            <Building2 size={120} />
          </div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-500/10 rounded-2xl transition-colors">
              <Building2 className="text-cyan-600 dark:text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter transition-colors">Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Company / Brand Name</label>
              <input name="brandName" value={localSettings.brandName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="e.g. CreatorFlow HQ" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Brand Tagline</label>
              <input name="brandTagline" value={localSettings.brandTagline} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="e.g. Digital Growth Partners" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Corporate Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-4 text-slate-300 dark:text-slate-700 transition-colors" size={16} />
                <input name="brandWebsite" value={localSettings.brandWebsite} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="www.yourbrand.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-300 dark:text-slate-700 transition-colors" size={16} />
                <input name="brandPhone" value={localSettings.brandPhone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="+1 000 000 000" />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">HQ Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-300 dark:text-slate-700 transition-colors" size={16} />
                <textarea name="brandAddress" value={localSettings.brandAddress} onChange={handleChange} rows={2} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="123 Business Avenue..." />
              </div>
            </div>
          </div>
        </section>

        {/* Financial Details */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-200 dark:text-white transition-colors">
            <CreditCard size={120} />
          </div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl transition-colors">
              <CreditCard className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter transition-colors">Financial Settlement Info</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Bank Name</label>
              <input name="bankName" value={localSettings.bankName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Account Number / IBAN</label>
              <input name="bankAccount" value={localSettings.bankAccount} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Swift / Extra Bank Details</label>
              <input name="bankDetails" value={localSettings.bankDetails} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Standard Tax Rate (%)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-4 text-slate-300 dark:text-slate-700 transition-colors" size={16} />
                <input type="number" name="taxPercent" value={localSettings.taxPercent} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-emerald-500 outline-none transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Legal & Terms */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-200 dark:text-white transition-colors">
            <FileText size={120} />
          </div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl transition-colors">
              <FileText className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter transition-colors">Contractual Terms</h3>
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1 transition-colors">Universal Terms & Conditions</label>
            <textarea name="paymentTerms" value={localSettings.paymentTerms} onChange={handleChange} rows={5} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] px-6 py-5 text-slate-700 dark:text-slate-300 font-medium focus:border-amber-500 outline-none leading-relaxed transition-colors" placeholder="Payment due within 30 days of invoice date..." />
          </div>
        </section>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-cyan-900/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-3"
          >
            <Save size={18} />
            <span>Persist Global Invoice Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceSettingsPanel;
