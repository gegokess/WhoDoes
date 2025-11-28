import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';
import type { TaskCompletion } from '@/types';

/**
 * Fetch task completions for the current household
 */
export const useCompletions = (startDate?: string, endDate?: string) => {
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useQuery({
    queryKey: ['completions', householdId, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('task_completions')
        .select(`
          *,
          task:tasks(*),
          partner:partners(*)
        `)
        .order('completed_at', { ascending: false });
      
      if (startDate) {
        query = query.gte('completed_at', startDate);
      }
      if (endDate) {
        query = query.lte('completed_at', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as TaskCompletion[];
    },
    enabled: !!householdId,
  });
};

/**
 * Complete a task
 */
export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useMutation({
    mutationFn: async (completion: {
      task_id: string;
      partner_id: string;
      points_earned: number;
    }) => {
      const { data, error } = await supabase
        .from('task_completions')
        .insert({
          ...completion,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as TaskCompletion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completions', householdId] });
      queryClient.invalidateQueries({ queryKey: ['points', householdId] });
    },
  });
};

/**
 * Undo a task completion
 */
export const useUndoCompletion = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useMutation({
    mutationFn: async (completionId: string) => {
      const { error } = await supabase
        .from('task_completions')
        .delete()
        .eq('id', completionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completions', householdId] });
      queryClient.invalidateQueries({ queryKey: ['points', householdId] });
    },
  });
};
