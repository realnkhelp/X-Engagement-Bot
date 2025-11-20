import { useState } from 'react';
import { CheckCircle, Eye, MoreVertical } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  createdBy: string;
  avatar: string;
  progress: number;
  totalNeeded: number;
  reward: number;
}

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  const userTasks: Task[] = [
    {
      id: 1,
      title: 'Follow Twitter Account',
      createdBy: 'Admin User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      progress: 45,
      totalNeeded: 100,
      reward: 500,
    },
    {
      id: 2,
      title: 'Like and Retweet',
      createdBy: 'Content Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      progress: 32,
      totalNeeded: 50,
      reward: 250,
    },
  ];

  const adminTasks: Task[] = [
    {
      id: 3,
      title: 'Verify Task Completion',
      createdBy: 'System',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      progress: 12,
      totalNeeded: 20,
      reward: 1000,
    },
  ];

  const tasks = activeTab === 'user' ? userTasks : adminTasks;

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'user'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          User List
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'admin'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Admin List
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 pb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={task.avatar || "/placeholder.svg"}
                  alt={task.createdBy}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.createdBy}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{task.progress}/{task.totalNeeded}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(task.progress / task.totalNeeded) * 100}%` }}
                />
              </div>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reward</span>
              <span className="font-bold text-green-500">{task.reward} Points</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                Open
              </button>
              <button className="flex-1 py-2 rounded-lg border border-blue-500 text-blue-500 font-semibold hover:bg-blue-500/10 transition flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
