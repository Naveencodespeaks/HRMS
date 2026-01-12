'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

/**
 * Temporary static data
 * (Later replaced with backend API)
 */
const data = [
  { name: 'Offers Accepted', value: 74 },
  { name: 'Offers Rejected', value: 12 },
  { name: 'Offers Pending', value: 22 },
  { name: 'Candidates On Hold', value: 18 },
]

/**
 * HR-friendly color palette
 */
const COLORS = [
  '#16a34a', // accepted
  '#dc2626', // rejected
  '#f59e0b', // pending
  '#2563eb', // on hold
]

export default function AdminOfferStatusPieChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={95}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
