import { YouTubeAnalysis } from '../../../types';

export interface YoutubeState {
  analyses: YouTubeAnalysis[];
  currentAnalysis: YouTubeAnalysis | null;
  isLoading: boolean;
  error: string | null;
}
