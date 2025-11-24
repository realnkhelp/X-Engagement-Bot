'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, Save, Link as LinkIcon } from 'lucide-react';

interface Rule {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      title: 'No Cheating',
      description: 'Do not use any third-party tools or hacks.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/10609/10609386.png',
      isActive: true,
    },
    {
      id: '2',
      title: 'Active Connection',
      description: 'You must have a stable internet connection to complete tasks.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/4577/4577270.png',
      isActive: false,
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) return;

    if (isEditing && editId) {
      setRules(rules.map(rule => 
        rule.id === editId 
          ? { ...rule, ...formData } 
          : rule
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      const newRule: Rule = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        iconUrl: formData.iconUrl || 'https://cdn-icons-png.flaticon.com/128/1828/1828665.png',
        isActive: true
      };
      setRules([newRule, ...rules]);
    }

    setFormData({ title: '', description: '', iconUrl: '' });
  };

  const handleEdit = (rule: Rule) => {
    setFormData({
      title: rule.title,
      description: rule.description,
      iconUrl: rule.iconUrl
    });
    setIsEditing(true);
    setEditId(rule.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', iconUrl: '' });
  };

  return (
    <div className="p-4 space-y-8 pb-24">
      <h1 className="text-2xl font-bold">Manage Rules</h1>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {isEditing ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
          {isEditing ? 'Edit Rule' : 'Create New Rule'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Rule Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: No VPN Allowed"
                className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Icon URL</label>
              <div className="flex gap-2">
                <div className="relative w-full">
                  <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="iconUrl"
                    value={formData.iconUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/icon.png"
                    className="w-full p-2 pl-9 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {formData.iconUrl && (
                  <div className="w-10 h-10 rounded border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <img src={formData.iconUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter brief description of the rule..."
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition flex items-center gap-2
                              ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Update Rule' : 'Add Rule'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="font-semibold">Existing Rules</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Icon</th>
                <th className="px-4 py-3 w-1/4">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 w-24 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                      <img 
                        src={rule.iconUrl} 
                        alt="icon" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/128/1828/1828665.png')}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-foreground">
                    {rule.title}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    <p className="line-clamp-2">{rule.description}</p>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${rule.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${rule.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                    <div className="text-[10px] mt-1 text-muted-foreground uppercase font-bold">
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(rule)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-semibold"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(rule.id)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rules.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No rules found. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}