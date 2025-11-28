import React from 'react';
import { usePartners } from '@/hooks/usePartners';
import { useHouseholdStore } from '@/stores/householdStore';
import { cn } from '@/lib/utils'; // Assuming this exists, standard in shadcn/ui etc. If not I'll check.
import { Check } from 'lucide-react';

interface PartnerSelectorProps {
  onSelect?: (partnerId: string) => void;
  className?: string;
}

export const PartnerSelector: React.FC<PartnerSelectorProps> = ({ onSelect, className }) => {
  const { data: partners, isLoading } = usePartners();
  const { currentPartnerId, setCurrentPartner } = useHouseholdStore();

  const handleSelect = (partnerId: string) => {
    setCurrentPartner(partnerId);
    if (onSelect) {
      onSelect(partnerId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Lade Partner...</div>;
  }

  if (!partners || partners.length === 0) {
    return <div className="text-center p-4 text-dusk-400">Keine Partner gefunden.</div>;
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {partners.map((partner) => {
        const isSelected = currentPartnerId === partner.id;
        
        return (
          <button
            key={partner.id}
            onClick={() => handleSelect(partner.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200",
              "border-2",
              isSelected 
                ? "border-dusk-terracotta bg-dusk-terracotta/10" 
                : "border-dusk-200 bg-white hover:border-dusk-300 hover:bg-dusk-50"
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 text-dusk-terracotta">
                <Check size={20} />
              </div>
            )}
            
            <div className="w-20 h-20 rounded-full bg-dusk-100 flex items-center justify-center text-3xl mb-3 shadow-sm">
              {partner.avatar_url || '👤'}
            </div>
            
            <span className={cn(
              "font-medium text-lg",
              isSelected ? "text-dusk-terracotta" : "text-dusk-900"
            )}>
              {partner.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
