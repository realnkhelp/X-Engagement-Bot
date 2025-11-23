import { useState } from 'react';
import { Download, TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface WalletScreenProps {
  user: any;
}

export default function WalletScreen({ user }: WalletScreenProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'transactions'>('deposit');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'TON' | 'USDT' | null>(null);

  // Demo Assets Data (Ye data admin se aayega future me)
  const assets = [
    { 
      id: 'ton', 
      name: 'TON', 
      symbol: 'TON',
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=029', // TON Logo
      price: 5.45, 
      change: -0.48, // Negative value for red color
      userBalance: 12.5, 
      userValue: 68.12 
    },
    { 
      id: 'usdt', 
      name: 'Tether', 
      symbol: 'USDT', 
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', // USDT Logo
      price: 1.00, 
      change: 0.01, // Positive value for green color
      userBalance: 2500.00, 
      userValue: 2500.00 
    }
  ];

  // History Data
  const depositHistory = [
    { id: 1, amount: 500, method: 'USDT Transfer', date: '2025-01-18', status: 'Completed' },
    { id: 2, amount: 250, method: 'TON Transfer', date: '2025-01-17', status: 'Completed' },
  ];

  const transactions = [
    { id: 1, type: 'Task Payment', amount: -150, date: '2025-01-18', status: 'Completed' },
    { id: 2, type: 'Task Reward', amount: +300, date: '2025-01-17', status: 'Completed' },
  ];

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      
      {/* 1. Main Balance Card (Centered) */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white flex flex-col items-center justify-center text-center space-y-4 shadow-lg shadow-blue-500/20">
        <span className="text-sm opacity-90 font-medium tracking-wide">Total Balance</span>
        <div className="text-5xl font-bold tracking-tight">
          {user.balance.toFixed(2)} <span className="text-2xl">USDT</span>
        </div>
        
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full max-w-[200px] mt-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all font-semibold flex items-center justify-center gap-2 active:scale-95"
        >
          <Download className="w-5 h-5" />
          Deposit
        </button>
      </div>

      {/* 2. Assets Section (TON/USDT Real-time Style) */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">Assets</h3>
        {assets.map((asset) => (
          <div key={asset.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            
            {/* Left: Icon & Name & Price */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted p-1 flex items-center justify-center">
                 {/* Fallback icon if image fails */}
                <img 
                  src={asset.icon} 
                  alt={asset.name} 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=?";
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-base">{asset.symbol}</p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span>${asset.price.toFixed(2)}</span>
                  <span className={`${asset.change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {asset.change}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right: User Balance & Value */}
            <div className="text-right">
              <p className="font-bold text-base">{asset.userBalance} {asset.symbol}</p>
              <p className="text-xs text-muted-foreground">${asset.userValue.toFixed(2)}</p>
            </div>

          </div>
        ))}
      </div>

      {/* 3. Tabs (Clean Style) */}
      <div className="flex gap-2 bg-muted p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'deposit'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Deposit History
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'transactions'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Transactions
        </button>
      </div>

      {/* 4. History Lists */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {activeTab === 'deposit' && depositHistory.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.method}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">+{item.amount}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{item.status}</p>
            </div>
          </div>
        ))}

        {activeTab === 'transactions' && transactions.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                <TrendingUp className={`w-5 h-5 ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.type}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount}
              </p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{item.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Payment Modal (Old Logic Preserved) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-card rounded-t-3xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl">Select Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {['TON', 'USDT'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency as 'TON' | 'USDT')}
                  className={`w-full p-4 rounded-xl border-2 transition-all font-semibold flex items-center justify-between ${
                    selectedCurrency === currency
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      : 'border-border hover:border-blue-300'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {/* Tiny Icon Logic */}
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                        {currency[0]}
                    </span>
                    {currency}
                  </span>
                  {selectedCurrency === currency && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>

            {selectedCurrency && (
              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition active:scale-95">
                Pay with {selectedCurrency}
              </button>
            )}

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-3 rounded-xl font-semibold text-muted-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
