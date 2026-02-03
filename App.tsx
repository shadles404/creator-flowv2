
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InfluencerManager from './components/InfluencerManager';
import TrackingInfluencer from './components/TrackingInfluencer';
import DeliveryManager from './components/DeliveryManager';
import ExpenseFlow from './components/ExpenseFlow';
import Reports from './components/Reports';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import InvoiceSettingsPanel from './components/InvoiceSettingsPanel';
import ConfirmedPayments from './components/ConfirmedPayments';
import { Influencer, Transaction, Delivery, Project, Task, InvoiceSettings } from './types';
import { Shield, LogOut, Loader2, Database, BellRing, X } from 'lucide-react';
import { db, auth } from './lib/firebase';
import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  brandName: 'LOGO NAME',
  brandTagline: 'YOUR TAGLINE',
  brandPhone: '+1 2345 6789',
  brandAddress: '123 Business Way, HQ',
  brandWebsite: 'YOURWEBSITE.COM',
  bankAccount: '0000 0000 0000',
  bankName: 'LOREM IPSUM',
  bankDetails: 'ADD YOUR DETAILS',
  paymentTerms: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget consectetur nunc. In rutrum porttitor risus. Duis scelerisque porttitor tincidunt. Etiam vel lobortis metus.',
  taxPercent: '10'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Local Data State
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['Other', 'Production', 'Commission', 'Ad Spend', 'Gift', 'Software']);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS);
  
  // Notification State
  const [activeNotifications, setActiveNotifications] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  // Generic function to save data to Firestore
  const saveData = async (collectionName: string, data: any[]) => {
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(collection(db, collectionName), item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  };

  // Load Data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const influencersCollection = await getDocs(collection(db, "influencers"));
      setInfluencers(influencersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Influencer[]);

      const transactionsCollection = await getDocs(collection(db, "transactions"));
      setTransactions(transactionsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[]);

      const deliveriesCollection = await getDocs(collection(db, "deliveries"));
      setDeliveries(deliveriesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delivery[]);

      const projectsCollection = await getDocs(collection(db, "projects"));
      setProjects(projectsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);

      const tasksCollection = await getDocs(collection(db, "tasks"));
      setTasks(tasksCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);

      const categoriesCollection = await getDocs(collection(db, "categories"));
      setCategories(categoriesCollection.docs.map(doc => doc.data().name) as string[]);
      
      const invoiceSettingsCollection = await getDocs(collection(db, "invoiceSettings"));
      if (invoiceSettingsCollection.docs.length > 0) {
        setInvoiceSettings(invoiceSettingsCollection.docs[0].data() as InvoiceSettings);
      }
      
      setLoading(false);
    };
    if (user){
      fetchData();
    }
  }, [user]);

  // Save data whenever it changes
  useEffect(() => {
    if (loading) return;
    saveData("influencers", influencers);
  }, [influencers, loading]);

  useEffect(() => {
    if (loading) return;
    saveData("transactions", transactions);
  }, [transactions, loading]);

  useEffect(() => {
    if (loading) return;
    saveData("deliveries", deliveries);
  }, [deliveries, loading]);

  useEffect(() => {
    if (loading) return;
    saveData("projects", projects);
  }, [projects, loading]);

  useEffect(() => {
    if (loading) return;
    saveData("tasks", tasks);
  }, [tasks, loading]);

  useEffect(() => {
    if (loading) return;
    // Categories are just strings, so we need to format them for saving
    saveData("categories", categories.map(name => ({ name })));
  }, [categories, loading]);

  useEffect(() => {
    if (loading) return;
    // Invoice settings is a single object, not an array
    const batch = writeBatch(db);
    const docRef = doc(collection(db, "invoiceSettings"), "settings");
    batch.set(docRef, invoiceSettings);
    batch.commit();
  }, [invoiceSettings, loading]);

  
  // Reminder Notification Engine
  useEffect(() => {
    if (loading || !user) return;

    const checkReminders = () => {
      const now = new Date();
      const triggeringTasks = tasks.filter(task => {
        if (!task.reminderTime || task.reminderDismissed || task.status === 'Done') return false;
        const rTime = new Date(task.reminderTime);
        return rTime <= now;
      });

      if (triggeringTasks.length > 0) {
        setActiveNotifications(prev => {
          const newIds = triggeringTasks.map(t => t.id);
          const currentIds = prev.map(t => t.id);
          const toAdd = triggeringTasks.filter(t => !currentIds.includes(t.id));
          return [...prev, ...toAdd];
        });
      }
    };

    const interval = setInterval(checkReminders, 15000);
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks, loading, user]);

  const dismissNotification = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, reminderDismissed: true } : t));
    setActiveNotifications(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // user will be set to null by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleAddInfluencer = (inf: Influencer) => {
    const influencerWithPayment: Influencer = {
      ...inf,
      paymentStatus: inf.paymentStatus || 'pending'
    };
    setInfluencers(prev => [...prev, influencerWithPayment]);
  };
  const handleUpdateInfluencer = (updated: Influencer) => setInfluencers(prev => prev.map(i => i.id === updated.id ? updated : i));
  const handleDeleteInfluencer = async (id: string) => {
    await deleteDoc(doc(db, "influencers", id));
    setInfluencers(prev => prev.filter(i => i.id !== id))
  };
  const handleResetAllInfluencers = () => {
    if (confirm('Are you sure you want to reset completion progress for ALL influencers?')) {
      setInfluencers(prev => prev.map(inf => ({ ...inf, completedVideos: 0 })));
    }
  };

  const handleAddDelivery = (del: Delivery) => setDeliveries(prev => [...prev, del]);
  const handleUpdateDelivery = (updated: Delivery) => setDeliveries(prev => prev.map(d => d.id === updated.id ? updated : d));
  const handleDeleteDelivery = async (id: string) => {
    await deleteDoc(doc(db, "deliveries", id));
    setDeliveries(prev => prev.filter(d => d.id !== id));
  };

  const handleBulkUpdateDeliveries = async (ids: string[], updates: Partial<Delivery>) => {
    setDeliveries(prev => prev.map(d => ids.includes(d.id) ? { ...d, ...updates } : d));
  };

  const handleBulkDeleteDeliveries = async (ids: string[]) => {
    const batch = writeBatch(db);
    ids.forEach(id => {
        const docRef = doc(db, "deliveries", id);
        batch.delete(docRef);
    });
    await batch.commit();
    setDeliveries(prev => prev.filter(d => !ids.includes(d.id)));
  };
  const handleDeleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(prev => prev.filter(p => p.id !== id));
  };

    const handleDeleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(prev => prev.filter(p => p.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard influencers={influencers} transactions={transactions} />;
      case 'influencers':
        return (
          <InfluencerManager 
            influencers={influencers} 
            onAddInfluencer={handleAddInfluencer} 
            onUpdateInfluencer={handleUpdateInfluencer}
            onDeleteInfluencer={handleDeleteInfluencer}
          />
        );
      case 'tracker':
        return (
          <TrackingInfluencer 
            influencers={influencers} 
            onUpdateInfluencer={handleUpdateInfluencer} 
            onDeleteInfluencer={handleDeleteInfluencer} 
            onResetAll={handleResetAllInfluencers}
          />
        );
      case 'payouts':
        return (
          <ConfirmedPayments 
            influencers={influencers} 
            onUpdateInfluencer={handleUpdateInfluencer} 
          />
        );
      case 'deliveries':
        return (
          <DeliveryManager 
            deliveries={deliveries} 
            influencers={influencers} 
            onAddDelivery={handleAddDelivery} 
            onUpdateDelivery={handleUpdateDelivery} 
            onDeleteDelivery={handleDeleteDelivery}
            onBulkUpdateDeliveries={handleBulkUpdateDeliveries}
            onBulkDeleteDeliveries={handleBulkDeleteDeliveries}
          />
        );
      case 'expenses':
        return (
          <ExpenseFlow 
            projects={projects} 
            setProjects={setProjects} 
            categories={categories} 
            setCategories={setCategories} 
            invoiceSettings={invoiceSettings}
            setInvoiceSettings={setInvoiceSettings}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'tasks':
        return <TaskManager tasks={tasks} setTasks={setTasks} onDeleteTask={handleDeleteTask} />;
      case 'reports':
        return <Reports influencers={influencers} deliveries={deliveries} projects={projects} transactions={transactions} tasks={tasks} />;
      case 'invoice-settings':
        return <InvoiceSettingsPanel settings={invoiceSettings} onSave={setInvoiceSettings} />;
      default:
        return <Dashboard influencers={influencers} transactions={transactions} />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-50'} flex flex-col items-center justify-center space-y-4 transition-colors duration-300`}>
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing Local Memory...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Login />
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      >
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4 relative">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-cyan-500">
              <Database size={10} />
              <span>System is Active</span>
              <span className="text-slate-700 dark:text-slate-500 ml-2">SESSION: {user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
            >
              <LogOut size={12} />
              <span>Lock Console</span>
            </button>
          </div>
          
          {activeNotifications.length > 0 && (
            <div className="fixed bottom-6 right-6 z-[200] space-y-3 w-80">
              {activeNotifications.map(notification => (
                <div key={notification.id} className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 p-5 rounded-3xl shadow-2xl flex items-start space-x-4 animate-in slide-in-from-right-8 duration-300">
                  <div className="bg-cyan-500/20 p-2.5 rounded-2xl">
                    <BellRing className="text-cyan-400 animate-bounce" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Task Reminder</h4>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{notification.title}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold">Due: {notification.dueDate}</p>
                  </div>
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="p-1.5 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {renderContent()}
        </div>
      </Layout>
    </div>
  );
};

export default App;
