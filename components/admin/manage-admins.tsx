'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Pencil, Activity, Lock, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

type Role = 'Super Admin' | 'Moderator';
type Status = 'Active' | 'Blocked';

interface Admin {
  id: number;
  name: string;
  username: string;
  role: Role;
  status: Status;
  lastLogin: string;
}

interface Log {
  id: number;
  adminName: string;
  role: string;
  action: string;
  target: string;
  details: string;
  createdAt: string;
}

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<'admins' | 'logs'>('admins');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Moderator' as Role,
  });

  useEffect(() => {
    fetchAdmins();
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.success) {
        const formattedLogs = data.logs.map((log: any) => ({
          id: log.id,
          adminName: log.admin?.username || 'System',
          role: log.admin?.role || 'System',
          action: log.action,
          target: log.target,
          details: log.details,
          createdAt: new Date(log.createdAt).toLocaleString()
        }));
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) return;

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('New admin created successfully!');
        setFormData({ name: '', username: '', password: '', role: 'Moderator' });
        fetchAdmins();
      } else {
        alert('Failed to create admin');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      try {
        await fetch('/api/admin/admins', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        fetchAdmins();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const toggleStatus = async (admin: Admin) => {
    const newStatus = admin.status === 'Active' ? 'Blocked' : 'Active';
    try {
      await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: admin.id, status: newStatus })
      });
      fetchAdmins();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading && activeTab === 'admins') return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Admin Management
        </h1>
        
        <div className="bg-muted p-1 rounded-lg flex text-sm font-medium">
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-md transition ${activeTab === 'admins' ? 'bg-white shadow text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Manage Admins
            </div>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-md transition ${activeTab === 'logs' ? 'bg-white shadow text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
          >
             <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Activity Logs
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'admins' && (
        <div className="space-y-8">
          
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              Create New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="Ex: John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Username</label>
                <input
                  type="text"
                  placeholder="Ex: johnd_admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 pl-9 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm">
                  Create Admin
                </button>
              </div>
            </form>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold">All Admins ({admins.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name / Username</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Login</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border whitespace-nowrap">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{admin.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-xs text-muted-foreground">@{admin.username}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(admin)} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                          admin.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {admin.status === 'Active' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                          {admin.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDeleteAdmin(admin.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 className="font-semibold">Recent Activities</h3>
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">Live Data</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target User</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border whitespace-nowrap">
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-6 text-muted-foreground">No logs found</td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-600">{log.adminName}</div>
                      <div className="text-xs text-muted-foreground">{log.role}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {log.createdAt}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{log.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {log.target}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground italic">
                      "{log.details}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
