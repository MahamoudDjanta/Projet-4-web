import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getCours = (params) => (
  useMockApi ? mockApi.getCours(params) : withMock(() => api.get('/cours', { params }), () => mockApi.getCours(params))
)

export const createCours = (payload) => (
  useMockApi ? mockApi.createCours(payload) : withMock(() => api.post('/cours', payload), () => mockApi.createCours(payload))
)

export const updateCours = (id, payload) => (
  useMockApi ? mockApi.updateCours(id, payload) : withMock(() => api.put(`/cours/${id}`, payload), () => mockApi.updateCours(id, payload))
)

export const deleteCours = (id) => (
  useMockApi ? mockApi.deleteCours(id) : withMock(() => api.delete(`/cours/${id}`), () => mockApi.deleteCours(id))
)

export const getProgramme = (classeId) => (
  useMockApi ? mockApi.programme(classeId) : withMock(() => api.get(`/cours/programme/${classeId}`), () => mockApi.programme(classeId))
)
