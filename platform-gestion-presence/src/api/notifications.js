import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getNotifications = () => (
  useMockApi ? mockApi.getNotifications() : withMock(() => api.get('/v1/notifications'), () => mockApi.getNotifications())
)

export const markNotificationsRead = () => (
  useMockApi ? mockApi.getNotifications() : Promise.resolve({ data: [] })
)
