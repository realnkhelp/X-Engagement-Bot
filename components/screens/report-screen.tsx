import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';

export default function ReportScreen() {
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [formData, setFormData] = useState({
    telegramId: '',
    taskLink: '',
    profileLink: '',
  });

  const reportHistory = [
    {
      id: 1,
      cheater: 'user123',
      reason: 'Spam engagement',
      status: 'Under Review',
      date: '2025-01-18',
    },
    {
      id: 2,
      cheater: 'user456',
      reason: 'Bot activity',
      status: 'Resolved',
      date: '2025-01-17',
    },
  ];

  const reportExamples = [
    {
      title: 'Fake Completion',
      description: 'User submitted fake screenshot or used automated tools',
    },
    {
      title: 'Multiple Accounts',
      description: 'Same person using multiple accounts to farm tasks',
    },
    {
      title: 'Incomplete Task',
      description: 'User marked task complete without actually doing it',
    },
  ];

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
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

      {/* Report Form */}
      {activeTab === 'report' && (
        <div className="space-y-4 pb-4">
          <form className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Report Suspicious Activity</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Help us maintain community integrity by reporting fraudulent users.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cheater's Telegram ID</label>
                <input
                  type="text"
                  placeholder="@telegram_username"
                  value={formData.telegramId}
                  onChange={(e) => setFormData({ ...formData, telegramId: e.target.value })}
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
                type="button"
                className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Report User
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-lg">Report Examples</h3>
            {reportExamples.map((example, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <p className="font-semibold text-blue-500">{example.title}:</p>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report History */}
      {activeTab === 'history' && (
        <div className="space-y-3 pb-4">
          {reportHistory.map((report) => (
            <div key={report.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{report.cheater}</p>
                  <p className="text-xs text-muted-foreground">{report.reason}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  report.status === 'Resolved'
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{report.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
