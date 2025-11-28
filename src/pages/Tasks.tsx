import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskTemplates } from '../components/tasks/TaskTemplates';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useCompleteTask } from '../hooks/useCompletions';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { useHouseholdStore } from '../stores/householdStore';
import type { Task } from '../types';

const Tasks: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  
  const { showToast } = useToast();
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: favorites = new Set(), isLoading: favoritesLoading } = useFavorites();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();
  const toggleFavorite = useToggleFavorite();
  
  const handleCreateTask = (data: { name: string; points: number }) => {
    createTask.mutate(data, {
      onSuccess: () => {
        showToast('success', 'Aufgabe erstellt');
      },
      onError: () => {
        showToast('error', 'Fehler beim Erstellen');
      },
    });
  };
  
  const handleUpdateTask = (data: { name: string; points: number }) => {
    if (editingTask) {
      updateTask.mutate({
        taskId: editingTask.id,
        updates: { name: data.name, points: data.points },
      }, {
        onSuccess: () => {
          showToast('success', 'Aufgabe aktualisiert');
          setEditingTask(undefined);
        },
        onError: () => {
          showToast('error', 'Fehler beim Aktualisieren');
        },
      });
    }
  };
  
  const handleDelete = (taskId: string) => {
    if (confirm('Aufgabe wirklich löschen?')) {
      deleteTask.mutate(taskId, {
        onSuccess: () => {
          showToast('success', 'Aufgabe gelöscht');
        },
        onError: () => {
          showToast('error', 'Fehler beim Löschen');
        },
      });
    }
  };
  
  const handleComplete = (taskId: string, points: number) => {
    if (!currentPartnerId) {
      showToast('error', 'Bitte Partner auswählen');
      return;
    }
    
    completeTask.mutate({
      task_id: taskId,
      partner_id: currentPartnerId,
      points_earned: points,
    }, {
      onSuccess: () => {
        showToast('success', `+${points} Punkte! 🎉`);
      },
      onError: () => {
        showToast('error', 'Fehler beim Erledigen');
      },
    });
  };
  
  const handleToggleFavorite = (taskId: string) => {
    const isFavorite = favorites.has(taskId);
    toggleFavorite.mutate({ taskId, isFavorite });
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };
  
  if (tasksLoading || favoritesLoading) {
    return (
      <PageLayout header={{ title: 'Aufgaben' }}>
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">Laden...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <>
      <PageLayout
        header={{
          title: 'Aufgaben',
          action: (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsTemplatesOpen(true)}
                className="!min-h-[44px]"
              >
                <Sparkles size={18} className="mr-1" />
                Vorlagen
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFormOpen(true)}
                className="!min-h-[44px]"
              >
                <Plus size={20} className="mr-1" />
                Neu
              </Button>
            </div>
          ),
        }}
      >
        <div className="py-6">
          <TaskList
            tasks={tasks}
            favorites={favorites}
            onComplete={handleComplete}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </PageLayout>
      
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        title={editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
      />
      
      <TaskTemplates
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelect={handleCreateTask}
      />
    </>
  );
};

export default Tasks;
