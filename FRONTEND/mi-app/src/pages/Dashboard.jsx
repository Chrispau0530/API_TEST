import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() { return localStorage.getItem('token') }

function authHeaders() {
  return { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ usuarios: 0, clientes: 0, vehiculos: 0, servicios: 0 })
  const [detalle, setDetalle] = useState([])
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function load() {
      try {
        const h = authHeaders()
        const [u, c, v, s, d] = await Promise.all([
          fetch(`${API}/usuarios/`, { headers: h }),
          fetch(`${API}/clientes/`, { headers: h }),
          fetch(`${API}/vehiculos/`, { headers: h }),
          fetch(`${API}/servicios/`, { headers: h }),
          fetch(`${API}/servicios-detalle/?fecha=${today}`, { headers: h }),
        ])
        const [us, cs, vs, ss, ds] = await Promise.all([u.json(), c.json(), v.json(), s.json(), d.json()])
        setStats({ usuarios: us.length, clientes: cs.length, vehiculos: vs.length, servicios: ss.length })
        setDetalle(Array.isArray(ds) ? ds.slice(0, 8) : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalHoy = detalle.reduce((sum, s) => sum + (s.costo_total || 0), 0)

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Usuarios" value={stats.usuarios} icon="blue" sub="Registrados" iconEl={<IconUsers />}
          onClick={() => navigate('/dashboard/usuarios')} />
        <StatCard label="Clientes" value={stats.clientes} icon="green" sub="En el sistema" iconEl={<IconClients />}
          onClick={() => navigate('/dashboard/clientes')} />
        <StatCard label="Vehículos" value={stats.vehiculos} icon="amber" sub="Registrados" iconEl={<IconCar />}
          onClick={() => navigate('/dashboard/vehiculos')} />
        <StatCard label="Servicios hoy" value={detalle.length} icon="red"
          sub={`$${totalHoy.toLocaleString()} recaudado`} iconEl={<IconService />}
          onClick={() => navigate('/dashboard/detalle')} />
      </div>

      {/* Grid inferior */}
      <div className="dash-grid">
        {/* Tabla servicios de hoy */}
        <div className="card span-2">
          <div className="table-header">
            <div className="table-header-left">
              <h2>Servicios de Hoy</h2>
              <p>{new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard/detalle')}>
              Ver todos →
            </button>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : detalle.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Sin servicios hoy</h3>
              <p>No se han registrado servicios para esta fecha.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cajero</th>
                    <th>Lavador</th>
                    <th>Vehículo</th>
                    <th>Placas</th>
                    <th>Color</th>
                    <th>Costo</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((s, i) => (
                    <tr key={s.servicio_id}>
                      <td className="td-mono">{i + 1}</td>
                      <td className="td-primary">{s.nombre_cajero}</td>
                      <td>{s.nombre_operativo}</td>
                      <td>{s.modelo_vehiculo}</td>
                      <td><span className="badge badge-blue">{s.placas_vehiculo}</span></td>
                      <td>{s.color_vehiculo}</td>
                      <td className="td-primary">${s.costo_total?.toLocaleString()}</td>
                      <td className="td-mono">
                        {s.fecha_servicio
                          ? new Date(s.fecha_servicio).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {detalle.length > 0 && (
            <div className="pagination">
              <span>Mostrando {detalle.length} servicio{detalle.length !== 1 ? 's' : ''} hoy</span>
              <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                Total: ${totalHoy.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Accesos Rápidos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Nuevo Cliente', path: '/dashboard/clientes', color: 'var(--success)' },
              { label: 'Registrar Vehículo', path: '/dashboard/vehiculos', color: 'var(--warning)' },
              { label: 'Gestionar Usuarios', path: '/dashboard/usuarios', color: 'var(--blue-400)' },
              { label: 'Ver Reporte del Día', path: '/dashboard/detalle', color: 'var(--danger)' },
            ].map(({ label, path, color }) => (
              <button
                key={path}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start', gap: '0.65rem' }}
                onClick={() => navigate(path)}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Info sistema */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Sistema
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'VERSIÓN', value: 'v4.5.0-clinical' },
              { label: 'ESTADO API', value: '● Conectado', color: 'var(--success)' },
              { label: 'FECHA', value: new Date().toLocaleDateString('es-MX') },
              { label: 'ENTORNO', value: 'Producción' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-400)', letterSpacing: '0.07em' }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: color || 'var(--slate-700)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, sub, iconEl, onClick }) {
  return (
    <div className="stat-card" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div>
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-sub">{sub}</div>
      </div>
      <div className={`stat-card-icon ${icon}`}>{iconEl}</div>
    </div>
  )
}

function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
}
function IconClients() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconCar() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
}
function IconService() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
}