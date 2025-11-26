'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckSquare, Plus, Shield, Home, Moon, Sun } from 'lucide-react';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import HomeScreen from '@/components/screens/home-screen';
import TasksScreen from '@/components/screens/tasks-screen';
import CreateTaskScreen from '@/components/screens/create-task-screen';
import ReportScreen from '@/components/screens/report-screen';
import AnnouncementsScreen from '@/components/screens/announcements-screen';
import WalletScreen from '@/components/screens/wallet-screen';
import RulesScreen from '@/components/screens/rules-screen';
import BlockedScreen from '@/components/screens/blocked-screen';
import OnboardingScreen from '@/components/screens/onboarding-screen';

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'wallet' | 'rules';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appConfig, setAppConfig] = useState<any>({});
  
  const [user, setUser] = useState({
    id: '12345',
    name: 'Test User',
    avatar: '', 
    balance: 2500.00,
    currency: 'Points',
    isBlocked: false,
    isOnboarded: false
  });

  useEffect(() => {
    const configRef = doc(db, "settings", "appConfig");
    getDoc(configRef).then((snap) => {
        if (snap.exists()) {
            setAppConfig(snap.data());
        } else {
            setAppConfig({ onboardingReward: 5 });
        }
    });

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
          const userId = tgUser.id.toString();
          const fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
          
          setUser(prev => ({
            ...prev,
            id: userId,
            name: fullName || prev.name,
            avatar: tgUser.photo_url || '',
            isOnboarded: false
          }));
        }
      }
      setIsLoading(false);
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
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleOnboardingComplete = () => {
    setUser(prev => ({ ...prev, isOnboarded: true }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
      case 'tasks': return <TasksScreen />;
      case 'create': return <CreateTaskScreen user={user} />;
      case 'report': return <ReportScreen />;
      case 'announcements': return <AnnouncementsScreen />;
      case 'wallet': return <WalletScreen />;
      case 'rules': return <RulesScreen />;
      default: return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (user.isBlocked) {
    return <BlockedScreen user={user} />;
  }

  if (!user.isOnboarded) {
    return (
      <OnboardingScreen 
        user={user} 
        rewardAmount={5} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <style jsx global>{`
        :root {
          --nav-bg: hsl(var(--card));
          --body-bg: hsl(var(--background));
          --indicator-color: #f43f5e;
        }
        .navigation {
          position: fixed;
          bottom: 0;
          width: 100%;
          max-width: 28rem;
          height: 70px;
          background: var(--nav-bg);
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
          z-index: 50;
        }
        .navigation ul { display: flex; width: 100%; padding: 0; margin: 0; }
        .navigation ul li { position: relative; list-style: none; width: 100%; height: 70px; z-index: 1; }
        .navigation ul li button { position: relative; display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%; text-align: center; font-weight: 500; background: transparent; border: none; height: 100%; cursor: pointer; }
        .navigation ul li button .icon { position: relative; display: block; line-height: 75px; font-size: 1.5em; text-align: center; transition: 0.5s; color: hsl(var(--muted-foreground)); }
        .navigation ul li.active button .icon { transform: translateY(-35px); color: white; }
        .navigation ul li button .text { position: absolute; color: hsl(var(--foreground)); font-weight: 600; font-size: 0.75em; letter-spacing: 0.05em; transition: 0.5s; opacity: 0; transform: translateY(20px); }
        .navigation ul li.active button .text { opacity: 1; transform: translateY(10px); }
        .indicator { position: absolute; top: -50%; width: 65px; height: 65px; background: var(--indicator-color); border-radius: 50%; border: 6px solid var(--body-bg); transition: 0.5s; }
        .indicator::before { content: ''; position: absolute; top: 50%; left: -22px; width: 20px; height: 20px; background: transparent; border-top-right-radius: 20px; box-shadow: 1px -10px 0 0 var(--nav-bg); }
        .indicator::after { content: ''; position: absolute; top: 50%; right: -22px; width: 20px; height: 20px; background: transparent; border-top-left-radius: 20px; box-shadow: -1px -10px 0 0 var(--nav-bg); }
      `}</style>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-blue-500 overflow-hidden flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">Balance: {user.balance.toFixed(2)}</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto max-w-md mx-auto w-full pb-24 no-scrollbar">
          {renderScreen()}
        </main>

        <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center z-50 pointer-events-none">
          <div className="navigation pointer-events-auto">
            <ul>
              <div className="indicator" style={{ transform: `translateX(calc(56px * ${getActiveIndex()} + (56px / 2) - 50%))` }}></div>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <li key={item.id} className={isActive ? 'active' : ''} style={{ width: 'calc(100% / 5)' }}>
                    <button onClick={() => setActiveScreen(item.id as Screen)}>
                      <span className="icon"><Icon className="w-6 h-6" /></span>
                      <span className="text">{item.label}</span>
                    </button>
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