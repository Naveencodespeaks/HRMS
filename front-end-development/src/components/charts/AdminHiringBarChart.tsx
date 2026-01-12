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

/**
 * Consistent color mapping
 */
const COLORS = {
  applied: '#2563eb',     // Blue
  interviewed: '#f59e0b', // Amber
  offered: '#16a34a',     // Green
  joined: '#9333ea',      // Purple
}

export default function AdminHiringBarChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="applied"
            fill={COLORS.applied}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="interviewed"
            fill={COLORS.interviewed}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="offered"
            fill={COLORS.offered}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="joined"
            fill={COLORS.joined}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
