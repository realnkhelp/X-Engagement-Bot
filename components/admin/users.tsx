'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, Lock, Unlock, Save } from 'lucide-react';

interface User {
  id: string;
  username: string;
  avatar: string; // URL for user image
  balance: number;
  joinDate: string;
  status: 'active' | 'blocked';
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Example Data - In real app, this comes from database
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
      avatar: '', // No image case
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

  // Handle Search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.includes(searchTerm)
  );

  // Toggle Block/Unblock
  const toggleBlockUser = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  // Handle Balance Change (Inline)
  const handleBalanceChange = (id: string, newAmount: string) => {
    const amount = parseFloat(newAmount);
    if (!isNaN(amount)) {
      setUsers(users.map(u => u.id === id ? { ...u, balance: amount } : u));
    }
  };

  // Helper for Initials (if no image)
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users List</h1>
          <p className="text-sm text-muted-foreground">Manage telegram users & balances</p>
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

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Balance (USDT)</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition">
                  
                  {/* ID */}
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {user.id}
                  </td>

                  {/* USER (Image + Name) */}
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
                      {user.status === 'blocked' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-600 font-bold">BLOCKED</span>
                      )}
                    </div>
                  </td>

                  {/* BALANCE (Editable) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        step="0.01"
                        value={user.balance}
                        onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-border bg-background text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </td>

                  {/* JOIN DATE */}
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {user.joinDate}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Block/Unblock */}
                      <button 
                        onClick={() => toggleBlockUser(user.id)}
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                        className={`p-1.5 rounded-lg transition ${
                          user.status === 'active' 
                            ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' 
                            : 'text-red-500 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>

                      {/* Edit Balance (Dummy Save for visual) */}
                      <button 
                        title="Update Balance"
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                       {/* Delete */}
                       <button 
                        title="Delete User"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
             <div className="p-8 text-center text-muted-foreground text-sm">
               No users found matching "{searchTerm}"
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
