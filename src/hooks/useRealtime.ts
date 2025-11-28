import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';

export const useRealtime = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);

  useEffect(() => {
    if (!householdId) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `household_id=eq.${householdId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_completions',
          // We can't filter by household_id directly on completions if it's not on the table (it is not, it has task_id)
          // But we can just listen to all completions and rely on RLS or just invalidate.
          // However, for efficiency, we might want to filter.
          // But 'task_completions' doesn't have 'household_id'. It links to 'tasks'.
          // So we might just listen to all changes for now, or rely on the fact that RLS prevents us from seeing others' changes anyway?
          // Supabase Realtime respects RLS if enabled.
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['completions'] });
          queryClient.invalidateQueries({ queryKey: ['points'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partners',
          filter: `household_id=eq.${householdId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['partners'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, queryClient]);
};
