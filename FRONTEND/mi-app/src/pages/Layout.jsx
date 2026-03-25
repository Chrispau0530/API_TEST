import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  {
    section: 'PRINCIPAL',
    items: [
      { to: '/dashboard',  label: 'Dashboard',  icon: <IconDashboard /> },
    ]
  },
  {
    section: 'GESTIÓN',
    items: [
      { to: '/dashboard/usuarios',  label: 'Usuarios',  icon: <IconUsers /> },
      { to: '/dashboard/clientes',  label: 'Clientes',  icon: <IconClients /> },
          { to: '/dashboard/productos', label: 'Productos', icon: <IconBox /> },
          { to: '/dashboard/vehiculos', label: 'Vehículos', icon: <IconCar /> },
          { to: '/dashboard/stock',     label: 'Stock',     icon: <IconBox /> },
      { to: '/dashboard/servicios', label: 'Servicios', icon: <IconService /> },
    ]
  },
  {
    section: 'REPORTES',
    items: [
      { to: '/dashboard/detalle', label: 'Servs. Detallados', icon: <IconReport /> },
    ]
  }
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobile = () => setMobileOpen(v => !v)

  const closeMobile = () => setMobileOpen(false)

  // Título dinámico según ruta
  const pageTitle = {
    '/dashboard': { title: 'Dashboard', sub: 'Resumen general del sistema' },
    '/dashboard/usuarios': { title: 'Usuarios', sub: 'Gestiona los usuarios del sistema' },
    '/dashboard/clientes': { title: 'Clientes', sub: 'Directorio de clientes registrados' },
    '/dashboard/vehiculos': { title: 'Vehículos', sub: 'Vehículos vinculados a clientes' },
    '/dashboard/servicios': { title: 'Servicios', sub: 'Catálogo de servicios disponibles' },
    '/dashboard/detalle': { title: 'Servicios Detallados', sub: 'Historial completo de servicios realizados' },
  }[location.pathname] || { title: 'Autolavado Pro', sub: '' }

  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AP'

  return (
    <div className="app-shell">
      {/* ─── Sidebar ─────────────────────────── */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="sidebar-logo-text">
            <strong>Autolavado Pro</strong>
            <span>v4.5.0-clinical</span>
          </div>
        </div>

        {/* Toggle */}
        <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)} aria-label="Colapsar menú">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed
              ? <polyline points="9 18 15 12 9 6"/>
              : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/dashboard'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  data-label={label}
                  onClick={closeMobile}
                >
                  <span className="nav-item-icon">{icon}</span>
                  <span className="nav-item-text">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <strong>{user?.nombre || 'Administrador'}</strong>
            <span>{user?.usuario || 'admin'}</span>
          </div>
        </div>
      </aside>

      {/* ─── Main ────────────────────────────── */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="topbar">
          <button className="topbar-hamburger" onClick={toggleMobile} aria-label="Toggle menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="topbar-left">
            <h1>{pageTitle.title}</h1>
            {pageTitle.sub && <p>{pageTitle.sub}</p>}
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" title="Notificaciones">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          </div>
        </header>

        <main className="page-body">
          <Outlet />
        </main>
      </div>
      {mobileOpen && <div className="mobile-overlay" onClick={closeMobile} />}
    </div>
  )
}

/* ─── Íconos SVG inline ─────────────────────── */
function IconDashboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
}
function IconUsers() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
}
function IconClients() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconCar() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
}
function IconService() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>
}
function IconReport() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
}
function IconBox() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73L12 2 4 6.27A2 2 0 003 8v8a2 2 0 001 1.73L12 22l8-4.27A2 2 0 0021 16z"/><path d="M12 7v7"/></svg>
}