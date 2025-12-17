import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Clock } from 'lucide-react';

interface TasksScreenProps {
  user: any; 
}

interface Task {
  id: number;
  creatorName: string; // Updated to camelCase
  category: string;
  creatorAvatar: string; // Updated to camelCase
  completedCount: number; // Updated to camelCase
  quantity: number;
  reward: string; // Decimal comes as string from JSON often, but we handle it
  type: 'user' | 'admin';
  link: string;
}

export default function TasksScreen({ user }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track status of each task verification individually
  const [verifyingTasks, setVerifyingTasks] = useState<{ [key: number]: 'idle' | 'waiting' | 'ready' | 'verifying' }>({});

  useEffect(() => {
    // Only fetch if we have user ID (using 'telegramId' now as per Prisma model)
    if (user?.telegramId) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${user.id}`); // Sending internal ID is safer for relations
      const data = await res.json();
      
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTask = (taskId: number, link: string) => {
    window.open(link, '_blank');
    
    // Set state to 'waiting' (timer starts)
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'waiting' }));

    // After 10 seconds, allow verification
    setTimeout(() => {
      setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
    }, 10000);
  };

  const handleVerifyTask = async (taskId: number, reward: string) => {
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'verifying' }));

    try {
      const res = await fetch('/api/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // Internal ID
          telegramId: user.telegramId.toString(), // For clearing Redis cache
          taskId: taskId,
          reward: Number(reward)
        })
      });

      const data = await res.json();

      if (data.success) {
        // Remove task from list immediately
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        // Optional: Show success toast/alert
        // alert(`Task Verified! You earned ${reward} Points.`);
      } else {
        alert(data.error || 'Verification Failed. Please try again.');
        setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Check connection.');
      setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
    }
  };

  const filteredTasks = tasks.filter(task => task.type === activeTab);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-muted-foreground gap-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Loading Tasks...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
            activeTab === 'user'
              ? 'bg-card shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          User Tasks
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
            activeTab === 'admin'
              ? 'bg-card shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Admin Tasks
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3 pb-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-10 h-10 opacity-20" />
            <p>No tasks available right now.</p>
            <p className="text-xs">Come back later for more!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const status = verifyingTasks[task.id] || 'idle';
            const progress = (task.completedCount / task.quantity) * 100;
            
            return (
              <div
                key={task.id}
                className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.creatorAvatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" }}
                    />
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{task.creatorName || 'Official Task'}</p>
                      <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {task.category || 'General'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{task.completedCount}/{task.quantity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Reward</span>
                  <span className="font-bold text-green-600 dark:text-green-400">+{Number(task.reward)} Points</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => handleOpenTask(task.id, task.link)}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </button>
                  
                  <button 
                    onClick={() => handleVerifyTask(task.id, task.reward)}
                    disabled={status !== 'ready'}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                      status === 'ready'
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20 active:scale-95'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {status === 'waiting' ? (
                      <>
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span className="animate-pulse">Wait...</span>
                      </>
                    ) : status === 'verifying' ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
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
