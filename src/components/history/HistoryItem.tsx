import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card } from '../ui/Card';
import type { TaskCompletion } from '@/types';

export interface HistoryItemProps {
  completion: TaskCompletion & {
    task?: { name: string };
    partner?: { name: string };
  };
  partnerColor: string;
  onUndo?: (completionId: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  completion,
  partnerColor,
  onUndo,
}) => {
  const taskName = completion.task?.name || 'Unbekannte Aufgabe';
  const partnerName = completion.partner?.name || 'Unbekannt';
  const completedAt = new Date(completion.completed_at);
  
  return (
    <Card variant="completion" className={`border-l-${partnerColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-text mb-1">{taskName}</h4>
          <p className="text-sm text-text-secondary">
            {partnerName} • {completion.points_earned} Punkte
          </p>
          <p className="text-xs text-text-muted mt-1">
            {format(completedAt, 'EEEE, dd.MM.yyyy • HH:mm', { locale: de })} Uhr
          </p>
        </div>
        
        {onUndo && (
          <button
            onClick={() => onUndo(completion.id)}
            className="text-xs text-error hover:underline ml-4"
          >
            Rückgängig
          </button>
        )}
      </div>
    </Card>
  );
};
