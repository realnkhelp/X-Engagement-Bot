import { Type as type, LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}

export default function NavigationCard({
  icon: Icon,
  label,
  color,
  onClick,
}: NavigationCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition group cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center transition group-hover:scale-110`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <p className="font-semibold text-sm">{label}</p>
    </button>
  );
}
