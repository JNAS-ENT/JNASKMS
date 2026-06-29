import { apiClient } from '../../../services/apiClient';
import { PaperInput } from '../validation/schema';
import { ResearchPaper } from '../../../types';

export const papersApi = {
  fetchPapers: async (): Promise<ResearchPaper[]> => {
    return apiClient.papers.getAll();
  },
  createPaper: async (data: PaperInput): Promise<ResearchPaper> => {
    const authorsArr = data.authors.split(',').map(a => a.trim()).filter(Boolean);
    return apiClient.papers.create({
      ...data,
      authors: authorsArr,
      tags: data.tags || []
    });
  },
  updatePaperStatus: async (id: string, status: ResearchPaper['status']): Promise<ResearchPaper> => {
    return apiClient.papers.updateStatus(id, status);
  }
};
