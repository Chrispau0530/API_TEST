import { useState, useEffect } from 'react'
import { rolesAPI, usuariosAPI, clientesAPI, vehiculosAPI, serviciosAPI, productosAPI } from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('roles')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData(activeTab)
  }, [activeTab])

  const loadData = async (tab) => {
    setLoading(true)
    setError('')
    try {
      let result = []
      switch (tab) {
        case 'roles':
          result = await rolesAPI.getAll()
          break
        case 'usuarios':
          result = await usuariosAPI.getAll()
          break
        case 'clientes':
          result = await clientesAPI.getAll()
          break
        case 'vehiculos':
          result = await vehiculosAPI.getAll()
          break
        case 'servicios':
          result = await serviciosAPI.getAll()
          break
        case 'productos':
          result = await productosAPI.getAll()
          break
        default:
          result = []
      }
      setData(result.data || [])
    } catch (err) {
      setError(`Error cargando ${tab}: ${err.message}`)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard - Sistema Autolavado</h1>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
        <button 
          className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          Usuarios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          Clientes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'vehiculos' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehiculos')}
        >
          Vehículos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'servicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('servicios')}
        >
          Servicios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
      </div>

      <div className="content">
        {loading && <div className="loading">Cargando...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && data.length === 0 && (
          <div className="no-data">No hay datos disponibles</div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {data.length > 0 && Object.keys(data[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {Object.values(item).map((value, vidx) => (
                      <td key={vidx}>
                        {typeof value === 'boolean' 
                          ? value ? '✓' : '✗' 
                          : value === null ? '-' : String(value).substring(0, 50)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Total de Registros</h3>
          <p className="stat-number">{data.length}</p>
        </div>
      </div>
    </div>
  )
}
