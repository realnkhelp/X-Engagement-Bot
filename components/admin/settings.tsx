import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'X Engagement',
    currencyName: 'Points',
    currencySymbol: 'PT',
    maintenanceMode: false,
    platformFee: 5,
    maxDepositLimit: 10000,
  });

  const [bannerUrl, setBannerUrl] = useState('');

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold">General Settings</h2>

        <div>
          <label className="block text-sm font-semibold mb-2">App Name</label>
          <input
            type="text"
            value={settings.appName}
            onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Currency Name</label>
            <input
              type="text"
              value={settings.currencyName}
              onChange={(e) => setSettings({ ...settings, currencyName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Currency Symbol</label>
            <input
              type="text"
              value={settings.currencySymbol}
              onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Platform Fee (%)</label>
            <input
              type="number"
              value={settings.platformFee}
              onChange={(e) => setSettings({ ...settings, platformFee: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Max Deposit Limit</label>
            <input
              type="number"
              value={settings.maxDepositLimit}
              onChange={(e) => setSettings({ ...settings, maxDepositLimit: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <input
            type="checkbox"
            id="maintenance"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="maintenance" className="cursor-pointer flex-1">
            <p className="font-semibold text-sm">Maintenance Mode</p>
            <p className="text-xs text-muted-foreground">Users will see maintenance page</p>
          </label>
        </div>
      </div>

      {/* Banner Management */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold">Banner Management</h2>

        <div>
          <label className="block text-sm font-semibold mb-2">Banner Image URL</label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {bannerUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
            <img src={bannerUrl || "/placeholder.svg"} alt="Banner Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <button className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
          Update Banner
        </button>
      </div>

      {/* Save Settings */}
      <button className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
        <Save className="w-5 h-5" />
        Save All Settings
      </button>
    </div>
  );
}
