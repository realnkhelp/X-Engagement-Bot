'use client';

import { useState } from 'react';
import { Search, Edit, Trash2, Plus, CheckCircle, XCircle, Save, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  reward: number;
  completedMembers: number;
  totalMembers: number;
  status: boolean;
  link?: string;
  iconUrl?: string;
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T001',
      title: 'JOIN REAL NK CRYPTO CHANNEL',
      reward: 0.01,
      completedMembers: 0,
      totalMembers: 50000,
      status: true,
      link: 'https://t.me/example',
      iconUrl: ''
    },
    {
      id: 'T002',
      title: 'Join Technical Ak Channel',
      reward: 0.01,
      completedMembers: 1250,
      totalMembers: 50000,
      status: true,
      link: 'https://t.me/example2',
      iconUrl: ''
    },
    {
      id: 'T003',
      title: 'Quotex Bug Signal',
      reward: 0.05,
      completedMembers: 5000,
      totalMembers: 5000,
      status: false,
      link: 'https://t.me/example3',
      iconUrl: ''
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    reward: '',
    totalMembers: '',
    link: '',
    iconUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.reward || !formData.totalMembers) return;

    if (isEditing && currentTaskId) {
      setTasks(tasks.map(task => 
        task.id === currentTaskId 
          ? { 
              ...task, 
              title: formData.title,
              reward: parseFloat(formData.reward),
              totalMembers: parseInt(formData.totalMembers),
              link: formData.link,
              iconUrl: formData.iconUrl
            } 
          : task
      ));
      setIsEditing(false);
      setCurrentTaskId(null);
    } else {
      const newTask: Task = {
        id: `T${Math.floor(Math.random() * 10000)}`,
        title: formData.title,
        reward: parseFloat(formData.reward),
        completedMembers: 0,
        totalMembers: parseInt(formData.totalMembers),
        status: true,
        link: formData.link,
        iconUrl: formData.iconUrl
      };
      setTasks([...tasks, newTask]);
    }

    setFormData({ title: '', reward: '', totalMembers: '', link: '', iconUrl: '' });
  };

  const handleEditClick = (task: Task) => {
    setFormData({
      title: task.title,
      reward: task.reward.toString(),
      totalMembers: task.totalMembers.toString(),
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
    setFormData({ title: '', reward: '', totalMembers: '', link: '', iconUrl: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: !task.status } : task
    ));
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management</h1>
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
              <label className="block text-sm font-medium mb-1">Reward (USDT)</label>
              <input
                type="number"
                name="reward"
                value={formData.reward}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Members</label>
              <input
                type="number"
                name="totalMembers"
                value={formData.totalMembers}
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
                    {task.title}
                  </td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    {task.reward} USDT
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {task.completedMembers} / {task.totalMembers}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button 
                      onClick={() => toggleStatus(task.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        task.status ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          task.status ? 'translate-x-6' : 'translate-x-1'
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