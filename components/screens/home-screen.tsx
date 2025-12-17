import { Wallet, Bell, CheckSquare, Plus, Shield, FileText, Users } from 'lucide-react';
import NavigationCard from '@/components/ui/navigation-card';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'rules' | 'wallet';

interface HomeScreenProps {
  user: any;
  isDark: boolean;
  onNavigate?: (screen: Screen) => void;
}

export default function HomeScreen({ user, isDark, onNavigate }: HomeScreenProps) {
  
  // Note: API call hata diya gaya hai kyunki Page.tsx data pass kar raha hai.
  // Ab yeh component sirf UI render karega.

  const handleNavigate = (screen: Screen) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const handleJoinCommunity = () => {
    // Is link ko baad mein Settings API se dynamic karenge
    window.open('https://t.me/ads_tasker', '_blank');
  };

  return (
    <div className="px-4 py-6 space-y-6">
      
      {/* Banner Section */}
      <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden relative shadow-lg">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20251118_225249-gR28xnd0VWsX266pkKGNGqnCjzeVlW.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation Grid */}
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

      {/* Community Button */}
      <button 
        onClick={handleJoinCommunity}
        className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-md active:scale-95 duration-200"
      >
        <Users className="w-5 h-5" />
        Join Community
      </button>
    </div>
  );
}
