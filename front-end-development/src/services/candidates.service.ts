// src/services/candidates.service.ts

import { apiRequest } from "@/lib/api-client"
import type { CandidateCreate, Candidate } from "@/types/candidate"

/* =====================================================
   CREATE CANDIDATE (MULTIPART + RESUME)
===================================================== */
export async function createCandidate(
  payload: CandidateCreate,
  resume: File
): Promise<Candidate> {
  const formData = new FormData()

  // Append form fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    formData.append(key, String(value))
  })

  // Append resume
  formData.append("resume", resume)

  // IMPORTANT: remove JSON header for multipart
  return apiRequest("/candidates", {
    method: "POST",
    body: formData,
    headers: {}, // overrides application/json
  })
}