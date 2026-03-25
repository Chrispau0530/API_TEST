import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../Hooks/useApi'

export default function ServiciosDetalle() {
  const today = new Date().toISOString().split('T')[0]
  const [fecha, setFecha]     = useState(today)
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setRows(await apiFetch(`/servicios-detalle/?fecha=${fecha}`)) }
    catch (e) { setError(e.message); setRows([]) }
    finally { setLoading(false) }
  }, [fecha])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter(r =>
    `${r.nombre_cajero} ${r.nombre_operativo} ${r.modelo_vehiculo} ${r.placas_vehiculo} ${r.color_vehiculo}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const totalRecaudado = filtered.reduce((sum, r) => sum + (r.costo_total || 0), 0)
  const promedio       = filtered.length ? Math.round(totalRecaudado / filtered.length) : 0

  const isToday = fecha === today
  const fechaLabel = isToday
    ? 'Hoy'
    : new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      {/* Stats de la fecha */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Servicios</div>
            <div className="stat-card-value">{filtered.length}</div>
            <div className="stat-card-sub">{fechaLabel}</div>
          </div>
          <div className="stat-card-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Recaudado</div>
            <div className="stat-card-value">${totalRecaudado.toLocaleString()}</div>
            <div className="stat-card-sub up">{filtered.length} servicios</div>
          </div>
          <div className="stat-card-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Promedio por Servicio</div>
            <div className="stat-card-value">${promedio.toLocaleString()}</div>
            <div className="stat-card-sub">Ticket promedio</div>
          </div>
          <div className="stat-card-icon amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Reporte de Servicios</h2>
            <p style={{ textTransform: 'capitalize' }}>{fechaLabel}</p>
          </div>
          <div className="table-header-right">
            {/* Selector de fecha */}
            <div className="search-box" style={{ gap: '0.6rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input
                type="date"
                value={fecha}
                max={today}
                onChange={e => setFecha(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.83rem', color: 'var(--slate-700)', cursor: 'pointer' }}
              />
            </div>

            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <button className="btn btn-ghost btn-sm" onClick={load} title="Actualizar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="form-alert error" style={{ margin: '1rem 1.5rem' }}>{error}</div>
        )}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <h3>Sin servicios para esta fecha</h3>
            <p>No se encontraron registros para {fechaLabel.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cajero</th>
                  <th>Lavador</th>
                  <th>Vehículo</th>
                  <th>Placas</th>
                  <th>Color</th>
                  <th>Costo Serv.</th>
                  <th>Total</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.servicio_id}>
                    <td className="td-mono" data-label="#">{String(i + 1).padStart(2, '0')}</td>
                    <td className="td-primary" data-label="Cajero">{row.nombre_cajero}</td>
                    <td data-label="Lavador">{row.nombre_operativo}</td>
                    <td data-label="Vehículo">{row.modelo_vehiculo}</td>
                    <td data-label="Placas">
                      <span className="badge badge-blue" style={{ letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        {row.placas_vehiculo}
                      </span>
                    </td>
                    <td data-label="Color">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: row.color_vehiculo?.toLowerCase() || '#ccc',
                          border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0
                        }} />
                        {row.color_vehiculo}
                      </div>
                    </td>
                    <td className="td-mono" data-label="Costo Serv.">${Number(row.costo_servicio).toLocaleString()}</td>
                    <td data-label="Total">
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)', fontFamily: 'var(--font-mono)' }}>
                        ${Number(row.costo_total).toLocaleString()}
                      </span>
                    </td>
                    <td className="td-mono" data-label="Hora">
                      {row.fecha_servicio
                        ? new Date(row.fecha_servicio).toLocaleTimeString('es-MX', {
                            hour: '2-digit', minute: '2-digit'
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="pagination">
            <span>{filtered.length} servicios · {fechaLabel}</span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
              Total: <span style={{ color: 'var(--success)' }}>${totalRecaudado.toLocaleString()}</span>
            </span>
          </div>
        )}
      </div>
    </>
  )
}