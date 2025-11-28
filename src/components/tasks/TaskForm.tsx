import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Task } from '@/types';

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; points: number }) => void;
  task?: Task;
  title?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  title = 'Neue Aufgabe',
}) => {
  const [name, setName] = useState(task?.name || '');
  const [points, setPoints] = useState(task?.points || 5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Bitte einen Namen eingeben');
      return;
    }
    
    if (points < 1) {
      alert('Mindestens 1 Punkt erforderlich');
      return;
    }
    
    onSubmit({ name: name.trim(), points });
    
    // Reset form
    setName('');
    setPoints(5);
    onClose();
  };
  
  const incrementPoints = () => setPoints(p => Math.min(p + 1, 50));
  const decrementPoints = () => setPoints(p => Math.max(p - 1, 1));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-name" className="block text-sm font-medium text-text-secondary mb-2">
            Aufgabenname
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Müll rausbringen"
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="task-points" className="block text-sm font-medium text-text-secondary mb-2">
            Punkte
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decrementPoints}
              className="w-12 h-12 rounded-xl border border-border hover:bg-surface-secondary flex items-center justify-center text-xl font-semibold transition-colors"
            >
              −
            </button>
            
            <input
              id="task-points"
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              min="1"
              max="50"
              className="flex-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-center text-xl font-semibold"
            />
            
            <button
              type="button"
              onClick={incrementPoints}
              className="w-12 h-12 rounded-xl border border-border hover:bg-surface-secondary flex items-center justify-center text-xl font-semibold transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            1-50 Punkte (höhere Zahl = mehr Aufwand)
          </p>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Abbrechen
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {task ? 'Speichern' : 'Erstellen'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
