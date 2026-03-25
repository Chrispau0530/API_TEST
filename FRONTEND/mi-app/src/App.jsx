// App.jsx — Configuración de rutas del sistema Autolavado Pro
// Reemplaza tu App.jsx actual con este contenido

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Páginas
import Login           from './pages/Login'
import Register        from './pages/Register'
import ResetPassword  from './pages/ResetPassword'
import Layout          from './pages/Layout'
import Dashboard       from './pages/Dashboard'
import Usuarios        from './pages/Usuarios'
import Clientes        from './pages/Clientes'
import Vehiculos       from './pages/Vehiculos'
import Servicios       from './pages/Servicios'
import ServiciosDetalle from './pages/Serviciosdetalle'

// CSS global del dashboard
import './dashboard.css'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Login y auth públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index      element={<Dashboard />} />
          <Route path="usuarios"  element={<Usuarios />} />
          <Route path="clientes"  element={<Clientes />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="detalle"   element={<ServiciosDetalle />} />
        </Route>

        {/* Redirigir raíz al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}