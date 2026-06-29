import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { youtubeApi } from '../api';
import { useEnterpriseStore } from '../../../store';

export function useYoutube() {
  const queryClient = useQueryClient();
  const { setYoutubeAnalyses } = useEnterpriseStore();

  const {
    data: analyses = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['youtube-analyses'],
    queryFn: async () => {
      const res = await youtubeApi.fetchAnalyses();
      setYoutubeAnalyses(res);
      return res;
    },
    refetchOnWindowFocus: false
  });

  const analyzeMutation = useMutation({
    mutationFn: youtubeApi.analyzeVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  return {
    analyses,
    isLoading,
    analyzeVideo: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    refetch
  };
}
