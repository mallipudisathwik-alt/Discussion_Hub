import axiosInstance from './axiosInstance'

export const searchPosts = (query) =>
  axiosInstance.get('/api/search', { params: { q: query } })
