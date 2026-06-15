import axiosInstance from './axiosInstance'

export const login = (username, password) =>
  axiosInstance.post('/api/auth/login', { username, password })

export const register = (username, email, password) =>
  axiosInstance.post('/api/auth/register', { username, email, password })

export const getMe = () =>
  axiosInstance.get('/api/auth/me')
