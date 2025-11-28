import { useMemo } from 'react';
import { useCompletions } from './useCompletions';
import { usePartners } from './usePartners';
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from 'date-fns';
import type { TimeRangeFilter, PointsData } from '@/types';

/**
 * Calculate points for partners based on completions
 */
export const usePoints = (timeRange: TimeRangeFilter = 'week') => {
  const now = new Date();
  
  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    let start: Date;
    
    switch (timeRange) {
      case 'today':
        start = startOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        break;
      case 'month':
        start = startOfMonth(now);
        break;
    }
    
    return {
      startDate: start.toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }, [timeRange, now]);
  
  const { data: completions = [], isLoading: completionsLoading } = useCompletions(startDate, endDate);
  const { data: partners = [], isLoading: partnersLoading } = usePartners();
  
  const pointsData: PointsData[] = useMemo(() => {
    return partners.map(partner => {
      const partnerCompletions = completions.filter(c => c.partner_id === partner.id);
      const totalPoints = partnerCompletions.reduce((sum, c) => sum + c.points_earned, 0);
      
      return {
        partnerId: partner.id,
        partnerName: partner.name,
        totalPoints,
        completions: partnerCompletions.length,
      };
    });
  }, [partners, completions]);
  
  return {
    data: pointsData,
    isLoading: completionsLoading || partnersLoading,
  };
};

/**
 * Calculate top tasks based on completions
 */
import { useTasks } from './useTasks';
import type { TopTask } from '@/types';

export const useTopTasks = (timeRange: TimeRangeFilter = 'week') => {
  const now = new Date();
  
  // Calculate date range (duplicated logic, could be extracted)
  const { startDate, endDate } = useMemo(() => {
    let start: Date;
    
    switch (timeRange) {
      case 'today':
        start = startOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        break;
      case 'month':
        start = startOfMonth(now);
        break;
    }
    
    return {
      startDate: start.toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }, [timeRange, now]);
  
  const { data: completions = [], isLoading: completionsLoading } = useCompletions(startDate, endDate);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  
  const topTasks: TopTask[] = useMemo(() => {
    if (!completions.length || !tasks.length) return [];
    
    const taskMap = new Map<string, TopTask>();
    
    completions.forEach(completion => {
      const task = tasks.find(t => t.id === completion.task_id);
      if (!task) return;
      
      if (!taskMap.has(task.id)) {
        taskMap.set(task.id, {
          taskId: task.id,
          taskName: task.name,
          totalPoints: 0,
          completions: {},
        });
      }
      
      const entry = taskMap.get(task.id)!;
      entry.totalPoints += completion.points_earned;
      entry.completions[completion.partner_id] = (entry.completions[completion.partner_id] || 0) + 1;
    });
    
    return Array.from(taskMap.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5); // Top 5
  }, [completions, tasks]);
  
  return {
    data: topTasks,
    isLoading: completionsLoading || tasksLoading,
  };
};
