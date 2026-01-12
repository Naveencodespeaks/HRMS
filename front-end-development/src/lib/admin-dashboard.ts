// src/lib/admin-dashboard.ts
export type RangePreset =
  | "today"
  | "week"
  | "month"
  | "3m"
  | "6m"
  | "12m"
  | "custom"

export type Granularity = "day" | "week" | "month"

export type DashboardFilters = {
  preset: RangePreset
  startDate?: string // YYYY-MM-DD (for custom)
  endDate?: string   // YYYY-MM-DD (for custom)
  role?: string
  status?: string
}

export type DashboardSummary = {
  total_positions: number
  accepted: number
  rejected: number
  total_candidates: number
}

export type TrendPoint = {
  label: string
  applied: number
  accepted: number
  rejected: number
}

export type DashboardData = {
  summary: DashboardSummary
  trend: TrendPoint[]
}

/**
 * ✅ PHASE-1: Mock implementation
 * ✅ PHASE-2: Replace this with real API call (single place change)
 */
export async function fetchAdminDashboard(
  filters: DashboardFilters
): Promise<DashboardData> {
  // simulate API delay
  await new Promise((r) => setTimeout(r, 250))

  // Choose trend shape based on preset
  const trend =
    filters.preset === "today"
      ? [
          { label: "10 AM", applied: 3, accepted: 1, rejected: 0 },
          { label: "12 PM", applied: 5, accepted: 1, rejected: 1 },
          { label: "2 PM", applied: 2, accepted: 0, rejected: 1 },
          { label: "4 PM", applied: 6, accepted: 2, rejected: 0 },
        ]
      : filters.preset === "week"
      ? [
          { label: "Mon", applied: 12, accepted: 2, rejected: 1 },
          { label: "Tue", applied: 18, accepted: 3, rejected: 2 },
          { label: "Wed", applied: 15, accepted: 2, rejected: 3 },
          { label: "Thu", applied: 22, accepted: 5, rejected: 2 },
          { label: "Fri", applied: 17, accepted: 2, rejected: 1 },
          { label: "Sat", applied: 9, accepted: 1, rejected: 1 },
          { label: "Sun", applied: 6, accepted: 1, rejected: 0 },
        ]
      : filters.preset === "month"
      ? Array.from({ length: 4 }).map((_, i) => ({
          label: `Week ${i + 1}`,
          applied: 40 + i * 10,
          accepted: 6 + i * 2,
          rejected: 10 + i * 2,
        }))
      : filters.preset === "3m"
      ? ["Nov", "Dec", "Jan"].map((m, i) => ({
          label: m,
          applied: 120 + i * 15,
          accepted: 22 + i * 3,
          rejected: 35 + i * 4,
        }))
      : filters.preset === "6m"
      ? ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((m, i) => ({
          label: m,
          applied: 90 + i * 12,
          accepted: 16 + i * 2,
          rejected: 28 + i * 3,
        }))
      : ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map(
          (m, i) => ({
            label: m,
            applied: 70 + i * 8,
            accepted: 10 + i,
            rejected: 18 + i * 2,
          })
        )

  const totals = trend.reduce(
    (acc, p) => {
      acc.applied += p.applied
      acc.accepted += p.accepted
      acc.rejected += p.rejected
      return acc
    },
    { applied: 0, accepted: 0, rejected: 0 }
  )

  return {
    summary: {
      total_positions: 22,
      accepted: totals.accepted,
      rejected: totals.rejected,
      total_candidates: totals.applied,
    },
    trend,
  }
}
