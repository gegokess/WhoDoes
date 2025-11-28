import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TASK_TEMPLATES } from '@/lib/taskTemplates';

export interface TaskTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: { name: string; points: number }) => void;
}

export const TaskTemplates: React.FC<TaskTemplatesProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTemplates = TASK_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (template: typeof TASK_TEMPLATES[0]) => {
    onSelect({ name: template.name, points: template.points });
    setSearchTerm('');
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aufgaben-Vorlagen">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Vorlagen durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleSelect(template)}
              className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-surface-secondary transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-text">{template.name}</span>
                <span className="text-sm text-primary font-semibold">{template.points} Pkt</span>
              </div>
            </button>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <p className="text-center text-text-secondary py-8">
            Keine Vorlagen gefunden
          </p>
        )}
        
        <Button variant="secondary" onClick={onClose} className="w-full">
          Abbrechen
        </Button>
      </div>
    </Modal>
  );
};
