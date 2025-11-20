import { Bell } from 'lucide-react';

export default function AnnouncementsScreen() {
  const announcements = [
    {
      id: 1,
      title: 'नई सुविधाएँ जोड़ी गई',
      description: 'अब आप पेड़ टास्क बना सकते हैं और अपनी टास्क की विजिबिलिटी बढ़ा सकते हैं।',
      category: 'feature',
      date: '15 Jan 2024',
    },
    {
      id: 2,
      title: 'सिस्टम अपडेट',
      description: 'बेहतर परफॉर्मेंस के लिए सिस्टम अपडेट किया गया है। अब टास्क तेजी से लोड होगा।',
      category: 'update',
      date: '10 Jan 2024',
    },
    {
      id: 3,
      title: 'नए नियम',
      description: 'कृपया नियम पेज पर जाएं और अपडेटेड दिशानिर्देश पढ़ें।',
      category: 'important',
      date: '5 Jan 2024',
    },
    {
      id: 4,
      title: 'रिवॉर्ड प्रोग्राम',
      description: 'सबसे ज्यादा टास्क कंप्लीट करने वाले यूजर्स को बोनस मिलेगा।',
      category: 'reward',
      date: '1 Jan 2024',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      feature: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      important: 'bg-red-100 text-red-700',
      reward: 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>
      
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-card border border-border rounded-xl p-4 space-y-2 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-bold text-foreground">{announcement.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{announcement.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getCategoryColor(announcement.category)}`}>
                {announcement.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
