'use client';

import { useState } from 'react';
import { Search, Edit, Lock, Unlock, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  balance: number;
  joinDate: string;
  status: 'active' | 'blocked';
  xProfileLink: string;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editXLink, setEditXLink] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '6771879298',
      name: 'Md Sawon',
      handle: 'mdsawon_01',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
      balance: 0.05,
      joinDate: '11/23/2025',
      status: 'active',
      xProfileLink: 'https://x.com/mdsawon'
    },
    {
      id: '8220282293',
      name: 'Kiron Kumar',
      handle: 'kiron_k',
      avatar: '',
      balance: 0.00,
      joinDate: '11/23/2025',
      status: 'active',
      xProfileLink: 'https://x.com/kironkumar'
    },
    {
      id: '6642048233',
      name: 'Shah Muhidul',
      handle: 'muhidul99',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop',
      balance: 0.19,
      joinDate: '11/22/2025',
      status: 'blocked',
      xProfileLink: 'https://x.com/shahmuhidul'
    },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    setEditXLink(user.xProfileLink);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (currentUser) {
      const newBalance = parseFloat(editBalance);
      if (!isNaN(newBalance)) {
        setUsers(users.map(u => u.id === currentUser.id ? { 
          ...u, 
          balance: newBalance,
          xProfileLink: editXLink 
        } : u));
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
            placeholder="Search by ID, Name or Username..."
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
                <th className="px-4 py-3 whitespace-nowrap">ID</th>
                <th className="px-4 py-3 whitespace-nowrap">USER</th>
                <th className="px-4 py-3 whitespace-nowrap">BALANCE</th>
                <th className="px-4 py-3 whitespace-nowrap">JOIN DATE</th>
                <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {user.id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate max-w-[120px]" title={user.name}>
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={`@${user.handle}`}>
                          @{user.handle}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {user.balance.toFixed(4)}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {user.joinDate}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-medium"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>

                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition text-xs font-medium ${
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-xl border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Edit User</h3>
                <p className="text-xs text-muted-foreground">Update details for @{currentUser.handle}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">User Balance</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full pl-3 pr-12 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">USDT</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">X Profile Link</label>
                <input
                  type="text"
                  value={editXLink}
                  onChange={(e) => setEditXLink(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://x.com/username"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
