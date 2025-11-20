'use client';

import { useState } from 'react';
import { Settings, Users, Briefcase, DollarSign, BarChart3, LogOut } from 'lucide-react';
import AdminDashboard from '@/components/admin/dashboard';
import AdminUsers from '@/components/admin/users';
import AdminTasks from '@/components/admin/tasks';
import AdminPayments from '@/components/admin/payments';
import AdminSettings from '@/components/admin/settings';

type AdminTab = 'dashboard' | 'users' | 'tasks' | 'payments' | 'settings';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isDark, setIsDark] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'tasks':
        return <AdminTasks />;
      case 'payments':
        return <AdminPayments />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: Briefcase },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-blue-500">Admin Panel</h1>
          </div>

          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 transition text-sm font-medium"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition text-sm font-medium flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
