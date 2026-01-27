'use client'

/**
 * =========================================================
 * ✅ HR Dashboard Page (List + KPIs + Click KPI -> Filter Table)
 * File: src/app/hr/page.tsx
 * =========================================================
 *
 * What this does:
 * 1) Loads ALL candidates from DB (by paging through API)
 * 2) Shows KPI cards (All / Pending / In Progress / Passed / Failed)
 * 3) Clicking a KPI auto-filters the table
 * 4) Search + Status dropdown also filter the same table
 * 5) Pagination is LOCAL (client-side)
 */

import { useEffect, useMemo, useState } from 'react'
import { hrAPI, HRCandidateRow } from '@/lib/hr.api'

/* =========================================================
   1) STATUS COLORS (Tailwind)
========================================================= */

const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  PASSED: 'bg-green-100 text-green-700',
  SHORTLISTED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-100 text-red-700',
  OFFER_CREATED: 'bg-green-100 text-green-700',
}

/* =========================================================
   2) KPI GROUPING (map KPI -> statuses)
   NOTE: adjust these statuses based on what your backend returns.
========================================================= */

const KPI_GROUPS: Record<
  'ALL' | 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED',
  string[]
> = {
  ALL: [],
  PENDING: ['PENDING'],
  IN_PROGRESS: ['IN_PROGRESS', 'ONGOING', 'INTERVIEWING'],
  PASSED: ['PASSED', 'SHORTLISTED', 'COMPLETED', 'OFFER_CREATED'],
  FAILED: ['FAILED', 'REJECTED', 'CANCELLED'],
}

/* =========================================================
   3) Page Component
========================================================= */

export default function HRPage() {
  /* ---------------------------
     3.1) Raw DB list (ALL)
  --------------------------- */
  const [allCandidates, setAllCandidates] = useState<HRCandidateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ---------------------------
     3.2) Filters
  --------------------------- */
  const [activeKpi, setActiveKpi] = useState<
    'ALL' | 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED'
  >('ALL')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('') // dropdown status filter

  /* ---------------------------
     3.3) Pagination (LOCAL)
  --------------------------- */
  const PAGE_SIZE = 20
  const [page, setPage] = useState(1)

  /* =========================================================
     STEP 1: Load ALL candidates from DB (paginate until done)
     - We repeatedly call /hr/candidates?page=... until we get all
     - Then we store it in allCandidates
  ========================================================= */

  const loadAllCandidates = async () => {
    setLoading(true)
    setError(null)

    try {
      const collected: HRCandidateRow[] = []
      let currentPage = 1
      const pageSize = 100 // backend limit in your API is 100

      while (true) {
        const res: any = await hrAPI.listCandidates({
          page: currentPage,
          page_size: pageSize,
          // Don't pass search/status here (we want full DB list)
        })

        const items: HRCandidateRow[] = res?.items ?? res ?? []
        if (!Array.isArray(items)) break

        collected.push(...items)

        // If backend gives total -> stop when collected >= total
        if (typeof res?.total === 'number') {
          if (collected.length >= res.total) break
        }

        // Or if items returned less than pageSize -> last page
        if (items.length < pageSize) break

        currentPage += 1

        // Safety guard: avoid infinite loop if API misbehaves
        if (currentPage > 200) break
      }

      setAllCandidates(collected)
    } catch (e: any) {
      setError(e?.message || 'Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =========================================================
     STEP 2: Compute KPIs from DB list
  ========================================================= */

  const kpis = useMemo(() => {
    const total = allCandidates.length

    const countInGroup = (groupKey: keyof typeof KPI_GROUPS) => {
      const statuses = KPI_GROUPS[groupKey]
      if (groupKey === 'ALL') return total
      return allCandidates.filter((c) => statuses.includes(c.status)).length
    }

    return {
      total,
      pending: countInGroup('PENDING'),
      inProgress: countInGroup('IN_PROGRESS'),
      passed: countInGroup('PASSED'),
      failed: countInGroup('FAILED'),
    }
  }, [allCandidates])

  /* =========================================================
     STEP 3: Click KPI -> auto-filter
     - Sets active KPI
     - Sets status dropdown accordingly (optional)
     - Resets page to 1
  ========================================================= */

  const handleKpiClick = (
    kpi: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED'
  ) => {
    setActiveKpi(kpi)
    setPage(1)

    // Optional: also set dropdown filter based on KPI
    // If you prefer dropdown independent, remove this.
    if (kpi === 'ALL') setStatus('')
    else setStatus(kpi) // status dropdown will show KPI name (if options exist)
  }

  /* =========================================================
     STEP 4: Filter candidates (KPI + Search + Dropdown status)
  ========================================================= */

  const filteredCandidates = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    // KPI filter (group statuses)
    const kpiStatuses = KPI_GROUPS[activeKpi]

    return allCandidates.filter((c) => {
      // KPI filter
      const matchesKpi =
        activeKpi === 'ALL' ? true : kpiStatuses.includes(c.status)

      // Dropdown status filter (exact match)
      const matchesStatus = !status ? true : c.status === status

      // Search filter
      const matchesSearch =
        !searchText ||
        (c.full_name || '').toLowerCase().includes(searchText) ||
        (c.email || '').toLowerCase().includes(searchText) ||
        (c.phone || '').toLowerCase().includes(searchText)

      return matchesKpi && matchesStatus && matchesSearch
    })
  }, [allCandidates, activeKpi, search, status])

  /* =========================================================
     STEP 5: Local pagination on filteredCandidates
  ========================================================= */

  const totalPages = useMemo(() => {
    const t = Math.ceil(filteredCandidates.length / PAGE_SIZE)
    return t <= 0 ? 1 : t
  }, [filteredCandidates.length])

  const paginatedCandidates = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredCandidates.slice(start, end)
  }, [filteredCandidates, page])

  // Keep page valid when filters reduce results
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  /* =========================================================
     UI States
  ========================================================= */

  if (loading) {
    return <div className="p-6 text-gray-500">Loading candidates...</div>
  }

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <div className="text-red-600">{error}</div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          onClick={loadAllCandidates}
        >
          Retry
        </button>
      </div>
    )
  }

  /* =========================================================
     Render
  ========================================================= */

  const kpiCardBase =
    'p-4 rounded shadow text-left transition hover:ring-2 focus:outline-none'

  const activeRing = (k: string) =>
    activeKpi === k ? 'ring-2 ring-black/20' : ''

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* =====================================================
          STEP 6: KPI CARDS (CLICKABLE)
      ====================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => handleKpiClick('ALL')}
          className={`${kpiCardBase} bg-white ${activeRing('ALL')}`}
        >
          <p className="text-sm text-gray-500">All Candidates</p>
          <p className="text-2xl font-bold">{kpis.total}</p>
        </button>

        <button
          onClick={() => handleKpiClick('PENDING')}
          className={`${kpiCardBase} bg-yellow-50 ${activeRing('PENDING')}`}
        >
          <p className="text-sm text-yellow-700">🟡 Pending</p>
          <p className="text-2xl font-bold">{kpis.pending}</p>
        </button>

        <button
          onClick={() => handleKpiClick('IN_PROGRESS')}
          className={`${kpiCardBase} bg-blue-50 ${activeRing('IN_PROGRESS')}`}
        >
          <p className="text-sm text-blue-700">🔵 In Progress</p>
          <p className="text-2xl font-bold">{kpis.inProgress}</p>
        </button>

        <button
          onClick={() => handleKpiClick('PASSED')}
          className={`${kpiCardBase} bg-green-50 ${activeRing('PASSED')}`}
        >
          <p className="text-sm text-green-700">🟢 Passed</p>
          <p className="text-2xl font-bold">{kpis.passed}</p>
        </button>

        <button
          onClick={() => handleKpiClick('FAILED')}
          className={`${kpiCardBase} bg-red-50 ${activeRing('FAILED')}`}
        >
          <p className="text-sm text-red-700">🔴 Failed</p>
          <p className="text-2xl font-bold">{kpis.failed}</p>
        </button>
      </div>

      {/* =====================================================
          STEP 7: Filters
      ====================================================== */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          className="border rounded px-3 py-2 text-sm w-64"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
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
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="PASSED">PASSED</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="ON_HOLD">ON_HOLD</option>
          <option value="FAILED">FAILED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="OFFER_CREATED">OFFER_CREATED</option>
        </select>

        <button
          className="px-4 py-2 bg-gray-900 text-white rounded text-sm"
          onClick={() => {
            setActiveKpi('ALL')
            setSearch('')
            setStatus('')
            setPage(1)
          }}
        >
          Clear Filters
        </button>

        <div className="text-sm text-gray-500">
          Showing <b>{filteredCandidates.length}</b> results
        </div>
      </div>

      {/* =====================================================
          STEP 8: Table
      ====================================================== */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">
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
            {paginatedCandidates.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}

            {paginatedCandidates.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{c.full_name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.role || '-'}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      STATUS_BADGE_CLASSES[c.status] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {String(c.status).replaceAll('_', ' ')}
                  </span>
                </td>

                <td className="p-3">{c.latest_round || '-'}</td>
                <td className="p-3">{c.offer_status || '-'}</td>

                <td className="p-3">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={async (e) => {
                      e.stopPropagation()
                      const res = await hrAPI.generateAccessLink(c.id)
                      window.open(res.url, '_blank')
                    }}
                  >
                    View Secure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          STEP 9: Pagination
      ====================================================== */}
      <div className="flex justify-end gap-2 items-center">
        <button
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <span className="px-3 py-1 text-sm">
          Page <b>{page}</b> / {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  )
}