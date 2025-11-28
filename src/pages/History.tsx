import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { HistoryList } from '../components/history/HistoryList';
import { TimeRangeFilter } from '../components/points/TimeRangeFilter';
import { useCompletions, useUndoCompletion } from '../hooks/useCompletions';
import { useToast } from '../components/ui/Toast';
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from 'date-fns';
import type { TimeRangeFilter as TimeRangeType } from '../types';

const History: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
  const { showToast } = useToast();
  
  const now = new Date();
  const getDateRange = () => {
    let start: Date;
    
    switch (timeRange) {
      case 'today':
        start = startOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        break;
    }
    
    return {
      startDate: start.toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  };
  
  const { startDate, endDate } = getDateRange();
  const { data: completions = [], isLoading } = useCompletions(startDate, endDate);
  const undoCompletion = useUndoCompletion();
  
  const handleUndo = (completionId: string) => {
    if (confirm('Diese Erledigung wirklich rückgängig machen?')) {
      undoCompletion.mutate(completionId, {
        onSuccess: () => {
          showToast('success', 'Erledigung rückgängig gemacht');
        },
        onError: () => {
          showToast('error', 'Fehler beim Rückgängig machen');
        },
      });
    }
  };
  
  if (isLoading) {
    return (
      <PageLayout header={{ title: 'Verlauf' }}>
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">Laden...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout header={{ title: 'Verlauf' }}>
      <div className="p-6 space-y-6">
        <TimeRangeFilter selected={timeRange} onChange={setTimeRange} />
        
        <HistoryList completions={completions} onUndo={handleUndo} />
      </div>
    </PageLayout>
  );
};

export default History;
