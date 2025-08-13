import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Management() {
  const [activeTab, setActiveTab] = useState('drivers')
  const [drivers, setDrivers] = useState([])
  const [routes, setRoutes] = useState([])
  const [orders, setOrders] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      // Test backend connectivity
      console.log('Testing backend connection to:', API_BASE)
      
      try {
        const testRes = await axios.get('http://127.0.0.1:8000/')
        console.log('Backend test response:', testRes.data)
        setBackendStatus('connected')
      } catch (testError) {
        console.error('Backend connection failed:', testError)
        setBackendStatus('disconnected')
        setError('Cannot connect to backend server. Make sure Django is running on http://127.0.0.1:8000')
        setLoading(false)
        return
      }
      
      console.log('Fetching data...')
      
      const driversRes = await axios.get(`${API_BASE}/drivers/`)
      console.log('Drivers API response:', driversRes.data)
      
      const routesRes = await axios.get(`${API_BASE}/routes/`)
      console.log('Routes API response:', routesRes.data)
      
      const ordersRes = await axios.get(`${API_BASE}/orders/`)
      console.log('Orders API response:', ordersRes.data)
      
      console.log('Setting state with:')
      console.log('- Drivers array length:', Array.isArray(driversRes.data) ? driversRes.data.length : 'Not an array')
      console.log('- Routes array length:', Array.isArray(routesRes.data) ? routesRes.data.length : 'Not an array')
      console.log('- Orders array length:', Array.isArray(ordersRes.data) ? ordersRes.data.length : 'Not an array')
      
      setDrivers(Array.isArray(driversRes.data) ? driversRes.data : [])
      setRoutes(Array.isArray(routesRes.data) ? routesRes.data : [])
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
      setBackendStatus('connected')
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message)
      setBackendStatus('error')
      if (error.response?.status === 500) {
        setError('Server Error (500): Database connection issue. Check if MySQL is running.')
      } else {
        setError(`API Error: ${error.message}. Check if backend is running on http://127.0.0.1:8000`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await axios.delete(`${API_BASE}/${type}/${id}/`)
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleSave = async (type, data) => {
    try {
      if (data.id) {
        await axios.put(`${API_BASE}/${type}/${data.id}/`, data)
      } else {
        await axios.post(`${API_BASE}/${type}/`, data)
      }
      
      setEditingItem(null)
      fetchData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const DriversTab = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Drivers</h3>
        <button
          onClick={() => setEditingItem({ type: 'drivers', data: { name: '', shift_hours: 8, past_week_hours_raw: '' } })}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Driver
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Shift Hours</th>
              <th className="px-4 py-2 text-left">Past Week Hours</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-t">
                <td className="px-4 py-2">{driver.name}</td>
                <td className="px-4 py-2">{driver.shift_hours}</td>
                <td className="px-4 py-2">{driver.total_past_week_hours}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setEditingItem({ type: 'drivers', data: driver })}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('drivers', driver.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const RoutesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Routes</h3>
        <button
          onClick={() => setEditingItem({ type: 'routes', data: { route_id: '', distance_km: 0, traffic_level: 'Low', base_time_min: 0 } })}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Route
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Route ID</th>
              <th className="px-4 py-2 text-left">Distance (km)</th>
              <th className="px-4 py-2 text-left">Traffic Level</th>
              <th className="px-4 py-2 text-left">Base Time (min)</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.route_id} className="border-t">
                <td className="px-4 py-2">{route.route_id}</td>
                <td className="px-4 py-2">{route.distance_km}</td>
                <td className="px-4 py-2">{route.traffic_level}</td>
                <td className="px-4 py-2">{route.base_time_min}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setEditingItem({ type: 'routes', data: route })}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('routes', route.route_id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const OrdersTab = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Orders</h3>
        <button
          onClick={() => setEditingItem({ type: 'orders', data: { order_id: '', value_rs: 0, route: routes[0]?.route_id || '', delivery_time_min: 0 } })}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Value (₹)</th>
              <th className="px-4 py-2 text-left">Route ID</th>
              <th className="px-4 py-2 text-left">Delivery Time (min)</th>
              <th className="px-4 py-2 text-left">Assigned Driver</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-t">
                <td className="px-4 py-2">{order.order_id}</td>
                <td className="px-4 py-2">₹{order.value_rs}</td>
                <td className="px-4 py-2">{order.route_id}</td>
                <td className="px-4 py-2">{order.delivery_time_min}</td>
                <td className="px-4 py-2">{order.assigned_driver_name || 'Unassigned'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setEditingItem({ type: 'orders', data: order })}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('orders', order.order_id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {['drivers', 'routes', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'drivers' && <DriversTab />}
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem.data.id ? 'Edit' : 'Add'} {editingItem.type.slice(0, -1)}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave(editingItem.type, editingItem.data)
              }}
            >
              {/* Form fields would go here - simplified for brevity */}
              <div className="space-y-4">
                {Object.keys(editingItem.data).map((key) => {
                  if (key === 'id' || key === 'total_past_week_hours' || key === 'assigned_driver_name') return null
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        type={typeof editingItem.data[key] === 'number' ? 'number' : 'text'}
                        value={editingItem.data[key]}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            [key]: typeof editingItem.data[key] === 'number' ? 
                              parseFloat(e.target.value) || 0 : e.target.value
                          }
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-600 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}