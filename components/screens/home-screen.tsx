import { useEffect } from 'react';
import { Wallet, Bell, CheckSquare, Plus, Shield, FileText, Users } from 'lucide-react';
import NavigationCard from '@/components/ui/navigation-card';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'rules' | 'wallet';

interface HomeScreenProps {
  user: any;
  isDark: boolean;
  onNavigate?: (screen: Screen) => void;
}

export default function HomeScreen({ user, isDark, onNavigate }: HomeScreenProps) {
  
  useEffect(() => {
    if (user) {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id || user.telegram_id,
          first_name: user.first_name,
          username: user.username
        }),
      })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Sync Error:", err);
      });
    }
  }, [user]); 

  const handleNavigate = (screen: Screen) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      
      <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden relative">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20251118_225249-gR28xnd0VWsX266pkKGNGqnCjzeVlW.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NavigationCard
          icon={Wallet}
          label="Wallet"
          color="bg-blue-500"
          onClick={() => handleNavigate('wallet')}
        />
        <NavigationCard
          icon={Bell}
          label="Announcements"
          color="bg-red-500"
          onClick={() => handleNavigate('announcements')}
        />
        <NavigationCard
          icon={CheckSquare}
          label="Tasks"
          color="bg-teal-500"
          onClick={() => handleNavigate('tasks')}
        />
        <NavigationCard
          icon={Plus}
          label="Create Task"
          color="bg-teal-500"
          onClick={() => handleNavigate('create')}
        />
        <NavigationCard
          icon={Shield}
          label="Report"
          color="bg-red-500"
          onClick={() => handleNavigate('report')}
        />
        <NavigationCard
          icon={FileText}
          label="Rules"
          color="bg-purple-500"
          onClick={() => handleNavigate('rules')}
        />
      </div>

      <button className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
        <Users className="w-5 h-5" />
        Join Community
      </button>
    </div>
  );
}
