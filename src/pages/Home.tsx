import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ActivityCard } from '../components/ui/ActivityCard';
import { FavoriteCard } from '../components/ui/FavoriteCard';
import { useTasks } from '../hooks/useTasks';
import { useFavorites } from '../hooks/useFavorites';
import { useCompleteTask } from '../hooks/useCompletions';
import { useHouseholdStore } from '../stores/householdStore';
import { CheckCircle2, Clock, PlusCircle } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentPartnerId = useHouseholdStore((s) => s.currentPartnerId);
  
  const { data: tasks = [] } = useTasks();
  const { data: favorites = new Set() } = useFavorites();
  const completeTask = useCompleteTask();
  
  const favoriteTasks = tasks.filter(t => favorites.has(t.id)).slice(0, 4);
  
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
    <PageLayout header={{ title: 'Home' }}>
      <div className="p-4 space-y-8 pb-24">
        
        {/* Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-text">Activity</h2>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-primary font-medium text-sm hover:text-primary-dark"
            >
              See All ({tasks.length})
            </button>
          </div>
          
          <div className="space-y-3">
            <ActivityCard 
              icon={<PlusCircle size={24} />}
              title="Create a task"
              subtitle="Add a new household chore"
              onAction={() => navigate('/tasks')}
            />
            <ActivityCard 
              icon={<Clock size={24} />}
              title="Log points"
              subtitle="Quickly log points for an activity"
              onAction={() => navigate('/points')}
            />
          </div>
        </section>
        
        {/* Favorites Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-text">Favorites</h2>
            <button className="text-primary font-medium text-sm hover:text-primary-dark">
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Dynamic Favorite Tasks */}
            {favoriteTasks.map(task => (
              <FavoriteCard
                key={task.id}
                title={task.name}
                status={`${task.points} Pkt`}
                icon={<CheckCircle2 size={24} className="text-primary" />}
                onClick={() => handleQuickComplete(task.id, task.points)}
                onMore={() => {}}
              />
            ))}
            
            {/* Add Favorite Placeholder */}
            <FavoriteCard 
              title="Add Favorite"
              status="Pin tasks here"
              icon={<PlusCircle size={24} className="text-text-muted" />}
              onClick={() => navigate('/tasks')}
              className="border-2 border-dashed border-border shadow-none bg-transparent hover:bg-surface-secondary"
            />
          </div>
        </section>

      </div>
    </PageLayout>
  );
};

export default Home;
