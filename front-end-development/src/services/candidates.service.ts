// import { Candidate } from '@/types/candidate'
// import { ApiResponse, PaginatedResponse } from '@/types/common'
// import api from '@/lib/api-client'

// export const candidatesService = {
//   async getAll(): Promise<PaginatedResponse<Candidate>> {
//     const response = await fetch(`${api.baseURL}${api.endpoints.candidates}`)
//     return response.json()
//   },

//   async getById(id: number): Promise<ApiResponse<Candidate>> {
//     const response = await fetch(`${api.baseURL}${api.endpoints.candidates}/${id}`)
//     return response.json()
//   },

//   async create(candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Candidate>> {
//     const response = await fetch(`${api.baseURL}${api.endpoints.candidates}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(candidate)
//     })
//     return response.json()
//   }
// }
  


import { Candidate, CandidateCreate } from '@/types/candidate'
import api from '@/lib/api-client'

export const candidatesService = {
  async getAll() {
    const res = await fetch(`${api.baseURL}${api.endpoints.candidates}`)
    if (!res.ok) throw new Error('Failed to fetch candidates')
    return res.json()
  },

  async getById(id: string): Promise<Candidate> {
    const res = await fetch(
      `${api.baseURL}${api.endpoints.candidates}/${id}`
    )
    if (!res.ok) throw new Error('Candidate not found')
    return res.json()
  },

  async create(payload: CandidateCreate): Promise<Candidate> {
    const res = await fetch(
      `${api.baseURL}${api.endpoints.candidates}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.detail || 'Failed to create candidate')
    }

    return data
  },
}
