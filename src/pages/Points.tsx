import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { PointsComparison } from '../components/points/PointsComparison';
import { TimeRangeFilter } from '../components/points/TimeRangeFilter';
import { usePoints, useTopTasks } from '../hooks/usePoints';
import type { TimeRangeFilter as TimeRangeType } from '../types';

const Points: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
  const { data: pointsData, isLoading: pointsLoading } = usePoints(timeRange);
  const { data: topTasks, isLoading: tasksLoading } = useTopTasks(timeRange);
  
  if (pointsLoading || tasksLoading) {
    return (
      <PageLayout header={{ title: 'Punkte-Vergleich' }}>
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">Laden...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout header={{ title: 'Punkte-Vergleich' }}>
      <div className="p-6 space-y-6">
        <TimeRangeFilter selected={timeRange} onChange={setTimeRange} />
        
        <PointsComparison partnersData={pointsData} topTasks={topTasks} />
        
        {pointsData.reduce((sum, p) => sum + p.totalPoints, 0) === 0 && (
          <div className="card bg-info/10">
            <p className="text-center text-text-secondary">
              Noch keine Erledigungen in diesem Zeitraum.
              <br />
              Beginnt Aufgaben zu erledigen, um Punkte zu sammeln! 🚀
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Points;
