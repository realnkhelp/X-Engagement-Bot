'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Save, X, RefreshCw, User, ShieldAlert, CheckCircle, PlayCircle, PauseCircle, Edit2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  reward: number;
  completed: number;
  quantity: number;
  status: string;
  link: string;
  iconUrl: string;
  creator?: {
    name: string;
    username: string;
    id: string;
  };
}

export default function AdminTasks() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    reward: '',
    quantity: '',
    link: '',
    iconUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.reward || !formData.quantity) return;

    try {
      if (isEditing && currentTaskId) {
        await fetch('/api/admin/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentTaskId,
            action: 'edit_full',
            ...formData
          })
        });
      } else {
        await fetch('/api/admin/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      handleCancelEdit();
      fetchTasks();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleEditClick = (task: Task) => {
    setFormData({
      title: task.title,
      reward: task.reward.toString(),
      quantity: task.quantity.toString(),
      link: task.link || '',
      iconUrl: task.iconUrl || ''
    });
    setIsEditing(true);
    setCurrentTaskId(task.id);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTaskId(null);
    setFormData({ title: '', reward: '', quantity: '', link: '', iconUrl: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch('/api/admin/tasks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        fetchTasks();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'active' ? 'inactive' : 'active';
      await fetch('/api/admin/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, action: 'status', status: newStatus })
      });
      fetchTasks();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleEditLink = async (id: string, currentLink: string) => {
    const newLink = prompt("Enter new link for this task:", currentLink);
    if (newLink && newLink !== currentLink) {
      try {
        await fetch('/api/admin/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action: 'edit', link: newLink })
        });
        fetchTasks();
      } catch (error) {
        alert('Update failed');
      }
    }
  };

  const systemTasks = tasks.filter(t => (!t.creator || t.creator.id === '0') && t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const userTasks = tasks.filter(t => (t.creator && t.creator.id !== '0') && (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.creator.username?.toLowerCase().includes(searchTerm.toLowerCase())));

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Tasks...</div>;

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        
        <div className="flex p-1 bg-muted rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'create' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create System Task
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            User Task History
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className={`bg-card border rounded-xl p-6 shadow-sm transition-colors ${isEditing ? 'border-blue-500 ring-1 ring-blue-500' : 'border-border'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{isEditing ? 'Edit System Task' : 'Create New System Task'}</h2>
            {isEditing && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                Editing Mode
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reward (Points)</label>
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Members</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Task Link</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Icon URL</label>
              <input
                type="text"
                name="iconUrl"
                value={formData.iconUrl}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end pt-2 gap-3">
              {isEditing && (
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button 
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isEditing ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">
            {activeTab === 'create' ? 'System Task List' : 'User Tasks History'}
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={activeTab === 'create' ? "Search Title..." : "Search Title or User..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={fetchTasks} className="p-2 hover:bg-muted rounded-full border border-border">
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">TASK DETAILS</th>
                {activeTab === 'history' && <th className="px-4 py-3 whitespace-nowrap">CREATOR</th>}
                <th className="px-4 py-3 whitespace-nowrap">REWARD</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">MEMBERS</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">STATUS</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'create' ? systemTasks : userTasks).map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <div className="flex items-center gap-3">
                      {task.iconUrl && <img src={task.iconUrl} className="w-8 h-8 rounded-full object-cover border border-border" />}
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-blue-500 hover:underline cursor-pointer truncate max-w-[200px]" onClick={() => window.open(task.link, '_blank')}>
                          {task.link}
                        </div>
                      </div>
                    </div>
                  </td>

                  {activeTab === 'history' && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-xs">{task.creator?.name}</div>
                          <div className="text-[10px] text-muted-foreground">@{task.creator?.username}</div>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    {Number(task.reward).toFixed(2)} P
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-center">
                    {task.completed} / {task.quantity}
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit mx-auto ${task.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {task.status === 'active' ? <CheckCircle className="w-3 h-3"/> : <ShieldAlert className="w-3 h-3"/>}
                      {task.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {activeTab === 'create' ? (
                        <>
                          <button 
                            onClick={() => toggleStatus(task)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              task.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                task.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <button 
                            onClick={() => handleEditClick(task)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => toggleStatus(task)}
                            title={task.status === 'active' ? "Block Task" : "Unblock Task"}
                            className={`p-2 rounded-lg transition ${
                              task.status === 'active' 
                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {task.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleEditLink(task.id, task.link)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                            title="Edit Link"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(activeTab === 'create' ? systemTasks : userTasks).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No tasks found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
