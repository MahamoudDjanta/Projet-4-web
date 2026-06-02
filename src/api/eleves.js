import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getEleves = (params) => (
  useMockApi ? mockApi.getEleves(params) : withMock(() => api.get('/eleves', { params }), () => mockApi.getEleves(params))
)

export const createEleve = (payload) => (
  useMockApi ? mockApi.createEleve(payload) : withMock(() => api.post('/eleves', payload), () => mockApi.createEleve(payload))
)

export const updateEleve = (id, payload) => (
  useMockApi ? mockApi.updateEleve(id, payload) : withMock(() => api.put(`/eleves/${id}`, payload), () => mockApi.updateEleve(id, payload))
)

export const deleteEleve = (id) => (
  useMockApi ? mockApi.deleteEleve(id) : withMock(() => api.delete(`/eleves/${id}`), () => mockApi.deleteEleve(id))
)
