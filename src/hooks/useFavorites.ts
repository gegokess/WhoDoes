import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';

/**
 * Fetch favorites for the current partner
 */
export const useFavorites = () => {
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  
  return useQuery({
    queryKey: ['favorites', currentPartnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('task_id')
        .eq('partner_id', currentPartnerId);
      
      if (error) throw error;
      return new Set(data.map(f => f.task_id));
    },
    enabled: !!currentPartnerId,
  });
};

/**
 * Toggle a task as favorite
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  
  return useMutation({
    mutationFn: async ({ taskId, isFavorite }: { taskId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('partner_id', currentPartnerId!)
          .eq('task_id', taskId);
        
        if (error) throw error;
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({
            partner_id: currentPartnerId!,
            task_id: taskId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentPartnerId] });
    },
  });
};
