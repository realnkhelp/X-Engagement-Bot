'use client';

import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, Ban, ExternalLink, X, AlertTriangle } from 'lucide-react';

interface Report {
  id: number;
  reporterName: string;
  reporterAvatar: string;
  type: 'Spam' | 'Fake' | 'Abuse';
  message: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  date: string;
  reportedUser: {
    name: string;
    username: string;
    avatar: string;
    taskLink: string;
    isBlocked: boolean;
  };
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      reporterName: 'Rahul Kumar',
      reporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      type: 'Fake',
      message: 'User submitted a fake screenshot for the task.',
      status: 'Pending',
      date: '24 Nov 2025',
      reportedUser: {
        name: 'Suresh Singh',
        username: '@suresh_007',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
        taskLink: 'https://telegram.me/suresh_task_123',
        isBlocked: false,
      }
    },
    {
      id: 2,
      reporterName: 'Amit Verma',
      reporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      type: 'Abuse',
      message: 'Using bad language in chat.',
      status: 'Resolved',
      date: '23 Nov 2025',
      reportedUser: {
        name: 'Rohan Das',
        username: '@rohan_das',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        taskLink: '',
        isBlocked: true,
      }
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

  const updateStatus = (id: number, newStatus: 'Resolved' | 'Rejected') => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (newStatus === 'Resolved') handleCloseModal();
  };

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const confirmReject = () => {
    if (selectedReport && rejectReason) {
      updateStatus(selectedReport.id, 'Rejected');
      console.log(`Report Rejected. Reason sent to user: ${rejectReason}`);
      handleCloseModal();
    }
  };

  const toggleBlockUser = () => {
    if (selectedReport) {
      const updatedReports = reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, reportedUser: { ...r.reportedUser, isBlocked: !r.reportedUser.isBlocked } }
          : r
      );
      setReports(updatedReports);
      
      setSelectedReport({
        ...selectedReport,
        reportedUser: { ...selectedReport.reportedUser, isBlocked: !selectedReport.reportedUser.isBlocked }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600" /> Report History
        </h1>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={report.reporterAvatar} alt="user" className="w-8 h-8 rounded-full bg-gray-200" />
                      <span className="font-medium">{report.reporterName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                      report.type === 'Spam' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      report.type === 'Fake' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-purple-100 text-purple-700 border-purple-200'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={report.message}>
                    {report.message}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <button onClick={() => handleOpenModal(report)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(report.id, 'Resolved')} className="p-1.5 text-green-600 hover:bg-green-100 rounded">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg">Report Details</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Reporter Info</p>
                <div className="flex items-center gap-3">
                  <img src={selectedReport.reporterAvatar} alt="Reporter" className="w-10 h-10 rounded-full bg-white border" />
                  <div>
                    <p className="font-bold text-sm">{selectedReport.reporterName}</p>
                    <p className="text-xs text-muted-foreground">Reported a {selectedReport.type} issue</p>
                  </div>
                </div>
                <div className="mt-2 text-sm bg-white p-2 rounded border border-blue-100 text-gray-700">
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reported User / Task</p>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img src={selectedReport.reportedUser.avatar} alt="Target" className="w-20 h-20 rounded-full border-4 border-card shadow-md" />
                    {selectedReport.reportedUser.isBlocked && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Ban className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-2">{selectedReport.reportedUser.name}</h2>
                  <p className="text-sm text-blue-500 font-medium">{selectedReport.reportedUser.username}</p>
                  
                  {selectedReport.reportedUser.taskLink && (
                    <a 
                      href={selectedReport.reportedUser.taskLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs bg-muted px-3 py-1 rounded-full hover:bg-muted/80 transition"
                    >
                      <ExternalLink className="w-3 h-3" /> View Task Link
                    </a>
                  )}
                </div>
              </div>

              {showRejectInput && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-red-600 mb-1 block">Reason for Rejection (Visible to User)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Ex: False claim, evidence mismatch..."
                      className="flex-1 p-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      autoFocus
                    />
                    <button onClick={confirmReject} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
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
                  <CheckCircle className="w-4 h-4" /> Resolved
                </button>

                <button 
                  onClick={handleRejectClick}
                  className={`flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition active:scale-95 ${showRejectInput ? 'bg-red-50' : 'bg-transparent'}`}
                >
                  <XCircle className="w-4 h-4" /> Rejected
                </button>

                <button 
                  onClick={toggleBlockUser}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition active:scale-95 text-white shadow-sm
                    ${selectedReport.reportedUser.isBlocked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'}`}
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