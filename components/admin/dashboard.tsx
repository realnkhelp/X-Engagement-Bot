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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
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
      value: '1,234',
      icon: Users,
      color: 'bg-blue-500',
      targetTab: 'users'
    },
    {
      title: 'Active Tasks',
      value: '456',
      icon: Briefcase,
      color: 'bg-green-500',
      targetTab: 'tasks'
    },
    {
      title: 'Total Reports',
      value: '23',
      icon: FileText,
      color: 'bg-red-500',
      targetTab: 'reports'
    },
    {
      title: 'Pending Deposits',
      value: '15',
      icon: Clock,
      color: 'bg-orange-500',
      targetTab: 'deposit-history'
    },
    {
      title: 'Total Revenue',
      value: '$12,450',
      icon: DollarSign,
      color: 'bg-purple-500',
      targetTab: 'payments'
    },
    {
      title: 'Payment Methods',
      value: '4',
      icon: CreditCard,
      color: 'bg-indigo-500',
      targetTab: 'payments'
    },
    {
      title: 'Total Admins',
      value: '3',
      icon: Shield,
      color: 'bg-gray-600',
      targetTab: 'manage-admins'
    },
    {
      title: 'Active Users',
      value: '892',
      icon: Users,
      color: 'bg-teal-500',
      targetTab: 'users'
    },
  ];

  const todayRecords = [
    { type: 'Joined User', count: 12 },
    { type: 'Deposit Request', count: 8 },
    { type: 'Task Created', count: 23 },
    { type: 'Report', count: 3 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to the admin panel</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition border border-border"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate?.(stat.targetTab)}
              className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Today's Records</h2>
        <div className="space-y-3">
          {todayRecords.map((record, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="font-semibold text-sm">{record.type}</p>
              </div>
              <span className="text-lg font-bold">{record.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
