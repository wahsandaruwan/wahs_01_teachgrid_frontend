/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const UserContext = createContext()

const getNodeEnv = (key) =>
  typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

// Default to the known local backend if no env var is provided
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  getNodeEnv('REACT_APP_API_BASE_URL') ||
  'http://localhost:3301'

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

  const fetchCurrentUser = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
          signal
        })

        if (data?.success && data.user) {
          setUser(data.user)
          return data.user
        }

        setUser(null)
        return null
      } catch (error) {
        if (axios.isCancel(error)) {
          return null
        }

        console.error('Failed to fetch current user', error)
        setUser(null)
        return null
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true
        }
      )
    } catch (error) {
      console.error('Logout request failed', error)
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController()

    const bootstrapAuth = async () => {
    try {
      await fetchCurrentUser(controller.signal);
    } catch (err) {
      // Error is handled inside fetchCurrentUser
    } finally {
      // ONLY set loading to false if this specific mount is still active
      if (isMounted) {
        setLoading(false);
      }
    }
  };

    bootstrapAuth()

    return () => {isMounted = false; controller.abort(); };
  }, [fetchCurrentUser])

  const refreshUser = useCallback(() => fetchCurrentUser(), [fetchCurrentUser])

  const value = {
    user,
    loading,
    refreshUser,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
