import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { fetchDashboard } from '../services/api'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_profit: 0,
    efficiency_score: 0,
    on_time_deliveries: 0,
    late_deliveries: 0,
    fuel_cost_breakdown: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await fetchDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const deliveryData = [
    { name: 'On Time', value: dashboardData.on_time_deliveries, color: '#10B981' },
    { name: 'Late', value: dashboardData.late_deliveries, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Profit</h3>
          <p className="text-3xl font-bold text-green-600">₹{dashboardData.total_profit.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Efficiency Score</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData.efficiency_score.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Deliveries</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardData.on_time_deliveries + dashboardData.late_deliveries}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-time vs Late Deliveries */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">On-time vs Late Deliveries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {deliveryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Cost Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fuel Cost by Route</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.fuel_cost_breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fuel_cost" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
