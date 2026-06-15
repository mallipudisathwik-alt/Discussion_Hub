import axiosInstance from './axiosInstance'

export const getCategories = () =>
  axiosInstance.get('/api/categories')

export const createCategory = (data) =>
  axiosInstance.post('/api/categories', data)

export const deleteCategory = (id) =>
  axiosInstance.delete(`/api/categories/${id}`)

export const getPendingCategories = () =>
  axiosInstance.get('/api/categories/pending')

export const getAllCategories = () =>
  axiosInstance.get('/api/categories/all')

export const approveCategory = (id) =>
  axiosInstance.post(`/api/categories/${id}/approve`)

export const rejectCategory = (id) =>
  axiosInstance.post(`/api/categories/${id}/reject`)
