import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api';

export function useSearch(query: string, filterType: string = 'all') {
  const {
    data: results = [],
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['search-query', query, filterType],
    queryFn: () => searchApi.queryIndex(query, filterType),
    enabled: query.length > 0,
    refetchOnWindowFocus: false
  });

  return {
    results,
    isLoading: isLoading || isFetching,
    refetch
  };
}
