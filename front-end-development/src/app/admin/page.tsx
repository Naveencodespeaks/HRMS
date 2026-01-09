'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

/* =======================
   LAZY LOAD CHARTS
======================= */
const AdminHiringBarChart = dynamic(
  () => import('@/components/charts/AdminHiringBarChart'),
  { loading: () => <ChartSkeleton /> }
)

const AdminOfferStatusPieChart = dynamic(
  () => import('@/components/charts/AdminOfferStatusPieChart'),
  { loading: () => <ChartSkeleton /> }
)

export default function AdminDashboard() {
  const [month, setMonth] = useState('All')
  const [role, setRole] = useState('All')

  const kpis = useMemo(
    () => [
      { title: 'Total Applications', value: '1,240' },
      { title: 'Interviews Conducted', value: '420' },
      { title: 'Candidates Selected', value: '128' },
      { title: 'Offers Released', value: '96' },
      { title: 'Offers Accepted', value: '74' },
      { title: 'Offers Rejected', value: '12' },
      { title: 'Candidates On Hold', value: '18' },
      { title: 'Open Positions', value: '22' },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ================= HEADER ================= */}
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Hiring analytics, controls, and administrative actions
          </p>
        </header>

        {/* ================= KPI CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </section>

        {/* ================= FILTERS ================= */}
        <section className="flex flex-wrap gap-3">
          <FilterSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={['All', 'Jan', 'Feb', 'Mar', 'Apr']}
          />
          <FilterSelect
            label="Role"
            value={role}
            onChange={setRole}
            options={['All', 'Frontend', 'Backend', 'HR', 'Sales']}
          />
        </section>

        {/* ================= CHARTS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Hiring Pipeline (Monthly)">
            <AdminHiringBarChart />
          </Card>

          <Card title="Offer & Candidate Status">
            <AdminOfferStatusPieChart />
          </Card>
        </section>

        {/* ================= ADMIN ACTIONS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Admin Management">
            <AdminAction
              title="User Management"
              description="Create, edit, deactivate candidates, recruiters, and admins"
            />
            <AdminAction
              title="Role & Permission Management"
              description="Assign access levels and system roles"
            />
            <AdminAction
              title="System Settings"
              description="Configure system-wide preferences"
            />
          </Card>

          <Card title="Hiring Actions">
            <AdminAction
              title="Update Candidate Status"
              description="Mark candidates as Accepted, Rejected, or On Hold"
            />
            <AdminAction
              title="Manage Offers"
              description="Approve, reject, or hold job offers"
            />
            <AdminAction
              title="Interview Control"
              description="View interview attendance and outcomes"
            />
            <AdminAction
              title="Reports & Analytics"
              description="Download hiring, interview, and offer reports"
            />
          </Card>
        </section>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <h3 className="text-base sm:text-lg font-semibold mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}

function AdminAction({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-lg p-4 mb-3 hover:bg-gray-50 transition cursor-pointer">
      <h4 className="text-sm sm:text-base font-medium">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs sm:text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm bg-white"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function ChartSkeleton() {
  return <div className="h-56 sm:h-64 bg-gray-100 rounded-lg animate-pulse" />
}
