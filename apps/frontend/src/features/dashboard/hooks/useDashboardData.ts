import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';

export function useDashboardData() {
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
    refetchOnWindowFocus: false
  });

  const {
    data: activities,
    isLoading: isActivitiesLoading,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardApi.getRecentActivity,
    refetchOnWindowFocus: false
  });

  const refreshDashboard = () => {
    refetchMetrics();
    refetchActivities();
  };

  return {
    metrics,
    activities,
    isLoading: isMetricsLoading || isActivitiesLoading,
    refreshDashboard
  };
}
