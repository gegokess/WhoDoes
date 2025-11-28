import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHouseholdStore } from './stores/householdStore';
import { setupAutoSync } from './lib/sync';
import { ToastProvider } from './components/ui/Toast';

// Pages (will be created)
import Home from './pages/Home.tsx';
import Tasks from './pages/Tasks.tsx';
import Points from './pages/Points.tsx';
import History from './pages/History.tsx';
import Settings from './pages/Settings.tsx';
import Setup from './pages/Setup.tsx';

import { useRealtime } from './hooks/useRealtime';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Setup offline sync
setupAutoSync();

const RealtimeHandler = () => {
  useRealtime();
  return null;
};

const AppRoutes = () => {
  const householdId = useHouseholdStore((s) => s.householdId);
  
  // If no household, redirect to setup
  const RequireHousehold = ({ children }: { children: React.ReactNode }) => {
    if (!householdId) {
      return <Navigate to="/setup" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <RealtimeHandler />
      <Routes>
        {/* Setup route (public) */}
        <Route path="/setup" element={<Setup />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireHousehold>
              <Home />
            </RequireHousehold>
          }
        />
        <Route
          path="/tasks"
          element={
            <RequireHousehold>
              <Tasks />
            </RequireHousehold>
          }
        />
        <Route
          path="/points"
          element={
            <RequireHousehold>
              <Points />
            </RequireHousehold>
          }
        />
        <Route
          path="/history"
          element={
            <RequireHousehold>
              <History />
            </RequireHousehold>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireHousehold>
              <Settings />
            </RequireHousehold>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
