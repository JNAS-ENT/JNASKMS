import { apiClient } from '../../../services/apiClient';
import { YouTubeAnalysis } from '../../../types';

export const youtubeApi = {
  fetchAnalyses: async (): Promise<YouTubeAnalysis[]> => {
    return apiClient.youtube.getAll();
  },
  analyzeVideo: async (url: string): Promise<YouTubeAnalysis> => {
    return apiClient.youtube.analyzeUrl(url);
  }
};
