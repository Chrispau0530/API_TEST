// hooks/useApi.js
// Hook genérico para peticiones autenticadas a la API

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() { return localStorage.getItem('token') }

export function authHeaders(isForm = false) {
  const h = { 'Authorization': `Bearer ${getToken()}` }
  if (!isForm) h['Content-Type'] = 'application/json'
  return h
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: authHeaders(),
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}