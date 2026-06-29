import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjects } from '../hooks/useProjects';
import { taskSchema, TaskInput, projectSchema, ProjectInput } from '../validation/schema';
import { Kanban, ListTodo, Plus, Calendar, User, ArrowRight, Loader2, RefreshCw, Layers, CheckSquare } from 'lucide-react';

export function ProjectBoard() {
  const { projects, isLoading, createProject, addTask, updateTaskStatus } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  useEffect(() => {
    if (projects.length > 0 && activeProjectId === null) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  // Task form setup
  const {
    register: registerTask,
    handleSubmit: handleSubmitTask,
    reset: resetTask,
    formState: { errors: taskErrors }
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: { title: '', description: '', status: 'todo', priority: 'medium', assignedTo: 'Shaikh J.' }
  });

  // Project form setup
  const {
    register: registerProj,
    handleSubmit: handleSubmitProj,
    reset: resetProj,
    formState: { errors: projErrors }
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: { name: '', description: '' }
  });

  const onAddTaskSubmit = async (data: TaskInput) => {
    if (!activeProjectId) return;
    try {
      await addTask({ projectId: activeProjectId, task: data });
      resetTask();
      setShowAddTaskForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onAddProjSubmit = async (data: ProjectInput) => {
    try {
      const newProj = await createProject(data);
      setActiveProjectId(newProj.id);
      resetProj();
      setShowAddProjectForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCycleStatus = (taskId: string, currentStatus: any) => {
    if (!activeProjectId) return;
    const statuses: any[] = ['backlog', 'todo', 'in-progress', 'completed'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updateTaskStatus({ projectId: activeProjectId, taskId, status: statuses[nextIdx] });
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200';
      case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200';
      case 'low': return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const columns: { id: any; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog Buffer', color: 'border-t-slate-400 bg-slate-500/5' },
    { id: 'todo', title: 'Planned Work', color: 'border-t-blue-400 bg-blue-500/5' },
    { id: 'in-progress', title: 'Active Focus', color: 'border-t-amber-400 bg-amber-500/5' },
    { id: 'completed', title: 'Audit Completed', color: 'border-t-emerald-400 bg-emerald-500/5' },
  ];

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col justify-center items-center gap-2">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono">Syncing task columns...</span>
      </div>
    );
  }

  return (
    <div id="projects-module-view" className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
            <Kanban className="w-5 h-5 text-primary" />
            Corporate Task Command Board
          </h2>
          <p className="text-xs text-muted-foreground">Orchestrate development milestone sprints, allocate tasks, and verify audit status states</p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-trigger-add-proj"
            onClick={() => setShowAddProjectForm(!showAddProjectForm)}
            className="px-3.5 py-1.5 bg-secondary text-foreground border border-border text-xs font-semibold rounded-lg hover:bg-opacity-80 transition-all"
          >
            Create Board Project
          </button>
          {activeProjectId && (
            <button
              id="btn-trigger-add-task"
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 transition-all shadow-sm active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              Append Task Card
            </button>
          )}
        </div>
      </div>

      {/* Project Switcher Tabs */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        {projects.map(proj => (
          <button
            key={proj.id}
            id={`btn-proj-tab-${proj.id}`}
            onClick={() => {
              setActiveProjectId(proj.id);
              setShowAddTaskForm(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-t border-x ${
              activeProjectId === proj.id
                ? 'bg-card text-foreground border-border border-b-2 border-b-primary shadow-sm font-bold'
                : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {proj.name}
          </button>
        ))}
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Project Panel */}
        {showAddProjectForm && (
          <div className="bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-500" />
              Create Board Project
            </h4>
            <form onSubmit={handleSubmitProj(onAddProjSubmit)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="proj-name-input">
                  Project Name
                </label>
                <input
                  id="proj-name-input"
                  type="text"
                  {...registerProj('name')}
                  placeholder="e.g. Unified Database Orchestrator"
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                />
                {projErrors.name && <p className="text-[10px] text-destructive font-semibold mt-0.5">{projErrors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="proj-desc-input">
                  Description
                </label>
                <input
                  id="proj-desc-input"
                  type="text"
                  {...registerProj('description')}
                  placeholder="e.g. Scoping and optimizing data storage caches..."
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {projErrors.description && <p className="text-[10px] text-destructive font-semibold mt-0.5">{projErrors.description.message}</p>}
              </div>
              <button
                id="btn-save-proj-submit"
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Catalog Project Board
              </button>
            </form>
          </div>
        )}

        {/* Create Task Panel */}
        {showAddTaskForm && activeProjectId && (
          <div className="bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <ListTodo className="w-4.5 h-4.5 text-emerald-500" />
              Append Task Deliverable
            </h4>
            <form onSubmit={handleSubmitTask(onAddTaskSubmit)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="task-title-input">
                  Task Short Name
                </label>
                <input
                  id="task-title-input"
                  type="text"
                  {...registerTask('title')}
                  placeholder="e.g. Finalize TLS endpoint certs"
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                />
                {taskErrors.title && <p className="text-[10px] text-destructive font-semibold mt-0.5">{taskErrors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="task-priority-select">
                    Priority Level
                  </label>
                  <select
                    id="task-priority-select"
                    {...registerTask('priority')}
                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="task-status-select">
                    Initial Phase
                  </label>
                  <select
                    id="task-status-select"
                    {...registerTask('status')}
                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none font-semibold"
                  >
                    <option value="backlog">Backlog Buffer</option>
                    <option value="todo">Planned</option>
                    <option value="in-progress">Active Focus</option>
                  </select>
                </div>
              </div>
              <button
                id="btn-save-task-submit"
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Pin Task to Board
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Kanban Board Grid */}
      {activeProject ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map(col => {
            const columnTasks = activeProject.tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                id={`kanban-col-${col.id}`}
                className={`border-t-4 ${col.color} border border-border rounded-xl p-4 flex flex-col gap-3 min-h-[350px] shadow-sm`}
              >
                {/* Column Title */}
                <div className="flex justify-between items-center pb-2 border-b border-border/40 shrink-0">
                  <span className="text-xs font-bold font-display tracking-tight text-foreground">{col.title}</span>
                  <span className="text-[10px] bg-secondary border border-border/50 px-2 py-0.5 rounded-full font-mono font-bold text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[450px] pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="py-12 text-center text-[10px] text-muted-foreground italic font-medium">
                      No cards here.
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        onClick={() => handleCycleStatus(task.id, task.status)}
                        className="bg-card text-card-foreground border border-border rounded-lg p-3.5 space-y-2.5 shadow-xs cursor-pointer hover:border-primary hover:-translate-y-0.5 hover:shadow-md transition-all group relative"
                        title="Click to advance status state"
                      >
                        <span className="font-semibold text-xs leading-tight block text-foreground pr-4 group-hover:text-primary transition-colors">
                          {task.title}
                        </span>

                        <div className="flex items-center justify-between gap-2 pt-1 text-[9px] font-mono">
                          <span className={`px-2 py-0.5 border rounded-full font-bold uppercase tracking-wide text-[8px] ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.assignedTo && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <User className="w-3 h-3" />
                              {task.assignedTo}
                            </span>
                          )}
                        </div>

                        {/* Status advance hint overlay */}
                        <div className="absolute right-2 top-2 p-1 opacity-0 group-hover:opacity-100 bg-secondary rounded transition-opacity" title="Cycle Status">
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Create or select an active project board above to verify progress.
        </div>
      )}
    </div>
  );
}
