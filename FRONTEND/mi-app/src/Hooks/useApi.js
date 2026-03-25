// hooks/useApi.js
// Hook genérico: usa el cliente axios central (`src/services/api.js`) y la clave
// `access_token` en localStorage para mantener coherencia con el AuthContext.

import api from '../services/api'

function getToken() { return localStorage.getItem('access_token') }

// apiFetch mantiene una API similar a fetch usada en las páginas:
// - path: ruta relativa (p. ej. '/usuarios/')
// - options: { method, body, headers }
export async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toLowerCase()
  try {
    const axiosOptions = {
      url: path,
      method,
      headers: options.headers || {},
    }

    if (options.body) {
      // body puede venir como JSON-string; si es string intentamos parsear
      axiosOptions.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
    }

    // axios ya añade Authorization desde el interceptor en services/api.js
    const res = await api.request(axiosOptions)
    return res.data
  } catch (err) {
    // Normalizar mensajes de error para las páginas
    const detail = err.response?.data?.detail || err.response?.data || err.message || 'Error desconocido'
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
}