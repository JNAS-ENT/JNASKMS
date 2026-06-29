import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { TaskInput, ProjectInput } from '../validation/schema';
import { useEnterpriseStore } from '../../../store';

export function useProjects() {
  const queryClient = useQueryClient();
  const { setProjects } = useEnterpriseStore();

  const {
    data: projects = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await projectsApi.fetchProjects();
      setProjects(res);
      return res;
    },
    refetchOnWindowFocus: false
  });

  const createProjectMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: ({ projectId, task }: { projectId: string; task: TaskInput }) => projectsApi.addTask(projectId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ projectId, taskId, status }: { projectId: string; taskId: string; status: any }) => 
      projectsApi.updateTaskStatus(projectId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  return {
    projects,
    isLoading,
    createProject: createProjectMutation.mutateAsync,
    isCreatingProject: createProjectMutation.isPending,
    addTask: addTaskMutation.mutateAsync,
    isAddingTask: addTaskMutation.isPending,
    updateTaskStatus: updateTaskStatusMutation.mutateAsync,
    isUpdatingTask: updateTaskStatusMutation.isPending,
    refetch
  };
}
