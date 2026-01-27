// import api from "./api"

// const { baseURL, endpoints } = api

// export async function fetchCandidates() {
//   const res = await fetch(`${baseURL}${endpoints.candidates}`)
//   if (!res.ok) {
//     throw new Error("Failed to fetch candidates")
//   }
//   return res.json()
// }


// export async function createCandidate(payload: any) {
//   const res = await fetch(`${baseURL}${endpoints.candidates}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   })

//   if (!res.ok) {
//     const err = await res.json()
//     throw new Error(err.detail || "Failed to create candidate")
//   }

//   return res.json()
// }


// export async function deleteCandidate(candidateId: string) {
//   const res = await fetch(
//     `${baseURL}${endpoints.candidates}/${candidateId}`,
//     {
//       method: "DELETE",
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Failed to delete candidate")
//   }
// }

// export async function restoreCandidate(candidateId: string) {
//   const res = await fetch(
//     `${baseURL}${endpoints.candidates}/${candidateId}/restore`,
//     {
//       method: "POST",
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Failed to restore candidate")
//   }

//   return res.json()
// }



// src/lib/candidates.ts
import apiClient from "./api-client"
import type { CandidateCreate,CandidateResponse,CandidateUpdate,Paginated,Candidate} from "@/types/candidate"

export async function listCandidates(params?: {
  page?: number
  page_size?: number
  search?: string | null
  status?: string | null // if your backend supports it; safe to send only if provided
}): Promise<Paginated<CandidateResponse>> {
  const query = new URLSearchParams()

  query.set("page", String(params?.page ?? 1))
  query.set("page_size", String(params?.page_size ?? 20))

  if (params?.search && params.search.trim() !== "") query.set("search", params.search)
  if (params?.status && params.status.trim() !== "") query.set("status", params.status)

  const res = await apiClient.get(`/candidates?${query.toString()}`)
  return res.data
}

export async function getCandidate(id: string): Promise<CandidateResponse> {
  const res = await apiClient.get(`/candidates/${id}`)
  return res.data
}

/**
 * ✅ JSON-only create (matches your schema docstring).
 * Use this if backend endpoint accepts application/json.
 */
export async function createCandidateJson(
  payload: CandidateCreate
): Promise<CandidateResponse> {
  const res = await apiClient.post(`/candidates`, payload, {
    headers: { "Content-Type": "application/json" },
  })
  return res.data
}

/**
 * ✅ Multipart create (resume + fields).
 * Use this if your backend endpoint is multipart/form-data (very common for resume).
 */
export async function createCandidateWithResume(args: {
  payload: CandidateCreate
  resume: File
}): Promise<CandidateResponse> {
  const { payload, resume } = args

  const fd = new FormData()
  fd.append("resume", resume)

  // append payload fields as strings
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return
    fd.append(k, String(v))
  })

  const res = await apiClient.post(`/candidates`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export async function updateCandidate(
  id: string,
  payload: CandidateUpdate
): Promise<CandidateResponse> {
  const res = await apiClient.patch(`/candidates/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  })
  return res.data
}