import { useState } from 'react';
import { Trash2, Lock, Unlock, Edit2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: 'active' | 'blocked';
  joinDate: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '001',
      name: 'John Doe',
      email: 'john@example.com',
      balance: 1500,
      status: 'active',
      joinDate: '2025-01-10',
    },
    {
      id: '002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      balance: 2300,
      status: 'active',
      joinDate: '2025-01-12',
    },
  ]);

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    balance: 0,
  });

  const toggleBlockUser = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  const updateBalance = (id: string, newBalance: number) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, balance: newBalance } : u
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and balances</p>
      </div>

      {/* Add User Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newUserForm.name}
            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUserForm.email}
            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Initial Balance"
            value={newUserForm.balance}
            onChange={(e) => setNewUserForm({ ...newUserForm, balance: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="md:col-span-3 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
            Add User
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Balance</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-mono text-xs">{user.id}</td>
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={user.balance}
                      onChange={(e) => updateBalance(user.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => toggleBlockUser(user.id)}
                      className="p-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 transition"
                    >
                      {user.status === 'active' ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
