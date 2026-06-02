import api from './axios'
import { useMockApi } from './client'
import { mockApi, withMock } from './mock'

export const previewRapport = (params) => (
  useMockApi ? mockApi.previewRapport(params) : withMock(() => api.get('/rapports/preview', { params }), () => mockApi.previewRapport(params))
)
