import { useState } from 'react';
import { CheckCircle, ExternalLink, Clock } from 'lucide-react';

// User data receive karne ke liye interface banaya
interface TasksScreenProps {
  user: any; 
}

interface Task {
  id: number;
  username: string;
  category: 'Follow' | 'Engagement' | 'Like' | 'Retweet';
  avatar: string;
  progress: number;
  totalNeeded: number;
  reward: number;
  type: 'user' | 'admin';
  link: string;
}

// Yahan props me { user } add kiya hai
export default function TasksScreen({ user }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [verifyingTasks, setVerifyingTasks] = useState<{ [key: number]: 'idle' | 'waiting' | 'ready' }>({});
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      username: 'Nitesh Kumar',
      category: 'Follow',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
      progress: 45,
      totalNeeded: 100,
      reward: 500,
      type: 'user',
      link: 'https://twitter.com',
    },
    {
      id: 2,
      username: 'Priya Singh',
      category: 'Engagement',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
      progress: 32,
      totalNeeded: 50,
      reward: 250,
      type: 'user',
      link: 'https://twitter.com',
    },
    {
      id: 3,
      username: 'System Admin',
      category: 'Follow',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
      progress: 12,
      totalNeeded: 20,
      reward: 1000,
      type: 'admin',
      link: 'https://twitter.com',
    },
  ]);

  const handleOpenTask = (taskId: number, link: string) => {
    window.open(link, '_blank');
    
    setVerifyingTasks(prev => ({ ...prev, [taskId]: 'waiting' }));

    // 8 second ka timer
    setTimeout(() => {
      setVerifyingTasks(prev => ({ ...prev, [taskId]: 'ready' }));
    }, 8000); 
  };

  const handleVerifyTask = async (taskId: number) => {
    // 1. Task List se hatana
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    const task = tasks.find(t => t.id === taskId);
    
    // IMPORTANT: Yahan wo Link hai jo Onboarding me save hua tha
    const myProfileLink = user?.xProfileLink || ''; 

    if (task) {
      console.log(`Verifying Task ID: ${taskId}`);
      console.log(`User completing task: ${user.name}`);
      console.log(`User's X Profile Link: ${myProfileLink}`);

      // TODO: Yahan aapko Database Call lagana hai (MySQL API ya Firebase)
      // Example Data jo database me bhejna hai:
      /*
        const submissionData = {
           taskId: task.id,
           completedByUserId: user.id,
           completedByUserName: user.name,
           completedByUserProfileLink: myProfileLink, // YEH HAI WO LINK JO ADMIN KO DIKHEGA
           timestamp: new Date(),
           status: 'completed'
        };
        
        // API Call Example:
        // await fetch('/api/complete-task', { method: 'POST', body: JSON.stringify(submissionData) });
      */

      // Abhi sirf console me dikha raha hu ki link capture ho gaya hai
      alert(`Task Verified! Your link sent to owner: ${myProfileLink}`);
    }
  };

  const filteredTasks = tasks.filter(task => task.type === activeTab);

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

      <div className="space-y-3 pb-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No tasks available
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
                      src={task.avatar}
                      alt={task.username}
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    />
                    <div>
                      <p className="font-bold text-base">{task.username}</p>
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        {task.category}
                      </p>
                    </div>
                  </div>
                </div>

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
                        Wait...
                      </>
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
