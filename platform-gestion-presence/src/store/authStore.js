import { create } from 'zustand'
import { login as loginRequest, logout as logoutRequest, me, register as registerRequest } from '../api/auth'

const storedUser = localStorage.getItem('user')

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  async login(credentials) {
    set({ isLoading: true })
    try {
      const { data: response } = await loginRequest(credentials)
      const data = response.data || response
      const token = data.token || data.access_token
      const user = data.user || data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, isLoading: false })
      return user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  async register(credentials) {
    set({ isLoading: true })
    try {
      const { data: response } = await registerRequest(credentials)
      const data = response.data || response
      const token = data.token || data.access_token
      const user = data.user || data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, isLoading: false })
      return user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  async loadUser() {
    const { data: response } = await me()
    const user = response.data || response
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  async logout() {
    try {
      await logoutRequest()
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ token: null, user: null })
    }
  },
}))
