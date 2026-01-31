
import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.tsx will handle the successful login
    } catch (error: any) {
      let errorMessage = "Failed to login. Please check your credentials.";
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Invalid terminal ID or security key.";
          break;
        case "auth/invalid-email":
          errorMessage = "The provided terminal ID is not a valid format.";
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      
      <div className="w-full max-w-md bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-10 rounded-[40px] shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-xl shadow-cyan-500/5">
            <ShieldCheck className="text-cyan-600 dark:text-cyan-400" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase mb-2">CreatorFlow</h1>
          <p className="text-slate-500 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Local Access Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-400 dark:text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creatorflow.com"
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest ml-1">Security Key (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-400 dark:text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-rose-600 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/40 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Decrypting...</span>
              </div>
            ) : 'Authorize Access'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-700 font-bold uppercase tracking-widest">
            Protected by CreatorFlow Security Protocol v4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
