import React from 'react';
import { MoreVertical } from 'lucide-react';

interface FavoriteCardProps {
  icon?: React.ReactNode;
  title: string;
  status?: string;
  onClick?: () => void;
  onMore?: () => void;
  className?: string;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  icon,
  title,
  status,
  onClick,
  onMore,
  className = '',
}) => {
  return (
    <div 
      className={`bg-surface rounded-xl p-4 shadow-card flex flex-col justify-between h-32 cursor-pointer active:scale-[0.98] transition-transform ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-text truncate w-full">{title}</h3>
          {status && <p className="text-sm text-text-secondary">{status}</p>}
        </div>
        
        {onMore && (
          <button 
            className="text-text-muted hover:text-text p-1 -mr-2 -mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onMore();
            }}
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>
      
      <div className="text-text-secondary">
        {icon}
      </div>
    </div>
  );
};
