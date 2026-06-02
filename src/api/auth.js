import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const login = (credentials) => (
  useMockApi ? mockApi.login(credentials) : withMock(() => api.post('/login', credentials), () => mockApi.login(credentials))
)

export const logout = () => (
  useMockApi ? mockApi.logout() : withMock(() => api.post('/logout'), () => mockApi.logout())
)

export const me = () => (
  useMockApi ? mockApi.me() : withMock(() => api.get('/me'), () => mockApi.me())
)
