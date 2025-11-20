import { Shield, AlertCircle, Users, Link, CheckCircle } from 'lucide-react';

export default function RulesScreen() {
  const rules = [
    {
      id: 1,
      icon: AlertCircle,
      title: 'कोई धोखा नहीं',
      description: 'कार्य सत्यापित होने के बाद उसे (जैसे लाइक, फॉलो) पूर्ववत न करें। पकड़े जाने पर खाता बैन कर दिया जाएगा।',
      color: 'text-red-500',
    },
    {
      id: 2,
      icon: Users,
      title: 'एक खाता प्रति उपयोगकर्ता',
      description: 'एकाधिक खातों (Multiple accounts) की अनुमति नहीं है।',
      color: 'text-blue-500',
    },
    {
      id: 3,
      icon: Link,
      title: 'स्पैमिंग नहीं',
      description: 'कृपया गलत या टूटे हुए लिंक के साथ कार्य न बनाएं।',
      color: 'text-orange-500',
    },
    {
      id: 4,
      icon: CheckCircle,
      title: 'सत्यापन (Verification)',
      description: 'सभी कार्यों को पूरा करने का सही प्रमाण (screenshot/link) प्रदान करें।',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="px-4 py-6 space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Rules & Regulations</h1>
      
      <div className="space-y-3">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div key={rule.id} className="bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${rule.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${rule.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{rule.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
