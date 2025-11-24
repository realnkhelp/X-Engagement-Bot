'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Copy, Filter, RefreshCw, X } from 'lucide-react';

interface Deposit {
  id: string;
  username: string;
  amount: number;
  method: string;
  transactionId: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminDepositHistory() {
  // --- Mock Data ---
  const [deposits, setDeposits] = useState<Deposit[]>([
    {
      id: '1',
      username: 'Bitget User',
      amount: 500,
      method: 'USDT BEP20',
      transactionId: '53686885',
      date: '11/16/2025',
      status: 'rejected',
    },
    {
      id: '2',
      username: 'Binance Trader',
      amount: 1200,
      method: 'USDT TRC20',
      transactionId: '519202493',
      date: '11/16/2025',
      status: 'pending',
    },
    {
      id: '3',
      username: 'CryptoKing',
      amount: 300,
      method: 'Metamask',
      transactionId: '0x22b55ccc53...',
      date: '11/16/2025',
      status: 'approved',
    },
  ]);

  // --- Filter States ---
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

  // --- Modal States ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // --- Handlers ---
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

  const handleApprove = (id: string) => {
    if (confirm('Are you sure you want to approve this deposit?')) {
      setDeposits(deposits.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)));
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedDepositId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedDepositId) {
      setDeposits(deposits.map((d) => (d.id === selectedDepositId ? { ...d, status: 'rejected' } : d)));
      console.log(`Rejected ID: ${selectedDepositId}, Reason: ${rejectReason}`);
      setIsRejectModalOpen(false);
      setSelectedDepositId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this record permanently?')) {
      setDeposits(deposits.filter((d) => d.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text); 
  };

  return (
    <div className="space-y-6 pb-20 p-4">
      <h1 className="text-2xl font-bold">Deposit History</h1>

      {/* Filters Section */}
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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

      {/* Table Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
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
            <tbody className="divide-y divide-border">
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-medium text-foreground">{deposit.username}</td>
                  <td className="px-4 py-3 font-bold text-green-600">${deposit.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{deposit.method}</td>
                  
                  {/* Transaction ID Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-mono text-xs bg-muted/50 w-fit px-2 py-1 rounded">
                       {deposit.transactionId}
                       <button onClick={() => copyToClipboard(deposit.transactionId)} className="text-muted-foreground hover:text-blue-500">
                         <Copy className="w-3 h-3" />
                       </button>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{deposit.date}</td>
                  
                  {/* Status Column */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${deposit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        deposit.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {deposit.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {deposit.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(deposit.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => openRejectModal(deposit.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(deposit.id)} className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDeposits.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No deposits found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Reject Deposit</h3>
              <button onClick={() => setIsRejectModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Please enter a reason for rejecting this deposit.</p>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-background mb-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              rows={3}
              placeholder="Reason for rejection..."
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