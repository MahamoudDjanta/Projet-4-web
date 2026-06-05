import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getPermissions = () => (
  useMockApi ? mockApi.getPermissions() : withMock(() => api.get('/v1/permissions'), () => mockApi.getPermissions())
)

export const createPermission = (payload) => (
  useMockApi
    ? mockApi.createPermission(payload)
    : withMock(() => api.post('/v1/permissions', payload, { headers: { 'Content-Type': 'multipart/form-data' } }), () => mockApi.createPermission(payload))
)

export const updatePermission = (id, payload) => (
  useMockApi ? mockApi.updatePermission(id, payload) : withMock(() => api.patch(`/v1/permissions/${id}/statut`, payload), () => mockApi.updatePermission(id, payload))
)
