'use client';

import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, Ban, ExternalLink, X, AlertTriangle, RefreshCw } from 'lucide-react';

interface Report {
  id: number;
  reporterName: string;
  reporterUsername: string;
  reporterAvatar: string;
  type: string;
  message: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  date: string;
  reason?: string;
  reportedUser: {
    name: string;
    username: string;
    avatar: string;
    taskLink: string;
    profileLink: string;
    isBlocked: boolean;
    telegramId: string;
  };
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.success) {
        const formattedReports = data.reports.map((r: any) => ({
          id: r.id,
          reporterName: r.reporter?.firstName || 'Unknown',
          reporterUsername: r.reporter?.username || 'No Username',
          reporterAvatar: r.reporter?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          type: r.subject || 'Report',
          message: r.message,
          status: r.status,
          date: new Date(r.createdAt).toLocaleDateString(),
          reason: r.reason,
          reportedUser: {
            name: r.targetUser?.firstName || r.cheaterUsername || 'Target User',
            username: r.cheaterUsername,
            avatar: r.targetUser?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
            taskLink: r.taskLink,
            profileLink: r.cheaterProfileLink,
            isBlocked: r.targetUser?.isBlocked || false,
            telegramId: r.targetUser?.telegramId
          }
        }));
        setReports(formattedReports);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setShowRejectInput(false);
    setRejectReason('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const updateStatus = async (id: number, newStatus: 'Resolved' | 'Rejected', reason?: string) => {
    try {
      const res = await fetch('/api/admin/reports/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: id, status: newStatus, reason })
      });

      if (res.ok) {
        setReports(reports.map(r => r.id === id ? { ...r, status: newStatus, reason: reason } : r));
        if (newStatus === 'Resolved' || newStatus === 'Rejected') handleCloseModal();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const confirmReject = () => {
    if (selectedReport && rejectReason) {
      updateStatus(selectedReport.id, 'Rejected', rejectReason);
    }
  };

  const toggleBlockUser = async () => {
    if (selectedReport && selectedReport.reportedUser.telegramId) {
      const newBlockStatus = !selectedReport.reportedUser.isBlocked;
      
      try {
        const res = await fetch('/api/admin/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            telegramId: selectedReport.reportedUser.telegramId, 
            isBlocked: newBlockStatus,
            // Pass existing values to prevent overwriting with null if API requires all fields
            balance: 0, 
            points: 0 
          })
        });

        if (res.ok) {
          const updatedReports = reports.map(r => 
            r.reportedUser.telegramId === selectedReport.reportedUser.telegramId 
              ? { ...r, reportedUser: { ...r.reportedUser, isBlocked: newBlockStatus } }
              : r
          );
          setReports(updatedReports);
          
          setSelectedReport({
            ...selectedReport,
            reportedUser: { ...selectedReport.reportedUser, isBlocked: newBlockStatus }
          });
        }
      } catch (error) {
        alert('Failed to update block status');
      }
    } else {
      alert('Cannot block user: User not found in database or ID missing');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to hide this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Reports...</div>;

  return (
    <div className="space-y-6 pb-20 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <AlertTriangle className="w-6 h-6 text-red-600" /> Report History
        </h1>
        <button onClick={fetchReports} className="p-2 hover:bg-muted rounded-full"><RefreshCw className="w-5 h-5 text-muted-foreground" /></button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {reports.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-6 text-muted-foreground">No pending reports.</td></tr>
              ) : reports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={report.reporterAvatar} alt="user" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                      <div className="flex flex-col">
                        <span className="font-bold">{report.reporterName}</span>
                        <span className="text-xs text-blue-500">{report.reporterUsername}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{report.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(report)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-semibold whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button 
                        onClick={() => updateStatus(report.id, 'Resolved')} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition text-xs font-semibold whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4" /> Resolve
                      </button>
                      <button 
                        onClick={() => handleDelete(report.id)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg text-foreground">Report Details</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">Reporter Info</p>
                <div className="flex items-center gap-3">
                  <img src={selectedReport.reporterAvatar} alt="Reporter" className="w-10 h-10 rounded-full bg-white border dark:border-gray-700" />
                  <div>
                    <p className="font-bold text-sm text-foreground">{selectedReport.reporterName}</p>
                    <p className="text-xs text-blue-500">{selectedReport.reporterUsername}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm bg-white dark:bg-zinc-900 p-2 rounded border border-blue-100 dark:border-blue-800 text-foreground italic">
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="text-center space-y-2 border-t border-border pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reported Cheater Info</p>
                <div className="flex flex-col items-center bg-muted/30 p-4 rounded-xl">
                  <div className="relative">
                    <img src={selectedReport.reportedUser.avatar} alt="Target" className="w-20 h-20 rounded-full border-4 border-card shadow-md" />
                    {selectedReport.reportedUser.isBlocked && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Ban className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-2 text-foreground">{selectedReport.reportedUser.name}</h2>
                  <p className="text-sm text-blue-500 font-medium mb-3">{selectedReport.reportedUser.username}</p>
                  
                  <div className="flex gap-2 flex-wrap justify-center">
                    {selectedReport.reportedUser.taskLink && (
                      <a 
                        href={selectedReport.reportedUser.taskLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition"
                      >
                        <ExternalLink className="w-3 h-3" /> Task Link
                      </a>
                    )}
                    {selectedReport.reportedUser.profileLink && (
                      <a 
                        href={selectedReport.reportedUser.profileLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
                      >
                        <ExternalLink className="w-3 h-3" /> X Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {showRejectInput && (
                <div className="animate-in fade-in slide-in-from-top-2 bg-red-50 p-3 rounded-lg border border-red-100">
                  <label className="text-xs font-bold text-red-600 mb-1 block">Reason for Rejection (Required)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Ex: False claim, evidence mismatch..."
                      className="flex-1 p-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-foreground"
                      autoFocus
                    />
                    <button onClick={confirmReject} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                      Send
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button 
                  onClick={() => updateStatus(selectedReport.id, 'Resolved')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>

                <button 
                  onClick={handleRejectClick}
                  className={`flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition active:scale-95 ${showRejectInput ? 'hidden' : 'block'}`}
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>

                <button 
                  onClick={toggleBlockUser}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition active:scale-95 text-white shadow-sm
                    ${selectedReport.reportedUser.isBlocked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-black hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600'}`}
                >
                  <Ban className="w-4 h-4" /> 
                  {selectedReport.reportedUser.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
