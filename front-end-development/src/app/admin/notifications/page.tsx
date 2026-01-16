'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminNewCandidatesMock } from '@/lib/notifications.mock'

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filteredCandidates = adminNewCandidatesMock.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          14 new candidates applied
        </h1>
        <p className="text-sm text-gray-500">
          Today · Last 15 minutes
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Phone</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Applied</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/admin/candidates/${candidate.id}`
                  )
                }
              >
                <td className="px-6 py-4 font-medium">
                  {candidate.name}
                </td>
                <td className="px-6 py-4">
                  {candidate.email}
                </td>
                <td className="px-6 py-4">
                  {candidate.phone}
                </td>
                <td className="px-6 py-4">
                  {candidate.role}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {candidate.appliedAgo}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                </td>
              </tr>
            ))}

            {filteredCandidates.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-400"
                >
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
