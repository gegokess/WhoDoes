import React from 'react';
import { Plus } from 'lucide-react';

interface ActivityCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  onAction?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  onAction,
}) => {
  return (
    <div 
      className="bg-surface rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className="text-primary">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text truncate">{title}</h3>
        <p className="text-sm text-text-secondary truncate">{subtitle}</p>
      </div>
      
      <button 
        className="bg-primary text-white rounded-full p-1 shadow-sm hover:bg-primary-dark transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onAction?.();
        }}
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
