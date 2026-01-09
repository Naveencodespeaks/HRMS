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
 * (Later we will replace this with backend API data)
 */
const data = [
  { name: 'Offers Accepted', value: 74 },
  { name: 'Offers Rejected', value: 12 },
  { name: 'Offers Pending', value: 22 },
  { name: 'Candidates On Hold', value: 18 },
]

/**
 * Color palette (HR-friendly)
 */
const COLORS = [
  '#16a34a', // green - accepted
  '#dc2626', // red - rejected
  '#f59e0b', // yellow - pending
  '#2563eb', // blue - on hold
]

export default function AdminOfferStatusPieChart() {
  return (
    <div className="w-full h-[320px]">
      <h3 className="text-lg font-semibold mb-4">
        Offer & Candidate Status
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
