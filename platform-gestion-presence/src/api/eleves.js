import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getEleves = (params) => (
  useMockApi ? mockApi.getEleves(params) : withMock(() => api.get('/v1/eleves', { params }), () => mockApi.getEleves(params))
)

export const createEleve = (payload) => (
  useMockApi ? mockApi.createEleve(payload) : withMock(() => api.post('/v1/eleves', payload), () => mockApi.createEleve(payload))
)

export const updateEleve = (id, payload) => (
  useMockApi ? mockApi.updateEleve(id, payload) : withMock(() => api.put(`/v1/eleves/${id}`, payload), () => mockApi.updateEleve(id, payload))
)

export const deleteEleve = (id) => (
  useMockApi ? mockApi.deleteEleve(id) : withMock(() => api.delete(`/v1/eleves/${id}`), () => mockApi.deleteEleve(id))
)
