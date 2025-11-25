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

type Screen = 'home' | 'tasks' | 'create' | 'report' | 'announcements' | 'wallet' | 'rules';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);

  const [user, setUser] = useState({
    id: 'guest',
    name: 'Guest',
    avatar: '',
    balance: 2500.0,
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
      } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
        try {
          tg.ready();
          tg.expand();
        } catch (e) {}
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
          const fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
          const finalName = fullName || tgUser.username || `User`;
          setUser(prev => ({
            ...prev,
            id: tgUser.id?.toString?.() || prev.id,
            name: finalName,
            avatar: tgUser.photo_url || prev.avatar
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
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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
      case 'rules':
        return <RulesScreen />;
      default:
        return <HomeScreen user={user} isDark={isDark} onNavigate={setActiveScreen} />;
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Report', icon: CheckSquare },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'report', label: 'Rules', icon: Shield },
    { id: 'announcements', label: 'Updates', icon: Bell }
  ];

  const getActiveIndex = () => {
    return navigationItems.findIndex(item => item.id === activeScreen);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900");
        :root {
          --clr: #222327;
        }
        .dark :root, .dark {
          --clr: 12 12% 92%;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Poppins", sans-serif; }
        :root { --nav-width: 400px; --item-width: 70px; --nav-height: 70px; --indicator-color: tomato; --nav-bg: #fff; --body-bg: #f3f4f6; --muted: #6b6b6b; }
        .dark { --nav-bg: #111215; --body-bg: #0e0f10; --muted: #9aa0a6; --indicator-color: #f15946; }
        html, body, #__next { height: 100%; }
        body { background: var(--body-bg); display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .min-h-screen { min-height: 100vh; }
        header.sticky { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid rgba(0,0,0,0.06); background: var(--nav-bg); }
        main { flex: 1; overflow: auto; max-width: 28rem; width: 100%; padding-bottom: 120px; margin: 0 auto; }
        .nav-wrapper { position: fixed; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; z-index: 60; pointer-events: none; }
        .navigation { position: relative; width: var(--nav-width); max-width: 92%; height: var(--nav-height); background: var(--nav-bg); display: flex; justify-content: center; align-items: center; border-radius: 12px; box-shadow: 0 -6px 20px rgba(0,0,0,0.08); pointer-events: auto; }
        .navigation ul { display: flex; width: calc(var(--item-width) * 5); padding: 0; margin: 0; list-style: none; align-items: center; justify-content: space-between; }
        .navigation ul li { position: relative; list-style: none; width: var(--item-width); height: var(--nav-height); z-index: 1; }
        .navigation ul li a { position: relative; display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%; text-align: center; font-weight: 500; background: transparent; border: none; cursor: pointer; }
        .navigation ul li a .icon { position: relative; display: block; line-height: 75px; font-size: 1.25em; text-align: center; transition: transform 0.45s; color: var(--muted); }
        .navigation ul li.active a .icon { transform: translateY(-28px); color: white; }
        .navigation ul li a .text { position: absolute; bottom: 8px; color: var(--muted); font-weight: 400; font-size: 0.75em; letter-spacing: 0.03em; transition: 0.4s; opacity: 0; transform: translateY(12px); }
        .navigation ul li.active a .text { opacity: 1; transform: translateY(0); color: var(--muted); }
        .indicator { position: absolute; top: -50%; width: var(--item-width); height: var(--item-width); background: var(--indicator-color); border-radius: 50%; border: 6px solid var(--nav-bg); transition: transform 0.45s cubic-bezier(.2,.9,.2,1); box-shadow: 0 6px 18px rgba(0,0,0,0.18); z-index: 2; }
        .indicator::before { content: ""; position: absolute; top: 50%; left: -22px; width: 20px; height: 20px; background: transparent; border-top-right-radius: 20px; box-shadow: 1px -10px 0 0 var(--nav-bg); }
        .indicator::after { content: ""; position: absolute; top: 50%; right: -22px; width: 20px; height: 20px; background: transparent; border-top-left-radius: 20px; box-shadow: -1px -10px 0 0 var(--nav-bg); }
        @media (max-width: 420px) { :root { --nav-width: 340px; --item-width: 64px; } .navigation { height: 66px; } .indicator { width: 64px; height: 64px; top: -46%; } .navigation ul li a .icon { font-size: 1.1em; } }
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

        <main className="flex-1 overflow-auto max-w-md mx-auto w-full pb-36">
          {renderScreen()}
        </main>

        <div className="nav-wrapper">
          <nav className="navigation" role="navigation" aria-label="bottom navigation">
            <ul>
              {navigationItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <li key={item.id} className={isActive ? 'active' : ''}>
                    <a onClick={() => setActiveScreen(item.id as Screen)} aria-current={isActive ? 'page' : undefined}>
                      <span className="icon"><Icon className="w-5 h-5" /></span>
                      <span className="text">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="indicator" style={{ transform: `translateX(${getActiveIndex() * (document.documentElement.clientWidth <= 420 ? 64 : 70)}px)` }} />
          </nav>
        </div>
      </div>
    </div>
  );
}