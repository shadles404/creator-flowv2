
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  Calendar, 
  LayoutList,
  CheckSquare,
  Square,
  Bell,
  BellRing,
  ArrowRight
} from 'lucide-react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    reminderTime: '',
    enableReminder: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reminderVal = formData.enableReminder && formData.reminderTime ? formData.reminderTime : undefined;

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { 
        ...t, 
        title: formData.title, 
        dueDate: formData.dueDate, 
        priority: formData.priority,
        reminderTime: reminderVal,
        reminderDismissed: reminderVal !== t.reminderTime ? false : t.reminderDismissed
      } : t));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        dueDate: formData.dueDate,
        status: 'Not Done',
        priority: formData.priority,
        reminderTime: reminderVal,
        reminderDismissed: false
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({ title: '', dueDate: new Date().toISOString().split('T')[0], priority: 'Medium', reminderTime: '', enableReminder: false });
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Done' ? 'Not Done' : 'Done' } : t
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this operational task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      reminderTime: task.reminderTime || '',
      enableReminder: !!task.reminderTime
    });
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    pending: tasks.filter(t => t.status === 'Not Done').length,
  };

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter transition-colors">Task Terminal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Global operational workflow & milestone tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-cyan-900/40"
        >
          <Plus size={16} />
          <span>New Mission</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg flex items-center justify-between transition-colors">
           <div>
             <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1 transition-colors">Total Directive</div>
             <div className="text-3xl font-black text-slate-900 dark:text-slate-100 transition-colors">{stats.total}</div>
           </div>
           <LayoutList className="text-slate-100 dark:text-slate-700 transition-colors" size={32} />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg flex items-center justify-between transition-colors">
           <div>
             <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1 transition-colors">Completed</div>
             <div className="text-3xl font-black text-emerald-600 dark:text-emerald-500 transition-colors">{stats.done}</div>
           </div>
           <CheckCircle2 className="text-emerald-100 dark:text-emerald-500/20 transition-colors" size={32} />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm dark:shadow-lg flex items-center justify-between transition-colors">
           <div>
             <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1 transition-colors">In Queue</div>
             <div className="text-3xl font-black text-amber-600 dark:text-amber-500 transition-colors">{stats.pending}</div>
           </div>
           <Clock className="text-amber-100 dark:text-amber-500/20 transition-colors" size={32} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
           <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter text-xl transition-colors">Operation Registry</h3>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-2.5 text-slate-400 dark:text-slate-500 transition-colors" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Locate mission by title..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 dark:text-slate-200 transition-colors"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-black bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
              <tr>
                <th className="px-8 py-6 w-12 text-center">Status</th>
                <th className="px-8 py-6">Mission Title</th>
                <th className="px-8 py-6">Due Date</th>
                <th className="px-8 py-6 text-center">Reminder</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 dark:text-slate-600 font-bold italic uppercase tracking-widest transition-colors">Zero active missions in registry.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => handleToggleStatus(task.id)}
                        className={`transition-all hover:scale-110 ${task.status === 'Done' ? 'text-emerald-500' : 'text-slate-200 dark:text-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400'}`}
                      >
                        {task.status === 'Done' ? <CheckSquare size={22} /> : <Square size={22} />}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`font-bold transition-all ${task.status === 'Done' ? 'text-slate-300 dark:text-slate-600 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                        {task.title}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest transition-colors">
                         <Calendar size={14} className="mr-2 text-cyan-600 dark:text-cyan-400 opacity-50 transition-colors" />
                         {task.dueDate}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {task.reminderTime ? (
                        <div className="flex flex-col items-center">
                          <BellRing size={14} className="text-cyan-600 dark:text-cyan-400 animate-pulse mb-1 transition-colors" />
                          <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase transition-colors">{new Date(task.reminderTime).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                      ) : (
                        <Bell size={14} className="text-slate-100 dark:text-slate-800 mx-auto transition-colors" />
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        task.priority === 'High' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-100 dark:border-rose-500/20' : 
                        task.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-500/20' : 
                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-400/10"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 size={16} />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar transition-colors">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter transition-colors">
                {editingTask ? 'Edit Directive' : 'New Directive'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Directive Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Sign contracts with @creatorX"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 font-bold focus:border-cyan-500 outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Target Date</label>
                  <input 
                    required
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-slate-900 dark:text-slate-200 text-xs focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors">Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-slate-900 dark:text-slate-200 text-xs focus:border-cyan-500 outline-none appearance-none transition-colors"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell size={14} className="text-cyan-600 dark:text-cyan-400 transition-colors" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Smart Reminder</span>
                  </div>
                  <input 
                    type="checkbox" 
                    name="enableReminder" 
                    checked={formData.enableReminder} 
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-500 focus:ring-cyan-500/20 transition-colors"
                  />
                </div>
                {formData.enableReminder && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-2 transition-colors">Notification Time</label>
                    <input 
                      required={formData.enableReminder}
                      type="datetime-local"
                      name="reminderTime"
                      value={formData.reminderTime}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-xs focus:border-cyan-500 outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transition-colors"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-900/40 transition-all transform hover:-translate-y-1"
                >
                  {editingTask ? 'Update Data' : 'Initialize Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
