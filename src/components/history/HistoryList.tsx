import React from 'react';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { HistoryItem } from './HistoryItem';
import type { TaskCompletion } from '@/types';

export interface HistoryListProps {
  completions: (TaskCompletion & {
    task?: { name: string };
    partner?: { name: string };
  })[];
  onUndo?: (completionId: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ completions, onUndo }) => {
  if (completions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">Noch keine Erledigungen</p>
        <p className="text-text-muted text-sm mt-2">
          Beginne Aufgaben zu erledigen, um sie hier zu sehen
        </p>
      </div>
    );
  }
  
  // Group completions by day
  const groupedByDay = completions.reduce((groups, completion) => {
    const date = startOfDay(new Date(completion.completed_at));
    const key = date.toISOString();
    
    if (!groups[key]) {
      groups[key] = {
        date,
        completions: [],
      };
    }
    
    groups[key].completions.push(completion);
    return groups;
  }, {} as Record<string, { date: Date; completions: typeof completions }>);
  
  const sortedDays = Object.values(groupedByDay).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  
  const getDayLabel = (date: Date) => {
    if (isToday(date)) return 'Heute';
    if (isYesterday(date)) return 'Gestern';
    return format(date, 'EEEE, dd. MMMM yyyy', { locale: de });
  };
  
  return (
    <div className="space-y-6">
      {sortedDays.map(({ date, completions: dayCompletions }) => (
        <div key={date.toISOString()}>
          <h3 className="text-lg font-semibold text-text mb-3 px-6">
            {getDayLabel(date)}
          </h3>
          <div className="space-y-2 px-6">
            {dayCompletions.map((completion, index) => (
              <HistoryItem
                key={completion.id}
                completion={completion}
                partnerColor={index % 2 === 0 ? 'partner-a' : 'partner-b'}
                onUndo={onUndo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
