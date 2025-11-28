import React from 'react';
import type { PointsData, TopTask } from '@/types';

export interface PointsComparisonProps {
  partnersData: PointsData[];
  topTasks?: TopTask[];
}

export const PointsComparison: React.FC<PointsComparisonProps> = ({ partnersData, topTasks }) => {
  if (partnersData.length === 0) {
    return (
      <div className="card">
        <p className="text-text-secondary text-center">Keine Daten vorhanden</p>
      </div>
    );
  }
  
  const totalPoints = partnersData.reduce((sum, p) => sum + p.totalPoints, 0);
  const maxPoints = Math.max(...partnersData.map(p => p.totalPoints), 1);
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Punkte-Vergleich</h3>
      
      <div className="space-y-4">
        {partnersData.map((partner, index) => {
          const percentage = totalPoints > 0 ? (partner.totalPoints / totalPoints) * 100 : 0;
          const barWidth = maxPoints > 0 ? (partner.totalPoints / maxPoints) * 100 : 0;
          
          const colorClass = index === 0 ? 'bg-partner-a' : 'bg-partner-b';
          
          return (
            <div key={partner.partnerId}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text">{partner.partnerName}</span>
                <span className="font-bold text-primary text-lg">{partner.totalPoints} Punkte</span>
              </div>
              
              <div className="w-full bg-surface-secondary rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${colorClass} transition-all duration-500 rounded-full`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              
              <p className="text-xs text-text-muted mt-1">
                {partner.completions} Erledigungen • {percentage.toFixed(0)}%
              </p>
            </div>
          );
        })}
      </div>
      
      {totalPoints > 0 && (
        <div className="mt-6 pt-4 border-t border-dusk-200">
          <p className="text-center text-dusk-500 mb-6">
            {partnersData.map((p, i) => (
              <span key={p.partnerId}>
                {i > 0 && ' • '}
                <strong>{((p.totalPoints / totalPoints) * 100).toFixed(0)}%</strong> {p.partnerName}
              </span>
            ))}
          </p>

          {topTasks && topTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-dusk-900 mb-3">Top Aufgaben</h4>
              <div className="space-y-3">
                {topTasks.map((task) => (
                  <div key={task.taskId} className="flex items-center justify-between text-sm">
                    <span className="text-dusk-700 truncate flex-1 mr-2">{task.taskName}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-dusk-900">{task.totalPoints} Pkt</span>
                      <div className="flex -space-x-2">
                        {partnersData.map((partner, idx) => {
                          const count = task.completions[partner.partnerId] || 0;
                          if (count === 0) return null;
                          return (
                            <div 
                              key={partner.partnerId}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white ${idx === 0 ? 'bg-dusk-burgundy' : 'bg-dusk-terracotta'}`}
                              title={`${partner.partnerName}: ${count}`}
                            >
                              {count}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
