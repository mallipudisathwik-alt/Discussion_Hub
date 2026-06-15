import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notificationsApi'
import { Link } from 'react-router-dom'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const queryClient = useQueryClient()

  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => getUnreadCount().then(r => r.data),
    refetchInterval: 30000,
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then(r => r.data),
    enabled: open,
  })

  const markReadMutation = useMutation({
    mutationFn: (id) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
    },
  })

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unread = unreadData?.count ?? 0

  const getTypeIcon = (type) => {
    if (type?.includes('approved')) return '✓'
    if (type?.includes('rejected')) return '✗'
    return '•'
  }

  const getTypeColor = (type) => {
    if (type?.includes('approved')) return 'text-green-400'
    if (type?.includes('rejected')) return 'text-red-400'
    return 'text-blue-400'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative p-1.5 text-gray-300 hover:text-white transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-[#475569] rounded-lg shadow-xl z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#475569]">
            <span className="text-gray-200 text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button onClick={() => markAllReadMutation.mutate()} className="text-xs text-blue-400 hover:text-blue-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {!notifications || notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-[#475569] hover:bg-[#0f172a] cursor-pointer ${!n.read ? 'bg-[#1a2a45]' : ''}`}
                  onClick={() => { if (!n.read) markReadMutation.mutate(n.id) }}
                >
                  <div className="flex items-start gap-2">
                    <span className={`text-sm mt-0.5 ${getTypeColor(n.type)}`}>{getTypeIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-sm font-medium truncate">{n.title}</p>
                      <p className="text-gray-400 text-xs truncate">{n.message}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
