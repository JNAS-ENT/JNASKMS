import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnterpriseStore } from './store';
import { Layout } from './components/Layout';

// Feature Workspace imports
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { DashboardOverview } from './features/dashboard/components/DashboardOverview';
import { NotesWorkspace } from './features/notes/components/NotesWorkspace';
import { PapersLibrary } from './features/papers/components/PapersLibrary';
import { YoutubeAnalyzer } from './features/youtube/components/YoutubeAnalyzer';
import { ChatInterface } from './features/chat/components/ChatInterface';
import { SearchConsole } from './features/search/components/SearchConsole';
import { JournalLogs } from './features/journal/components/JournalLogs';
import { ProjectBoard } from './features/projects/components/ProjectBoard';
import { SettingsPanel } from './features/settings/components/SettingsPanel';

// Initialize the enterprise-grade TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime in React Query v4)
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { currentScreen } = useEnterpriseStore();

  // Screen Dispatcher
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'notes':
        return <NotesWorkspace />;
      case 'papers':
        return <PapersLibrary />;
      case 'youtube':
        return <YoutubeAnalyzer />;
      case 'chat':
        return <ChatInterface />;
      case 'search':
        return <SearchConsole />;
      case 'journal':
        return <JournalLogs />;
      case 'projects':
        return <ProjectBoard />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  // Auth pages centered layout
  if (currentScreen === 'login') {
    return (
      <QueryClientProvider client={queryClient}>
        <div id="auth-layout" className="min-y-screen min-h-screen w-screen flex justify-center items-center bg-background text-foreground p-6">
          <LoginForm />
        </div>
      </QueryClientProvider>
    );
  }

  if (currentScreen === 'register') {
    return (
      <QueryClientProvider client={queryClient}>
        <div id="auth-layout" className="min-y-screen min-h-screen w-screen flex justify-center items-center bg-background text-foreground p-6">
          <RegisterForm />
        </div>
      </QueryClientProvider>
    );
  }

  // Dashboard pages inside Layout
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {renderScreen()}
      </Layout>
    </QueryClientProvider>
  );
}
