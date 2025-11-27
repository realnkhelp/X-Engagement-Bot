'use client';

import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, Ban, ExternalLink, X, AlertTriangle } from 'lucide-react';

interface Report {
  id: number;
  reporterName: string;
  reporterUsername: string;
  reporterAvatar: string;
  type: 'Cheating' | 'Spam' | 'Abuse';
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
      reporterUsername: '@rahul_k',
      reporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      type: 'Cheating',
      message: 'Fake Completion Report',
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
      reporterUsername: '@amit_v',
      reporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      type: 'Cheating',
      message: 'Fake Completion Report',
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
                <th className="px-6 py-4 whitespace-nowrap">User</th>
                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={report.reporterAvatar} alt="user" className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-border" />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white font-bold ring-2 ring-white">
                          R
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">{report.reporterName}</span>
                        <span className="text-xs text-muted-foreground font-medium">{report.reporterUsername}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wide">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-100' :
                      report.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">{report.date}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(report)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-semibold border border-blue-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button 
                        onClick={() => updateStatus(report.id, 'Resolved')} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition text-xs font-semibold border border-green-100"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Resolve
                      </button>
                      <button 
                        onClick={() => handleDelete(report.id)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold border border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
             <div className="p-10 text-center text-muted-foreground text-sm">
               No reports found.
             </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg">Report Details</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-200 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Reporter</p>
                  <span className="text-[10px] text-blue-400 font-mono">{selectedReport.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={selectedReport.reporterAvatar} alt="Reporter" className="w-10 h-10 rounded-full bg-white border shadow-sm" />
                  <div>
                    <p className="font-bold text-sm text-foreground">{selectedReport.reporterName}</p>
                    <p className="text-xs text-blue-500 font-medium">{selectedReport.reporterUsername}</p>
                  </div>
                </div>
                <div className="text-sm bg-white p-3 rounded-lg border border-blue-100 text-gray-700 shadow-sm">
                  <span className="font-semibold text-gray-900 block mb-1 text-xs uppercase">Issue:</span>
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="text-center space-y-4 pt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mx-10">Reported User</p>
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img src={selectedReport.reportedUser.avatar} alt="Target" className="w-20 h-20 rounded-full border-4 border-card shadow-lg" />
                    {selectedReport.reportedUser.isBlocked && (
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                        <Ban className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-3 text-foreground">{selectedReport.reportedUser.name}</h2>
                  <p className="text-sm text-blue-500 font-medium bg-blue-50 px-3 py-1 rounded-full mt-1 border border-blue-100">
                    {selectedReport.reportedUser.username}
                  </p>
                  
                  {selectedReport.reportedUser.taskLink && (
                    <a 
                      href={selectedReport.reportedUser.taskLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition border border-border"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> 
                      Open Task Proof Link
                    </a>
                  )}
                </div>
              </div>

              {showRejectInput && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                  <label className="text-xs font-bold text-red-600 mb-1.5 block">Reason for Rejection</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Why is this report invalid?"
                      className="flex-1 p-2.5 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50/30"
                      autoFocus
                    />
                    <button onClick={confirmReject} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-sm">
                      Send
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button 
                  onClick={() => updateStatus(selectedReport.id, 'Resolved')}
                  className="flex flex-col items-center justify-center gap-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-semibold hover:bg-green-100 transition active:scale-95"
                >
                  <CheckCircle className="w-5 h-5" /> 
                  <span className="text-xs">Resolve</span>
                </button>

                <button 
                  onClick={handleRejectClick}
                  className={`flex flex-col items-center justify-center gap-1 border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition active:scale-95 ${showRejectInput ? 'bg-red-50 ring-2 ring-red-200' : 'bg-transparent'}`}
                >
                  <XCircle className="w-5 h-5" /> 
                  <span className="text-xs">Reject</span>
                </button>

                <button 
                  onClick={toggleBlockUser}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-semibold transition active:scale-95 text-white shadow-sm border border-transparent
                    ${selectedReport.reportedUser.isBlocked 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-black hover:bg-gray-800'}`}
                >
                  <Ban className="w-5 h-5" /> 
                  <span className="text-xs">{selectedReport.reportedUser.isBlocked ? 'Unblock' : 'Block'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}