import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosAPI } from '../services/api'
import './Login.css'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [papellido, setPapellido] = useState('')
  const [sapellido, setSapellido] = useState('')
  const [usuario, setUsuario] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmContrasena, setConfirmContrasena] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombre || !papellido || !usuario || !contrasena || !confirmContrasena) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }

    if (contrasena !== confirmContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const body = {
        rol_Id: 1,
        nombre,
        papellido,
        sapellido,
        usuario,
        telefono,
        estatus: true,
        contrasena
      }
      await usuariosAPI.create(body)
      setSuccess('Registro exitoso. Redirigiendo a login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error en el registro')
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
            <span className="logo-icon">🏷</span>
            <span className="logo-name">Autolavado Pro</span>
          </div>
          <div className="hero-text">
            <h2>Regístrate ahora<br />y lleva tu autolavado al próximo nivel.</h2>
            <p>El acceso administrativo para tus colaboradores se crea rápidamente.</p>
          </div>
          <div className="hero-footer">© 2024 Autolavado Pro · v4.5.0</div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <h1>Crear Cuenta</h1>
            <p>Completa los datos para registrarte.</p>
          </div>

          <div className="form-body">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" value={nombre} placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="papellido">Apellido Paterno</label>
              <input id="papellido" type="text" value={papellido} placeholder="Apellido Paterno" onChange={(e) => setPapellido(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="sapellido">Apellido Materno</label>
              <input id="sapellido" type="text" value={sapellido} placeholder="Apellido Materno" onChange={(e) => setSapellido(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="usuario">Usuario / Correo</label>
              <input id="usuario" type="text" value={usuario} placeholder="usuario@autolavado.pro" onChange={(e) => setUsuario(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="text" value={telefono} placeholder="55xxxxxxxx" onChange={(e) => setTelefono(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" type="password" value={contrasena} placeholder="Contraseña" onChange={(e) => setContrasena(e.target.value)} disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="confirmContrasena">Confirmar Contraseña</label>
              <input id="confirmContrasena" type="password" value={confirmContrasena} placeholder="Confirmar contraseña" onChange={(e) => setConfirmContrasena(e.target.value)} disabled={loading} />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="error-message" style={{ background: '#d1fae5', color: '#064e3b', border: '1px solid #a7f3d0' }}>{success}</div>}

            <button type="button" className="login-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
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
