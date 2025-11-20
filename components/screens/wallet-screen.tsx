import { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';

interface WalletScreenProps {
  user: any;
}

export default function WalletScreen({ user }: WalletScreenProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'transactions'>('deposit');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'TON' | 'USDT' | null>(null);

  const depositHistory = [
    { id: 1, amount: '50.00', currency: 'USDT', date: '2025-01-18', status: 'Completed' },
    { id: 2, amount: '100.00', currency: 'TON', date: '2025-01-17', status: 'Completed' },
  ];

  const transactionHistory = [
    { id: 1, type: 'Task Payment', amount: '-0.55', currency: 'USDT', date: '2025-01-18', status: 'Completed' },
    { id: 2, type: 'Withdrawal', amount: '-25.00', currency: 'USDT', date: '2025-01-17', status: 'Completed' },
  ];

  return (
    <div className="px-4 py-6 space-y-6 pb-20">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white space-y-4">
        <span className="text-sm opacity-90">Total Balance</span>
        <div className="text-5xl font-bold">0.00 USDT</div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 transition font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Deposit
        </button>
      </div>

      {/* Admin-Loaded Currency Section */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1564760055-e80a4c10df9e?w=40&h=40&fit=crop"
                alt="TON"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div>
              <p className="font-bold">TON</p>
              <p className="text-xs text-muted-foreground">0.00 USDT</p>
            </div>
          </div>
          <p className="font-bold text-lg">0.00 TON</p>
        </div>
      </div>

      {/* Tabs for History */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
            activeTab === 'deposit'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Deposit History
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
            activeTab === 'transactions'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Deposit History Tab */}
      {activeTab === 'deposit' && (
        <div className="space-y-3">
          {depositHistory.map((record) => (
            <div key={record.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{record.amount} {record.currency}</p>
                <p className="text-xs text-muted-foreground">{record.date}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-600">
                {record.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {transactionHistory.map((record) => (
            <div key={record.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{record.type}</p>
                <p className="text-xs text-muted-foreground">{record.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-500">{record.amount} {record.currency}</p>
                <p className="text-xs text-muted-foreground">{record.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 max-w-md mx-auto">
          <div className="w-full bg-card rounded-t-2xl p-6 space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Select Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {['TON', 'USDT'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency as 'TON' | 'USDT')}
                  className={`w-full p-3 rounded-lg border-2 transition font-semibold ${
                    selectedCurrency === currency
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border hover:border-blue-500'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>

            {selectedCurrency && (
              <button className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
                0.55 {selectedCurrency} PAY
              </button>
            )}

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2 rounded-lg border border-border font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
