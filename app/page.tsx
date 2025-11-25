'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckSquare, Plus, Shield, Home, Moon, Sun } from 'lucide-react';
import HomeScreen from '@/components/screens/home-screen';
import TasksScreen from '@/components/screens/tasks-screen';
import CreateTaskScreen from '@/components/screens/create-task-screen';
import ReportScreen from '@/components/screens/report-screen';
import AnnouncementsScreen from '@/components/screens/announcements-screen';
import WalletScreen from '@/components/screens/wallet-screen';
import RulesScreen from '@/components/screens/rules-screen';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'wallet' | 'rules';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  
  const [user, setUser] = useState({
    id: 'guest',
    name: 'Guest',
    avatar: '', 
    balance: 2500.00,
    currency: 'Points'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let themeToApply = 'light'; 

    if (savedTheme) {
      themeToApply = savedTheme;
    } else {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.colorScheme === 'dark') {
        themeToApply = 'dark';
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeToApply = 'dark';
      }
    }

    if (themeToApply === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const loadTelegramData = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        const tgUser = tg.initDataUnsafe?.user;
        
        if (tgUser) {
          const fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
          const finalName = fullName || tgUser.username || `User`;
          
          setUser(prev => ({
            ...prev,
            id: tgUser.id.toString(),
            name: finalName,
            avatar: tgUser.photo_url || ''
          }));
        }
      }
    };

    loadTelegramData();
    const timer = setTimeout(loadTelegramData, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        return <ReportScreen onNavigate={setActiveScreen} />;
      case 'announcements':
        return <AnnouncementsScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'rules':
        return <RulesScreen />;
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
  ];

  const getActiveIndex = () => {
    return navigationItems.findIndex(item => item.id === activeScreen);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-blue-500 overflow-hidden flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              <div className="flex flex-col justify-center">
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

        <main className="flex-1 overflow-auto max-w-md mx-auto w-full pb-24 no-scrollbar">
          {renderScreen()}
        </main>

        <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 z-50">
          <div className="relative bg-card h-[70px] rounded-t-xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex justify-center items-center px-2">
            
            <div 
              className="absolute top-[-50%] w-[60px] h-[60px] bg-blue-600 rounded-full border-[6px] border-background transition-all duration-500 ease-in-out flex items-center justify-center shadow-lg"
              style={{
                left: `calc(calc(100% / 5) * ${getActiveIndex()} + calc(100% / 10) - 30px)`
              }}
            >
               <div className="absolute top-[50%] left-[-22px] w-[20px] h-[20px] bg-transparent rounded-tr-[20px] shadow-[1px_-10px_0_0_hsl(var(--background))]"></div>
               <div className="absolute top-[50%] right-[-22px] w-[20px] h-[20px] bg-transparent rounded-tl-[20px] shadow-[-1px_-10px_0_0_hsl(var(--background))]"></div>
               
               {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return activeScreen === item.id ? (
                    <Icon key={index} className="w-6 h-6 text-white" />
                  ) : null;
               })}
            </div>

            <ul className="flex w-full p-0 m-0 relative">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                
                return (
                  <li 
                    key={item.id} 
                    className="relative list-none w-[20%] h-[70px] z-[1]"
                    onClick={() => setActiveScreen(item.id as Screen)}
                  >
                    <a className="relative flex justify-center items-center flex-col w-full h-full text-center font-medium cursor-pointer no-underline">
                      <span 
                        className={`relative block leading-[75px] text-[1.5em] text-center transition-all duration-500 ${
                          isActive 
                            ? 'translate-y-[-32px] opacity-0' 
                            : 'translate-y-0 text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </span>
                      <span 
                        className={`absolute text-foreground font-normal text-[0.75em] tracking-[0.05em] transition-all duration-500 ${
                          isActive 
                            ? 'opacity-100 translate-y-[10px]' 
                            : 'opacity-0 translate-y-[20px]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}