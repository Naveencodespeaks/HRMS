'use client'

export type DatePreset =
  | 'today'
  | 'week'
  | 'month'
  | '3m'
  | '6m'
  | '12m'
  | 'custom'

type Props = {
  preset: DatePreset
  role: string
  startDate?: string
  endDate?: string
  onPresetChange: (v: DatePreset) => void
  onRoleChange: (v: string) => void
  onStartDateChange: (v: string) => void
  onEndDateChange: (v: string) => void
}

export default function AdminDashboardFilters({
  preset,
  role,
  startDate,
  endDate,
  onPresetChange,
  onRoleChange,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <section className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-xl border shadow-sm">
      {/* Date Preset */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">Date Range</label>
        <select
          value={preset}
          onChange={(e) => onPresetChange(e.target.value as DatePreset)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Custom Dates */}
      {preset === 'custom' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </>
      )}

      {/* Role */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">Role</label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
    </section>
  )
}
