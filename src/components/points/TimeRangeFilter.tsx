import React from 'react';
import type { TimeRangeFilter } from '@/types';

export interface TimeRangeFilterProps {
  selected: TimeRangeFilter;
  onChange: (range: TimeRangeFilter) => void;
}

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ selected, onChange }) => {
  const options: { value: TimeRangeFilter; label: string }[] = [
    { value: 'today', label: 'Heute' },
    { value: 'week', label: 'Woche' },
    { value: 'month', label: 'Monat' },
  ];
  
  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-surface rounded-2xl">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            px-6 py-2 rounded-xl font-medium transition-all
            ${selected === value
              ? 'bg-primary text-white shadow-button'
              : 'text-text-secondary hover:text-text hover:bg-surface-secondary'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
