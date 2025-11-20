'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckSquare, Plus, Shield, FileText, Home, Moon, Sun } from 'lucide-react';
import HomeScreen from '@/components/screens/home-screen';
import TasksScreen from '@/components/screens/tasks-screen';
import CreateTaskScreen from '@/components/screens/create-task-screen';
import ReportScreen from '@/components/screens/report-screen';
import AnnouncementsScreen from '@/components/screens/announcements-screen';
import RulesScreen from '@/components/screens/rules-screen';
import WalletScreen from '@/components/screens/wallet-screen';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'rules' | 'wallet';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState({
    id: '12345',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    balance: 2500,
    currency: 'USDT'
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
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
      case 'rules':
        return <RulesScreen />;
      case 'wallet':
        return <WalletScreen user={user} />;
      default:
        return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'report', label: 'Report', icon: Shield },
    { id: 'announcements', label: 'Updates', icon: Bell },
    { id: 'wallet', label: 'Wallet', icon: FileText },
  ];

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">X</div>
              <div>
                <p className="font-bold text-sm">{user.name}</p>
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

        {/* Main Content */}
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
