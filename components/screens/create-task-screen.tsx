import { useState } from 'react';
import { Zap, Plus } from 'lucide-react';

interface CreateTaskScreenProps {
  user: any;
}

interface Completer {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export default function CreateTaskScreen({ user }: CreateTaskScreenProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'my'>('add');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'TON' | 'USDT' | null>(null);
  const [formData, setFormData] = useState({
    category: 'Follow',
    title: '',
    link: '',
    quantity: 100,
  });

  const myTasks = [
    {
      id: 1,
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      userName: 'Alex Johnson',
      category: 'Follow',
      completed: 30,
      total: 30,
      status: 'Closed',
      completers: [
        { id: 1, name: 'Priya Singh', username: '@priyasingh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=30&h=30&fit=crop' },
        { id: 2, name: 'Amit Patel', username: '@amitpatel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop' },
        { id: 3, name: 'Sneha Verma', username: '@snehaverma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop' },
      ],
    },
  ];

  const categories = ['Follow', 'Like', 'Retweet', 'Comment'];

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
      {/* Tabs */}
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

      {/* Add Task Form */}
      {activeTab === 'add' && (
        <form className="space-y-4 pb-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            {/* Category - Dropdown like image */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-2.5 text-muted-foreground">
                  ▼
                </div>
              </div>
              {/* Show selected category highlighted */}
              <div className="mt-2 p-3 rounded-lg bg-muted border border-border space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition ${
                      formData.category === cat
                        ? 'bg-purple-500 text-white'
                        : 'text-foreground hover:bg-muted-foreground/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Task Title</label>
              <input
                type="text"
                placeholder="e.g., Follow our account"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-semibold mb-2">Post/Profile Link</label>
              <input
                type="url"
                placeholder="https://twitter.com/..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Create Task Button */}
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>

            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              Pay 0.55 USDT
            </button>
          </div>
        </form>
      )}

      {/* My Tasks */}
      {activeTab === 'my' && (
        <div className="space-y-3 pb-4">
          {myTasks.map((task) => (
            <div key={task.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1">
                  <img
                    src={task.userImage || "/placeholder.svg"}
                    alt={task.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">{task.userName}</p>
                    <p className="text-xs text-muted-foreground">{task.category}</p>
                    <p className="text-sm text-muted-foreground font-semibold">{task.completed}/{task.total} completed</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  task.status === 'Closed'
                    ? 'bg-gray-500/20 text-gray-600'
                    : 'bg-green-500/20 text-green-600'
                }`}>
                  {task.status}
                </span>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-sm font-semibold mb-3">Completers ({task.completers.length})</p>
                <div className="space-y-2">
                  {task.completers.map((completer) => (
                    <div key={completer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={completer.avatar || "/placeholder.svg"}
                          alt={completer.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{completer.name}</p>
                          <p className="text-xs text-muted-foreground">{completer.username}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition">
                        View
                      </button>
                    </div>
                  ))}
                </div>
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
              <h2 className="font-bold text-lg">Select Payment</h2>
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
                  onClick={() => setSelectedPayment(currency as 'TON' | 'USDT')}
                  className={`w-full p-3 rounded-lg border-2 transition font-semibold ${
                    selectedPayment === currency
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border hover:border-blue-500'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>

            {selectedPayment && (
              <button className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
                0.55 {selectedPayment} PAY
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
