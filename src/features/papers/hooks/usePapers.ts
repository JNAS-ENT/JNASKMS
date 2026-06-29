import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { papersApi } from '../api';
import { PaperInput } from '../validation/schema';
import { ResearchPaper } from '../../../types';
import { useEnterpriseStore } from '../../../store';

export function usePapers() {
  const queryClient = useQueryClient();
  const { setPapers } = useEnterpriseStore();

  const {
    data: papers = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['papers'],
    queryFn: async () => {
      const res = await papersApi.fetchPapers();
      setPapers(res);
      return res;
    },
    refetchOnWindowFocus: false
  });

  const createMutation = useMutation({
    mutationFn: papersApi.createPaper,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ResearchPaper['status'] }) => papersApi.updatePaperStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  return {
    papers,
    isLoading,
    createPaper: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    refetch
  };
}
