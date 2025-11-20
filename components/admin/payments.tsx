import { Download } from 'lucide-react';

export default function AdminPayments() {
  const paymentMethods = [
    { id: 1, name: 'Credit Card', icon: '💳', enabled: true },
    { id: 2, name: 'Bank Transfer', icon: '🏦', enabled: true },
    { id: 3, name: 'Cryptocurrency', icon: '₿', enabled: false },
  ];

  const transactions = [
    { id: 1, user: 'John Doe', amount: 500, method: 'Credit Card', status: 'Completed', date: '2025-01-18' },
    { id: 2, user: 'Jane Smith', amount: 250, method: 'Bank Transfer', status: 'Pending', date: '2025-01-18' },
    { id: 3, user: 'Bob Johnson', amount: 1000, method: 'Cryptocurrency', status: 'Completed', date: '2025-01-17' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
        <p className="text-muted-foreground">Manage payment methods and transactions</p>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <span className="font-semibold">{method.name}</span>
              </div>
              <input
                type="checkbox"
                checked={method.enabled}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Method</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 font-semibold">{tx.user}</td>
                  <td className="px-4 py-3 font-bold text-green-600">${tx.amount}</td>
                  <td className="px-4 py-3">{tx.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      tx.status === 'Completed'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
