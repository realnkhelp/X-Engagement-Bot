'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, AlertTriangle, Coins, Users, ThumbsUp, Star, X, Check, Wallet } from 'lucide-react';

interface Currency {
  id: number;
  code: string;
  name: string;
  iconUrl: string;
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

interface TaskRate {
  id: number;
  category: 'Follow' | 'Engagement';
  name: string;
  price: number;
  points: number;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    telegramLink: 'https://t.me/ads_tasker',
    maintenanceMode: false,
    maintenanceDate: '',
    maintenanceMessage: 'We are currently undergoing scheduled maintenance.',
  });

  const [currencies, setCurrencies] = useState<Currency[]>([
    { id: 1, code: 'USDC', name: 'USD Coin', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
    { id: 2, code: 'BTC', name: 'Bitcoin', iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' }
  ]);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', iconUrl: '' });

  const [taskRates, setTaskRates] = useState<TaskRate[]>([
    { id: 1, category: 'Follow', name: 'Twitter Follow', price: 0.0040, points: 10 },
    { id: 2, category: 'Engagement', name: 'Like', price: 0.0030, points: 5 },
    { id: 3, category: 'Engagement', name: 'Retweet', price: 0.0055, points: 15 },
  ]);

  const [newTaskRate, setNewTaskRate] = useState<{ category: 'Follow' | 'Engagement'; name: string; price: string; points: string }>({
    category: 'Engagement',
    name: '',
    price: '',
    points: ''
  });

  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, imageUrl: 'https://i.ibb.co/HDwhQ3QX/20251023-125919.jpg' },
    { id: 2, imageUrl: 'https://i.ibb.co/yn1tb0hG/20251023-130113-1.jpg' },
  ]);
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);

  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([
    { id: 1, title: 'Support Chat', url: 'https://t.me/adstasker_support' },
    { id: 2, title: 'Twitter', url: 'https://twitter.com/DefiTasker' },
  ]);
  const [newSupportLink, setNewSupportLink] = useState({ title: '', url: '' });

  const addCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.iconUrl) {
      setCurrencies([...currencies, { id: Date.now(), ...newCurrency }]);
      setNewCurrency({ code: '', name: '', iconUrl: '' });
    }
  };

  const deleteCurrency = (id: number) => {
    setCurrencies(currencies.filter(c => c.id !== id));
  };

  const addTaskRate = () => {
    if (newTaskRate.name && newTaskRate.price && newTaskRate.points) {
      setTaskRates([
        ...taskRates,
        {
          id: Date.now(),
          category: newTaskRate.category,
          name: newTaskRate.name,
          price: parseFloat(newTaskRate.price),
          points: parseInt(newTaskRate.points)
        }
      ]);
      setNewTaskRate({ ...newTaskRate, name: '', price: '', points: '' });
    }
  };

  const deleteTaskRate = (id: number) => {
    setTaskRates(taskRates.filter(r => r.id !== id));
  };

  const handleBannerSubmit = () => {
    if (!newBannerUrl) return;

    if (editingBannerId) {
      setBanners(banners.map(b => b.id === editingBannerId ? { ...b, imageUrl: newBannerUrl } : b));
      setEditingBannerId(null);
    } else {
      setBanners([...banners, { id: Date.now(), imageUrl: newBannerUrl }]);
    }
    setNewBannerUrl('');
  };

  const startEditBanner = (banner: Banner) => {
    setNewBannerUrl(banner.imageUrl);
    setEditingBannerId(banner.id);
  };

  const cancelEditBanner = () => {
    setNewBannerUrl('');
    setEditingBannerId(null);
  };

  const deleteBanner = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
    if (editingBannerId === id) cancelEditBanner();
  };

  const addSupportLink = () => {
    if (newSupportLink.title && newSupportLink.url) {
      setSupportLinks([...supportLinks, { id: Date.now(), ...newSupportLink }]);
      setNewSupportLink({ title: '', url: '' });
    }
  };

  const deleteSupportLink = (id: number) => {
    setSupportLinks(supportLinks.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          Wallet Currencies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currencies.map((currency) => (
            <div key={currency.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
              <img src={currency.iconUrl} alt={currency.code} className="w-10 h-10 object-contain bg-white rounded-full p-1" />
              <div className="flex-1">
                <p className="font-bold text-sm">{currency.name}</p>
                <p className="text-xs text-muted-foreground">{currency.code}</p>
              </div>
              <button onClick={() => deleteCurrency(currency.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Currency Code</label>
            <input
              type="text"
              placeholder="e.g. BTC"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value})}
              className="w-full p-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Currency Name</label>
            <input
              type="text"
              placeholder="e.g. Bitcoin"
              value={newCurrency.name}
              onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
              className="w-full p-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Icon URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={newCurrency.iconUrl}
                onChange={(e) => setNewCurrency({...newCurrency, iconUrl: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={addCurrency} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition h-[38px] w-[38px] flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          Task Pricing & Rates
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-3 text-center">
            <div className="col-span-3 text-left">Category</div>
            <div className="col-span-4 text-left">Task Name</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Points</div>
            <div className="col-span-1">Action</div>
          </div>

          {taskRates.map((rate) => (
            <div key={rate.id} className="grid grid-cols-12 items-center gap-4 p-3 border border-border rounded-lg bg-muted/30 text-center">
              <div className="col-span-3 text-left">
                <span className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1.5 ${
                  rate.category === 'Follow' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {rate.category === 'Follow' ? <Users className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />}
                  {rate.category}
                </span>
              </div>
              <div className="col-span-4 text-sm font-semibold truncate text-left pl-2">{rate.name}</div>
              <div className="col-span-2 text-sm font-bold text-green-600 dark:text-green-400">
                {rate.price.toFixed(4)}
              </div>
              <div className="col-span-2 text-sm font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500" />
                {rate.points}
              </div>
              <div className="col-span-1 text-right">
                <button onClick={() => deleteTaskRate(rate.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setNewTaskRate({ ...newTaskRate, category: 'Follow' })}
              className={`flex-1 py-2 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition ${
                newTaskRate.category === 'Follow'
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
              }`}
            >
              <Users className="w-4 h-4" />
              Follow
            </button>
            <button
              onClick={() => setNewTaskRate({ ...newTaskRate, category: 'Engagement' })}
              className={`flex-1 py-2 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition ${
                newTaskRate.category === 'Engagement'
                  ? 'bg-purple-500 text-white border-purple-600'
                  : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Engagement
            </button>
          </div>

          <div className="flex gap-3 items-end">
            <div className="w-1/3">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Task Name</label>
              <input
                type="text"
                placeholder="e.g. Like"
                value={newTaskRate.name}
                onChange={(e) => setNewTaskRate({...newTaskRate, name: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Price</label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.0050"
                value={newTaskRate.price}
                onChange={(e) => setNewTaskRate({...newTaskRate, price: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Points</label>
              <input
                type="number"
                placeholder="10"
                value={newTaskRate.points}
                onChange={(e) => setNewTaskRate({...newTaskRate, points: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button 
              onClick={addTaskRate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition h-[38px]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2">Slide Banners</h2>
        
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${editingBannerId === banner.id ? 'border-blue-500 bg-blue-50/50' : 'border-border bg-muted/30'}`}>
              <img src={banner.imageUrl} alt="Banner" className="w-24 h-12 object-cover rounded border border-border bg-white" />
              <div className="flex-1 truncate text-sm text-muted-foreground">{banner.imageUrl}</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => startEditBanner(banner)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteBanner(banner.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {editingBannerId ? 'Edit Banner URL' : 'Add New Banner URL'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className={`w-full p-2 pr-10 rounded-lg border bg-background focus:outline-none focus:ring-2 ${editingBannerId ? 'border-blue-300 focus:ring-blue-500' : 'border-border focus:ring-blue-500'}`}
              />
              {editingBannerId && (
                <button 
                  onClick={cancelEditBanner}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={handleBannerSubmit}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition text-white ${editingBannerId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {editingBannerId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingBannerId ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2">Support & Community Links</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Main Telegram Channel</label>
          <input
            type="text"
            value={settings.telegramLink}
            onChange={(e) => setSettings({...settings, telegramLink: e.target.value})}
            className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-muted-foreground">Additional Support Links</label>
          {supportLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3">
              <div className="w-1/3 p-2 bg-muted rounded-lg text-sm font-medium">{link.title}</div>
              <div className="flex-1 p-2 bg-muted rounded-lg text-sm truncate text-muted-foreground">{link.url}</div>
              <button onClick={() => deleteSupportLink(link.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="flex gap-2 items-end pt-2">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="Title (e.g., Admin Support)"
                value={newSupportLink.title}
                onChange={(e) => setNewSupportLink({...newSupportLink, title: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="URL (e.g., https://t.me/...)"
                value={newSupportLink.url}
                onChange={(e) => setNewSupportLink({...newSupportLink, url: e.target.value})}
                className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button 
              onClick={addSupportLink}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Maintenance Mode
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.maintenanceMode && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
              App is currently accessible only to admins. Users will see the maintenance screen.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Expected Completion Time</label>
                <input
                  type="datetime-local"
                  value={settings.maintenanceDate}
                  onChange={(e) => setSettings({...settings, maintenanceDate: e.target.value})}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance Message</label>
                <textarea
                  rows={3}
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
