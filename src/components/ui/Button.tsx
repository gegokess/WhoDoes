import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-white shadow-button hover:bg-primary-dark hover:shadow-button-hover',
      secondary: 'bg-surface border border-border text-text shadow-sm hover:bg-surface-secondary hover:shadow-md',
      accent: 'bg-accent text-white hover:bg-accent-hover shadow-button',
      icon: 'bg-transparent hover:bg-surface text-text-secondary rounded-xl',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-7 py-3.5 text-base min-h-[56px]',
      lg: 'px-8 py-4 text-lg min-h-[64px]',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
