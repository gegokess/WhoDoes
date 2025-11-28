import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useHouseholdStore } from '../stores/householdStore';
import { Button } from '../components/ui/Button';

import { PartnerProfile } from '../components/partners/PartnerProfile';
import { usePartners } from '../hooks/usePartners';

const Settings: React.FC = () => {
  const { householdCode, reset, currentPartnerId } = useHouseholdStore();
  const { data: partners = [] } = usePartners();
  
  const currentPartner = partners.find(p => p.id === currentPartnerId);
  
  const handleReset = () => {
    if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
      reset();
      window.location.href = '/setup';
    }
  };
  
  return (
    <PageLayout header={{ title: 'Einstellungen' }}>
      <div className="p-6 space-y-6">
        {currentPartner && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Dein Profil</h3>
            <PartnerProfile partner={currentPartner} />
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Haushalt</h3>
          <p className="text-sm text-text-secondary mb-2">Haushalts-Code:</p>
          <p className="text-2xl font-mono font-bold text-primary">{householdCode || 'N/A'}</p>
        </div>
        
        <div className="card bg-error/10">
          <h3 className="text-lg font-semibold mb-2 text-error">Gefahrenzone</h3>
          <p className="text-sm text-text-secondary mb-4">
            Achtung: Dies setzt alle lokalen Daten zurück!
          </p>
          <Button variant="secondary" onClick={handleReset}>
            App zurücksetzen
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
