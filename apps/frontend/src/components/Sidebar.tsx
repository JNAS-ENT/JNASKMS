import { useEnterpriseStore } from '../store';
import { useAuth } from '../features/auth/hooks/useAuth';
import {
  FileText,
  BookOpen,
  Youtube,
  PenTool,
  CheckCircle,
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  Bot,
  Sun,
  Moon,
  Workflow
} from 'lucide-react';

export function Sidebar() {
  const { currentScreen, navigateTo, config, toggleTheme } = useEnterpriseStore();
  const { logout, currentUser } = useAuth();

  const links = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Technical Plans', icon: FileText },
    { id: 'papers', label: 'Research Papers', icon: BookOpen },
    { id: 'youtube', label: 'Video Analyzer', icon: Youtube },
    { id: 'chat', label: 'AI Chat Command', icon: Bot },
    { id: 'search', label: 'Global Search', icon: Search },
    { id: 'journal', label: 'Daily Journals', icon: PenTool },
    { id: 'projects', label: 'Task command board', icon: CheckCircle },
    { id: 'settings', label: 'Station Settings', icon: Settings },
  ];

  return (
    <aside id="workspace-sidebar" className="w-64 bg-card text-card-foreground border-r border-border flex flex-col h-full shrink-0">
      {/* Workspace Brand Title */}
      <div className="p-6 border-b border-border flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Workflow className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-sm font-display tracking-tight leading-none text-foreground truncate">
            Command Center
          </h1>
          <span className="text-[10px] text-muted-foreground font-semibold font-mono tracking-wider uppercase">
            Enterprise Node
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map(link => {
          const IconComp = link.icon;
          const isActive = currentScreen === link.id;
          return (
            <button
              key={link.id}
              id={`sidebar-link-${link.id}`}
              onClick={() => navigateTo(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md font-bold'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <IconComp className="w-4.5 h-4.5 shrink-0" />
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-border space-y-2.5">
        {/* Theme toggle switch */}
        <button
          id="btn-sidebar-theme-toggle"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2.5">
            {config.theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            {config.theme === 'dark' ? 'Technical Dark' : 'Corporate Light'}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Theme</span>
        </button>

        {/* Operator User badge & Logout */}
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 min-w-0">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full border border-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName.charAt(0) || 'O'}
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-[11px] block leading-none truncate text-foreground">
                {currentUser?.fullName || 'Operator'}
              </span>
              <span className="text-[9px] text-muted-foreground block font-mono truncate leading-normal pt-0.5">
                {currentUser?.email || 'shaikh.jnas@gmail.com'}
              </span>
            </div>
          </div>

          <button
            id="btn-sidebar-logout"
            onClick={logout}
            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors shrink-0"
            title="Terminate Operator Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
