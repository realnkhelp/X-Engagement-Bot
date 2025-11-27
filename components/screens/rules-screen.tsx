'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function RulesScreen() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading Rules...</div>;
  }

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div className="text-center space-y-2 mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold">Rules & Regulations</h1>
        <p className="text-muted-foreground text-sm">Follow these rules to keep your account safe.</p>
      </div>
      
      <div className="space-y-4">
        {rules.length === 0 ? (
          <p className="text-center text-muted-foreground">No rules added yet.</p>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800 p-2 flex-shrink-0 flex items-center justify-center border border-border">
                  <img 
                    src={rule.icon || 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'} 
                    alt="icon" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-lg">{rule.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{rule.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
