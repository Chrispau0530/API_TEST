import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosAPI } from '../services/api'
import './Login.css'

export default function ResetPassword() {
  const [usuario, setUsuario] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmContrasena, setConfirmContrasena] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!usuario || !nuevaContrasena || !confirmContrasena) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    if (nuevaContrasena !== confirmContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await usuariosAPI.resetPassword({ usuario, nueva_contrasena: nuevaContrasena })
      setSuccess('Contraseña restablecida correctamente. Redirigiendo a login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al restablecer la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logo">
            <span className="logo-icon">🔒</span>
            <span className="logo-name">Autolavado Pro</span>
          </div>
          <div className="hero-text">
            <h2>Recupera tu acceso<br />en segundos.</h2>
            <p>Asegura tu cuenta con una nueva contraseña segura.</p>
          </div>
          <div className="hero-footer">© 2024 Autolavado Pro · v4.5.0</div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <h1>Resetear Contraseña</h1>
            <p>Ingresa tus datos para restablecer contraseña.</p>
          </div>

          <div className="form-body">
            <div className="form-group">
              <label htmlFor="usuario">Usuario / Correo</label>
              <input id="usuario" type="text" value={usuario} placeholder="usuario@autolavado.pro" onChange={(e) => setUsuario(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
              <input id="nuevaContrasena" type="password" value={nuevaContrasena} placeholder="Nueva contraseña" onChange={(e) => setNuevaContrasena(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="confirmContrasena">Confirmar Contraseña</label>
              <input id="confirmContrasena" type="password" value={confirmContrasena} placeholder="Confirmar contraseña" onChange={(e) => setConfirmContrasena(e.target.value)} disabled={loading} />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="error-message" style={{ background: '#d1fae5', color: '#064e3b', border: '1px solid #a7f3d0' }}>{success}</div>}

            <button type="button" className="login-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Procesando...' : 'Resetear Contraseña'}
            </button>

            <p className="contact-admin">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
