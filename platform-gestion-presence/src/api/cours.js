import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getCours = (params) => (
  useMockApi ? mockApi.getCours(params) : withMock(() => api.get('/v1/cours', { params }), () => mockApi.getCours(params))
)

export const createCours = (payload) => (
  useMockApi ? mockApi.createCours(payload) : withMock(() => api.post('/v1/cours', payload), () => mockApi.createCours(payload))
)

export const updateCours = (id, payload) => (
  useMockApi ? mockApi.updateCours(id, payload) : withMock(() => api.put(`/v1/cours/${id}`, payload), () => mockApi.updateCours(id, payload))
)

export const deleteCours = (id) => (
  useMockApi ? mockApi.deleteCours(id) : withMock(() => api.delete(`/v1/cours/${id}`), () => mockApi.deleteCours(id))
)

export const getProgramme = (classeId) => (
  useMockApi ? mockApi.programme(classeId) : withMock(() => api.get(`/v1/cours/programme/${classeId}`), () => mockApi.programme(classeId))
)
