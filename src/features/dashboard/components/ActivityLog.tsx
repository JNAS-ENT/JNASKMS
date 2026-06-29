import { FileText, BookOpen, Youtube, PenTool, CheckCircle, RefreshCw } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityLogProps {
  activities?: ActivityItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onNavigate: (screen: string) => void;
}

export function ActivityLog({ activities = [], isLoading, onRefresh, onNavigate }: ActivityLogProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4 text-sky-500" />;
      case 'paper':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'journal':
        return <PenTool className="w-4 h-4 text-amber-500" />;
      case 'task':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
    }
  };

  const getScreenName = (type: ActivityItem['type']) => {
    switch (type) {
      case 'note': return 'notes';
      case 'paper': return 'papers';
      case 'youtube': return 'youtube';
      case 'journal': return 'journal';
      case 'task': return 'projects';
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="activity-log-panel" className="bg-card text-card-foreground border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-display tracking-tight">Recent Station Audit Logs</h3>
        <button
          id="btn-refresh-activities"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Hydrating event buffers...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No audits found in local index.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, idx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {idx !== activities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center ring-8 ring-card">
                        {getIcon(activity.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-foreground font-medium">
                          {activity.action}:{' '}
                          <button
                            onClick={() => onNavigate(getScreenName(activity.type))}
                            className="font-semibold text-primary hover:underline hover:text-opacity-80"
                          >
                            {activity.title}
                          </button>
                        </p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-muted-foreground">
                        <time dateTime={activity.timestamp}>{formatTime(activity.timestamp)}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
