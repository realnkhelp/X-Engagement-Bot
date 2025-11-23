'use client';

import { useState, useEffect } from 'react';
import { Wallet, Bell, CheckSquare, Plus, Shield, Home, Moon, Sun } from 'lucide-react';
import HomeScreen from '@/components/screens/home-screen';
import TasksScreen from '@/components/screens/tasks-screen';
import CreateTaskScreen from '@/components/screens/create-task-screen';
import ReportScreen from '@/components/screens/report-screen';
import AnnouncementsScreen from '@/components/screens/announcements-screen';
import WalletScreen from '@/components/screens/wallet-screen';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'wallet';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  
  // Shuru me "Loading..." rahega, Guest User nahi dikhega
  const [user, setUser] = useState({
    id: 'loading', 
    name: 'Loading...', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', // Default placeholder jab tak load na ho
    balance: 2500.00,
    currency: 'Points'
  });

  useEffect(() => {
    // Function to check and load Telegram data
    const loadTelegramData = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand(); // App ko full screen karne ke liye

        const tgUser = tg.initDataUnsafe?.user;

        // Agar Telegram User mil gaya, to update karo
        if (tgUser) {
          const fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
          const finalName = fullName || tgUser.username || `User`;
          
          setUser(prev => ({
            ...prev,
            id: tgUser.id.toString(),
            name: finalName, // Original Telegram Name
            avatar: tgUser.photo_url || prev.avatar // Original Telegram Photo (agar hai to)
          }));
        }

        // Auto Theme Set Karna
        if (tg.colorScheme === 'dark') {
          setIsDark(true);
          document.documentElement.classList.add('dark');
        }
      }
    };

    // Try to load immediately
    loadTelegramData();

    // Thoda wait karke dobara try karo (kyunki script load hone me 1 sec lag sakta hai)
    const timer = setTimeout(loadTelegramData, 1000);

    // Fallback theme check for browser
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
      case 'tasks':
        return <TasksScreen />;
      case 'create':
        return <CreateTaskScreen user={user} />;
      case 'report':
        return <ReportScreen />;
      case 'announcements':
        return <AnnouncementsScreen />;
      case 'wallet':
        return <WalletScreen user={user} />;
      default:
        return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'report', label: 'Report', icon: Shield },
    { id: 'announcements', label: 'Updates', icon: Bell },
  ];

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header Section */}
        <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="font-bold text-sm">
                  {/* Agar loading hai to 'Loading...' dikhega, warna Original Name */}
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">Balance: {user.balance.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto max-w-md mx-auto w-full pb-20">
          {renderScreen()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card z-40 max-w-md mx-auto">
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id as Screen)}
                  className={`flex-1 py-3 px-2 flex flex-col items-center justify-center gap-1 transition ${
                    activeScreen === item.id
                      ? 'text-blue-500 bg-blue-500/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
