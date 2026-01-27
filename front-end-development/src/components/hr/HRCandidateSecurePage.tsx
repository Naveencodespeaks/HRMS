'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { hrApi } from '@/lib/hr.api'

type Interview = {
  round: string
  interviewer?: string
  status: string
  feedback?: string
}

type CandidateResponse = {
  candidate: {
    id: string
    full_name: string
    email: string
    phone: string
    role: string
    status: string
  }
  interviews: Interview[]
  offer?: {
    status: string
  }
}

const STATUS_COLOR: Record<string, string> = {
  APPLIED: 'bg-gray-300',

  PENDING: 'bg-yellow-400',
  ON_HOLD: 'bg-yellow-400',

  PASSED: 'bg-green-500',
  SHORTLISTED: 'bg-green-500',
  OFFER_CREATED: 'bg-green-500',

  FAILED: 'bg-red-500',
  REJECTED: 'bg-red-500',
}

export default function HRCandidateSecurePage({ candidateId }: { candidateId: string }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [data, setData] = useState<CandidateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing HR access token')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const res = await hrApi.getCandidateSecure(candidateId, token)
        setData(res)
      } catch (err) {
        setError('Unable to load candidate details')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [candidateId, token])

  if (loading) {
    return <div className="p-6 text-sm">Loading candidate details...</div>
  }

  if (error || !data) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  const { candidate, interviews, offer } = data

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Candidate Header */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold">{candidate.full_name}</h2>
        <p className="text-sm text-gray-600">{candidate.email}</p>
        <p className="text-sm text-gray-600">{candidate.phone}</p>

        <div className="mt-3 flex gap-4 text-sm">
          <span><b>Role:</b> {candidate.role || '-'}</span>
          <span><b>Status:</b> {candidate.status}</span>
        </div>
      </div>

      {/* Hiring Pipeline */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-medium mb-4">Hiring Pipeline</h3>

        <div className="flex items-center gap-6">
          {interviews.map((round, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full ${
                  STATUS_COLOR[round.status] || 'bg-gray-300'
                }`}
              />
              <span className="text-xs mt-2">{round.round}</span>
            </div>
          ))}

          {offer && (
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full ${
                  STATUS_COLOR[offer.status]
                }`}
              />
              <span className="text-xs mt-2">Offer</span>
            </div>
          )}
        </div>
      </div>

      {/* Interview Details */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-medium mb-4">Interview History</h3>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Round</th>
              <th className="p-2 text-left">Interviewer</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((i, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{i.round}</td>
                <td className="p-2">{i.interviewer || '-'}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      STATUS_COLOR[i.status]
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td className="p-2">{i.feedback || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}