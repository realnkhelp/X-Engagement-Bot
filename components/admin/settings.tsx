'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, AlertTriangle, Coins, Wallet, Gift, Image as ImageIcon, MessageCircle, X, Settings as SettingsIcon } from 'lucide-react';

interface Currency {
  id: number;
  code: string;
  name: string;
  iconUrl: string;
}

interface TaskRate {
  id: number;
  category: 'Follow' | 'Engagement';
  name: string;
  price: number;
  points: number;
}

interface Banner {
  id: number;
  imageUrl: string;
}

interface SupportLink {
  id: number;
  title: string;
  url: string;
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    bot_name: '',
    min_withdraw: 50,
    onboarding_bonus: 500,
    upi_id: '',
    maintenance_mode: false,
    maintenance_message: 'System under maintenance.'
  });

  const [currencies, setCurrencies] = useState<Currency[]>([
    { id: 1, code: 'USDT', name: 'Tether', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { id: 2, code: 'TON', name: 'Toncoin', iconUrl: 'https://cryptologos.cc/logos/toncoin-ton-logo.png' }
  ]);

  const [taskRates, setTaskRates] = useState<TaskRate[]>([
    { id: 1, category: 'Follow', name: 'Twitter Follow', price: 0.0040, points: 10 },
    { id: 2, category: 'Engagement', name: 'Like', price: 0.0030, points: 5 },
  ]);

  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, imageUrl: 'https://i.ibb.co/HDwhQ3QX/banner1.jpg' }
  ]);

  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([
    { id: 1, title: 'Support Chat', url: 'https://t.me/support' }
  ]);

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', iconUrl: '' });

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [newTaskRate, setNewTaskRate] = useState({ category: 'Follow', name: '', price: '', points: '' });

  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newSupportLink, setNewSupportLink] = useState({ title: '', url: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          ...settings,
          ...data.settings,
          maintenance_mode: data.settings.maintenance_mode === 1
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert('Settings Saved Successfully!');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  const addCurrency = () => {
    if (newCurrency.code && newCurrency.name) {
      setCurrencies([...currencies, { id: Date.now(), ...newCurrency }]);
      setNewCurrency({ code: '', name: '', iconUrl: '' });
      setIsCurrencyModalOpen(false);
    }
  };

  const addTaskRate = () => {
    if (newTaskRate.name && newTaskRate.price) {
      setTaskRates([...taskRates, {
        id: Date.now(),
        category: newTaskRate.category as 'Follow' | 'Engagement',
        name: newTaskRate.name,
        price: parseFloat(newTaskRate.price),
        points: parseInt(newTaskRate.points)
      }]);
      setNewTaskRate({ category: 'Follow', name: '', price: '', points: '' });
      setIsRateModalOpen(false);
    }
  };

  const addBanner = () => {
    if (newBannerUrl) {
      setBanners([...banners, { id: Date.now(), imageUrl: newBannerUrl }]);
      setNewBannerUrl('');
    }
  };

  const addSupportLink = () => {
    if (newSupportLink.title && newSupportLink.url) {
      setSupportLinks([...supportLinks, { id: Date.now(), ...newSupportLink }]);
      setNewSupportLink({ title: '', url: '' });
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Settings...</div>;

  return (
    <div className="space-y-8 max-w-5xl pb-24 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">App Settings</h1>
        <button 
          onClick={handleSaveGeneral}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-gray-500" /> General Info
          </h2>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Bot Name</label>
            <input
              type="text"
              value={settings.bot_name}
              onChange={(e) => setSettings({...settings, bot_name: e.target.value})}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">UPI ID (For Deposits)</label>
            <input
              type="text"
              value={settings.upi_id}
              onChange={(e) => setSettings({...settings, upi_id: e.target.value})}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Min Withdrawal</label>
            <input
              type="number"
              value={settings.min_withdraw}
              onChange={(e) => setSettings({...settings, min_withdraw: parseFloat(e.target.value)})}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" /> Maintenance
          </h2>
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800">
            <div>
              <p className="font-bold text-orange-800 dark:text-orange-200">Maintenance Mode</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">App will be locked for users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Maintenance Message</label>
            <textarea
              rows={3}
              value={settings.maintenance_message}
              onChange={(e) => setSettings({...settings, maintenance_message: e.target.value})}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-orange-500 outline-none font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
          <Wallet className="w-5 h-5 text-blue-500" /> Wallet Currencies
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currencies.map((currency) => (
            <div key={currency.id} className="relative group bg-muted/30 border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:border-blue-500 transition">
              <button 
                onClick={() => setCurrencies(currencies.filter(c => c.id !== currency.id))}
                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <img src={currency.iconUrl} className="w-10 h-10 object-contain" />
              <div className="text-center">
                <p className="font-bold text-sm">{currency.code}</p>
                <p className="text-xs text-muted-foreground">{currency.name}</p>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsCurrencyModalOpen(true)}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-500 transition text-blue-600 min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Add Currency</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 text-purple-600">
          <Gift className="w-5 h-5" /> Onboarding Bonus
        </h2>
        <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800">
          <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Registration Reward</p>
            <p className="text-xs text-muted-foreground">Points given to users when they first join.</p>
          </div>
          <div className="relative w-32">
            <input
              type="number"
              value={settings.onboarding_bonus}
              onChange={(e) => setSettings({...settings, onboarding_bonus: parseFloat(e.target.value)})}
              className="w-full p-2 pr-8 text-right font-bold text-lg bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Pts</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
          <Coins className="w-5 h-5 text-yellow-500" /> Task Pricing & Rates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskRates.map((rate) => (
            <div key={rate.id} className="relative group bg-muted/30 border border-border rounded-xl p-4 space-y-3 hover:border-yellow-500 transition">
              <button 
                onClick={() => setTaskRates(taskRates.filter(r => r.id !== rate.id))}
                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-background rounded text-xs font-bold border border-border">
                  {rate.category}
                </span>
              </div>
              <div>
                <p className="font-bold text-lg">{rate.name}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <div className="text-green-600 font-bold">${rate.price}</div>
                  <div className="text-yellow-600 font-bold">{rate.points} Pts</div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setIsRateModalOpen(true)}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-yellow-300 bg-yellow-50/50 rounded-xl p-4 hover:bg-yellow-50 hover:border-yellow-500 transition text-yellow-700 min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Add New Rate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-500" /> Banners
          </h2>
          <div className="space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="flex gap-3 p-2 border border-border rounded-lg bg-muted/30">
                <img src={banner.imageUrl} className="w-16 h-10 object-cover rounded bg-white" />
                <div className="flex-1 min-w-0 flex items-center">
                  <p className="text-xs text-muted-foreground truncate">{banner.imageUrl}</p>
                </div>
                <button onClick={() => setBanners(banners.filter(b => b.id !== banner.id))} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Image URL" 
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
                className="flex-1 p-2 text-sm border border-border rounded-lg bg-background"
              />
              <button onClick={addBanner} className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-500" /> Support Links
          </h2>
          <div className="space-y-3">
            {supportLinks.map((link) => (
              <div key={link.id} className="flex justify-between items-center p-3 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-bold text-sm">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
                </div>
                <button onClick={() => setSupportLinks(supportLinks.filter(l => l.id !== link.id))} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Title" 
                value={newSupportLink.title}
                onChange={(e) => setNewSupportLink({...newSupportLink, title: e.target.value})}
                className="w-1/3 p-2 text-sm border border-border rounded-lg bg-background"
              />
              <input 
                type="text" 
                placeholder="URL" 
                value={newSupportLink.url}
                onChange={(e) => setNewSupportLink({...newSupportLink, url: e.target.value})}
                className="flex-1 p-2 text-sm border border-border rounded-lg bg-background"
              />
              <button onClick={addSupportLink} className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-4">Add Currency</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Code (e.g. BTC)" value={newCurrency.code} onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Name (e.g. Bitcoin)" value={newCurrency.name} onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Icon URL" value={newCurrency.iconUrl} onChange={(e) => setNewCurrency({...newCurrency, iconUrl: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsCurrencyModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={addCurrency} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}

      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-4">Add Task Rate</h3>
            <div className="space-y-3">
              <select value={newTaskRate.category} onChange={(e) => setNewTaskRate({...newTaskRate, category: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                <option value="Follow">Follow</option>
                <option value="Engagement">Engagement</option>
              </select>
              <input type="text" placeholder="Task Name" value={newTaskRate.name} onChange={(e) => setNewTaskRate({...newTaskRate, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Price (USDT)" value={newTaskRate.price} onChange={(e) => setNewTaskRate({...newTaskRate, price: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Points Reward" value={newTaskRate.points} onChange={(e) => setNewTaskRate({...newTaskRate, points: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsRateModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={addTaskRate} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}