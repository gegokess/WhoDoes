import React from 'react';
import { Header, type HeaderProps } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  header: HeaderProps;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ header, children, className }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header {...header} />
      <main className={cn('flex-1 overflow-y-auto pb-20', className)}>
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};
