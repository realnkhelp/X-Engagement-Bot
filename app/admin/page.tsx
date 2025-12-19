'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import AdminDashboard from '@/components/admin/dashboard';
import AdminSettings from '@/components/admin/settings';
import AdminUsers from '@/components/admin/users';
import AdminTasks from '@/components/admin/tasks';
import AdminDepositHistory from '@/components/admin/deposit-history';

// ✅ Naye Imports (Aapki file names ke hisab se corrected)
import AdminPayments from '@/components/admin/payments';
import AdminRules from '@/components/admin/rules';
import AdminAnnouncements from '@/components/admin/announcement'; // <-- Yahan 's' hata diya hai
import AdminReports from '@/components/admin/reports';
import AdminManageAdmins from '@/components/admin/manage-admins';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
         setIsAuthenticated(true);
      } else {
         alert(data.error || 'Invalid Username or Password');
      }
    } catch (error) {
      alert('Login Failed: Server Error');
    } finally {
      setLoading(false);
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
        return <AdminAnnouncements />;
      
      case 'reports':
      case 'report-history':
        return <AdminReports />;
      
      case 'admins':
      case 'manage-admins':
        return <AdminManageAdmins />;
        
      case 'settings':
        return <AdminSettings />;
      
      default:
        return <div className="p-10 text-center">Module Coming Soon ({activeTab})</div>;
    }
  };

  const user = {
    firstName: 'Admin',
    username: 'super_admin',
    avatar: '' 
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Password"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 overflow-hidden">
      <div className="hidden md:flex flex-shrink-0 h-full w-64 border-r border-gray-200 bg-white">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="relative w-64 h-full bg-white shadow-xl flex flex-col">
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
          <div className="flex-1 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 relative w-full">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-gray-900">Admin Panel</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
