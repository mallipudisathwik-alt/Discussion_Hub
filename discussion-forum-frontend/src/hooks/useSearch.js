import { useQuery } from '@tanstack/react-query'
import { searchPosts } from '../api/searchApi'

export function useSearch(query) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query).then((res) => res.data),
    enabled: !!query && query.length > 2,
  })
}
