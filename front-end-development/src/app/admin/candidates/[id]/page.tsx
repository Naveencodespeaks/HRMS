'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import OfferTimeline from '@/components/offers/OfferTimeline'
import { apiRequest } from '@/lib/api-client'

type Interview = {
  round_number: number
  round_name?: string
  interview_type?: string
  status: string
  feedback?: string
  rating?: number
  scheduled_at?: string
  completed_at?: string
}

type Offer = {
  offered_ctc: number
  status: string
  joining_date?: string
  remarks?: string
  updated_at?: string
}

type HRCandidateDetail = {
  id: string
  full_name: string
  email: string
  phone: string
  experience_type: string
  highest_qualification: string
  previous_company?: string
  total_experience_years?: number
  expected_ctc: number
  notice_period_days?: number
  immediate_joining: boolean
  resume_url?: string
  created_at: string
  interviews: Interview[]
  offer?: Offer
}

export default function AdminCandidateDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const candidateId = params.id as string
  const token = searchParams.get('token')

  const [data, setData] = useState<HRCandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!candidateId || !token) {
      setError('Invalid access link')
      setLoading(false)
      return
    }

    const fetchCandidate = async () => {
      try {
        const res = await apiRequest(
          `/hr/candidates/${candidateId}?token=${token}`
        )
        setData(res)
      } catch (err: any) {
        setError(err.message || 'Failed to load candidate')
      } finally {
        setLoading(false)
      }
    }

    fetchCandidate()
  }, [candidateId, token])

  if (loading) return <p className="p-8">Loading candidate details...</p>

  if (error)
    return (
      <div className="p-8 text-red-600 font-semibold">
        {error}
      </div>
    )

  if (!data) return null

  return (
    <div className="p-8 space-y-8">
      {/* ================= Candidate Header ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          {data.full_name}
        </h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Email:</b> {data.email}</p>
          <p><b>Phone:</b> {data.phone}</p>
          <p><b>Experience:</b> {data.experience_type}</p>
          <p><b>Qualification:</b> {data.highest_qualification}</p>
          <p><b>Expected CTC:</b> ₹{data.expected_ctc}</p>
          <p>
            <b>Immediate Joining:</b>{' '}
            {data.immediate_joining ? 'Yes' : 'No'}
          </p>
        </div>

        {data.resume_url && (
          <a
            href={data.resume_url}
            target="_blank"
            className="inline-block mt-4 text-blue-600 underline"
          >
            View Resume
          </a>
        )}
      </div>

      {/* ================= Offer Timeline ================= */}
      {data.offer && (
        <OfferTimeline
          status={data.offer.status}
          created_at={data.created_at}
          updated_at={data.offer.updated_at || data.created_at}
        />
      )}

      {/* ================= Interviews ================= */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          🧑‍💼 Interviews
        </h2>

        {data.interviews.length === 0 ? (
          <p className="text-gray-500">
            No interviews scheduled yet
          </p>
        ) : (
          <div className="space-y-3">
            {data.interviews.map((i) => (
              <div
                key={i.round_number}
                className="border rounded p-3 text-sm"
              >
                <p>
                  <b>Round:</b> {i.round_name || i.round_number}
                </p>
                <p><b>Status:</b> {i.status}</p>
                {i.feedback && <p><b>Feedback:</b> {i.feedback}</p>}
                {i.rating && <p><b>Rating:</b> {i.rating}/5</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
