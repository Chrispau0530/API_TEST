import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [staySignedIn, setStaySignedIn] = useState(false)
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    // El login debe recibir la contraseña en texto plano.
    // No debe enviarse el hash de la contraseña desde el frontend.
    const plainPassword = password.trim()
    if (plainPassword.startsWith('$pbkdf2-sha256$')) {
      setError('Ingresa la contraseña original, no su hash.')
      return
    }

    const success = await login(username, plainPassword)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="login-container">
      {/* Panel izquierdo — hero */}
      <div className="login-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logo">
            <span className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M8 12s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3z"/>
              </svg>
            </span>
            <span className="logo-name">Autolavado Pro</span>
          </div>

          <div className="hero-text">
            <h2>El Estándar Clínico<br />del Cuidado Automotriz.</h2>
            <p>Gestiona tus operaciones con total eficiencia desde nuestra plataforma de administración.</p>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">99.8%</span>
              <span className="stat-label">Eficiencia</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">2.4k</span>
              <span className="stat-label">Servicios Activos</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">© 2024 Autolavado Pro · v4.5.0</div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-form-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <div className="form-body">
            <div className="form-group">
              <label htmlFor="username">USUARIO / CORREO</label>
              <input
                id="username"
                type="text"
                placeholder="manager@autolavado.pro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">CONTRASEÑA</label>
                <button type="button" className="forgot-link">¿Olvidaste tu contraseña?</button>
              </div>
              <div className="input-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                />
                <span className="checkmark" />
                Mantener sesión iniciada por 30 días
              </label>
            </div>

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              className="login-btn"
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" /> Verificando...
                </span>
              ) : (
                <span className="btn-content">
                  Iniciar Sesión
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              )}
            </button>

            <p className="contact-admin">
              ¿No tienes cuenta? <a href="/register">Regístrate</a> · <a href="/reset-password">Recuperar contraseña</a>
            </p>
          </div>

          <div className="form-footer">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Conexión Segura
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
              SSL 256-bit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}