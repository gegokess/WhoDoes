import { nanoid } from 'nanoid';
import type { Task, Partner, TaskCompletion } from '@/types';

export const mockHouseholdId = 'test-household-id';

export const mockPartners: Partner[] = [
  {
    id: 'partner-1',
    household_id: mockHouseholdId,
    name: 'Alex',
    avatar_url: '👨',
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-2',
    household_id: mockHouseholdId,
    name: 'Sam',
    avatar_url: '👩',
    created_at: new Date().toISOString(),
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    household_id: mockHouseholdId,
    name: 'Müll rausbringen',
    points: 5,
    is_template: false,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    household_id: mockHouseholdId,
    name: 'Geschirrspüler ausräumen',
    points: 3,
    is_template: false,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    household_id: mockHouseholdId,
    name: 'Bad putzen',
    points: 8,
    is_template: false,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const generateMockCompletions = (count: number): TaskCompletion[] => {
  return Array.from({ length: count }).map(() => {
    const task = mockTasks[Math.floor(Math.random() * mockTasks.length)];
    const partner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
    
    return {
      id: nanoid(),
      task_id: task.id,
      partner_id: partner.id,
      points_earned: task.points,
      completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
      created_at: new Date().toISOString(),
    };
  });
};
