import React from 'react';
import { Plus, Bell } from 'lucide-react';
import { useHouseholdStore } from '../../stores/householdStore';
import { usePartners } from '../../hooks/usePartners';

export interface HeaderProps {
  title?: string;
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Home', action }) => {
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  const { data: partners = [] } = usePartners();
  const currentPartner = partners.find(p => p.id === currentPartnerId);

  // Get initial for avatar
  const initial = currentPartner?.name?.charAt(0).toUpperCase() || '?';

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface z-50 px-4 py-3 flex items-center justify-between safe-area-top shadow-sm">
      <h1 className="text-2xl font-bold text-text">{title}</h1>
      
      <div className="flex items-center gap-4">
        {action}
        <button className="text-text hover:text-primary transition-colors">
          <Plus size={28} strokeWidth={2} />
        </button>
        <button className="text-text hover:text-primary transition-colors">
          <Bell size={26} strokeWidth={2} />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {initial}
        </div>
      </div>
    </header>
  );
};
