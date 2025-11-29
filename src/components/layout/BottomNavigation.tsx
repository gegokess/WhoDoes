import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListTodo, BarChart2, Settings, Mic } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-bottom z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-6 py-2 max-w-lg mx-auto w-full h-[72px]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text'
            }`
          }
        >
          <Home size={26} strokeWidth={2.5} />
        </NavLink>
        
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text'
            }`
          }
        >
          <ListTodo size={26} strokeWidth={2.5} />
        </NavLink>

        {/* Central Action Button (Alexa style) */}
        <div className="flex-1 mx-4">
          <button className="w-full h-12 bg-white border border-border rounded-full flex items-center justify-between px-4 shadow-sm active:scale-[0.98] transition-all group">
            <span className="text-primary font-medium">Quick Add...</span>
            <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
              <Mic size={20} className="text-primary" />
            </div>
          </button>
        </div>

        <NavLink
          to="/points"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text'
            }`
          }
        >
          <BarChart2 size={26} strokeWidth={2.5} />
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text'
            }`
          }
        >
          <Settings size={26} strokeWidth={2.5} />
        </NavLink>
      </div>
    </nav>
  );
};
