import { apiRequest } from "./api-client"
import { Offer } from "@/types/offer"

/*
|--------------------------------------------------------------------------
| Offers API
|--------------------------------------------------------------------------
| - HR: create / list / get / update offers
| - Candidate: view offer by secure token
| - Candidate: accept / reject offer
*/

export const offersAPI = {
  /* =========================
     HR APIs
  ========================= */

  // Create offer (HR)
  create: (payload: Partial<Offer>): Promise<Offer> =>
    apiRequest("/offers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // List all offers (HR dashboard)
  list: (): Promise<Offer[]> =>
    apiRequest("/offers"),

  // Get offer by ID (HR / Recruiter)
  get: (id: string): Promise<Offer> =>
    apiRequest(`/offers/${id}`),

  // Update offer (HR)
  update: (id: string, payload: Partial<Offer>): Promise<Offer> =>
    apiRequest(`/offers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /* =========================
     Candidate APIs (Secure)
  ========================= */

  // 🔐 Get offer using secure token (Candidate view)
  getByToken: (token: string): Promise<Offer> =>
    apiRequest(`/offers/token/${token}`),

  // ✅ Candidate accept / reject decision
  candidateDecision: (
    token: string,
    action: "ACCEPT" | "REJECT",
    remarks?: string
  ): Promise<{ message: string }> =>
    apiRequest(`/offers/decision`, {
      method: "POST",
      body: JSON.stringify({
        token,
        action,
        remarks,
      }),
    }),
}
