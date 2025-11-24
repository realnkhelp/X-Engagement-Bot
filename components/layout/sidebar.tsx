'use client';

import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Wallet, 
  Settings, 
  LogOut, 
  X, 
  ScrollText, 
  Megaphone, 
  ShieldCheck, 
  Flag, 
  History 
} from 'lucide-react';

interface SidebarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
}

export default function Sidebar({ user, activeTab, setActiveTab, onClose }: SidebarProps) {
  
  const menuItems = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Users', id: 'users', icon: Users },
    { name: 'Tasks', id: 'tasks', icon: CheckSquare },
    { name: 'Deposit History', id: 'deposit-history', icon: History },
    { name: 'Payments', id: 'payments', icon: Wallet },
    { name: 'Rules', id: 'rules', icon: ScrollText },
    { name: 'Announcements', id: 'announcements', icon: Megaphone },
    { name: 'Report History', id: 'reports', icon: Flag },
    { name: 'Manage Admins', id: 'manage-admins', icon: ShieldCheck },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  return (
    <div className="w-full h-full bg-card shadow-lg flex flex-col border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-bold text-xl text-blue-600">Admin Panel</h2>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.name || 'Admin User'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-medium text-sm">
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );
}
