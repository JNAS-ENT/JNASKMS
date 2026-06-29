import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api';
import { NoteInput } from '../validation/schema';
import { useEnterpriseStore } from '../../../store';

export function useNotes() {
  const queryClient = useQueryClient();
  const { setNotes } = useEnterpriseStore();

  const {
    data: notesList = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await notesApi.fetchNotes();
      // Sync to standard store for other modules (e.g. search, dashboard)
      setNotes(res);
      return res;
    },
    refetchOnWindowFocus: false
  });

  const createMutation = useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoteInput> }) => notesApi.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    }
  });

  return {
    notes: notesList,
    isLoading,
    createNote: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateNote: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteNote: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetch
  };
}
