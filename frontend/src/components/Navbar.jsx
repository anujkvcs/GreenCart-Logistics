import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ setToken }) {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/simulation', label: 'Simulation' },
    { path: '/management', label: 'Management' }
  ]

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">GreenCart Logistics</h1>
          
          <div className="flex space-x-4">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-green-700' 
                    : 'hover:bg-green-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}