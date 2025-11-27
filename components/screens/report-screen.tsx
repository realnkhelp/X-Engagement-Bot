import { useState, useEffect } from 'react';
import { AlertTriangle, Send } from 'lucide-react';

interface ReportScreenProps {
  onNavigate: (screen: any) => void;
}

export default function ReportScreen({ onNavigate }: ReportScreenProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    taskLink: '',
    profileLink: '',
  });

  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
  const userId = tgUser?.id || 123456789;

  useEffect(() => {
    if (activeTab === 'history') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.username) return;

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cheater_username: formData.username,
          task_link: formData.taskLink,
          cheater_profile_link: formData.profileLink
        })
      });

      if (res.ok) {
        alert('Report Submitted!');
        setFormData({ username: '', taskLink: '', profileLink: '' });
        setActiveTab('history');
      }
    } catch (error) {
      alert('Failed to submit report');
    }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-xs ${
            activeTab === 'report'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Report User
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-xs ${
            activeTab === 'history'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'report' && (
        <div className="space-y-6 pb-4">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Report Suspicious Activity</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Help us maintain a fair community by reporting users who cheat or break the rules.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cheater Username</label>
                <input
                  type="text"
                  placeholder="@telegram_username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Task Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.taskLink}
                  onChange={(e) => setFormData({ ...formData, taskLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cheater's X Profile Link</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={formData.profileLink}
                  onChange={(e) => setFormData({ ...formData, profileLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Send className="w-5 h-5" />
                Report User
              </button>
            </div>
          </form>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-border pb-4">
              Report Guidelines
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <span className="block font-semibold text-muted-foreground text-sm mb-1">Fake Completion:</span>
                <p className="text-sm leading-relaxed">User submitted fake screenshot or used automated tools.</p>
              </div>
            </div>

            <hr className="border-border my-6" />

            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">
                How to Report a User
              </h3>
              
              <ol className="list-decimal pl-5 space-y-3 text-sm text-foreground/80">
                <li>
                  Click the 
                  <button 
                    onClick={() => onNavigate('create')}
                    className="mx-1.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium hover:bg-blue-100 transition inline-block"
                  >
                    Create Task +
                  </button> 
                  button.
                </li>
                <li>Go to <strong>My Tasks</strong>.</li>
                <li>
                  Click the 
                  <button 
                     onClick={() => onNavigate('create')}
                     className="mx-1.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium hover:bg-blue-100 transition inline-block"
                  >
                    View
                  </button> 
                  button to get details.
                </li>
                <li>Click <span className="font-bold text-foreground">Report User</span> to submit.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3 pb-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading history...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-muted-foreground">No reports found.</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      <img 
                        src={report.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
                        alt={report.first_name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{report.first_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Reported: {report.cheater_username}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    report.status === 'resolved'
                      ? 'bg-green-100 text-green-600'
                      : report.status === 'rejected' 
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {report.status}
                  </span>
                </div>

                {report.status === 'rejected' && report.reason && (
                  <div className="mt-3 pt-2 border-t border-red-200">
                    <p className="text-xs text-red-500 font-bold">
                      Reason: {report.reason}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
