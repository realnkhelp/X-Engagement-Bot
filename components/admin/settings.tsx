'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';

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
  const [settings, setSettings] = useState({
    currencyName: 'USDC',
    telegramLink: 'https://t.me/ads_tasker',
    maintenanceMode: false,
    maintenanceDate: '',
    maintenanceMessage: 'We are currently undergoing scheduled maintenance.',
  });

  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, imageUrl: 'https://i.ibb.co/HDwhQ3QX/20251023-125919.jpg' },
    { id: 2, imageUrl: 'https://i.ibb.co/yn1tb0hG/20251023-130113-1.jpg' },
  ]);
  const [newBannerUrl, setNewBannerUrl] = useState('');

  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([
    { id: 1, title: 'Support Chat', url: 'https://t.me/adstasker_support' },
    { id: 2, title: 'Twitter', url: 'https://twitter.com/DefiTasker' },
  ]);
  const [newSupportLink, setNewSupportLink] = useState({ title: '', url: '' });

  const addBanner = () => {
    if (newBannerUrl) {
      setBanners([...banners, { id: Date.now(), imageUrl: newBannerUrl }]);
      setNewBannerUrl('');
    }
  };

  const deleteBanner = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
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
        <h2 className="text-lg font-bold border-b border-border pb-2">System Settings</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Currency Name</label>
          <input
            type="text"
            value={settings.currencyName}
            onChange={(e) => setSettings({...settings, currencyName: e.target.value})}
            className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-2">Slide Banners</h2>
        
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center gap-4 p-3 border border-border rounded-lg bg-muted/30">
              <img src={banner.imageUrl} alt="Banner" className="w-24 h-12 object-cover rounded border border-border" />
              <div className="flex-1 truncate text-sm text-muted-foreground">{banner.imageUrl}</div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition">
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
            <label className="block text-sm font-medium mb-1">Add New Banner URL</label>
            <input
              type="text"
              value={newBannerUrl}
              onChange={(e) => setNewBannerUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={addBanner}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> Add
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