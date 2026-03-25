import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../Hooks/useApi'

const EMPTY_FORM = {
  nombre: '', papellido: '', sapellido: '',
  direccion: '', telefono: '', estatus: 1,
}

export default function Clientes() {
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
    try { setRows(await apiFetch('/clientes/')) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter(r =>
    `${r.nombre} ${r.papellido} ${r.telefono} ${r.direccion}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal('create') }
  const openEdit   = row => {
    setSelected(row)
    setForm({ nombre: row.nombre, papellido: row.papellido, sapellido: row.sapellido || '',
      direccion: row.direccion || '', telefono: row.telefono || '', estatus: row.estatus })
    setError(''); setModal('edit')
  }
  const openDelete = row => { setSelected(row); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null); setError('') }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...form, estatus: Number(form.estatus) }
      if (modal === 'create') {
        await apiFetch('/clientes/', { method: 'POST', body: JSON.stringify(body) })
      } else {
        await apiFetch(`/clientes/${selected.Id}`, { method: 'PUT', body: JSON.stringify(body) })
      }
      closeModal(); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await apiFetch(`/clientes/${selected.Id}`, { method: 'DELETE' }); closeModal(); load() }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="card">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Directorio de Clientes</h2>
            <p>{filtered.length} registros encontrados</p>
          </div>
          <div className="table-header-right">
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo Cliente
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <h3>Sin clientes</h3>
            <p>Registra el primer cliente del autolavado.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estatus</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.Id}>
                    <td className="td-mono" data-label="ID">#{row.Id}</td>
                    <td className="td-primary" data-label="Nombre">{row.nombre} {row.papellido} {row.sapellido}</td>
                    <td className="td-mono" data-label="Teléfono">{row.telefono || '—'}</td>
                    <td data-label="Dirección" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.direccion || '—'}
                    </td>
                    <td data-label="Estatus">
                      <span className={`badge ${row.estatus ? 'badge-active' : 'badge-inactive'}`}>
                        {row.estatus ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="td-mono" data-label="Registro">
                      {row.fecha_registro
                        ? new Date(row.fecha_registro).toLocaleDateString('es-MX')
                        : '—'}
                    </td>
                    <td data-label="Acciones">
                      <div className="td-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(row)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination">
          <span>{filtered.length} de {rows.length} clientes</span>
        </div>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="form-alert error">{error}</div>}
              <div className="form-grid">
                <div className="field">
                  <label>Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="María" />
                </div>
                <div className="field">
                  <label>Primer Apellido</label>
                  <input name="papellido" value={form.papellido} onChange={handleChange} placeholder="Hernández" />
                </div>
                <div className="field">
                  <label>Segundo Apellido</label>
                  <input name="sapellido" value={form.sapellido} onChange={handleChange} placeholder="Ramírez" />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="7771234567" />
                </div>
                <div className="field full">
                  <label>Dirección</label>
                  <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, Colonia, Ciudad" />
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
                {saving ? 'Guardando...' : modal === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Eliminar Cliente</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>
                ¿Eliminar a <strong style={{ color: 'var(--slate-900)' }}>
                  {selected.nombre} {selected.papellido}
                </strong>? Esta acción no se puede deshacer.
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