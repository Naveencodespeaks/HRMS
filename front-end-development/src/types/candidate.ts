export interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  company_location: string
  is_active: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}


export type CandidateCreate = {
  first_name: string
  last_name: string
  phone: string
  email: string
  address?: string

  highest_qualification: string
  experience_type: 'fresher' | 'experienced'

  previous_company?: string
  role?: string
  company_location?: string
  total_experience_years?: number

  current_ctc?: number
  expected_ctc: number
  notice_period_days?: number
  immediate_joining: boolean
  date_of_joining?: string | null
}
