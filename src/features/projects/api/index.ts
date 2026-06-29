import { apiClient } from '../../../services/apiClient';
import { TaskInput, ProjectInput } from '../validation/schema';
import { Project } from '../../../types';

export const projectsApi = {
  fetchProjects: async (): Promise<Project[]> => {
    return apiClient.projects.getAll();
  },
  createProject: async (data: ProjectInput): Promise<Project> => {
    return apiClient.projects.create(data.name, data.description);
  },
  addTask: async (projectId: string, task: TaskInput): Promise<Project> => {
    return apiClient.projects.addTask(projectId, task);
  },
  updateTaskStatus: async (projectId: string, taskId: string, status: Project['tasks'][0]['status']): Promise<Project> => {
    return apiClient.projects.updateTaskStatus(projectId, taskId, status);
  }
};
