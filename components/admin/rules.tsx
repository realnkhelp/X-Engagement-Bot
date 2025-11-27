'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Save, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface Rule {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rules');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRules(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) return;

    try {
      if (isEditing && editId) {
        // Update Rule
        await fetch('/api/rules', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...formData }),
        });
      } else {
        // Create Rule
        await fetch('/api/rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      
      setFormData({ title: '', description: '', icon: '' });
      setIsEditing(false);
      setEditId(null);
      fetchRules();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleEdit = (rule: Rule) => {
    setFormData({
      title: rule.title,
      description: rule.description,
      icon: rule.icon
    });
    setIsEditing(true);
    setEditId(rule.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      try {
        await fetch('/api/rules', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        fetchRules();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', icon: '' });
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Rules...</div>;

  return (
    <div className="p-4 space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Rules</h1>
        <button onClick={fetchRules} className="p-2 hover:bg-muted rounded-full">
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

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
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="https://example.com/icon.png"
                    className="w-full p-2 pl-9 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {formData.icon && (
                  <div className="w-10 h-10 rounded border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={formData.icon} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/128/1828/1828665.png')}
                    />
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
          <h3 className="font-semibold">Existing Rules ({rules.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Icon</th>
                <th className="px-4 py-3 w-1/4">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.length === 0 ? (
                <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">No rules created yet.</td></tr>
              ) : rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                      <img 
                        src={rule.icon || 'https://cdn-icons-png.flaticon.com/128/1828/1828665.png'} 
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
        </div>
      </div>
    </div>
  );
}