import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNavigation: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tasks', icon: CheckSquare, label: 'Aufgaben' },
    { to: '/points', icon: TrendingUp, label: 'Punkte' },
    { to: '/settings', icon: Settings, label: 'Einstellungen' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around h-18 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-colors min-w-[64px]',
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text hover:bg-surface-secondary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn('text-xs font-medium', isActive && 'font-semibold')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
