import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getPermissions = () => (
  useMockApi ? mockApi.getPermissions() : withMock(() => api.get('/permissions'), () => mockApi.getPermissions())
)

export const createPermission = (payload) => (
  useMockApi
    ? mockApi.createPermission(payload)
    : withMock(() => api.post('/permissions', payload, { headers: { 'Content-Type': 'multipart/form-data' } }), () => mockApi.createPermission(payload))
)

export const updatePermission = (id, payload) => (
  useMockApi ? mockApi.updatePermission(id, payload) : withMock(() => api.patch(`/permissions/${id}`, payload), () => mockApi.updatePermission(id, payload))
)
