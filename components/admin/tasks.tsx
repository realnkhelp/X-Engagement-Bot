import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  reward: number;
  completions: number;
  status: 'active' | 'paused';
  createdDate: string;
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T001',
      title: 'Follow Twitter Account',
      category: 'Twitter',
      reward: 500,
      completions: 45,
      status: 'active',
      createdDate: '2025-01-15',
    },
    {
      id: 'T002',
      title: 'Join Telegram Channel',
      category: 'Telegram',
      reward: 300,
      completions: 28,
      status: 'active',
      createdDate: '2025-01-16',
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Task Management</h1>
          <p className="text-muted-foreground">Create and manage platform tasks</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Task ID</th>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Reward</th>
                <th className="px-4 py-3 text-left font-semibold">Completions</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-mono text-xs">{task.id}</td>
                  <td className="px-4 py-3 font-semibold">{task.title}</td>
                  <td className="px-4 py-3">{task.category}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{task.reward}</td>
                  <td className="px-4 py-3">{task.completions}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      task.status === 'active'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
