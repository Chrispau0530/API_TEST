import { useState, useEffect } from 'react'
import { productosAPI } from '../services/api'

const EMPTY = { Descripcion: '', Descuento: 0, Costo_Total: 0, stock: 0, estatus: 1 }

export default function Productos() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const res = await productosAPI.getAll(); setRows(res.data || res) }
    catch (e) { setError(e.response?.data || e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setError(''); setModal('create') }
  const openEdit = row => { setSelected(row); setForm({ Descripcion: row.Descripcion || '', Descuento: row.Descuento || 0, Costo_Total: row.Costo_Total || 0, stock: row.stock || 0, estatus: row.estatus }); setModal('edit') }
  const openDelete = row => { setSelected(row); setModal('delete') }
  const close = () => { setModal(null); setSelected(null); setError('') }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (modal === 'create') {
        await productosAPI.create(form)
      } else {
        await productosAPI.update(selected.id, form)
      }
      close(); load()
    } catch (e) { setError(e.response?.data || e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await productosAPI.delete(selected.id); close(); load() }
    catch (e) { setError(e.response?.data || e.message) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="card">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Productos</h2>
            <p>{rows.length} registros</p>
          </div>
          <div className="table-header-right">
            <button className="btn btn-primary" onClick={openCreate}>Nuevo Producto</button>
          </div>
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Descripción</th><th>Costo</th><th>Descuento</th><th>Stock</th><th>Estatus</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td className="td-mono">#{r.id}</td>
                    <td>{r.Descripcion || `Prod ${r.id}`}</td>
                    <td className="td-mono">{r.Costo_Total}</td>
                    <td className="td-mono">{r.Descuento ?? '—'}</td>
                    <td className="td-mono">{r.stock ?? 0}</td>
                    <td>{r.estatus ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openDelete(r)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="form-alert error">{error}</div>}
              <div className="form-grid">
                <div className="field"><label>Descripción</label><input name="Descripcion" value={form.Descripcion} onChange={handleChange} /></div>
                <div className="field"><label>Costo Total</label><input name="Costo_Total" type="number" value={form.Costo_Total} onChange={handleChange} /></div>
                <div className="field"><label>Descuento</label><input name="Descuento" type="number" value={form.Descuento} onChange={handleChange} /></div>
                <div className="field"><label>Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} /></div>
                <div className="field"><label>Estatus</label>
                  <select name="estatus" value={form.estatus} onChange={handleChange}><option value={1}>Activo</option><option value={0}>Inactivo</option></select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={close}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : modal === 'create' ? 'Crear' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header"><h3>Eliminar Producto</h3><button className="modal-close" onClick={close}>✕</button></div>
            <div className="modal-body">
              <p>¿Eliminar <strong>{selected.Descripcion || `Prod ${selected.id}`}</strong>? Esta acción no se puede deshacer.</p>
              {error && <div className="form-alert error">{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={close}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Eliminando...' : 'Sí, eliminar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
