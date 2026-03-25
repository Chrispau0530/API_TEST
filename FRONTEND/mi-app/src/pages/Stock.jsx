import { useState, useEffect } from 'react'
import { productosAPI, stockAPI } from '../services/api'

export default function Stock() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [movs, setMovs] = useState([])
  const [form, setForm] = useState({ tipo: 'IN', cantidad: 0, descripcion: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const res = await productosAPI.getAll(); setProductos(res.data || res) }
    catch (e) { setError(e.message || 'Error cargando productos') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openMovs = async (p) => {
    setSelected(p); setMovs([]); setError('')
    try {
      const res = await stockAPI.getMovements(p.id)
      setMovs(res.data || res)
    } catch (e) { setError(e.response?.data || e.message) }
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async () => {
    setSaving(true); setError('')
    try {
      const payload = { tipo: form.tipo, cantidad: Number(form.cantidad), descripcion: form.descripcion }
      await stockAPI.createMovement(selected.id, payload)
      await openMovs(selected)
      await load()
      setForm({ tipo: 'IN', cantidad: 0, descripcion: '' })
    } catch (e) { setError(e.response?.data || e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="card">
      <div className="table-header">
        <div className="table-header-left">
          <h2>Control de Stock</h2>
          <p>{productos.length} productos</p>
        </div>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Producto</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="td-mono" data-label="ID">#{p.id}</td>
                  <td data-label="Producto">{p.Descripcion || p.nombre || `Prod ${p.id}`}</td>
                  <td className="td-mono" data-label="Stock">{p.stock ?? 0}</td>
                  <td data-label="Acciones">
                    <button className="btn btn-ghost btn-sm" onClick={() => openMovs(p)}>Movimientos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Movimientos — Producto #{selected.id}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="form-alert error">{error}</div>}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block' }}>Tipo</label>
                <select name="tipo" value={form.tipo} onChange={handleChange}>
                  <option value="IN">Entrada</option>
                  <option value="OUT">Salida</option>
                </select>
                <label style={{ display: 'block', marginTop: 8 }}>Cantidad</label>
                <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange} />
                <label style={{ display: 'block', marginTop: 8 }}>Descripción</label>
                <input name="descripcion" value={form.descripcion} onChange={handleChange} />
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cerrar</button>
                  <button className="btn btn-primary" onClick={handleAdd} disabled={saving} style={{ marginLeft: 8 }}>{saving ? 'Guardando...' : 'Agregar'}</button>
                </div>
              </div>

              <h4>Historial</h4>
              <div style={{ maxHeight: 280, overflow: 'auto' }}>
                <table style={{ width: '100%' }}>
                  <thead><tr><th>Tipo</th><th>Cantidad</th><th>Usuario</th><th>Fecha</th><th>Desc</th></tr></thead>
                  <tbody>
                    {movs.map(m => (
                      <tr key={m.Id}>
                        <td data-label="Tipo">{m.tipo}</td>
                        <td className="td-mono" data-label="Cantidad">{m.cantidad}</td>
                        <td className="td-mono" data-label="Usuario">{m.usuario_Id ?? '—'}</td>
                        <td className="td-mono" data-label="Fecha">{m.fecha ? new Date(m.fecha).toLocaleString() : '—'}</td>
                        <td data-label="Desc">{m.descripcion || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
