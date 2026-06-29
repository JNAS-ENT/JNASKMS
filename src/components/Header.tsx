import { useEnterpriseStore } from '../store';
import { Search, Bell, Terminal, RefreshCw } from 'lucide-react';

export function Header() {
  const { currentScreen, navigateTo } = useEnterpriseStore();

  const getPageTitle = (screen: string) => {
    switch (screen) {
      case 'dashboard': return 'Command Center Overview';
      case 'notes': return 'Technical Plans Workspace';
      case 'papers': return 'Research publications index';
      case 'youtube': return 'Lecture Transcript analyzer';
      case 'chat': return 'Co-Pilot Command Chat';
      case 'search': return 'Global Search Console';
      case 'journal': return 'Reflective logs & metrics';
      case 'projects': return 'Milestone Kanban command';
      case 'settings': return 'Console Settings configuration';
      default: return 'Workstation Station';
    }
  };

  return (
    <header id="workspace-header" className="h-16 border-b border-border bg-card text-card-foreground px-6 flex items-center justify-between shrink-0">
      {/* Page Path titles */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
        <span>station</span>
        <span>/</span>
        <span className="font-semibold text-foreground text-sm font-sans">{getPageTitle(currentScreen)}</span>
      </div>

      {/* Right operations bar */}
      <div className="flex items-center gap-4">
        {/* Search shortcut button */}
        <button
          id="btn-header-search"
          onClick={() => navigateTo('search')}
          className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Search station index"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* Diagnostic indicator badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border/60 text-[10px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-muted-foreground font-semibold">CONTAINER: ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
