import React, { useState } from 'react';
import { useUpdatePartner } from '@/hooks/usePartners';
import type { Partner } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

// Simple emoji preset list for avatar selection
const AVATAR_PRESETS = ['👤', '👩', '👨', '🧑', '👱', '🧔', '👵', '👴', '🦊', 'cat', 'dog', 'panda'];

interface PartnerProfileProps {
  partner: Partner;
  onSave?: () => void;
  className?: string;
}

export const PartnerProfile: React.FC<PartnerProfileProps> = ({ partner, onSave, className }) => {
  const [name, setName] = useState(partner.name);
  const [avatar, setAvatar] = useState(partner.avatar_url || '👤');
  const updatePartner = useUpdatePartner();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updatePartner.mutate(
      { id: partner.id, name, avatar_url: avatar },
      {
        onSuccess: () => {
          showToast('success', 'Profil aktualisiert');
          if (onSave) onSave();
        },
        onError: () => {
          showToast('error', 'Fehler beim Speichern');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dusk-700">Avatar</label>
        <div className="flex flex-wrap gap-2">
          {AVATAR_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={cn(
                "w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-colors",
                avatar === emoji 
                  ? "bg-dusk-terracotta text-white" 
                  : "bg-dusk-100 text-dusk-900 hover:bg-dusk-200"
              )}
            >
              {emoji.length > 2 ? (emoji === 'cat' ? '🐱' : emoji === 'dog' ? '🐶' : emoji === 'panda' ? '🐼' : '👤') : emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-dusk-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-dusk-200 focus:outline-none focus:ring-2 focus:ring-dusk-terracotta/50 focus:border-dusk-terracotta"
          placeholder="Dein Name"
          required
        />
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        className="w-full"
        disabled={updatePartner.isPending}
      >
        {updatePartner.isPending ? 'Speichert...' : 'Speichern'}
      </Button>
    </form>
  );
};
