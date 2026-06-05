import api from './axios'
import { useMockApi } from './client'
import { withMock } from './mock'

const mockClasses = [
  { id: 1, nom: '6eme B', niveau: 'College' },
  { id: 2, nom: '5eme A', niveau: 'College' },
  { id: 3, nom: '4eme A', niveau: 'College' },
  { id: 4, nom: '4eme B', niveau: 'College' },
  { id: 5, nom: '3eme A', niveau: 'College' },
  { id: 6, nom: '3eme B', niveau: 'College' },
  { id: 7, nom: '2nd A/B', niveau: 'Lycee' },
  { id: 8, nom: '2nd D', niveau: 'Lycee' },
  { id: 9, nom: '1ere A/B', niveau: 'Lycee' },
  { id: 10, nom: '1ere D', niveau: 'Lycee' },
  { id: 11, nom: '1ere C', niveau: 'Lycee' },
  { id: 12, nom: 'Tle A', niveau: 'Lycee' },
  { id: 13, nom: 'Tle D/C', niveau: 'Lycee' },
]

export const getClasses = () => (
  useMockApi ? Promise.resolve({ data: mockClasses }) : withMock(() => api.get('/v1/classes'), () => Promise.resolve({ data: mockClasses }))
)
