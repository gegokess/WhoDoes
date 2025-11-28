import type { Task } from '@/types';

export const TASK_TEMPLATES: Omit<Task, 'id' | 'household_id' | 'created_at' | 'updated_at' | 'is_deleted'>[] = [
  { name: '🗑️ Müll rausbringen', points: 3, is_template: true },
  { name: '🧹 Bad putzen', points: 8, is_template: true },
  { name: '🚿 Dusche reinigen', points: 6, is_template: true },
  { name: '🍽️ Geschirrspüler ausräumen', points: 3, is_template: true },
  { name: '🍽️ Geschirrspüler einräumen', points: 2, is_template: true },
  { name: '🧺 Wäsche waschen', points: 5, is_template: true },
  { name: '👕 Wäsche aufhängen', points: 4, is_template: true },
  { name: '👔 Wäsche zusammenlegen', points: 5, is_template: true },
  { name: '🧽 Küche putzen', points: 7, is_template: true },
  { name: '🧹 Staubsaugen', points: 6, is_template: true },
  { name: '🧹 Wischen', points: 7, is_template: true },
  { name: '🛏️ Betten beziehen', points: 5, is_template: true },
  { name: '🪴 Pflanzen gießen', points: 2, is_template: true },
  { name: '🛒 Einkaufen gehen', points: 8, is_template: true },
  { name: '🍳 Kochen', points: 10, is_template: true },
  { name: '🧼 Abwaschen', points: 4, is_template: true },
  { name: '🪟 Fenster putzen', points: 10, is_template: true },
  { name: '🚗 Auto waschen', points: 8, is_template: true },
  { name: '📦 Paket zur Post bringen', points: 5, is_template: true },
  { name: '♻️ Altglas wegbringen', points: 3, is_template: true },
];
