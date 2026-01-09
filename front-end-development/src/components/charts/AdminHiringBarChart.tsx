'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', applied: 120, interviewed: 80, offered: 30, joined: 20 },
  { month: 'Feb', applied: 150, interviewed: 95, offered: 40, joined: 25 },
  { month: 'Mar', applied: 180, interviewed: 110, offered: 55, joined: 35 },
  { month: 'Apr', applied: 200, interviewed: 140, offered: 70, joined: 50 },
]

export default function AdminHiringBarChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Hiring Pipeline (Monthly)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="applied" />
          <Bar dataKey="interviewed" />
          <Bar dataKey="offered" />
          <Bar dataKey="joined" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
