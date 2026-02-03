
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { Shield, UserPlus, Trash2, Mail, X } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'staff' as UserRole
  });

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as UserProfile[];
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser: Omit<UserProfile, 'uid' | 'createdAt'> = {
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role,
      };
      const docRef = await addDoc(collection(db, "users"), {
        ...newUser,
        createdAt: new Date().toISOString()
      });
      setUsers([...users, { ...newUser, uid: docRef.id, createdAt: new Date().toISOString() }]);
      setIsModalOpen(false);
      setFormData({ email: '', displayName: '', role: 'staff' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (confirm(`Revoke access for ${email}?`)) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(u => u.uid !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase transition-colors">User Control</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Manage enterprise access and permission levels</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] transition-all shadow-xl shadow-emerald-900/40"
        >
          <UserPlus size={16} />
          <span>Provision User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors">
            <tr>
              <th className="px-8 py-6">User Identity</th>
              <th className="px-8 py-6">Auth Email</th>
              <th className="px-8 py-6 text-center">Security Level</th>
              <th className="px-8 py-6">Created</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center animate-pulse text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest transition-colors">Scanning Network...</td></tr>
            ) : users.map((user) => (
              <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors">
                      {user.displayName[0]}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 transition-colors">{user.displayName}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-500 dark:text-slate-400 font-medium transition-colors">{user.email}</td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                      user.role === 'admin' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-100 dark:border-rose-500/20' : 
                      user.role === 'staff' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20' : 
                      'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest transition-colors">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleDeleteUser(user.uid, user.email)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter transition-colors">Provision User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Full Name</label>
                <input 
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 text-sm focus:border-cyan-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-slate-300 dark:text-slate-600 transition-colors" size={16} />
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 text-sm focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">Permission Level</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-4 text-slate-300 dark:text-slate-600 transition-colors" size={16} />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-slate-200 text-sm focus:border-cyan-500 outline-none appearance-none transition-colors"
                  >
                    <option value="staff">Staff - Operations</option>
                    <option value="delivery">Delivery - Limited</option>
                    <option value="admin">Administrator - Full Access</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-cyan-900/40"
              >
                Confirm Access Grant
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
