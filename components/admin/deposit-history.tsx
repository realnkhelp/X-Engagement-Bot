'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Copy, Filter, RefreshCw, X } from 'lucide-react';

interface Deposit {
  id: number;
  username: string;
  amount: number;
  method: string;
  transactionId: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  reason?: string;
}

export default function AdminDepositHistory() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    username: '',
    method: '',
    status: ''
  });

  const [tempFilters, setTempFilters] = useState({
    username: '',
    method: '',
    status: ''
  });

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDepositId, setSelectedDepositId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      if (data.success) {
        const formattedDeposits = data.deposits.map((d: any) => ({
          id: d.id,
          username: d.username || d.first_name || 'Unknown',
          amount: Number(d.amount),
          method: d.method,
          transactionId: d.txid,
          date: new Date(d.created_at).toLocaleDateString(),
          status: d.status,
          reason: d.reason
        }));
        setDeposits(formattedDeposits);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    setTempFilters({ username: '', method: '', status: '' });
    setFilters({ username: '', method: '', status: '' });
  };

  const filteredDeposits = deposits.filter((deposit) => {
    return (
      deposit.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      deposit.method.toLowerCase().includes(filters.method.toLowerCase()) &&
      (filters.status === '' || deposit.status === filters.status)
    );
  });

  const updateDepositStatus = async (id: number, status: string, reason: string | null = null) => {
    try {
      const res = await fetch('/api/admin/deposits/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: id,
          status,
          reason
        })
      });

      if (res.ok) {
        fetchDeposits(); 
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
    }
  };

  const handleApprove = (id: number) => {
    if (confirm('Are you sure you want to approve this deposit? User balance will be updated.')) {
      updateDepositStatus(id, 'Completed');
    }
  };

  const openRejectModal = (id: number) => {
    setSelectedDepositId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedDepositId) {
      updateDepositStatus(selectedDepositId, 'Rejected', rejectReason);
      setIsRejectModalOpen(false);
      setSelectedDepositId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text); 
  };

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading Deposits...</div>;
  }

  return (
    <div className="space-y-6 pb-20 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deposit History</h1>
        <button 
          onClick={fetchDeposits} 
          className="p-2 hover:bg-muted rounded-full transition"
        >
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <h2 className="font-semibold text-sm uppercase tracking-wide">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search Username..."
            value={tempFilters.username}
            onChange={(e) => setTempFilters({ ...tempFilters, username: e.target.value })}
            className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="text"
            placeholder="Payment Method..."
            value={tempFilters.method}
            onChange={(e) => setTempFilters({ ...tempFilters, method: e.target.value })}
            className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={tempFilters.status}
            onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
            className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex gap-2 justify-end border-t border-border pt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase whitespace-nowrap">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border whitespace-nowrap">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    No deposits found.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3 font-medium text-blue-500">{deposit.username}</td>
                    <td className="px-4 py-3 font-bold text-green-600">${deposit.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{deposit.method}</td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-mono text-xs bg-muted/50 w-fit px-2 py-1 rounded">
                         <span className="truncate max-w-[100px]">{deposit.transactionId}</span>
                         <button onClick={() => copyToClipboard(deposit.transactionId)} className="text-muted-foreground hover:text-blue-500">
                           <Copy className="w-3 h-3" />
                         </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">{deposit.date}</td>
                    
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize w-fit
                          ${deposit.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            deposit.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'}`}>
                          {deposit.status}
                        </span>
                        {deposit.status === 'Rejected' && deposit.reason && (
                          <span className="text-[10px] text-red-500 max-w-[150px] truncate">
                            {deposit.reason}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {deposit.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(deposit.id)} 
                              className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition text-xs font-semibold"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button 
                              onClick={() => openRejectModal(deposit.id)} 
                              className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                        {deposit.status !== 'Pending' && (
                          <span className="text-xs text-muted-foreground italic px-3">Processed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Reject Deposit</h3>
              <button onClick={() => setIsRejectModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Please enter a reason for rejecting this deposit.</p>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-background mb-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              rows={3}
              placeholder="Reason for rejection (e.g. Invalid Transaction ID)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted">Cancel</button>
              <button onClick={handleConfirmReject} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}