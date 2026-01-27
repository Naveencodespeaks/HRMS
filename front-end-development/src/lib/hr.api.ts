// src/lib/hr.api.ts
import { apiRequest } from './api-client'

/* =========================
   Types
========================= */

export type HRDecision =
  | 'SHORTLIST'
  | 'REJECT'
  | 'HOLD'
  | 'APPROVE_OFFER'

export interface HRCandidateRow {
  id: string
  full_name: string
  email: string
  phone: string
  role?: string
  experience_type: string
  status: string
  latest_round?: string
  latest_interview_status?: string
  offer_status?: string
  created_at?: string
}

/* =========================
   Helpers
========================= */

const buildQuery = (params?: {
  page?: number
  page_size?: number
  search?: string | null
  status?: string | null
}) => {
  if (!params) return ''

  const qs = new URLSearchParams()

  if (params.page !== undefined) {
    qs.set('page', String(params.page))
  }

  if (params.page_size !== undefined) {
    qs.set('page_size', String(params.page_size))
  }

  if (params.search && params.search.trim() !== '') {
    qs.set('search', params.search.trim())
  }

  if (params.status && params.status.trim() !== '') {
    qs.set('status', params.status.trim())
  }

  const query = qs.toString()
  return query ? `?${query}` : ''
}

/* =========================
   HR API
========================= */

export const hrAPI = {
  /* -------- Dashboard list -------- */
  listCandidates: async (params?: {
    page?: number
    page_size?: number
    search?: string | null
    status?: string | null
  }) => {
    const query = buildQuery(params)
    return apiRequest(`/hr/candidates${query}`)
  },

  /* -------- Secure detail view -------- */
  getCandidateDetail: (id: string, token: string) =>
    apiRequest(`/hr/candidates/${id}?token=${token}`),

  /* -------- HR decision -------- */
  decide: (
    id: string,
    token: string,
    body: { decision: HRDecision; remarks?: string }
  ) =>
    apiRequest(`/hr/candidates/${id}/decision?token=${token}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /* -------- 🔐 Generate secure access link -------- */
  generateAccessLink: (candidateId: string) =>
    apiRequest(`/hr/candidates/${candidateId}/access-link`, {
      method: 'POST',
    }),
}