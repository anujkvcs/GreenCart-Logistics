import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import Management from './pages/Management'
import Navbar from './components/Navbar'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  if (!token) return <Login setToken={setToken} />

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar setToken={setToken} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/management" element={<Management />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}