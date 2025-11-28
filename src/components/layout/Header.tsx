import React from 'react';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  title: string;
  action?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  action, 
  className 
}) => {
  return (
    <header className={cn('bg-surface border-b border-border px-6 py-4 safe-area-top', className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
};
