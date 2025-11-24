'use client';

import { useState } from 'react';
import { Menu, Lock, User } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import AdminDashboard from '@/components/admin/dashboard';
import AdminUsers from '@/components/admin/users';
import AdminTasks from '@/components/admin/tasks';
import AdminPayments from '@/components/admin/payments';
import AdminSettings from '@/components/admin/settings';
import AdminDepositHistory from '@/components/admin/deposit-history';
import AdminRules from '@/components/admin/rules';
import AdminAnnouncement from '@/components/admin/announcement';
import AdminManageAdmins from '@/components/admin/manage-admins';
import AdminReports from '@/components/admin/reports';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Username or Password');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'users':
        return <AdminUsers />;
      case 'tasks':
        return <AdminTasks />;
      case 'deposit-history':
        return <AdminDepositHistory />;
      case 'payments':
        return <AdminPayments />;
      case 'rules':
        return <AdminRules />;
      case 'announcements':
        return <AdminAnnouncement />;
      case 'reports':
        return <AdminReports />;
      case 'manage-admins':
        return <AdminManageAdmins />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  const user = {
    name: 'Nitesh Admin',
    email: 'admin@spck.com',
    avatar: '' 
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-200 via-pink-200 to-red-300 p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-2">Signin to Your Account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg active:scale-95"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="hidden md:flex flex-shrink-0 h-full w-64 border-r border-border bg-card">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="relative w-64 h-full bg-card shadow-2xl flex flex-col">
            <Sidebar 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }} 
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/10 relative w-full">
        <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border shadow-sm flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 active:scale-95 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-foreground">Admin Panel</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
