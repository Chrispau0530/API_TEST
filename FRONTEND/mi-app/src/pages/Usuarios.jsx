import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../Hooks/useApi'


const ESTATUS = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
]

const EMPTY_FORM = {
    rol_Id: '', nombre: '', papellido: '', sapellido: '',
    usuario: '', telefono: '', contrasena: '', estatus: 1,
}

export default function Usuarios() {
    const [rows, setRows] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // ✅ FIX PRINCIPAL: se eliminó la coma extra ", []" al final del useCallback
    const load = useCallback(async () => {
        setLoading(true)
        try {
            const us = await apiFetch('/usuarios/')

            let rs = []
            try {
                const rolesRaw = await apiFetch('/roles/')

                // ✅ "description" es el campo real que manda el backend
                rs = (Array.isArray(rolesRaw) ? rolesRaw : []).map(r => ({
                    id: r.id,
                    nombre: r.description,
                    estatus: r.estatus,
                }))

            } catch (inner) {
                console.error('Error al cargar roles:', inner)
                // Fallback con los 4 roles reales de la DB
                rs = [
                    { id: 1, nombre: 'Administrador', estatus: true },
                    { id: 2, nombre: 'Cajero',        estatus: true },
                    { id: 3, nombre: 'Lavador',       estatus: true },
                    { id: 4, nombre: 'Cliente',       estatus: true },
                ]
            }

            setRows(us)
            setRoles(rs)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, []) // ✅ solo un [] al final, sin coma extra
    

    useEffect(() => { load() }, [load])

    const filtered = rows.filter(r =>
        `${r.nombre} ${r.papellido} ${r.usuario} ${r.telefono}`
            .toLowerCase().includes(search.toLowerCase())
    )

    const openCreate = () => {
        setForm(EMPTY_FORM); setError(''); setModal('create')
    }

    const openEdit = (row) => {
        setSelected(row)
        setForm({
            rol_Id: row.rol_Id, nombre: row.nombre, papellido: row.papellido,
            sapellido: row.sapellido || '', usuario: row.usuario,
            telefono: row.telefono || '', contrasena: '', estatus: row.estatus,
        })
        setError('')
        setModal('edit')
    }

    const openDelete = (row) => { setSelected(row); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null); setError('') }

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSave = async () => {
        setSaving(true); setError('')
        try {
            const selectedRole = form.rol_Id ? Number(form.rol_Id) : 1
            const body = { ...form, rol_Id: selectedRole, estatus: Number(form.estatus) }
            if (modal === 'edit' && !body.contrasena) delete body.contrasena

            if (modal === 'create') {
                await apiFetch('/usuarios/', { method: 'POST', body: JSON.stringify(body) })
            } else {
                const { usuario, contrasena, ...rest } = body
                const payload = contrasena ? { ...rest, contrasena } : rest
                await apiFetch(`/usuarios/${selected.Id}`, { method: 'PUT', body: JSON.stringify(payload) })
            }
            closeModal()
            load()
        } catch (e) { setError(e.message) }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await apiFetch(`/usuarios/${selected.Id}`, { method: 'DELETE' })
            closeModal(); load()
        } catch (e) { setError(e.message) }
        finally { setSaving(false) }
    }

    // ✅ Compara como Number para evitar "1" === 1 → false
    const rolName = id => {
        const r = roles.find(r => Number(r.id) === Number(id))
        return r ? r.nombre : 'Rol desconocido'
    }

    return (
        <>
            <div className="card">
                <div className="table-header">
                    <div className="table-header-left">
                        <h2>Usuarios del Sistema</h2>
                        <p>{filtered.length} registros encontrados</p>
                    </div>
                    <div className="table-header-right">
                        <div className="search-box">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                placeholder="Buscar usuario..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner-wrap"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                        </svg>
                        <h3>Sin usuarios</h3>
                        <p>Crea el primer usuario del sistema.</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Teléfono</th>
                                    <th>Estatus</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(row => (
                                    <tr key={row.Id}>
                                        <td className="td-mono">#{row.Id}</td>
                                        <td className="td-primary">{row.nombre} {row.papellido}</td>
                                        <td className="td-mono">{row.usuario}</td>
                                        <td><span className="badge badge-blue">{rolName(row.rol_Id)}</span></td>
                                        <td>{row.telefono || '—'}</td>
                                        <td>
                                            <span className={`badge ${row.estatus ? 'badge-active' : 'badge-inactive'}`}>
                                                {row.estatus ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="td-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Editar
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => openDelete(row)}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
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
                    <span>{filtered.length} de {rows.length} usuarios</span>
                </div>
            </div>

            {/* Modal crear / editar */}
            {(modal === 'create' || modal === 'edit') && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{modal === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</h3>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="form-alert error">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {error}
                                </div>
                            )}
                            <div className="form-grid">
                                <div className="field">
                                    <label>Nombre</label>
                                    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" />
                                </div>
                                <div className="field">
                                    <label>Primer Apellido</label>
                                    <input name="papellido" value={form.papellido} onChange={handleChange} placeholder="García" />
                                </div>
                                <div className="field">
                                    <label>Segundo Apellido</label>
                                    <input name="sapellido" value={form.sapellido} onChange={handleChange} placeholder="López" />
                                </div>
                                <div className="field">
                                    <label>Teléfono</label>
                                    <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="7771234567" />
                                </div>
                                <div className="field">
                                    <label>Usuario</label>
                                    <input name="usuario" value={form.usuario} onChange={handleChange}
                                        placeholder="juan.garcia" disabled={modal === 'edit'} />
                                </div>
                                <div className="field">
                                    <label>{modal === 'edit' ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
                                    <input name="contrasena" type="password" value={form.contrasena} onChange={handleChange} placeholder="••••••••" />
                                </div>
                                <div className="field">
                                    <label>Rol</label>
                                    <select name="rol_Id" value={form.rol_Id} onChange={handleChange}>
                                        <option value="">— Selecciona rol —</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Estatus</label>
                                    <select name="estatus" value={form.estatus} onChange={handleChange}>
                                        {ESTATUS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : modal === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal eliminar */}
            {modal === 'delete' && selected && (
                <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="modal" style={{ maxWidth: 420 }}>
                        <div className="modal-header">
                            <h3>Eliminar Usuario</h3>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>
                                ¿Estás seguro de eliminar a{' '}
                                <strong style={{ color: 'var(--slate-900)' }}>
                                    {selected.nombre} {selected.papellido}
                                </strong>?
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