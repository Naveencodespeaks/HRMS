'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { hrAPI, HRCandidateRow } from '@/lib/hr.api'

/* =========================
   Constants
========================= */

const DECISION_DONE_STATUSES = [
  'REJECTED',
  'ON_HOLD',
  'SHORTLISTED',
  'OFFER_CREATED',
]

/* =========================
   Page
========================= */

export default function HRCandidatesPage() {
  const router = useRouter()

  const [candidates, setCandidates] = useState<HRCandidateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const loadCandidates = async () => {
    setLoading(true)
    try {
      const res = await hrAPI.listCandidates({
        page,
        page_size: 20,
        search: search || undefined,
        status: status || undefined,
      })

      setCandidates(res.items ?? res)
    } catch (e: any) {
      setError(e?.message || 'Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [page, status])

  if (loading) {
    return <div className="p-6 text-gray-500">Loading candidates...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ================= Filters ================= */}
      <div className="flex gap-4 items-center">
        <input
          className="border rounded px-3 py-2 text-sm w-64"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER_CREATED">Offer Created</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          onClick={() => {
            setPage(1)
            loadCandidates()
          }}
        >
          Search
        </button>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Candidate</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Latest Round</th>
              <th className="p-3">Offer</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}

            {candidates.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{c.full_name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.role || '-'}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{c.latest_round || '-'}</td>
                <td className="p-3">{c.offer_status || '-'}</td>

                <td className="p-3">
                  {DECISION_DONE_STATUSES.includes(c.status) ? (
                    <span className="text-gray-400 text-sm">
                      Decision Taken
                    </span>
                  ) : (
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() =>
                        router.push(`/hr/candidates/${c.id}`)
                      }
                    >
                      View Secure
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}
      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1">Page {page}</span>

        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}