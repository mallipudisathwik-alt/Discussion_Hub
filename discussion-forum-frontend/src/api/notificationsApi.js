import axiosInstance from './axiosInstance'

export const getNotifications = () =>
  axiosInstance.get('/api/notifications')

export const getUnreadCount = () =>
  axiosInstance.get('/api/notifications/unread-count')

export const markAsRead = (id) =>
  axiosInstance.put(`/api/notifications/${id}/read`)

export const markAllAsRead = () =>
  axiosInstance.put('/api/notifications/read-all')
