'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, AlertTriangle, Coins, Users, ThumbsUp, Star, X, Wallet, Gift, Image as ImageIcon, MessageCircle } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    bot_name: '',
    min_withdraw: 50,
    onboarding_bonus: 500,
    point_currency_name: 'Points',
    upi_id: '',
    maintenance_mode: false,
    maintenance_message: '',
    maintenance_date: '',
    telegram_channel: 'https://t.me/ads_tasker'
  });

  const [currencies, setCurrencies] = useState<any[]>([]);
  const [taskRates, setTaskRates] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [supportLinks, setSupportLinks] = useState<any[]>([]);

  // Modal States
  const [modalType, setModalType] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings({
          ...settings,
          ...data.settings,
          maintenance_mode: data.settings.maintenance_mode === 1
        });
        setCurrencies(data.currencies || []);
        setTaskRates(data.taskRates || []);
        setBanners(data.banners || []);
        setSupportLinks(data.supportLinks || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'general', ...settings })
      });
      alert('Settings Saved!');
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleAddItem = async (type: string, data: any) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
      });
      if (res.ok) {
        setModalType(null);
        setTempData({});
        fetchData();
      }
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    if(!confirm('Delete this item?')) return;
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8 max-w-5xl pb-24 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button onClick={handleSaveGeneral} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {/* Wallet Currencies Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          Wallet Currencies
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currencies.map((currency) => (
            <div key={currency.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
              <img src={currency.logo || currency.iconUrl} alt={currency.symbol} className="w-10 h-10 object-contain bg-white rounded-full p-1" />
              <div className="flex-1">
                <p className="font-bold text-sm">{currency.name}</p>
                <p className="text-xs text-muted-foreground">{currency.symbol || currency.code}</p>
              </div>
              <button onClick={() => handleDeleteItem('delete_currency', currency.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => { setModalType('currency'); setTempData({ name: '', code: '', iconUrl: '' }); }}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl hover:bg-blue-100/50 hover:border-blue-400 transition min-h-[80px]"
          >
            <div className="bg-blue-100 p-2 rounded-full mb-1">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-blue-700">Add New Currency</span>
          </button>
        </div>
      </div>

      {/* Onboarding Bonus Section (New) */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2 text-purple-600">
          <Gift className="w-5 h-5" />
          Onboarding Bonus
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Registration Reward Amount</label>
            <div className="relative">
              <input
                type="number"
                value={settings.onboarding_bonus}
                onChange={(e) => setSettings({...settings, onboarding_bonus: parseFloat(e.target.value)})}
                className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 outline-none text-lg font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                {settings.point_currency_name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Points given to users when they first join.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Point Currency Name</label>
            <input
              type="text"
              value={settings.point_currency_name}
              onChange={(e) => setSettings({...settings, point_currency_name: e.target.value})}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. Coins, Gems, Points"
            />
            <p className="text-xs text-muted-foreground mt-1">This name will be displayed across the app (Balance, Rewards).</p>
          </div>
        </div>
      </div>

      {/* Task Pricing & Rates Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          Task Pricing & Rates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {taskRates.map((rate) => (
            <div key={rate.id} className="relative group bg-muted/30 border border-border rounded-xl p-4 space-y-2 hover:border-yellow-500 transition">
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-background rounded text-xs font-bold border border-border shadow-sm">
                  {rate.category}
                </span>
                <button onClick={() => handleDeleteItem('delete_rate', rate.id)} className="text-muted-foreground hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-bold text-lg leading-tight">{rate.name}</p>
              <div className="flex gap-3 text-sm pt-1">
                <span className="text-green-600 font-bold bg-green-50 px-1.5 rounded">${Number(rate.price).toFixed(4)}</span>
                <span className="text-yellow-600 font-bold bg-yellow-50 px-1.5 rounded">{rate.points} {settings.point_currency_name}</span>
              </div>
            </div>
          ))}

          <button 
            onClick={() => { setModalType('rate'); setTempData({ category: 'Follow', name: '', price: '', points: '' }); }}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-yellow-300 bg-yellow-50/50 rounded-xl hover:bg-yellow-100/50 hover:border-yellow-500 transition min-h-[120px]"
          >
            <div className="bg-yellow-100 p-2 rounded-full mb-1">
              <Plus className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-bold text-yellow-700">Add New Rate</span>
          </button>
        </div>
      </div>

      {/* Slide Banners Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-500" /> Slide Banners
          </h2>
          <div className="space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="flex gap-3 p-2 border border-border rounded-lg bg-muted/30 items-center">
                <img src={banner.image_url || banner.imageUrl} className="w-16 h-10 object-cover rounded bg-white" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{banner.image_url || banner.imageUrl}</p>
                </div>
                <button onClick={() => handleDeleteItem('delete_banner', banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
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
              <button 
                onClick={() => { if(newBannerUrl) { handleAddItem('add_banner', { imageUrl: newBannerUrl }); setNewBannerUrl(''); }}} 
                className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Support Links Section */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-500" /> Support Links
          </h2>
          
          <div className="space-y-2 mb-4">
            <label className="block text-xs font-bold text-muted-foreground uppercase">Main Telegram Channel</label>
            <input
              type="text"
              value={settings.telegram_channel}
              onChange={(e) => setSettings({...settings, telegram_channel: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-muted-foreground uppercase">Additional Support Links (Blocked Page)</label>
            {supportLinks.map((link) => (
              <div key={link.id} className="flex justify-between items-center p-2.5 border border-border rounded-lg bg-muted/30">
                <div className="min-w-0 flex-1 mr-2">
                  <p className="font-bold text-sm truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <button onClick={() => handleDeleteItem('delete_support', link.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
              <button 
                onClick={() => { if(newSupportLink.title && newSupportLink.url) { handleAddItem('add_support', newSupportLink); setNewSupportLink({title:'', url:''}); }}}
                className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2 text-orange-500">
            <AlertTriangle className="w-5 h-5" />
            Maintenance Mode
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {settings.maintenance_mode && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
              App is currently accessible only to admins. Users will see the maintenance screen.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Expected Completion Date/Time</label>
                <input
                  type="text"
                  placeholder="e.g. 25 Nov, 10:00 PM"
                  value={settings.maintenance_date}
                  onChange={(e) => setSettings({...settings, maintenance_date: e.target.value})}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance Message</label>
                <textarea
                  rows={2}
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings({...settings, maintenance_message: e.target.value})}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Currency Modal */}
      {modalType === 'currency' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-4">Add Currency</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Code (e.g. BTC)" value={tempData.code} onChange={(e) => setTempData({...tempData, code: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Name (e.g. Bitcoin)" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Icon URL" value={tempData.iconUrl} onChange={(e) => setTempData({...tempData, iconUrl: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleAddItem('add_currency', tempData)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Rate Modal */}
      {modalType === 'rate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-4">Add Task Rate</h3>
            <div className="space-y-3">
              <select value={tempData.category} onChange={(e) => setTempData({...tempData, category: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                <option value="Follow">Follow</option>
                <option value="Engagement">Engagement</option>
              </select>
              <input type="text" placeholder="Task Name" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Price (USDT)" value={tempData.price} onChange={(e) => setTempData({...tempData, price: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Points Reward" value={tempData.points} onChange={(e) => setTempData({...tempData, points: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalType(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleAddItem('add_rate', tempData)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}