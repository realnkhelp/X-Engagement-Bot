'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Save, X, RefreshCw } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  reward: number;
  completedCount: number;
  quantity: number;
  status: string;
  link: string;
  iconUrl: string;
}

export default function AdminTasks() {
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
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

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
            title: formData.title,
            reward: formData.reward,
            quantity: formData.quantity,
            link: formData.link,
            iconUrl: formData.iconUrl
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTaskId(null);
    setFormData({ title: '', reward: '', quantity: '', link: '', iconUrl: '' });
  };

  const handleDelete = async (id: number) => {
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
        body: JSON.stringify({ id: task.id, status: newStatus })
      });
      fetchTasks();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Tasks...</div>;

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button onClick={fetchTasks} className="p-2 hover:bg-muted rounded-full">
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className={`bg-card border rounded-xl p-6 shadow-sm transition-colors ${isEditing ? 'border-blue-500 ring-1 ring-blue-500' : 'border-border'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
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

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Task History</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">TITLE</th>
                <th className="px-4 py-3 whitespace-nowrap">REWARD</th>
                <th className="px-4 py-3 whitespace-nowrap">MEMBERS</th>
                <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      {task.iconUrl && <img src={task.iconUrl} className="w-6 h-6 rounded-full" />}
                      {task.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    {Number(task.reward).toFixed(2)} P
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {task.completedCount} / {task.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button 
                      onClick={() => toggleStatus(task)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        task.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          task.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleEditClick(task)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition font-medium text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 transition font-medium text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
