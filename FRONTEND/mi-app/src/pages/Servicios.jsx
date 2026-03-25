import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../Hooks/useApi'

const EMPTY_FORM = {
  nombre: '', descripcion: '', costo: '', estatus: 1,
}

export default function Servicios() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setRows(await apiFetch('/servicios/')) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter(r =>
    `${r.nombre} ${r.descripcion}`.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal('create') }
  const openEdit   = row => {
    setSelected(row)
    setForm({ nombre: row.nombre, descripcion: row.descripcion || '', costo: row.costo, estatus: row.estatus })
    setError(''); setModal('edit')
  }
  const openDelete = row => { setSelected(row); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null); setError('') }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...form, costo: Number(form.costo), estatus: Number(form.estatus) }
      if (modal === 'create') {
        await apiFetch('/servicios/', { method: 'POST', body: JSON.stringify(body) })
      } else {
        await apiFetch(`/servicios/${selected.Id}`, { method: 'PUT', body: JSON.stringify(body) })
      }
      closeModal(); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await apiFetch(`/servicios/${selected.Id}`, { method: 'DELETE' }); closeModal(); load() }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const totalCatalogo = rows.reduce((sum, r) => sum + (r.costo || 0), 0)

  return (
    <>
      {/* Mini stats */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Total Servicios</div>
            <div className="stat-card-value">{rows.length}</div>
            <div className="stat-card-sub">En catálogo</div>
          </div>
          <div className="stat-card-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Activos</div>
            <div className="stat-card-value">{rows.filter(r => r.estatus).length}</div>
            <div className="stat-card-sub up">Disponibles</div>
          </div>
          <div className="stat-card-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card-label">Costo Promedio</div>
            <div className="stat-card-value">
              ${rows.length ? Math.round(totalCatalogo / rows.length).toLocaleString() : 0}
            </div>
            <div className="stat-card-sub">Por servicio</div>
          </div>
          <div className="stat-card-icon amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Catálogo de Servicios</h2>
            <p>{filtered.length} servicios encontrados</p>
          </div>
          <div className="table-header-right">
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Buscar servicio..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo Servicio
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/>
            </svg>
            <h3>Sin servicios</h3>
            <p>Agrega el primer servicio al catálogo.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del Servicio</th>
                  <th>Descripción</th>
                  <th>Costo</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.Id}>
                    <td className="td-mono" data-label="ID">#{row.Id}</td>
                    <td className="td-primary" data-label="Nombre">{row.nombre}</td>
                    <td data-label="Descripción" style={{ color: 'var(--slate-500)', fontSize: '0.82rem', maxWidth: 280,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.descripcion || '—'}
                    </td>
                    <td data-label="Costo">
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)', fontFamily: 'var(--font-mono)' }}>
                        ${Number(row.costo).toLocaleString()}
                      </span>
                    </td>
                    <td data-label="Estatus">
                      <span className={`badge ${row.estatus ? 'badge-active' : 'badge-inactive'}`}>
                        {row.estatus ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className="td-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(row)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination">
          <span>{filtered.length} de {rows.length} servicios</span>
        </div>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="form-alert error">{error}</div>}
              <div className="form-grid">
                <div className="field full">
                  <label>Nombre del Servicio</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange}
                    placeholder="Lavado completo exterior" />
                </div>
                <div className="field full">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                    placeholder="Detalle del servicio..." />
                </div>
                <div className="field">
                  <label>Costo ($)</label>
                  <input name="costo" type="number" value={form.costo} onChange={handleChange}
                    placeholder="150" min="0" />
                </div>
                <div className="field">
                  <label>Estatus</label>
                  <select name="estatus" value={form.estatus} onChange={handleChange}>
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Eliminar Servicio</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>
                ¿Eliminar el servicio{' '}
                <strong style={{ color: 'var(--slate-900)' }}>{selected.nombre}</strong>?
                Esta acción no se puede deshacer.
              </p>
              {error && <div className="form-alert error" style={{ marginTop: '1rem' }}>{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}