import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HouseholdState {
  householdId: string | null;
  householdCode: string | null;
  currentPartnerId: string | null;
  setHousehold: (id: string, code: string) => void;
  setCurrentPartner: (partnerId: string) => void;
  reset: () => void;
}

export const useHouseholdStore = create<HouseholdState>()(
  persist(
    (set) => ({
      householdId: null,
      householdCode: null,
      currentPartnerId: null,
      
      setHousehold: (id, code) => {
        set({ householdId: id, householdCode: code });
        localStorage.setItem('household_id', id);
        localStorage.setItem('household_code', code);
      },
      
      setCurrentPartner: (partnerId) => {
        set({ currentPartnerId: partnerId });
        localStorage.setItem('current_partner_id', partnerId);
      },
      
      reset: () => {
        set({ householdId: null, householdCode: null, currentPartnerId: null });
        localStorage.removeItem('household_id');
        localStorage.removeItem('household_code');
        localStorage.removeItem('current_partner_id');
      },
    }),
    {
      name: 'whodoes-household-storage',
    }
  )
);
