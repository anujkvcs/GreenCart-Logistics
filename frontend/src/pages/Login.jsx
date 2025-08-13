import React, { useState } from 'react'
import axios from 'axios'
import { login as apiLogin, register as apiRegister } from '../services/api'

export default function Login({ setToken }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await apiRegister({ username, email, password })
        setIsRegister(false)
        setError('Registration successful! Please login.')
      } else {
        const data = await apiLogin({ username, password })
        console.log('Login response:', data)
        const token = data.access || data.token
        if (token) {
          localStorage.setItem('token', token)
          setToken(token)
        } else {
          setError('No token received from server')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          {isRegister ? 'Register' : 'Login'} - GreenCart Logistics
        </h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded"
              autoComplete="username"
              required
            />
          </div>
          {isRegister && (
            <div className="mb-4">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded"
                autoComplete="email"
                required
              />
            </div>
          )}
          <div className="mb-6">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        
        <p className="mt-4 text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-green-600 ml-2 underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}