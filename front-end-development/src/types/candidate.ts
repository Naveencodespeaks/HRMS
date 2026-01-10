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
