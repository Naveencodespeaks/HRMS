'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'

import AdminDashboardFilters from '@/components/admin/AdminDashboardFilters'
import AdminKpiCards from '@/components/admin/AdminKpiCards'
import AdminTrendTable, { TrendPoint } from '@/components/admin/AdminTrendTable'

const AdminHiringBarChart = dynamic(
  () => import('@/components/charts/AdminHiringBarChart'),
  { ssr: false }
)

const AdminOfferStatusPieChart = dynamic(
  () => import('@/components/charts/AdminOfferStatusPieChart'),
  { ssr: false }
)

export type DatePreset =
  | 'today'
  | 'week'
  | 'month'
  | '3m'
  | '6m'
  | '12m'
  | 'custom'

export default function AdminDashboard() {
  const [preset, setPreset] = useState<DatePreset>('month')
  const [role, setRole] = useState('All')
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()

  /* ✅ CORRECT RANGE LABEL */
  const rangeLabel = useMemo(() => {
    if (preset === 'custom' && startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('en-GB')} → ${new Date(
        endDate
      ).toLocaleDateString('en-GB')}`
    }

    switch (preset) {
      case 'today':
        return 'Today'
      case 'week':
        return 'This Week'
      case 'month':
        return 'This Month'
      case '3m':
        return 'Last 3 Months'
      case '6m':
        return 'Last 6 Months'
      case '12m':
        return 'Last 12 Months'
      default:
        return ''
    }
  }, [preset, startDate, endDate])

  /* MOCK DATA (API LATER) */
  const summary = {
    total_positions: 22,
    total_candidates: 1240,
    accepted: 74,
    rejected: 12,
    on_hold: 18,
    interviews: 420,
    offers_released: 96,
    offers_accepted: 74,
  }

  const trend: TrendPoint[] = [
    { label: 'Jan 2026', applied: 120, accepted: 32, rejected: 18 },
    { label: 'Feb 2026', applied: 150, accepted: 41, rejected: 22 },
    { label: 'Mar 2026', applied: 98, accepted: 29, rejected: 14 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-6 space-y-8">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Hiring analytics, reports, and administrative controls
          </p>
        </header>

        {/* FILTERS */}
        <AdminDashboardFilters
          preset={preset}
          role={role}
          startDate={startDate}
          endDate={endDate}
          onPresetChange={setPreset}
          onRoleChange={setRole}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* KPI */}
        <AdminKpiCards summary={summary} />

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BAR */}
          <div className="bg-white rounded-xl border p-5 h-[420px] flex flex-col">
            <h3 className="font-semibold mb-1">Hiring Pipeline</h3>
            <p className="text-xs text-gray-500 mb-3">{rangeLabel}</p>

            <div className="flex-1">
              <AdminHiringBarChart
                preset={preset}
                startDate={startDate}
                endDate={endDate}
                role={role}
              />
            </div>
          </div>

          {/* PIE */}
          <div className="bg-white rounded-xl border p-5 h-[420px] flex flex-col">
            <h3 className="font-semibold mb-1">Offer & Candidate Status</h3>
            <p className="text-xs text-gray-500 mb-3">{rangeLabel}</p>

            <div className="flex-1">
              <AdminOfferStatusPieChart
                preset={preset}
                startDate={startDate}
                endDate={endDate}
                role={role}
              />
            </div>
          </div>
        </section>

        {/* TREND TABLE */}
        <AdminTrendTable trend={trend} />

      </div>
    </div>
  )
}
