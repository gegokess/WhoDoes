import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { PointsOverview } from '../components/points/PointsOverview';
import { Button } from '../components/ui/Button';
import { usePoints } from '../hooks/usePoints';
import { useTasks } from '../hooks/useTasks';
import { useFavorites } from '../hooks/useFavorites';
import { useCompleteTask } from '../hooks/useCompletions';
import { useHouseholdStore } from '../stores/householdStore';
import { usePartners } from '../hooks/usePartners';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  
  const { data: pointsData, isLoading: pointsLoading } = usePoints('week');
  const { data: tasks = [] } = useTasks();
  const { data: favorites = new Set() } = useFavorites();
  const { data: partners = [] } = usePartners();
  const completeTask = useCompleteTask();
  
  const favoriteTasks = tasks.filter(t => favorites.has(t.id)).slice(0, 4);
  const currentPartner = partners.find(p => p.id === currentPartnerId);
  
  const handleQuickComplete = (taskId: string, points: number) => {
    if (!currentPartnerId) {
      alert('Bitte wählen Sie zuerst Ihren Partner in den Einstellungen aus');
      return;
    }
    
    completeTask.mutate({
      task_id: taskId,
      partner_id: currentPartnerId,
      points_earned: points,
    });
  };
  
  return (
    <PageLayout header={{ title: 'WhoDoes' }}>
      <div className="p-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-text">
            Hallo{currentPartner ? ` ${currentPartner.name}` : ''}! 👋
          </h2>
          <p className="text-text-secondary mt-1">
            Bereit für ein paar Aufgaben?
          </p>
        </div>
        
        {/* Points Overview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-text">Diese Woche</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/points')}
              className="!min-h-[36px]"
            >
              Details
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          
          {pointsLoading ? (
            <div className="card">
              <p className="text-text-secondary text-center">Laden...</p>
            </div>
          ) : (
            <PointsOverview partnersData={pointsData} />
          )}
        </div>
        
        {/* Quick Actions */}
        {favoriteTasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-text">⚡ Quick Actions</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/tasks')}
                className="!min-h-[36px]"
              >
                Alle Aufgaben
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {favoriteTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => handleQuickComplete(task.id, task.points)}
                  className="card text-left hover:scale-105 active:scale-95 transition-transform"
                >
                  <div className="text-2xl mb-2">✓</div>
                  <h4 className="font-semibold text-text mb-1 line-clamp-2">{task.name}</h4>
                  <p className="text-sm text-primary font-medium">{task.points} Pkt</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {favoriteTasks.length === 0 && tasks.length === 0 && (
          <div className="card bg-surface-secondary text-center py-8">
            <p className="text-lg font-medium text-text mb-2">Willkommen bei WhoDoes!</p>
            <p className="text-text-secondary mb-4">
              Erstelle deine ersten Aufgaben, um loszulegen.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/tasks')}
            >
              Aufgaben erstellen
            </Button>
          </div>
        )}
        
        {favoriteTasks.length === 0 && tasks.length > 0 && (
          <div className="card bg-info/10 text-center py-6">
            <p className="text-text-secondary">
              💡 Markiere häufige Aufgaben als Favoriten für schnellen Zugriff hier!
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Home;
