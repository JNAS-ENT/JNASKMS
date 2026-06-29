import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api';
import { useEnterpriseStore } from '../../../store';
import { SystemConfig } from '../../../types';

export function useSettings() {
  const queryClient = useQueryClient();
  const { config, setConfig } = useEnterpriseStore();

  const updateConfigMutation = useMutation({
    mutationFn: settingsApi.saveConfig,
    onSuccess: (newConfig) => {
      setConfig(newConfig);
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    }
  });

  return {
    config,
    updateConfig: updateConfigMutation.mutateAsync,
    isSaving: updateConfigMutation.isPending
  };
}
