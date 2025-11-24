'use client';

import { useState } from 'react';
import { Megaphone, Pencil, Trash2, Plus, Save, Calendar, Bell } from 'lucide-react';

type AnnouncementType = 'Feature' | 'Update' | 'Important' | 'Reward';

interface Announcement {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  date: string;
}

export default function AdminAnnouncement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'New Dashboard Design',
      description: 'We have updated the user dashboard with a fresh look.',
      type: 'Feature',
      date: '11/24/2025',
    },
    {
      id: '2',
      title: 'Server Maintenance',
      description: 'Scheduled maintenance on Sunday night from 2 AM to 4 AM.',
      type: 'Important',
      date: '11/22/2025',
    },
    {
      id: '3',
      title: 'Referral Bonus',
      description: 'Invite friends and earn double rewards this weekend!',
      type: 'Reward',
      date: '11/20/2025',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Feature' as AnnouncementType,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US');

    if (isEditing && editId) {
      setAnnouncements(
        announcements.map((item) =>
          item.id === editId
            ? { ...item, ...formData }
            : item
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: currentDate,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setFormData({ title: '', description: '', type: 'Feature' });
  };

  const handleEdit = (item: Announcement) => {
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter((item) => item.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', type: 'Feature' });
  };

  const getTypeBadgeStyles = (type: AnnouncementType) => {
    switch (type) {
      case 'Important': return 'bg-red-100 text-red-700 border-red-200';
      case 'Feature': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Reward': return 'bg-green-100 text-green-700 border-green-200';
      case 'Update': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-8 pb-24">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-blue-600" />
        Manage Announcements
      </h1>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {isEditing ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
          {isEditing ? 'Edit Announcement' : 'New Announcement'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: System Maintenance"
                className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="Feature">Feature</option>
                  <option value="Update">Update</option>
                  <option value="Important">Important</option>
                  <option value="Reward">Reward</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Write the details here..."
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
              {isEditing ? 'Update Announcement' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Announcement List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3 w-1/3">Title & Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {announcements.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {item.description}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeStyles(item.type)}`}>
                      {item.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-semibold"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
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

          {announcements.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No announcements found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}