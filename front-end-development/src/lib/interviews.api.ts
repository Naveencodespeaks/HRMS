import { apiRequest } from "./api-client"

export type InterviewCreatePayload = {
  candidate_id: string
  job_id?: string
  round_number: number
  round_name?: string
  interview_type: string
  interviewer_name?: string
  interviewer_email?: string
  scheduled_at: string
}

export type Interview = {
  id: string
  candidate_id: string
  round_number: number
  round_name?: string
  interview_type?: string
  status: string
  feedback?: string
  rating?: number
  scheduled_at?: string
  completed_at?: string
}

export const interviewsAPI = {
  schedule: (payload: InterviewCreatePayload): Promise<Interview> =>
    apiRequest("/interviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listByCandidate: (candidateId: string): Promise<Interview[]> =>
    apiRequest(`/interviews/candidate/${candidateId}`),

  update: (
    interviewId: string,
    payload: Partial<Interview>
  ): Promise<Interview> =>
    apiRequest(`/interviews/${interviewId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
}
