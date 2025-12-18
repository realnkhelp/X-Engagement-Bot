'use client';

import { useState, useEffect } from 'react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.announcements);
        }
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      feature: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      important: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      reward: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading Updates...</div>;
  }

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Updates</h1>
      
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-center text-muted-foreground">No updates available.</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-card border border-border rounded-xl p-4 space-y-2 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-foreground">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{announcement.message}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {formatDate(announcement.createdAt)}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap uppercase tracking-wide ${getCategoryColor(announcement.category)}`}>
                  {announcement.category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
