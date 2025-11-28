import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '@/types';

export interface TaskListProps {
  tasks: Task[];
  favorites: Set<string>;
  onComplete: (taskId: string, points: number) => void;
  onToggleFavorite: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  favorites,
  onComplete,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  const favoriteTasks = tasks.filter(t => favorites.has(t.id));
  const otherTasks = tasks.filter(t => !favorites.has(t.id));
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">Keine Aufgaben vorhanden</p>
        <p className="text-text-muted text-sm mt-2">
          Erstelle deine erste Aufgabe mit dem + Button
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {favoriteTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text mb-3 px-6">⭐ Favoriten</h2>
          <div className="space-y-3 px-6">
            {favoriteTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isFavorite={true}
                onComplete={onComplete}
                onToggleFavorite={onToggleFavorite}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
      
      {otherTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text mb-3 px-6">
            {favoriteTasks.length > 0 ? 'Alle Aufgaben' : 'Aufgaben'}
          </h2>
          <div className="space-y-3 px-6">
            {otherTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isFavorite={false}
                onComplete={onComplete}
                onToggleFavorite={onToggleFavorite}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
