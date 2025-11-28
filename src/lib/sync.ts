import { supabase } from './supabase';
import { db } from './db';

/**
 * Sync offline data to Supabase when connection is restored
 */
export const syncOfflineData = async (_householdId: string) => {
  try {
    // Sync unsynced completions
    const unsyncedCompletions = await db.completions
      .filter(c => c.synced === false)
      .toArray();
    
    for (const completion of unsyncedCompletions) {
      try {
        const { error } = await supabase
          .from('task_completions')
          .insert({
            task_id: completion.task_id,
            partner_id: completion.partner_id,
            points_earned: completion.points_earned,
            completed_at: completion.completed_at,
          });
        
        if (!error) {
          // Mark as synced
          await db.completions.update(completion.id, { synced: true });
        }
      } catch (err) {
        console.error('Failed to sync completion:', completion.id, err);
      }
    }
    
    // Sync unsynced tasks (if any were created offline)
    const unsyncedTasks = await db.tasks
      .filter(t => t.synced === false)
      .toArray();
    
    for (const task of unsyncedTasks) {
      try {
        const { error } = await supabase
          .from('tasks')
          .insert({
            household_id: task.household_id,
            name: task.name,
            points: task.points,
            is_template: task.is_template,
          });
        
        if (!error) {
          await db.tasks.update(task.id, { synced: true });
        }
      } catch (err) {
        console.error('Failed to sync task:', task.id, err);
      }
    }
    
    console.log('Offline sync completed');
  } catch (err) {
    console.error('Offline sync failed:', err);
  }
};

/**
 * Check if online
 */
export const isOnline = () => navigator.onLine;

/**
 * Setup auto-sync listeners
 */
export const setupAutoSync = () => {
  window.addEventListener('online', () => {
    console.log('Connection restored, syncing offline data...');
    const householdId = localStorage.getItem('household_id');
    if (householdId) {
      syncOfflineData(householdId);
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('Connection lost, entering offline mode');
  });
};
