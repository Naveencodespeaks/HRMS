import api from "./api"

const { baseURL, endpoints } = api

export async function fetchCandidates() {
  const res = await fetch(`${baseURL}${endpoints.candidates}`)
  if (!res.ok) {
    throw new Error("Failed to fetch candidates")
  }
  return res.json()
}


export async function createCandidate(payload: any) {
  const res = await fetch(`${baseURL}${endpoints.candidates}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Failed to create candidate")
  }

  return res.json()
}


export async function deleteCandidate(candidateId: string) {
  const res = await fetch(
    `${baseURL}${endpoints.candidates}/${candidateId}`,
    {
      method: "DELETE",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to delete candidate")
  }
}

export async function restoreCandidate(candidateId: string) {
  const res = await fetch(
    `${baseURL}${endpoints.candidates}/${candidateId}/restore`,
    {
      method: "POST",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to restore candidate")
  }

  return res.json()
}
