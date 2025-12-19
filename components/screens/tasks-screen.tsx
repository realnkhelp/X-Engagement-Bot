import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Clock, ShieldCheck, User } from 'lucide-react';

interface TasksScreenProps {
  user: any; 
}

interface Task {
  id: number;
  title: string;
  creatorName: string;
  category: string;
  creatorAvatar: string;
  completedCount: number;
  quantity: number;
  reward: string;
  type: 'user' | 'admin';
  link: string;
}

export default function TasksScreen({ user }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tasks ka verification status track karne ke liye
  const [verifyingTasks, setVerifyingTasks] = useState<{ [key: number]: 'idle' | 'waiting' | 'ready' | 'verifying' }>({});

  useEffect(() => {
    if (user?.telegramId) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      // FIX: Yahan hum Telegram ID bhej rahe hain taaki API sahi user dhoond sake
      const res = await fetch(`/api/tasks?userId=${user.telegramId}`); 
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
    
    // Timer start karo (10 seconds)
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'waiting' }));

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
          userId: user.id, // Internal ID database ke liye
          telegramId: user.telegramId.toString(),
          taskId: taskId,
          reward: Number(reward)
        })
      });

      const data = await res.json();

      if (data.success) {
        // INSTANT REMOVE: Task ko list se turant hata do
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        // State clean karo
        setVerifyingTasks(prev => {
           const newState = { ...prev };
           delete newState[taskId];
           return newState;
        });

      } else {
        alert(data.error || 'Verification Failed.');
        setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
      }
    } catch (error) {
      console.error(error);
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
    <div className="px-4 py-6 space-y-4 pb-24">
      {/* Tabs */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2 ${
            activeTab === 'user'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" /> User Tasks
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2 ${
            activeTab === 'admin'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Admin Tasks
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-12 h-12 opacity-10" />
            <p className="font-medium">No tasks available</p>
            <p className="text-xs">You have completed all tasks in this category!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const status = verifyingTasks[task.id] || 'idle';
            const progress = (task.completedCount / task.quantity) * 100;
            
            return (
              <div
                key={task.id}
                className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={task.creatorAvatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{task.title || task.creatorName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                         {task.category}
                       </span>
                       <span className="text-[10px] text-muted-foreground">
                         by {task.creatorName}
                       </span>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="block font-bold text-green-600">+{Number(task.reward)} P</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <span>Slots</span>
                    <span>{task.completedCount}/{task.quantity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => handleOpenTask(task.id, task.link)}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    OPEN
                  </button>
                  
                  <button 
                    onClick={() => handleVerifyTask(task.id, task.reward)}
                    disabled={status !== 'ready'}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      status === 'ready'
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm active:scale-95'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {status === 'waiting' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        WAIT 10s
                      </>
                    ) : status === 'verifying' ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        CLAIM
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
