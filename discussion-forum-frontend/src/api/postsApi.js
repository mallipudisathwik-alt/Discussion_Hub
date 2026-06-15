import axiosInstance from './axiosInstance'

export const getPosts = (params) =>
  axiosInstance.get('/api/posts', { params })

export const getPost = (id) =>
  axiosInstance.get(`/api/posts/${id}`)

export const createPost = (data) =>
  axiosInstance.post('/api/posts', data)

export const updatePost = (id, data) =>
  axiosInstance.put(`/api/posts/${id}`, data)

export const deletePost = (id) =>
  axiosInstance.delete(`/api/posts/${id}`)

export const upvotePost = (id) =>
  axiosInstance.post(`/api/posts/${id}/upvote`)

export const downvotePost = (id) =>
  axiosInstance.post(`/api/posts/${id}/downvote`)

export const pinPost = (id) =>
  axiosInstance.post(`/api/posts/${id}/pin`)

export const closePost = (id) =>
  axiosInstance.post(`/api/posts/${id}/close`)

export const getPendingPosts = () =>
  axiosInstance.get('/api/posts/pending')

export const approvePost = (id) =>
  axiosInstance.post(`/api/posts/${id}/approve`)

export const rejectPost = (id, reason) =>
  axiosInstance.post(`/api/posts/${id}/reject`, { reason })
