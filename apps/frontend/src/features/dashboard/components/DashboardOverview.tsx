import { useDashboardData } from '../hooks/useDashboardData';
import { MetricCard } from './MetricCard';
import { ActivityLog } from './ActivityLog';
import { FileText, BookOpen, Youtube, PenTool, CheckCircle, Award, Terminal, ArrowRight } from 'lucide-react';
import { useEnterpriseStore } from '../../../store';

export function DashboardOverview() {
  const { metrics, activities, isLoading, refreshDashboard } = useDashboardData();
  const { navigateTo, currentUser } = useEnterpriseStore();

  const formattedMetrics = metrics || {
    totalNotes: 0,
    totalPapers: 0,
    totalAnalyses: 0,
    totalProjects: 0,
    completedTasks: 0,
    totalJournalEntries: 0,
    productivityAverage: 0
  };

  return (
    <div id="dashboard-overview-view" className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-primary to-slate-800 text-primary-foreground rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl border border-primary/20">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
            Welcome back, {currentUser?.fullName || 'Operator'}
          </h2>
          <p className="text-sm text-slate-300">
            Workstation state: <span className="text-emerald-400 font-semibold font-mono">ONLINE</span> | Role: <span className="font-mono text-emerald-300 uppercase">{currentUser?.role || 'user'}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-quick-new-note"
            onClick={() => navigateTo('notes')}
            className="px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            Create Note
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-quick-ai"
            onClick={() => navigateTo('chat')}
            className="px-4 py-2 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            AI Console
          </button>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="File Assets"
          value={formattedMetrics.totalNotes}
          description="Documented notes and technical plans"
          icon={FileText}
          trend={{ value: '+4 this week', positive: true }}
          onClick={() => navigateTo('notes')}
        />
        <MetricCard
          title="Research Index"
          value={formattedMetrics.totalPapers}
          description="Monitored PDF documents"
          icon={BookOpen}
          trend={{ value: '+1 today', positive: true }}
          onClick={() => navigateTo('papers')}
        />
        <MetricCard
          title="Video Extractions"
          value={formattedMetrics.totalAnalyses}
          description="YouTube lecture summaries"
          icon={Youtube}
          trend={{ value: '+12% growth', positive: true }}
          onClick={() => navigateTo('youtube')}
        />
        <MetricCard
          title="Focus Ratings"
          value={formattedMetrics.productivityAverage > 0 ? `${formattedMetrics.productivityAverage}/5` : 'N/A'}
          description="Mean productivity reflection rate"
          icon={PenTool}
          trend={{ value: 'Stable', positive: true }}
          onClick={() => navigateTo('journal')}
        />
      </div>

      {/* Secondary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity log takes 2 cols on wide screens */}
        <div className="lg:col-span-2">
          <ActivityLog
            activities={activities}
            isLoading={isLoading}
            onRefresh={refreshDashboard}
            onNavigate={navigateTo}
          />
        </div>

        {/* Status Hub Widgets */}
        <div className="space-y-6">
          {/* Quick Stats Panel */}
          <div className="bg-card text-card-foreground border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Operational Milestones
            </h3>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Active Projects
                </span>
                <span className="font-semibold font-mono">{formattedMetrics.totalProjects}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Task Deliverables Done
                </span>
                <span className="font-semibold font-mono">{formattedMetrics.completedTasks}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Reflective Logs Index
                </span>
                <span className="font-semibold font-mono">{formattedMetrics.totalJournalEntries}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <button
                id="btn-goto-projects"
                onClick={() => navigateTo('projects')}
                className="w-full text-center text-xs font-semibold text-primary hover:underline"
              >
                Manage project timeline
              </button>
            </div>
          </div>

          {/* Quick System Diagnostics */}
          <div className="bg-card text-card-foreground border border-border rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-muted-foreground">Workstation Diagnostics</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>API Endpoint:</span>
                <span className="text-muted-foreground">https://api.workstation.internal</span>
              </div>
              <div className="flex justify-between">
                <span>Model Server:</span>
                <span className="text-blue-500 font-semibold">gemini-2.5-flash</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Cache:</span>
                <span className="text-emerald-500">Active (L2)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
