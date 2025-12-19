'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Check, Zap, Wallet, Coins, RefreshCw } from 'lucide-react';

interface CreateTaskScreenProps {
  user: any;
}

interface CategoryOption {
  id: string;
  name: string;
  priceUsd: number;
  pricePoints: number;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
}

export default function CreateTaskScreen({ user }: CreateTaskScreenProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'my'>('add');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  
  // Dynamic Assets & Prices
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prices, setPrices] = useState<{[key: string]: number}>({});
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Selected Coin for Crypto Payment
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>(''); 
  
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    link: '',
    quantity: 10,
  });

  // 1. Load Categories & Assets
  useEffect(() => {
    // Categories
    fetch('/api/tasks/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setFormData(prev => ({ ...prev, category: data.categories[0].id }));
          }
        }
      })
      .catch(err => console.error("Category Load Error:", err));

    // Assets (Coins)
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.assets.length > 0) {
          setAssets(data.assets);
          setSelectedAssetSymbol(data.assets[0].symbol); // Default first coin
          fetchLivePrices(data.assets);
        }
      })
      .catch(err => console.error("Assets Load Error:", err));
  }, []);

  // 2. Load Tasks
  useEffect(() => {
    if (activeTab === 'my' && user?.telegramId) {
      setLoadingTasks(true);
      fetch(`/api/tasks/my?userId=${user.telegramId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMyTasks(data.tasks);
          }
          setLoadingTasks(false);
        })
        .catch(err => {
            console.error(err);
            setLoadingTasks(false);
        });
    }
  }, [activeTab, user]);

  // 3. Binance Live Price Fetcher
  const fetchLivePrices = async (assetList: Asset[]) => {
    const newPrices: {[key: string]: number} = {};
    newPrices['USDT'] = 1; // USDT base

    for (const asset of assetList) {
      if (asset.symbol === 'USDT') continue;
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${asset.symbol}USDT`);
        const data = await res.json();
        if (data.price) {
          newPrices[asset.symbol] = parseFloat(data.price);
        }
      } catch (err) {
        // Fallback agar API fail ho
        if (asset.symbol === 'TON') newPrices['TON'] = 5.2;
        if (asset.symbol === 'BTC') newPrices['BTC'] = 95000;
        if (asset.symbol === 'ETH') newPrices['ETH'] = 3500;
      }
    }
    setPrices(prev => ({ ...prev, ...newPrices }));
  };

  const getSelectedCategoryData = () => {
    return categories.find(c => String(c.id) === String(formData.category));
  };

  const calculateTotalUsd = () => {
    const data = getSelectedCategoryData();
    if (!data) return "0.00";
    return (Number(data.priceUsd) * formData.quantity).toFixed(4);
  };

  const calculateTotalPoints = () => {
    const data = getSelectedCategoryData();
    if (!data) return 0;
    return Number(data.pricePoints) * formData.quantity;
  };

  const getCryptoAmount = () => {
    const totalUsd = parseFloat(calculateTotalUsd());
    const coinPrice = prices[selectedAssetSymbol] || 1;
    return (totalUsd / coinPrice).toFixed(6);
  };

  const handleCategorySelect = (id: string) => {
    setFormData({ ...formData, category: id });
    setIsDropdownOpen(false);
  };

  // --- CREATE TASK LOGIC ---
  const handlePointsPayment = async () => {
    try {
      const res = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.telegramId, // API expects BigInt as string/number
          categoryId: formData.category,
          link: formData.link,
          quantity: formData.quantity,
          totalPoints: calculateTotalPoints()
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Task Created Successfully! 🚀');
        setShowPointsModal(false);
        setActiveTab('my'); // Redirect to My Tasks
        // Reset form
        setFormData(prev => ({ ...prev, link: '', quantity: 10 }));
      } else {
        alert(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  const handleCryptoPayment = () => {
    alert(`Payment of ${getCryptoAmount()} ${selectedAssetSymbol} is currently under maintenance. Please use Points.`);
    setShowCryptoModal(false);
  };

  const toggleTaskView = (id: number) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const openCompleterLink = (link: string) => {
    if (link) window.open(link, '_blank');
    else alert('No link available');
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      {/* Tabs */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'add' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
        >
          Add Task
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'my' ? 'bg-blue-500 text-white' : 'text-muted-foreground'}`}
        >
          My Tasks
        </button>
      </div>

      {/* --- ADD TASK TAB --- */}
      {activeTab === 'add' && (
        <div className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            
            {/* Category Select */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2">Category</label>
              <button 
                type="button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
              >
                <span className="font-medium">
                  {categories.find(c => String(c.id) === String(formData.category))?.name || 'Select Category'}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 p-1.5 animate-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button 
                      key={cat.id} 
                      type="button" 
                      onClick={() => handleCategorySelect(cat.id)} 
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all mb-1 last:mb-0 ${String(formData.category) === String(cat.id) ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-muted text-foreground'}`}
                    >
                      <span className="font-semibold">{cat.name}</span>
                      {String(formData.category) === String(cat.id) && <div className="bg-white/20 p-1 rounded-full"><Check className="w-4 h-4 text-white" /></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Link Input */}
            <div>
              <label className="block text-sm font-semibold mb-2">Post/Profile Link</label>
              <input 
                type="url" 
                placeholder="https://twitter.com/..." 
                value={formData.link} 
                onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <input 
                type="number" 
                placeholder="Minimum 10" 
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 font-bold ${formData.quantity > 0 && formData.quantity < 10 ? "border-red-500 focus:ring-red-500 text-red-500" : "border-border focus:ring-blue-500"}`}
                value={formData.quantity === 0 ? "" : formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value === "" ? 0 : parseInt(e.target.value) })} 
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-1 gap-3">
              <button 
                type="button" 
                onClick={() => { 
                   if (!formData.quantity || formData.quantity < 10) { setShowErrorModal(true); return; } 
                   setShowPointsModal(true); 
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Coins className="w-5 h-5" />
                Create with {calculateTotalPoints()} Points
              </button>

              <button 
                type="button" 
                onClick={() => { 
                   if (!formData.quantity || formData.quantity < 10) { setShowErrorModal(true); return; } 
                   setShowCryptoModal(true); 
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Wallet className="w-5 h-5" />
                Pay {calculateTotalUsd()} USDT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MY TASKS TAB --- */}
      {activeTab === 'my' && (
        <div className="space-y-4 pb-4">
          {loadingTasks ? (
            <div className="text-center py-10 text-muted-foreground">Loading My Tasks...</div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No tasks created yet.</div>
          ) : (
            myTasks.map((task) => {
              const isFinished = task.completedCount >= task.quantity;
              return (
                <div key={task.id} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                         <img src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{user?.firstName}</h3>
                        {isFinished ? 
                          <span className="text-green-600 font-bold text-sm">Completed</span> : 
                          <span className="text-blue-600 font-bold text-sm">{task.completedCount}/{task.quantity} Progress</span>
                        }
                        <p className="text-xs text-muted-foreground mt-1 font-medium truncate max-w-[150px]">
                          {task.link}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isFinished ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                      {isFinished ? 'Closed' : 'Open'}
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleTaskView(task.id)}
                    className="w-full py-2.5 rounded-lg border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition"
                  >
                    {expandedTaskId === task.id ? 'Hide Details' : 'View Completers'}
                  </button>

                  {/* Completers List */}
                  {expandedTaskId === task.id && (
                    <div className="pt-2 border-t border-border animate-in slide-in-from-top-2">
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Completers ({task.completers?.length || 0})</h4>
                      <div className="space-y-3">
                        {(!task.completers || task.completers.length === 0) && <p className="text-xs text-muted-foreground text-center">No completions yet.</p>}
                        
                        {task.completers?.map((completer: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <img src={completer.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt={completer.name} className="w-9 h-9 rounded-full object-cover" />
                              <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate w-24">{completer.name}</p>
                                <p className="text-xs text-muted-foreground truncate w-24">@{completer.username}</p>
                              </div>
                            </div>
                            <button onClick={() => openCompleterLink(completer.twitterLink)} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">
                              Check
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- POINTS CONFIRMATION MODAL --- */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="font-bold text-xl">Confirm Points Payment</h2>
              <p className="text-muted-foreground text-sm">You are about to deduct <span className="font-bold text-foreground">{calculateTotalPoints()} Points</span> from your balance.</p>
            </div>
            <div className="space-y-3">
              <button onClick={handlePointsPayment} className="w-full py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition shadow-lg shadow-yellow-500/20">Pay {calculateTotalPoints()} Points</button>
              <button onClick={() => setShowPointsModal(false)} className="w-full py-3.5 rounded-xl border border-border font-semibold hover:bg-muted transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CRYPTO PAYMENT MODAL --- */}
      {showCryptoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl">Select Payment Method</h2>
              <button onClick={() => setShowCryptoModal(false)} className="p-2 hover:bg-muted rounded-full transition"><ChevronDown className="w-5 h-5 rotate-180" /></button>
            </div>

            {/* Dynamic Coins Grid */}
            <div className="grid grid-cols-2 gap-3">
              {assets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetSymbol(asset.symbol)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedAssetSymbol === asset.symbol ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'border-border hover:border-muted-foreground/30'}`}
                >
                   {asset.iconUrl ? <img src={asset.iconUrl} alt={asset.symbol} className="w-8 h-8 rounded-full" /> : <Wallet className="w-8 h-8" />}
                   <span className="font-bold text-lg">{asset.symbol}</span>
                </button>
              ))}
              {assets.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground">No assets found.</p>}
            </div>

            <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Task Cost (USD)</span><span className="font-semibold">${calculateTotalUsd()}</span></div>
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{selectedAssetSymbol} Live Price</span>
                  <span className="font-semibold text-green-500">${prices[selectedAssetSymbol]?.toFixed(2) || '...'}</span>
              </div>
              <div className="border-t border-border/50 my-2 pt-2 flex justify-between items-center">
                <span className="font-bold">Total Pay</span>
                <span className="font-bold text-xl text-blue-600">{getCryptoAmount()} {selectedAssetSymbol}</span>
              </div>
            </div>

            <button onClick={handleCryptoPayment} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 fill-current" />
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* --- ERROR MODAL --- */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-[300px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center"><h3 className="text-lg font-bold mb-2">Error</h3><p className="text-muted-foreground text-sm">Minimum quantity required is 10</p></div>
            <div className="border-t border-border"><button onClick={() => setShowErrorModal(false)} className="w-full py-3 text-blue-600 font-bold text-base transition">OK</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
