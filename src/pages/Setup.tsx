
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { createHousehold, joinHousehold, createPartner } from '../lib/household';
import { useHouseholdStore } from '../stores/householdStore';
import { PartnerSelector } from '../components/partners/PartnerSelector';
import { usePartners } from '../hooks/usePartners';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { setHousehold, setCurrentPartner } = useHouseholdStore();
  const { data: partners = [] } = usePartners();
  
  const [mode, setMode] = useState<'select' | 'create' | 'join' | 'partner-setup'>('select');
  const [householdName, setHouseholdName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  
  const handleCreateHousehold = async () => {
    if (!householdName.trim()) {
      setError('Bitte Haushalts-Namen eingeben');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const household = await createHousehold(householdName);
      setCreatedCode(household.code);
      setHousehold(household.id, household.code);
      setMode('partner-setup');
    } catch (err) {
      setError('Fehler beim Erstellen des Haushalts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinHousehold = async () => {
    if (!joinCode.trim()) {
      setError('Bitte Code eingeben');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const household = await joinHousehold(joinCode);
      setHousehold(household.id, household.code);
      setMode('partner-setup');
    } catch (err) {
      setError('Ungültiger Code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePartner = async () => {
    if (!partnerName.trim()) {
      setError('Bitte Namen eingeben');
      return;
    }
    
    const householdId = useHouseholdStore.getState().householdId;
    if (!householdId) {
      setError('Kein Haushalt gefunden');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const partner = await createPartner(householdId, partnerName);
      setCurrentPartner(partner.id);
      navigate('/');
    } catch (err) {
      setError('Fehler beim Erstellen des Partners');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPartner = (partnerId: string) => {
    setCurrentPartner(partnerId);
    navigate('/');
  };
  
  if (mode === 'partner-setup') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full card">
          {createdCode && (
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Haushalt erstellt! 🎉</h1>
              <p className="text-text-secondary mb-4">Code für deinen Partner:</p>
              <div className="bg-primary/10 p-4 rounded-2xl inline-block">
                <p className="text-3xl font-mono font-bold text-primary">{createdCode}</p>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold mb-4 text-center">Wer bist du?</h2>
          
          {partners.length > 0 && (
            <div className="mb-6">
              <PartnerSelector onSelect={handleSelectPartner} />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-surface text-text-secondary">oder neu erstellen</span></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Dein Name"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCreatePartner}
              disabled={loading}
            >
              Profil erstellen
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full card">
          <h1 className="text-3xl font-bold mb-2 text-center">Haushalt erstellen</h1>
          <p className="text-text-secondary text-center mb-6">
            Erstellen Sie einen neuen Haushalt
          </p>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Haushalts-Name (z.B. 'Familie Müller')"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCreateHousehold}
              disabled={loading}
            >
              Haushalt erstellen
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setMode('select')}
            >
              Zurück
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full card">
          <h1 className="text-3xl font-bold mb-2 text-center">Haushalt beitreten</h1>
          <p className="text-text-secondary text-center mb-6">
            Geben Sie den Code ein, den Sie erhalten haben
          </p>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="6-stelliger Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-mono font-bold uppercase"
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleJoinHousehold}
              disabled={loading}
            >
              Beitreten
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setMode('select')}
            >
              Zurück
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Select mode
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full card">
        <h1 className="text-4xl font-bold mb-2 text-center">WhoDoes</h1>
        <p className="text-text-secondary text-center mb-8">
          Fair household task tracking for couples
        </p>
        <div className="space-y-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setMode('create')}
          >
            Neuen Haushalt erstellen
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setMode('join')}
          >
            Bestehendem Haushalt beitreten
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
