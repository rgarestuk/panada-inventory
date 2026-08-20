import { useQuery } from '@tanstack/react-query';
import { dashboardRepository } from '../repository/dashboard.repository';
import { DASHBOARD_QUERY_KEYS } from '../constants';

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.STATS,
    queryFn: () => dashboardRepository.getStats(),
  });
}
