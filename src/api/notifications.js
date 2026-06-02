import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const getNotifications = () => (
  useMockApi ? mockApi.getNotifications() : withMock(() => api.get('/notifications'), () => mockApi.getNotifications())
)

export const markNotificationsRead = () => (
  useMockApi ? mockApi.getNotifications() : withMock(() => api.patch('/notifications/read'), () => mockApi.getNotifications())
)
