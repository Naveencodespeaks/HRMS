import { Candidate } from '@/types/candidate'
import { ApiResponse, PaginatedResponse } from '@/types/common'
import api from '@/lib/api-client'

export const candidatesService = {
  async getAll(): Promise<PaginatedResponse<Candidate>> {
    const response = await fetch(`${api.baseURL}${api.endpoints.candidates}`)
    return response.json()
  },

  async getById(id: number): Promise<ApiResponse<Candidate>> {
    const response = await fetch(`${api.baseURL}${api.endpoints.candidates}/${id}`)
    return response.json()
  },

  async create(candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Candidate>> {
    const response = await fetch(`${api.baseURL}${api.endpoints.candidates}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate)
    })
    return response.json()
  }
}