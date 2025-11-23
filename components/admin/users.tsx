'use client';

import { useState } from 'react';
import { Search, Edit, Lock, Unlock, X } from 'lucide-react';

interface User {
  id: string;
  username: string;
  avatar: string;
  balance: number;
  joinDate: string;
  status: 'active' | 'blocked';
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editBalance, setEditBalance] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '6771879298',
      username: 'Md Sawon',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
      balance: 0.05,
      joinDate: '11/23/2025',
      status: 'active',
    },
    {
      id: '8220282293',
      username: 'Kiron Kumar',
      avatar: '',
      balance: 0.00,
      joinDate: '11/23/2025',
      status: 'active',
    },
    {
      id: '6642048233',
      username: 'shahmuhidul',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop',
      balance: 0.19,
      joinDate: '11/22/2025',
      status: 'blocked',
    },
  ]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.includes(searchTerm)
  );

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setEditBalance(user.balance.toString());
    setIsEditModalOpen(true);
  };

  const handleUpdateBalance = () => {
    if (currentUser) {
      const newBalance = parseFloat(editBalance);
      if (!isNaN(newBalance)) {
        setUsers(users.map(u => u.id === currentUser.id ? { ...u, balance: newBalance } : u));
        setIsEditModalOpen(false);
        setCurrentUser(null);
      }
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users List</h1>
          <p className="text-sm text-muted-foreground">Manage users & balances</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID or Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">USER</th>
                <th className="px-4 py-3">BALANCE</th>
                <th className="px-4 py-3">JOIN DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {user.id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.username)
                        )}
                      </div>
                      <span className="font-semibold text-foreground">{user.username}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {user.balance.toFixed(4)} USDT
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {user.joinDate}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-medium"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>

                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <Lock className="w-3 h-3" />
                            Block
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
             <div className="p-8 text-center text-muted-foreground text-sm">
               No users found.
             </div>
          )}
        </div>
      </div>

      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-sm rounded-lg shadow-lg border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">User Name</p>
                <p className="font-semibold text-base">{currentUser.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Balance (USDT)</label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateBalance}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}