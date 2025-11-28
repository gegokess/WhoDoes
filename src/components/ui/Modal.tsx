import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={cn(
          'relative w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl p-6 shadow-lg animate-slide-up',
          'max-h-[80vh] overflow-y-auto',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-secondary transition-colors"
          >
            <X size={24} className="text-text-secondary" />
          </button>
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
