import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const login = (credentials) => (
  useMockApi ? mockApi.login(credentials) : api.post('/v1/login', credentials)
)

export const register = (credentials) => (
  useMockApi ? mockApi.register(credentials) : api.post('/v1/register', credentials)
)

export const logout = () => (
  useMockApi ? mockApi.logout() : withMock(() => api.post('/v1/logout'), () => mockApi.logout())
)

export const me = () => (
  useMockApi ? mockApi.me() : withMock(() => api.get('/v1/me'), () => mockApi.me())
)
