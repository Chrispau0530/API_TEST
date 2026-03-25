import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../Hooks/useApi'

const EMPTY_FORM = {
  cliente_Id: '', matricula: '', modelo: '',
  color: '', numero_del_dueno: '', estatus: 1,
}

export default function Vehiculos() {
  const [rows, setRows]         = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [vs, cs] = await Promise.all([apiFetch('/vehiculos/'), apiFetch('/clientes/')])
      setRows(vs); setClientes(cs)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter(r =>
    `${r.matricula} ${r.modelo} ${r.color} ${r.numero_del_dueno}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const clienteNombre = id => {
    const c = clientes.find(c => c.Id === id)
    return c ? `${c.nombre} ${c.papellido}` : `#${id}`
  }

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal('create') }
  const openEdit   = row => {
    setSelected(row)
    setForm({
      cliente_Id: row.cliente_Id, matricula: row.matricula, modelo: row.modelo,
      color: row.color || '', numero_del_dueno: row.numero_del_dueno || '', estatus: row.estatus,
    })
    setError(''); setModal('edit')
  }
  const openDelete = row => { setSelected(row); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null); setError('') }
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...form, cliente_Id: Number(form.cliente_Id), estatus: Number(form.estatus) }
      if (modal === 'create') {
        await apiFetch('/vehiculos/', { method: 'POST', body: JSON.stringify(body) })
      } else {
        await apiFetch(`/vehiculos/${selected.Id}`, { method: 'PUT', body: JSON.stringify(body) })
      }
      closeModal(); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await apiFetch(`/vehiculos/${selected.Id}`, { method: 'DELETE' }); closeModal(); load() }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="card">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Registro de Vehículos</h2>
            <p>{filtered.length} vehículos registrados</p>
          </div>
          <div className="table-header-right">
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Placas, modelo, color..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo Vehículo
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/>
              <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
            <h3>Sin vehículos</h3>
            <p>Registra el primer vehículo.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placas</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Propietario (tel.)</th>
                  <th>Cliente</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.Id}>
                    <td className="td-mono">#{row.Id}</td>
                    <td>
                      <span className="badge badge-blue" style={{ letterSpacing: '0.05em' }}>
                        {row.matricula}
                      </span>
                    </td>
                    <td className="td-primary">{row.modelo}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: 12, height: 12, borderRadius: '50%',
                          background: row.color?.toLowerCase() || '#ccc',
                          border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0
                        }} />
                        {row.color || '—'}
                      </div>
                    </td>
                    <td className="td-mono">{row.numero_del_dueno || '—'}</td>
                    <td>{clienteNombre(row.cliente_Id)}</td>
                    <td>
                      <span className={`badge ${row.estatus ? 'badge-active' : 'badge-inactive'}`}>
                        {row.estatus ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
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
          <span>{filtered.length} de {rows.length} vehículos</span>
        </div>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="form-alert error">{error}</div>}
              <div className="form-grid">
                <div className="field">
                  <label>Matrícula / Placas</label>
                  <input name="matricula" value={form.matricula} onChange={handleChange}
                    placeholder="ABC-123" style={{ textTransform: 'uppercase' }} />
                </div>
                <div className="field">
                  <label>Modelo</label>
                  <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Toyota Corolla 2022" />
                </div>
                <div className="field">
                  <label>Color</label>
                  <input name="color" value={form.color} onChange={handleChange} placeholder="Blanco perla" />
                </div>
                <div className="field">
                  <label>Teléfono del Dueño</label>
                  <input name="numero_del_dueno" value={form.numero_del_dueno} onChange={handleChange} placeholder="7771234567" />
                </div>
                <div className="field">
                  <label>Cliente</label>
                  <select name="cliente_Id" value={form.cliente_Id} onChange={handleChange}>
                    <option value="">— Selecciona cliente —</option>
                    {clientes.map(c => (
                      <option key={c.Id} value={c.Id}>{c.nombre} {c.papellido}</option>
                    ))}
                  </select>
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
                {saving ? 'Guardando...' : modal === 'create' ? 'Registrar Vehículo' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Eliminar Vehículo</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>
                ¿Eliminar el vehículo{' '}
                <strong style={{ color: 'var(--slate-900)' }}>
                  {selected.matricula} — {selected.modelo}
                </strong>?
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