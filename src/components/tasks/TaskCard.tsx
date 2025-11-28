import React from 'react';
import { Star, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Task } from '@/types';

export interface TaskCardProps {
  task: Task;
  isFavorite?: boolean;
  onComplete?: (taskId: string, points: number) => void;
  onToggleFavorite?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isFavorite = false,
  onComplete,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  return (
    <Card variant="standard" className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text">{task.name}</h3>
          <p className="text-sm text-primary font-medium">{task.points} Punkte</p>
        </div>
        
        <button
          onClick={() => onToggleFavorite?.(task.id)}
          className="p-2 rounded-lg hover:bg-surface-secondary transition-colors"
          aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
        >
          <Star
            size={24}
            className={isFavorite ? 'text-warning fill-warning' : 'text-text-muted'}
          />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Button
          variant="accent"
          size="sm"
          onClick={() => onComplete?.(task.id, task.points)}
          className="flex-1"
        >
          <Check size={18} className="mr-1" />
          Erledigen
        </Button>
        
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Bearbeiten
          </Button>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg hover:bg-error/10 transition-colors"
            aria-label="Aufgabe löschen"
          >
            <Trash2 size={18} className="text-error" />
          </button>
        )}
      </div>
    </Card>
  );
};
