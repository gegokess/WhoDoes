// Core type definitions for WhoDoes

export type TimeRangeFilter = 'today' | 'week' | 'month';

export interface Task {
  id: string;
  household_id: string;
  name: string;
  points: number;
  is_template: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  household_id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Household {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  partner_id: string;
  points_earned: number;
  completed_at: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  partner_id: string;
  task_id: string;
  created_at: string;
}

export interface TaskPointsHistory {
  id: string;
  task_id: string;
  old_points: number;
  new_points: number;
  apply_retroactive: boolean;
  changed_at: string;
}

// UI-specific types
export interface PointsData {
  partnerId: string;
  partnerName: string;
  totalPoints: number;
  completions: number;
}

export interface TopTask {
  taskId: string;
  taskName: string;
  totalPoints: number;
  completions: Record<string, number>; // partnerId -> count
}
