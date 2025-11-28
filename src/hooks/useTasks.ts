import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';
import type { Task } from '@/types';

/**
 * Fetch all tasks for the current household
 */
export const useTasks = () => {
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useQuery({
    queryKey: ['tasks', householdId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId)
        .eq('is_deleted', false)
        .order('name');
      
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!householdId,
  });
};

/**
 * Create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useMutation({
    mutationFn: async (task: { name: string; points: number; is_template?: boolean }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          household_id: householdId!,
          name: task.name,
          points: task.points,
          is_template: task.is_template || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', householdId] });
    },
  });
};

/**
 * Update an existing task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', householdId] });
    },
  });
};

/**
 * Soft delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .update({ is_deleted: true })
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', householdId] });
    },
  });
};
