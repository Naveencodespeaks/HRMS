'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { hrAPI } from '@/lib/hr.api'

/* =========================
   Status → Color Mapping
========================= */
const STATUS_COLOR: Record<string, string> = {
  FAILED: 'bg-red-100 text-red-700',
  REJECTED: 'bg-red-100 text-red-700',

  PENDING: 'bg-yellow-100 text-yellow-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-yellow-100 text-yellow-700',

  PASSED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
  SHORTLISTED: 'bg-green-100 text-green-700',

  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-blue-100 text-blue-700',

  APPLIED: 'bg-gray-100 text-gray-700',
}

/* =========================
   Page
========================= */
export default function HRCandidateSecurePage() {
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [decision, setDecision] = useState('')
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)

  /* =========================
     Fetch Candidate (NO TOKEN)
  ========================= */
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await hrAPI.getCandidateDetail(id)
        setData(res)
      } catch (e: any) {
        setError(e?.message || 'Failed to load candidate')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  /* =========================
     Submit HR Decision
  ========================= */
  const submitDecision = async () => {
    if (!decision) return

    setSubmitting(true)
    try {
      await hrAPI.decideCandidate(id, {
        decision,
        remarks,
      })
      window.location.reload()
    } catch (e: any) {
      alert(e?.message || 'Failed to submit decision')
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return <div className="p-6 text-gray-500">Loading candidate…</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  const decisionTaken = Boolean(data.hr_decision)

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ================= Candidate Header ================= */}
      <div className="bg-white rounded shadow p-6 space-y-2">
        <h1 className="text-2xl font-bold">{data.full_name}</h1>

        <div className="text-sm text-gray-600">
          {data.email} · {data.phone}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span><b>Role:</b> {data.role || '-'}</span>
          <span><b>Experience:</b> {data.experience_type}</span>
          <span><b>Previous Company:</b> {data.previous_company || '-'}</span>
          <span><b>Current CTC:</b> ₹{data.current_ctc || '-'}</span>
          <span><b>Expected CTC:</b> ₹{data.expected_ctc}</span>
        </div>
      </div>

      {/* ================= Interview Pipeline ================= */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Interview Pipeline
        </h2>

        <div className="space-y-3">
          {data.interviews.length === 0 && (
            <div className="text-sm text-gray-500">
              No interviews scheduled yet
            </div>
          )}

          {data.interviews.map((i: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between border rounded p-3"
            >
              <div>
                <div className="font-medium">{i.round_name}</div>
                <div className="text-xs text-gray-500">
                  {i.interview_type}
                </div>
                {i.remarks && (
                  <div className="text-xs text-gray-600 mt-1">
                    {i.remarks}
                  </div>
                )}
              </div>

              <span
                className={`px-2 py-1 text-xs rounded font-medium ${
                  STATUS_COLOR[i.status] ||
                  'bg-gray-100 text-gray-700'
                }`}
              >
                {i.status.replaceAll('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Offer Details ================= */}
      {data.offer && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-2">
            Offer Details
          </h2>

          <div className="text-sm">
            <b>Offered CTC:</b> ₹{data.offer.offered_ctc}
          </div>

          <span
            className={`inline-block mt-2 px-2 py-1 text-xs rounded font-medium ${
              STATUS_COLOR[data.offer.status] ||
              'bg-gray-100 text-gray-700'
            }`}
          >
            {data.offer.status.replaceAll('_', ' ')}
          </span>
        </div>
      )}

      {/* ================= HR Decision ================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">HR Decision</h2>

        {decisionTaken ? (
          <div>
            <span
              className={`px-2 py-1 text-xs rounded font-medium ${
                STATUS_COLOR[data.hr_decision] ||
                'bg-gray-100 text-gray-700'
              }`}
            >
              {data.hr_decision.replaceAll('_', ' ')}
            </span>

            {data.hr_decision_remarks && (
              <p className="mt-2 text-sm text-gray-600">
                <b>Remarks:</b> {data.hr_decision_remarks}
              </p>
            )}
          </div>
        ) : (
          <>
            <select
              className="border rounded px-3 py-2 text-sm w-64"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="">Select decision</option>
              <option value="SHORTLISTED">Shortlist</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="REJECTED">Reject</option>
            </select>

            <textarea
              className="border rounded px-3 py-2 text-sm w-full"
              placeholder="Remarks (mandatory for Reject / On Hold)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              disabled={submitting}
              onClick={submitDecision}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
            >
              Submit Decision
            </button>
          </>
        )}
      </div>
    </div>
  )
}