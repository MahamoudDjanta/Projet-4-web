import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getPresenceDashboard = () => (
  useMockApi ? mockApi.dashboard() : withMock(() => api.get('/v1/dashboard/stats'), () => mockApi.dashboard())
)

export const getPresences = (params) => (
  useMockApi ? mockApi.getPresences(params) : withMock(() => api.get('/v1/presences', { params }), () => mockApi.getPresences(params))
)

export const createPresenceSession = (payload) => (
  useMockApi ? mockApi.createPresenceSession(payload) : withMock(() => api.post('/v1/sessions', payload), () => mockApi.createPresenceSession(payload))
)

export const closePresenceSession = (id) => (
  useMockApi ? mockApi.closePresenceSession(id) : withMock(() => api.post(`/v1/sessions/${id}/cloturer`), () => mockApi.closePresenceSession(id))
)

export const getSessions = () => (
  useMockApi ? mockApi.getSessions() : withMock(() => api.get('/v1/sessions'), () => mockApi.getSessions())
)

export const getSession = (id) => (
  useMockApi ? mockApi.getSession(id) : withMock(() => api.get(`/v1/sessions/${id}`), () => mockApi.getSession(id))
)

export const getSessionQrToken = (id) => (
  useMockApi ? mockApi.getSessionQrToken(id) : withMock(() => api.get(`/v1/sessions/${id}/qr-token`), () => mockApi.getSessionQrToken(id))
)

export const markManualPresence = (id, payload) => (
  useMockApi ? mockApi.markManualPresence(id, payload) : withMock(() => api.post('/v1/presences/marquer-liste', payload), () => mockApi.markManualPresence(id, payload))
)

export const scanQrPresence = (payload) => (
  useMockApi ? mockApi.scanQrPresence(payload) : withMock(() => api.post('/v1/presences/scan-qr', payload), () => mockApi.scanQrPresence(payload))
)

export const clearPresences = () => (
  useMockApi ? mockApi.clearPresences() : withMock(() => api.delete('/v1/presences/clear'), () => mockApi.clearPresences())
)

export const getPresenceRequests = () => (
  useMockApi ? mockApi.getPresenceRequests() : withMock(() => api.get('/v1/requetes'), () => mockApi.getPresenceRequests())
)

export const createPresenceRequest = (payload) => (
  useMockApi ? mockApi.createPresenceRequest(payload) : withMock(() => api.post('/v1/requetes', payload), () => mockApi.createPresenceRequest(payload))
)

export const updatePresenceRequest = (id, payload) => (
  useMockApi ? mockApi.updatePresenceRequest(id, payload) : withMock(() => api.patch(`/v1/requetes/${id}/traiter`, payload), () => mockApi.updatePresenceRequest(id, payload))
)
