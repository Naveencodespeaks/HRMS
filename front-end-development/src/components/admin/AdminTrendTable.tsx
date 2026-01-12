"use client"

import React from "react"
import type { TrendPoint } from "@/lib/admin-dashboard"

export default function AdminTrendTable({ trend }: { trend: TrendPoint[] }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Report (Applied / Accepted / Rejected)</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2 pr-4">Period</th>
            <th className="py-2 pr-4">Applied</th>
            <th className="py-2 pr-4">Accepted</th>
            <th className="py-2 pr-4">Rejected</th>
          </tr>
        </thead>
        <tbody>
          {trend.map((row) => (
            <tr key={row.label} className="border-b last:border-0">
              <td className="py-2 pr-4 font-medium">{row.label}</td>
              <td className="py-2 pr-4">{row.applied}</td>
              <td className="py-2 pr-4">{row.accepted}</td>
              <td className="py-2 pr-4">{row.rejected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
