import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getPresenceDashboard = () => (
  useMockApi ? mockApi.dashboard() : withMock(() => api.get('/presences/dashboard'), () => mockApi.dashboard())
)

export const getPresences = (params) => (
  useMockApi ? mockApi.dashboard() : withMock(() => api.get('/presences', { params }), () => mockApi.dashboard())
)

export const createPresenceSession = (payload) => (
  useMockApi ? mockApi.createPresenceSession(payload) : withMock(() => api.post('/presences', payload), () => mockApi.createPresenceSession(payload))
)

export const closePresenceSession = (id) => (
  useMockApi ? mockApi.closePresenceSession(id) : withMock(() => api.patch(`/presences/${id}/close`), () => mockApi.closePresenceSession(id))
)

export const markManualPresence = (id, payload) => (
  useMockApi ? mockApi.markManualPresence(id, payload) : withMock(() => api.post(`/presences/${id}/manual`, payload), () => mockApi.markManualPresence(id, payload))
)

export const scanQrPresence = (payload) => (
  useMockApi ? mockApi.scanQrPresence(payload) : withMock(() => api.post('/presences/qr/scan', payload), () => mockApi.scanQrPresence(payload))
)

export const getPresenceRequests = () => (
  useMockApi ? mockApi.getPresenceRequests() : withMock(() => api.get('/requetes'), () => mockApi.getPresenceRequests())
)

export const updatePresenceRequest = (id, payload) => (
  useMockApi ? mockApi.updatePresenceRequest(id, payload) : withMock(() => api.patch(`/requetes/${id}`, payload), () => mockApi.updatePresenceRequest(id, payload))
)
