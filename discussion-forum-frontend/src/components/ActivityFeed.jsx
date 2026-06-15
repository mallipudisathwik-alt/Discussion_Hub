import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import { formatDistanceToNow } from '../utils'

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => axiosInstance.get('/api/activity').then((res) => res.data),
  })

  if (isLoading) return <div className="text-gray-400">Loading activity...</div>

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-200">Activity Log</h3>
      {activities?.map((log) => (
        <div key={log._id} className="bg-[#1e293b] rounded-lg border border-[#475569] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded">
                {log.action}
              </span>
              <span className="text-gray-400 text-sm">User {log.user_id}</span>
              <span className="text-gray-500 text-xs">{log.target_type}:{log.target_id}</span>
            </div>
            <span className="text-gray-500 text-xs">{formatDistanceToNow(log.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
