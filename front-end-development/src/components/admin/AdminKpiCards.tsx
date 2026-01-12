'use client'

type DashboardSummary = {
  total_positions: number
  total_candidates: number
  accepted: number
  rejected: number
  on_hold: number
  interviews: number
  offers_released: number
  offers_accepted: number
}

export default function AdminKpiCards({
  summary,
}: {
  summary: DashboardSummary
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard title="Total Positions" value={summary.total_positions} />
      <KpiCard title="Total Candidates" value={summary.total_candidates} />
      <KpiCard title="Accepted (Hired)" value={summary.accepted} />
      <KpiCard title="Rejected" value={summary.rejected} />
      <KpiCard title="On Hold" value={summary.on_hold} />
      <KpiCard title="Interviews Conducted" value={summary.interviews} />
      <KpiCard title="Offers Released" value={summary.offers_released} />
      <KpiCard title="Offers Accepted" value={summary.offers_accepted} />
    </div>
  )
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
