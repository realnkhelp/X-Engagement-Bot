'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
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
        return <AdminDashboard />;
    }
  };

  const user = {
    name: 'Nitesh Admin',
    email: 'admin@spck.com',
    avatar: '' 
  };

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
