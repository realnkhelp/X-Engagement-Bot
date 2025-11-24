'use client';

import { useState } from 'react';
import { Shield, UserPlus, Trash2, Pencil, Activity, Lock, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

type Role = 'Super Admin' | 'Moderator';
type Status = 'Active' | 'Blocked';

interface Admin {
  id: string;
  name: string;
  username: string;
  role: Role;
  status: Status;
  lastLogin: string;
}

interface ActivityLog {
  id: string;
  adminName: string;
  date: string;
  action: string;
  targetUser: string;
  details: string;
}

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<'admins' | 'logs'>('admins');

  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      name: 'Nitesh Kumar',
      username: 'nitesh_dev',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: 'Today, 10:30 AM',
    },
    {
      id: '2',
      name: 'Rahul Singh',
      username: 'rahul_mod',
      role: 'Moderator',
      status: 'Active',
      lastLogin: 'Yesterday, 5:00 PM',
    },
  ]);

  const [logs] = useState<ActivityLog[]>([
    {
      id: '101',
      adminName: 'Nitesh (Super Admin)',
      date: '23 Nov 2025, 10:30 AM',
      action: 'Updated Balance',
      targetUser: '@Rahul123',
      details: 'Added 50 USDT',
    },
    {
      id: '102',
      adminName: 'Rahul (Moderator)',
      date: '23 Nov 2025, 09:15 AM',
      action: 'Blocked User',
      targetUser: '@Spammer007',
      details: 'Violation of rules',
    },
    {
      id: '103',
      adminName: 'Nitesh (Super Admin)',
      date: '22 Nov 2025, 08:45 PM',
      action: 'Approved Deposit',
      targetUser: '@CryptoKing',
      details: 'TxID: 0x55d... (500 USDT)',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Moderator' as Role,
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) return;

    const newAdmin: Admin = {
      id: Date.now().toString(),
      name: formData.name,
      username: formData.username,
      role: formData.role,
      status: 'Active',
      lastLogin: 'Never',
    };

    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', username: '', password: '', role: 'Moderator' });
    alert('New admin created successfully!');
  };

  const handleDeleteAdmin = (id: string) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setAdmins(admins.map(a => 
      a.id === id ? { ...a, status: a.status === 'Active' ? 'Blocked' : 'Active' } : a
    ));
  };

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
              <h3 className="font-semibold">All Admins</h3>
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
                        <button onClick={() => toggleStatus(admin.id)} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                          admin.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {admin.status === 'Active' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                          {admin.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{admin.lastLogin}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-semibold">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
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
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">Last 30 Days</span>
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
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {log.adminName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {log.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{log.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {log.targetUser}
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