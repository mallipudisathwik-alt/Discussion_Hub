import axiosInstance from './axiosInstance'

export const getComments = (postId) =>
  axiosInstance.get(`/api/comments/${postId}`)

export const addComment = (postId, content) =>
  axiosInstance.post(`/api/comments/${postId}`, { post_id: postId, content })

export const editComment = (commentId, content) =>
  axiosInstance.put(`/api/comments/${commentId}`, { content })

export const deleteComment = (commentId) =>
  axiosInstance.delete(`/api/comments/${commentId}`)

export const replyToComment = (commentId, content) =>
  axiosInstance.post(`/api/comments/${commentId}/reply`, { content })

export const upvoteComment = (commentId) =>
  axiosInstance.post(`/api/comments/${commentId}/upvote`)
