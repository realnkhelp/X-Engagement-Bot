import { Headset } from 'lucide-react';

interface BlockedScreenProps {
  user: {
    name: string;
    avatar?: string;
  };
  supportContacts?: { name: string; link: string }[];
}

export default function BlockedScreen({ user, supportContacts = [] }: BlockedScreenProps) {
  
  const defaultContacts = [
    { name: "Contact Nitesh", link: "https://t.me/niteshadmin" },
    { name: "Contact Muzakkir", link: "https://t.me/muzakkir_04" }
  ];

  const contactsToDisplay = supportContacts.length > 0 ? supportContacts : defaultContacts;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[linear-gradient(135deg,#ffecd2_0%,#fcb69f_100%)]">
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center mb-2">
          <div className="relative mb-4">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt={user.name}
              className="w-[90px] h-[90px] rounded-full object-cover border-4 border-gray-100 shadow-sm"
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">
            {user.name}
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
          {contactsToDisplay.map((contact, index) => (
            <a 
              key={index}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3.5 bg-[#0084ff] hover:bg-[#006bce] text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Headset className="w-5 h-5 mr-2.5" />
              {contact.name}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}