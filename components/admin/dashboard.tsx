import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Active Tasks',
      value: '456',
      icon: Briefcase,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      title: 'Total Revenue',
      value: '$12,450',
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: '+25%',
    },
    {
      title: 'Verified Users',
      value: '892',
      icon: Users,
      color: 'bg-teal-500',
      trend: '+5%',
    },
  ];

  const todayRecords = [
    { type: 'Task Created', count: 23, time: '14:32' },
    { type: 'Users Registered', count: 12, time: '13:45' },
    { type: 'Deposits Processed', count: 8, time: '12:10' },
    { type: 'Reports Filed', count: 3, time: '11:20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600">{stat.trend}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Records */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Today's Records</h2>
        <div className="space-y-3">
          {todayRecords.map((record, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition"
            >
              <div>
                <p className="font-semibold">{record.type}</p>
                <p className="text-xs text-muted-foreground">{record.time}</p>
              </div>
              <p className="text-lg font-bold text-blue-500">{record.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
