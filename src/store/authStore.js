import { create } from 'zustand'
import { login as loginRequest, logout as logoutRequest, me } from '../api/auth'

const storedUser = localStorage.getItem('user')

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  async login(credentials) {
    set({ isLoading: true })
    try {
      const { data } = await loginRequest(credentials)
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
    const { data } = await me()
    localStorage.setItem('user', JSON.stringify(data))
    set({ user: data })
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
