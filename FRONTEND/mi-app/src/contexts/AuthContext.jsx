import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      // Aquí puedes agregar logic para verificar el token
      setUser({ isAuthenticated: true })
    }
  }, [token])

  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(username, password)
      const { access_token } = response.data
      
      localStorage.setItem('access_token', access_token)
      setToken(access_token)
      setUser({ isAuthenticated: true, username })
      
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Error en login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
