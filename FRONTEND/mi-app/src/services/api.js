import axios from 'axios'

const API_URL = import.meta.env.DEV ? '/' : '/'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    return api.post('/login', formData)
  }
}

export const rolesAPI = {
  getAll: () => api.get('/roles/'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles/', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`)
}

export const usuariosAPI = {
  getAll: () => api.get('/usuarios/'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios/', data),
  update: (id, data) => api.put(`/usuarios/{id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`)
}

export const clientesAPI = {
  getAll: () => api.get('/clientes/'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes/', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`)
}

export const vehiculosAPI = {
  getAll: () => api.get('/vehiculos/'),
  getById: (id) => api.get(`/vehiculos/${id}`),
  create: (data) => api.post('/vehiculos/', data),
  update: (id, data) => api.put(`/vehiculos/${id}`, data),
  delete: (id) => api.delete(`/vehiculos/${id}`)
}

export const serviciosAPI = {
  getAll: () => api.get('/servicios/'),
  getById: (id) => api.get(`/servicios/${id}`),
  create: (data) => api.post('/servicios/', data),
  update: (id, data) => api.put(`/servicios/${id}`, data),
  delete: (id) => api.delete(`/servicios/${id}`)
}

export const productosAPI = {
  getAll: () => api.get('/productos/'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos/', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`)
}

export default api
