import api from './axios'

export const getUsers = (params) => api.get('/v1/users', { params })
export const createUser = (payload) => api.post('/v1/users', payload)
export const deleteUser = (id) => api.delete(`/v1/users/${id}`)
