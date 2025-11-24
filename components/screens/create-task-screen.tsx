'use client';

import { useState } from 'react';
import { ChevronDown, Check, Zap, Wallet, Coins, User } from 'lucide-react';

interface CreateTaskScreenProps {
  user: any;
}

interface CategoryOption {
  id: string;
  label: string;
  priceUsd: number;
  pricePoints: number;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'Follow', label: 'Follow', priceUsd: 0.0040, pricePoints: 10 },
  { id: 'Like', label: 'Like', priceUsd: 0.0030, pricePoints: 5 },
  { id: 'Retweet', label: 'Retweet', priceUsd: 0.0055, pricePoints: 15 },
  { id: 'Comment', label: 'Comment', priceUsd: 0.0100, pricePoints: 20 },
];

export default function CreateTaskScreen({ user }: CreateTaskScreenProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'my'>('add');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'TON' | 'USDT'>('USDT');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    category: 'Follow',
    title: '',
    link: '',
    quantity: 100,
  });

  const tonPriceInUsd = 5.20; 

  const myTasks = [
    {
      id: 1,
      taskId: '#1',
      category: 'Follow',
      quantity: 100,
      completedCount: 45,
      status: 'Open', 
      completers: [
        { id: 101, name: 'Priya Singh', username: '@priyasingh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=30&h=30&fit=crop' },
        { id: 102, name: 'Amit Patel', username: '@amitpatel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop' },
      ],
    },
    {
      id: 2,
      taskId: '#2',
      category: 'Like',
      quantity: 50,
      completedCount: 50,
      status: 'Closed',
      completers: [
        { id: 201, name: 'Rahul Kumar', username: '@rahul_k', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=30&h=30&fit=crop' },
      ],
    },
  ];

  const getSelectedCategoryData = () => {
    return CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0];
  };

  const calculateTotalUsd = () => {
    const price = getSelectedCategoryData().priceUsd;
    return (price * formData.quantity).toFixed(4);
  };

  const calculateTotalPoints = () => {
    const points = getSelectedCategoryData().pricePoints;
    return points * formData.quantity;
  };

  const getTonAmount = () => {
    const totalUsd = parseFloat(calculateTotalUsd());
    return (totalUsd / tonPriceInUsd).toFixed(4);
  };

  const handleCategorySelect = (id: string) => {
    setFormData({ ...formData, category: id });
    setIsDropdownOpen(false);
  };

  const handlePointsPayment = () => {
    console.log(`Processing Points Payment: ${calculateTotalPoints()} Points`);
    setShowPointsModal(false);
  };

  const handleCryptoPayment = () => {
    if (selectedPaymentMethod === 'TON') {
      console.log(`Processing TON Payment: ${getTonAmount()} TON (Value: $${calculateTotalUsd()})`);
    } else {
      console.log(`Processing USDT Payment: ${calculateTotalUsd()} USDT`);
    }
    setShowCryptoModal(false);
  };

  const toggleTaskView = (id: number) => {
    if (expandedTaskId === id) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(id);
    }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex gap-2 bg-muted p-1 rounded-lg sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'add'
              ? 'bg-card shadow-sm'
              : 'text-muted-foreground'
          }`}
        >
          Add Task
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeTab === 'my'
              ? 'bg-blue-500 text-white'
              : 'text-muted-foreground'
          }`}
        >
          My Tasks
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            
            <div className="relative">
              <label className="block text-sm font-semibold mb-2">Category</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
              >
                <span className="font-medium">{formData.category}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 p-1.5 animate-in zoom-in-95 duration-200">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all mb-1 last:mb-0 ${
                        formData.category === cat.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <span className="font-semibold">{cat.label}</span>
                      {formData.category === cat.id && (
                        <div className="bg-white/20 p-1 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Task Title</label>
              <input
                type="text"
                placeholder="e.g., Follow our account"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                min="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div className="pt-2 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setShowPointsModal(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                                <Coins className="w-5 h-5" />
                Create with {calculateTotalPoints()} Points
              </button>

              <button
                type="button"
                onClick={() => setShowCryptoModal(true)}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Wallet className="w-5 h-5" />
                Pay {calculateTotalUsd()} USDT
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my' && (
        <div className="space-y-4 pb-4">
          {myTasks.map((task) => {
            const isCompleted = task.status === 'Closed';
            
            return (
              <div key={task.id} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
                
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                       <img 
                         src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
                         alt="User"
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">Nitesh Kumar</h3>
                      
                      {isCompleted ? (
                         <span className="text-green-600 font-bold text-sm">Completed</span>
                      ) : (
                         <span className="text-blue-600 font-bold text-sm">
                           {task.completedCount}/{task.quantity}
                         </span>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-1 font-medium">
                        {task.taskId} {task.category}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isCompleted 
                      ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' 
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {isCompleted ? 'Closed' : 'Open'}
                  </div>
                </div>

                <button 
                  onClick={() => toggleTaskView(task.id)}
                  className="w-full py-2.5 rounded-lg border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 transition"
                >
                  {expandedTaskId === task.id ? 'Hide Details' : 'View'}
                </button>

                {expandedTaskId === task.id && (
                  <div className="pt-2 border-t border-border animate-in slide-in-from-top-2">
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Completers List ({task.completers.length})</h4>
                    <div className="space-y-3">
                      {task.completers.map((completer) => (
                        <div key={completer.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <img 
                              src={completer.avatar} 
                              alt={completer.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-sm">{completer.name}</p>
                              <p className="text-xs text-muted-foreground">{completer.username}</p>
                            </div>
                          </div>
                          <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showPointsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="font-bold text-xl">Confirm Points Payment</h2>
              <p className="text-muted-foreground text-sm">
                You are about to deduct <span className="font-bold text-foreground">{calculateTotalPoints()} Points</span> from your balance to create this task.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePointsPayment}
                className="w-full py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition shadow-lg shadow-yellow-500/20"
              >
                                Pay {calculateTotalPoints()} Points
              </button>
              <button
                onClick={() => setShowPointsModal(false)}
                className="w-full py-3.5 rounded-xl border border-border font-semibold hover:bg-muted transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCryptoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl">Select Payment Method</h2>
              <button
                onClick={() => setShowCryptoModal(false)}
                className="p-2 hover:bg-muted rounded-full transition"
              >
                <ChevronDown className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPaymentMethod('USDT')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selectedPaymentMethod === 'USDT'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <span className="font-bold text-lg">USDT</span>
                <span className="text-xs font-medium text-muted-foreground">Tether</span>
              </button>
              <button
                onClick={() => setSelectedPaymentMethod('TON')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selectedPaymentMethod === 'TON'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <span className="font-bold text-lg">TON</span>
                <span className="text-xs font-medium text-muted-foreground">Toncoin</span>
              </button>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Task Cost (USD)</span>
                <span className="font-semibold">${calculateTotalUsd()}</span>
              </div>
              {selectedPaymentMethod === 'TON' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TON Price</span>
                  <span className="font-semibold">${tonPriceInUsd.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/50 my-2 pt-2 flex justify-between items-center">
                <span className="font-bold">Total Pay</span>
                <span className="font-bold text-xl text-blue-600">
                  {selectedPaymentMethod === 'USDT' 
                    ? `${calculateTotalUsd()} USDT` 
                    : `${getTonAmount()} TON`}
                </span>
              </div>
            </div>

            <button
              onClick={handleCryptoPayment}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}