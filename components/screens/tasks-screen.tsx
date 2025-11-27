import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Clock } from 'lucide-react';

interface TasksScreenProps {
  user: any; 
}

interface Task {
  id: number;
  creator_name: string;
  category: string;
  creator_avatar: string;
  completed_count: number;
  quantity: number;
  reward: number;
  type: 'user' | 'admin';
  link: string;
}

export default function TasksScreen({ user }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingTasks, setVerifyingTasks] = useState<{ [key: number]: 'idle' | 'waiting' | 'ready' | 'verifying' }>({});

  useEffect(() => {
    if (user?.telegram_id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${user.telegram_id}`);
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

  const handleOpenTask = (taskId: number, link: string) => {
    window.open(link, '_blank');
    
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'waiting' }));

    setTimeout(() => {
      setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
    }, 10000);
  };

  const handleVerifyTask = async (taskId: number) => {
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'verifying' }));

    try {
      const res = await fetch('/api/tasks/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.telegram_id,
          taskId: taskId
        })
      });

      const data = await res.json();

      if (data.success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        alert(`Task Verified! You earned ${data.reward} Points.`);
      } else {
        alert('Verification Failed. Please try again.');
        setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
      }
    } catch (error) {
      console.error(error);
      setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
    }
  };

  const filteredTasks = tasks.filter(task => task.type === activeTab);

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading Tasks...</div>;
  }

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'user'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          User Tasks
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'admin'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Admin Tasks
        </button>
      </div>

      <div className="space-y-3 pb-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No tasks available in this category.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const status = verifyingTasks[task.id] || 'idle';
            
            return (
              <div
                key={task.id}
                className="bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.creator_avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    />
                    <div>
                      <p className="font-bold text-base">{task.creator_name || 'Admin Task'}</p>
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        {task.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{task.completed_count}/{task.quantity}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(task.completed_count / task.quantity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="font-bold text-green-500">{task.reward} Points</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleOpenTask(task.id, task.link)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </button>
                  
                  <button 
                    onClick={() => handleVerifyTask(task.id)}
                    disabled={status !== 'ready'}
                    className={`flex-1 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                      status === 'ready'
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                    }`}
                  >
                    {status === 'waiting' ? (
                      <>
                        <Clock className="w-4 h-4 animate-pulse" />
                        Wait 10s
                      </>
                    ) : status === 'verifying' ? (
                      <>Checking...</>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
