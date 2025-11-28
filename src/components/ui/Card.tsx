import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'compact' | 'completion' | 'info';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'standard', children, ...props }, ref) => {
    const variants = {
      standard: 'bg-surface rounded-4xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all',
      compact: 'bg-surface rounded-2xl p-4 shadow-sm',
      completion: 'bg-surface rounded-xl p-3.5 shadow-sm border-l-4',
      info: 'bg-surface-secondary rounded-4xl p-6 shadow-sm',
    };
    
    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
