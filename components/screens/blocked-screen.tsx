'use client';

import { useState, useEffect } from 'react';
import { Headset } from 'lucide-react';

interface BlockedScreenProps {
  user?: any;
}

interface SupportLink {
  id: number;
  title: string;
  url: string;
}

export default function BlockedScreen({ user }: BlockedScreenProps) {
  const [contacts, setContacts] = useState<SupportLink[]>([]);

  useEffect(() => {
    fetch('/api/support')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContacts(data.links);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Handle both camelCase (Prisma) and snake_case (Legacy) just in case
  const firstName = user?.firstName || user?.first_name || '';
  const lastName = user?.lastName || user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || user?.username || 'User';
  
  const displayAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=random&color=fff`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[linear-gradient(135deg,#ffecd2_0%,#fcb69f_100%)]">
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center mb-2">
          <div className="relative mb-4">
            <img 
              src={displayAvatar} 
              alt={fullName}
              className="w-[90px] h-[90px] rounded-full object-cover border-4 border-gray-100 shadow-sm"
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">
            {fullName}
          </h2>
          
          <div className="text-[#d93025] text-sm font-bold uppercase tracking-widest mb-5">
            BLOCKED
          </div>
        </div>

        <div className="bg-[#fdecea] border border-[#f5c6cb] rounded-xl p-4 mb-6 text-left">
          <span className="block text-[#d93025] font-semibold text-[15px] mb-2 leading-tight">
            Your account has been deactivated by the administrator due to multiple reports of incomplete tasks.
          </span>
          <span className="text-gray-600 text-sm leading-relaxed block">
            Note: Should you wish to enhance your performance and ensure successful task completion, please contact the administrator below to reactivate your account.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <a 
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 bg-[#0084ff] hover:bg-[#006bce] text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <Headset className="w-5 h-5 mr-2.5" />
                {contact.title}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-500">No support contacts available.</p>
          )}
        </div>

      </div>
    </div>
  );
}
