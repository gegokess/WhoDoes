import Dexie, { type Table } from 'dexie';
import type { Task, TaskCompletion, Partner } from '@/types';

// Offline storage interfaces
export interface OfflineTask extends Task {
  synced: boolean;
}

export interface OfflineCompletion extends TaskCompletion {
  synced: boolean;
}

export interface OfflinePartner extends Partner {
  synced: boolean;
}

class WhoDoesDB extends Dexie {
  tasks!: Table<OfflineTask>;
  completions!: Table<OfflineCompletion>;
  partners!: Table<OfflinePartner>;

  constructor() {
    super('WhoDoes');
    this.version(1).stores({
      tasks: 'id, household_id, synced, is_deleted',
      completions: 'id, partner_id, completed_at, synced',
      partners: 'id, household_id, synced',
    });
  }
}

export const db = new WhoDoesDB();
