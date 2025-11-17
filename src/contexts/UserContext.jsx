/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

const getNodeEnv = (key) =>
  typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  getNodeEnv('REACT_APP_API_BASE_URL') ||
  ''

const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'admin@teachgrid.edu',
  role: 'admin',
  avatar: 'SJ'
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const fetchUser = async () => {
      // Bail out early if the API base URL is not configured yet.
      if (!API_BASE_URL) {
        setUser(mockUser)
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
          signal: controller.signal
        })
        setUser(data)
      } catch (error) {
        console.warn('Falling back to mock admin user', error)
        setUser(mockUser)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    return () => controller.abort()
  }, [])

  const value = {
    user,
    setUser,
    loading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
