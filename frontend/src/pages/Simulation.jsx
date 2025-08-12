import React, { useState, useEffect } from 'react'
import { runSimulation as apiRunSimulation, fetchSimulationHistory } from '../services/api'

export default function Simulation() {
  const [formData, setFormData] = useState({
    num_drivers: 3,
    start_time: '09:00',
    max_hours: 8
  })
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await fetchSimulationHistory()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const runSimulation = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await apiRunSimulation(formData)
      setResults(data)
      fetchHistory() // Refresh history
    } catch (error) {
      console.error('Error running simulation:', error)
      alert('Error running simulation: ' + (error.response?.data?.error || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_drivers' || name === 'max_hours' ? parseInt(value) : value
    }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Delivery Simulation</h1>
      
      {/* Simulation Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
        <form onSubmit={runSimulation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Drivers
              </label>
              <input
                type="number"
                name="num_drivers"
                value={formData.num_drivers}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Hours per Driver
              </label>
              <input
                type="number"
                name="max_hours"
                value={formData.max_hours}
                onChange={handleInputChange}
                min="1"
                max="12"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800">Total Profit</h3>
              <p className="text-2xl font-bold text-green-600">₹{results.total_profit.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-800">Efficiency Score</h3>
              <p className="text-2xl font-bold text-blue-600">{results.efficiency_score.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-semibold text-purple-800">On-time Deliveries</h3>
              <p className="text-2xl font-bold text-purple-600">{results.on_time_deliveries}</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-800">Late Deliveries</h3>
              <p className="text-2xl font-bold text-red-600">{results.late_deliveries}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Simulation History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Drivers</th>
                <th className="px-4 py-2 text-left">Start Time</th>
                <th className="px-4 py-2 text-left">Max Hours</th>
                <th className="px-4 py-2 text-left">Profit</th>
                <th className="px-4 py-2 text-left">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {history.map((sim) => (
                <tr key={sim.id} className="border-t">
                  <td className="px-4 py-2">{new Date(sim.timestamp).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{sim.num_drivers}</td>
                  <td className="px-4 py-2">{sim.start_time}</td>
                  <td className="px-4 py-2">{sim.max_hours}</td>
                  <td className="px-4 py-2">₹{sim.total_profit.toFixed(2)}</td>
                  <td className="px-4 py-2">{sim.efficiency_score.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}