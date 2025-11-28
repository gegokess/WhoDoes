import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';
import type { Partner } from '@/types';

/**
 * Fetch all partners in the current household
 */
export const usePartners = () => {
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useQuery({
    queryKey: ['partners', householdId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at');
      
      if (error) throw error;
      return data as Partner[];
    },
    enabled: !!householdId,
  });
};

/**
 * Update a partner's details (name, avatar)
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);

  return useMutation({
    mutationFn: async ({ id, name, avatar_url }: { id: string; name: string; avatar_url: string | null }) => {
      const { data, error } = await supabase
        .from('partners')
        .update({ name, avatar_url })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Partner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', householdId] });
    },
  });
};
