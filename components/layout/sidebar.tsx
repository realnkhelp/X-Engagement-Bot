import { X, LogOut, Settings, User } from 'lucide-react';

interface SidebarProps {
  user: any;
  isDark: boolean;
  onClose: () => void;
}

export default function Sidebar({ user, isDark, onClose }: SidebarProps) {
  return (
    <div className="w-64 bg-card shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-bold text-lg">Menu</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>

        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
