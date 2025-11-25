import { useState, useEffect } from 'react';
import { Download, TrendingUp, Copy, Check, X, ChevronRight, RefreshCw, Send, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const initialUserAssets = [
  { id: 1, name: 'Toncoin', symbol: 'TON', balance: 12.5, logo: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=026' },
  { id: 2, name: 'Tether', symbol: 'USDT', balance: 2500.00, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026' },
  { id: 3, name: 'Bitcoin', symbol: 'BTC', balance: 0.00045, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026' },
];

const paymentMethods = [
  { id: 'ton', name: 'TON', symbol: 'TON', address: 'UQBvW8Z...ExampleTonAddress', minDeposit: 1 },
  { id: 'usdt', name: 'USDT BEP20', symbol: 'USDT', address: '0x22b55ccc532d4ad62895975e6fe4542a6699bcc9', minDeposit: 5 },
];

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'transactions'>('deposit');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  
  const [assets, setAssets] = useState(initialUserAssets);
  const [prices, setPrices] = useState<{ [key: string]: { price: number, change: number } }>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [depositAmount, setDepositAmount] = useState('');
  const [depositTxid, setDepositTxid] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState<string | null>(null);

  const depositHistory = [
    { id: 1, amount: 500, method: 'USDT BEP20', date: '2025-01-18', status: 'Completed' },
    { id: 2, amount: 25, method: 'TON', date: '2025-01-17', status: 'Pending' },
  ];

  const transactions = [
    { id: 1, type: 'Task Payment', amount: +0.45, date: '2025-01-18', status: 'Completed' },
    { id: 2, type: 'Task Payment', amount: +0.30, date: '2025-01-17', status: 'Completed' },
  ];

  const fetchLivePrices = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      const priceMap: { [key: string]: { price: number, change: number } } = {};
      
      data.forEach((ticker: any) => {
        priceMap[ticker.symbol] = {
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChangePercent)
        };
      });
      
      setPrices(priceMap);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching prices", error);
    }
  };

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPortfolioValue = assets.reduce((total, asset) => {
    const liveData = asset.symbol === 'USDT' ? { price: 1 } : (prices[`${asset.symbol}USDT`] || { price: 0 });
    return total + (asset.balance * liveData.price);
  }, 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = () => {
    if (!depositAmount) {
        setAmountError(true);
        return;
    }
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < selectedMethod.minDeposit) {
      setAmountError(true);
      setShowErrorAlert(`Minimum deposit amount is ${selectedMethod.minDeposit} ${selectedMethod.symbol}`);
      setTimeout(() => setShowErrorAlert(null), 3000);
      return;
    }
    
    setAmountError(false);
    setShowDepositModal(false);
    setSelectedMethod(null);
    setDepositAmount('');
    setDepositTxid('');
  };

  return (
    <div className="px-4 py-6 space-y-6 pb-24 bg-background min-h-screen">
      
      <div className="relative overflow-hidden bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-blue-100 font-medium text-sm mb-1">Total Balance</p>
          <div className="flex items-baseline gap-1">
            <h1 className="text-5xl font-bold tracking-tight">
              {totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
            <span className="text-xl text-blue-200 font-medium">USDT</span>
          </div>

          <button 
            onClick={() => setShowDepositModal(true)}
            className="mt-6 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition py-3 px-8 rounded-xl font-bold backdrop-blur-md active:scale-95 w-full max-w-[200px]"
          >
            <Download className="w-5 h-5" />
            Deposit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-lg text-foreground">Assets</h3>
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground"/>}
        </div>

        {assets.map((asset) => {
          const pairSymbol = `${asset.symbol}USDT`;
          const marketData = asset.symbol === 'USDT' 
            ? { price: 1, change: 0.01 } 
            : (prices[pairSymbol] || { price: 0, change: 0 });
            
          const valueInUsd = asset.balance * marketData.price;
          const isPriceLoaded = marketData.price > 0;
          const isPositive = marketData.change >= 0;

          return (
            <div key={asset.id} className="bg-card border border-border rounded-2xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800 p-2">
                  <img src={asset.logo} alt={asset.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base">{asset.symbol} <span className="text-sm font-normal text-muted-foreground">({asset.name})</span></h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="font-bold text-sm">
                        ${isPriceLoaded ? marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "..."}
                     </span>
                     {isPriceLoaded && (
                        <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                           {Math.abs(marketData.change).toFixed(2)}%
                        </span>
                     )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg">{asset.balance} {asset.symbol}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  ≈ ${valueInUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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

      <div className="space-y-3">
        {activeTab === 'deposit' ? (
          depositHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Deposit</p>
                  <p className="text-xs text-muted-foreground">{item.date} • {item.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+{item.amount}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{item.status}</p>
              </div>
            </div>
          ))
        ) : (
          transactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
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
          ))
        )}
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 relative">
            
            {showErrorAlert && (
                <div className="absolute top-4 left-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 text-sm font-semibold text-center">
                    {showErrorAlert}
                </div>
            )}

            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="font-bold text-lg">
                {selectedMethod ? 'Deposit' : 'Select Payment Method'}
              </h2>
              <button 
                onClick={() => {
                  setShowDepositModal(false);
                  setSelectedMethod(null);
                  setAmountError(false);
                  setDepositAmount('');
                }}
                className="p-1 hover:bg-muted rounded-full transition"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5">
              {!selectedMethod ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className="w-full p-4 rounded-xl border border-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-between group"
                    >
                      <span className="font-bold text-lg">{method.name}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowDepositModal(false)}
                    className="w-full py-3.5 mt-2 rounded-xl border border-border font-semibold hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
                    <label className="block text-sm text-muted-foreground font-medium">
                      <span className="font-bold text-foreground">{selectedMethod.name} ADDRESS</span>
                    </label>
                    <div className="flex items-center justify-between gap-2 bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs font-mono break-all text-muted-foreground line-clamp-2">
                        {selectedMethod.address}
                      </p>
                      <button 
                        onClick={() => handleCopy(selectedMethod.address)}
                        className="p-2 hover:bg-muted rounded-md transition text-blue-600 shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => {
                        setDepositAmount(e.target.value);
                        setAmountError(false);
                      }}
                      placeholder={`Amount (Minimum ${selectedMethod.minDeposit})`}
                      className={`w-full px-4 py-3.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 transition font-medium ${
                        amountError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-border focus:ring-blue-500"
                      }`}
                    />
                    
                    <input
                      type="text"
                      value={depositTxid}
                      onChange={(e) => setDepositTxid(e.target.value)}
                      placeholder="TXID (Transaction Hash) / Payment URL"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedMethod(null);
                        setAmountError(false);
                        setDepositAmount('');
                      }}
                      className="flex-1 py-3.5 rounded-xl border border-border font-bold hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDepositSubmit}
                      className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      Request Deposit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}