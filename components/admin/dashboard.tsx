'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Briefcase, DollarSign, FileText, 
  CreditCard, Shield, Clock, Sun, Moon 
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function AdminDashboard({ onNavigate }: DashboardProps) {
  const [isDark, setIsDark] = useState(false);
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    pendingDeposits: 0,
    activeTasks: 0,
    totalUserBalance: 0
  });

  useEffect(() => {
    // Theme Check
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Fetch Stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setDbStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
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

  const stats = [
    {
      title: 'Total Users',
      value: dbStats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      targetTab: 'users'
    },
    {
      title: 'Active Tasks',
      value: dbStats.activeTasks.toLocaleString(),
      icon: Briefcase,
      color: 'bg-green-500',
      targetTab: 'tasks'
    },
    {
      title: 'Total Reports',
      value: 'View',
      icon: FileText,
      color: 'bg-red-500',
      targetTab: 'reports'
    },
    {
      title: 'Pending Deposits',
      value: dbStats.pendingDeposits.toLocaleString(),
      icon: Clock,
      color: dbStats.pendingDeposits > 0 ? 'bg-orange-500 animate-pulse' : 'bg-orange-500',
      targetTab: 'deposit-history'
    },
    {
      title: 'Users Liability',
      value: `$${Number(dbStats.totalUserBalance).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      targetTab: 'users'
    },
    {
      title: 'Payment Methods',
      value: '2',
      icon: CreditCard,
      color: 'bg-indigo-500',
      targetTab: 'payments'
    },
    {
      title: 'Total Admins',
      value: '1',
      icon: Shield,
      color: 'bg-gray-600',
      targetTab: 'manage-admins'
    },
    {
      title: 'Active Users',
      value: dbStats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-teal-500',
      targetTab: 'users'
    },
  ];

  const todayRecords = [
    { type: 'Pending Deposits', count: dbStats.pendingDeposits },
    { type: 'Active Tasks', count: dbStats.activeTasks },
    { type: 'Total Users', count: dbStats.totalUsers },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to the admin panel</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition border border-border"
        >
          {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate?.(stat.targetTab)}
              className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-foreground">Live Overview</h2>
        <div className="space-y-3">
          {todayRecords.map((record, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition bg-background"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                <p className="font-semibold text-sm text-foreground">{record.type}</p>
              </div>
              <span className="text-lg font-bold text-foreground">{record.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
