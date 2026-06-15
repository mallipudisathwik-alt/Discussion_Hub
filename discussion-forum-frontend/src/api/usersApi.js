import axiosInstance from './axiosInstance'

export const getUsers = () =>
  axiosInstance.get('/api/users')

export const getUser = (id) =>
  axiosInstance.get(`/api/users/${id}`)

export const updateUser = (id, data) =>
  axiosInstance.put(`/api/users/${id}`, data)

export const deleteUser = (id) =>
  axiosInstance.delete(`/api/users/${id}`)
