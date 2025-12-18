'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Lock, Unlock, X, Save, Wallet, Coins } from 'lucide-react';

interface User {
  id: number;
  telegramId: string;
  firstName: string;
  username: string;
  avatar: string;
  balance: number;
  points: number;
  twitterLink: string;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [editForm, setEditForm] = useState({
    balance: '',
    points: '',
    twitterLink: '',
    isBlocked: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setEditForm({
      balance: user.balance.toString(),
      points: user.points ? user.points.toString() : '0',
      twitterLink: user.twitterLink || '',
      isBlocked: user.isBlocked
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: currentUser.telegramId,
          balance: parseFloat(editForm.balance),
          points: parseFloat(editForm.points),
          twitterLink: editForm.twitterLink,
          isBlocked: editForm.isBlocked
        })
      });

      if (res.ok) {
        alert('User Updated Successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      alert('Error updating user');
    }
  };

  const toggleUserStatus = async (user: User) => {
    if (confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`)) {
      try {
        const res = await fetch('/api/admin/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: user.telegramId,
            balance: user.balance,
            points: user.points,
            twitterLink: user.twitterLink,
            isBlocked: !user.isBlocked
          })
        });
        if (res.ok) fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    String(user.telegramId).includes(searchTerm)
  );

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Users...</div>;

  return (
    <div className="space-y-6 relative pb-20 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users List ({users.length})</h1>
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
                <th className="px-4 py-3 whitespace-nowrap">BALANCE (USDT)</th>
                <th className="px-4 py-3 whitespace-nowrap">POINTS</th>
                <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {user.telegramId.toString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                        <img 
                          src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                          alt="user" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate max-w-[120px]">
                          {user.firstName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          @{user.username || 'no_username'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-green-600 whitespace-nowrap">
                    ${Number(user.balance).toFixed(4)}
                  </td>

                  <td className="px-4 py-3 font-medium text-orange-500 whitespace-nowrap">
                    {Number(user.points).toFixed(0)} P
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      !user.isBlocked 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {!user.isBlocked ? 'Active' : 'Blocked'}
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
                        onClick={() => toggleUserStatus(user)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition text-xs font-medium ${
                          !user.isBlocked
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {!user.isBlocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {!user.isBlocked ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-xl border border-border animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-base">Edit User</h3>
                  <p className="text-xs text-muted-foreground">ID: {currentUser.telegramId.toString()}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wallet Balances</label>
                
                <div className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">USDT Balance</p>
                    <input
                      type="number"
                      value={editForm.balance}
                      onChange={(e) => setEditForm({...editForm, balance: e.target.value})}
                      className="w-full bg-transparent font-bold text-lg outline-none text-foreground"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/50">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Points Balance</p>
                    <input
                      type="number"
                      value={editForm.points}
                      onChange={(e) => setEditForm({...editForm, points: e.target.value})}
                      className="w-full bg-transparent font-bold text-lg outline-none text-foreground"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile Settings</label>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">X (Twitter) Profile Link</p>
                  <input
                    type="text"
                    value={editForm.twitterLink}
                    onChange={(e) => setEditForm({...editForm, twitterLink: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://x.com/username"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <span className="text-sm font-medium">Account Status</span>
                <button
                  onClick={() => setEditForm({...editForm, isBlocked: !editForm.isBlocked})}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                    editForm.isBlocked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {editForm.isBlocked ? 'Blocked' : 'Active'}
                </button>
              </div>

            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/10">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
