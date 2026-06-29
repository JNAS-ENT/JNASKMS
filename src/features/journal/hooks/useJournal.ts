import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../api';
import { JournalInput } from '../validation/schema';
import { useEnterpriseStore } from '../../../store';

export function useJournal() {
  const queryClient = useQueryClient();
  const { setJournalEntries } = useEnterpriseStore();

  const {
    data: entries = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const res = await journalApi.fetchEntries();
      setJournalEntries(res);
      return res;
    },
    refetchOnWindowFocus: false
  });

  const createMutation = useMutation({
    mutationFn: journalApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  return {
    entries,
    isLoading,
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    refetch
  };
}
