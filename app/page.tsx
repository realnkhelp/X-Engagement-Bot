'use client';

import { useState, useEffect } from 'react';
import { Wallet, Bell, CheckSquare, Plus, Shield, Home, Moon, Sun } from 'lucide-react';
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
  
  // 1. DUMMY USER DATA (Database ki jagah ye use hoga)
  const [user, setUser] = useState({
    id: 'demo-user-123',
    name: 'Demo User',
    avatar: '', // Khali hai to Initials dikhenge
    balance: 2500.00,
    currency: 'Points',
    isBlocked: false,
    isOnboarded: false, // Ise niche function se true karenge
    xProfileLink: ''
  });

  // Config bhi local bana diya
  const appConfig = { onboardingReward: 500 };

  useEffect(() => {
    // 2. Theme Logic (Local Storage se)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
        // Agar Telegram dark mode me hai to auto dark
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.colorScheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }

    // 3. Fake Loading (Taaki app real lage)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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

  // 4. Onboarding Complete Logic (Local State Update)
  const handleOnboardingComplete = (profileLink: string) => {
    console.log("Saving Link locally:", profileLink);
    
    // User ko update kar rahe hain (Bina Database ke)
    setUser(prev => ({ 
        ...prev, 
        isOnboarded: true,
        xProfileLink: profileLink,
        balance: prev.balance + appConfig.onboardingReward
    }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
      case 'tasks':
        return <TasksScreen user={user} />;
      case 'create':
        return <CreateTaskScreen user={user} />;
      case 'report':
        return <ReportScreen />;
      case 'announcements':
        return <AnnouncementsScreen />;
      case 'wallet':
        return <WalletScreen user={user} />;
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
        rewardAmount={appConfig.onboardingReward} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

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

        <main className="flex-1 overflow-auto max-w-md mx-auto w-full pb-20">
          {renderScreen()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card z-40 max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id as Screen)}
                  className={`flex items-center p-3 rounded-full transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-medium ${
                      isActive ? 'max-w-[150px] ml-2 opacity-100' : 'max-w-0 opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}