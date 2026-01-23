'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { offersAPI } from '@/lib/offers.api'

type OfferDetails = {
  offered_ctc: number
  joining_date?: string
  remarks?: string
}

export default function CandidateOfferDecisionPage() {
  const params = useParams()
  const token = params.token as string

  const [offer, setOffer] = useState<OfferDetails | null>(null)
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<'ACCEPT' | 'REJECT' | null>(null)
  const [error, setError] = useState<string | null>(null)

  /* =========================
     LOAD OFFER BY TOKEN
  ========================= */
  useEffect(() => {
    if (!token) return

    const loadOffer = async () => {
      try {
        // 🔐 Secure token-based fetch
        const data = await offersAPI.getByToken(token)
        setOffer(data)
      } catch (err) {
        setError('Invalid or expired offer link')
      }
    }

    loadOffer()
  }, [token])

  /* =========================
     SUBMIT DECISION
  ========================= */
  const submitDecision = async (action: 'ACCEPT' | 'REJECT') => {
    try {
      setLoading(true)
      await offersAPI.candidateDecision(token, action, remarks)
      setSubmitted(action)
    } catch (err) {
      alert('Unable to submit your decision. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Link Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  /* =========================
     LOADING STATE
  ========================= */
  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading offer details…</p>
      </div>
    )
  }

  /* =========================
     SUCCESS STATE
  ========================= */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Thank you 🙏</h1>
          <p className="text-gray-700">
            You have <strong>{submitted}</strong> the offer.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Our HR team will contact you shortly.
          </p>
        </div>
      </div>
    )
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Offer Letter – Mahavir Group
        </h1>

        {/* OFFER DETAILS */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p>
            <strong>💰 Offered CTC:</strong>{' '}
            ₹{offer.offered_ctc.toLocaleString('en-IN')}
          </p>

          {offer.joining_date && (
            <p className="mt-2">
              <strong>📅 Joining Date:</strong>{' '}
              {new Date(offer.joining_date).toDateString()}
            </p>
          )}

          {offer.remarks && (
            <p className="mt-2 text-gray-600">
              <strong>📝 HR Notes:</strong> {offer.remarks}
            </p>
          )}
        </div>

        {/* CANDIDATE REMARKS */}
        <textarea
          placeholder="Optional remarks or questions for HR"
          className="w-full border rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={() => submitDecision('ACCEPT')}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            ✅ Accept
          </button>

          <button
            disabled={loading}
            onClick={() => submitDecision('REJECT')}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  )
}
