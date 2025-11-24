'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <div className="hidden md:flex h-screen sticky top-0">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false);
            }} 
            onClose={() => setIsSidebarOpen(false)}
          />
          <div className="flex-1 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 h-screen overflow-auto bg-muted/10 w-full relative">
        <div className="md:hidden p-4 border-b border-border bg-card flex items-center justify-between sticky top-0 z-20">
          <h1 className="font-bold text-xl text-blue-600">Admin Panel</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-muted focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        <div className="p-4 md:p-8 pb-24">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
