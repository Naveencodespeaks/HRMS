'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiRequest } from '@/lib/api-client'

type CandidateSelfDetail = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  experience_type: string
  highest_qualification: string
  expected_ctc: number
  resume_url?: string
  status: string
}

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params?.id as string | undefined

  const [data, setData] = useState<CandidateSelfDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔔 email states
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    if (!candidateId) return

    setLoading(true)

    apiRequest(`/candidates/${candidateId}`)
      .then((res) => setData(res))
      .catch(() => setError('Unable to load your application'))
      .finally(() => setLoading(false))
  }, [candidateId])

  // 📧 Send / Resend email
  async function sendConfirmationEmail() {
    if (!candidateId) return

    setEmailLoading(true)
    setEmailError(null)

    try {
      await apiRequest(
        `/candidates/${candidateId}/send-confirmation-email`,
        { method: 'POST' }
      )
      setEmailSent(true)
    } catch (err) {
      setEmailError('Failed to send confirmation email')
    } finally {
      setEmailLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading your application…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return <div className="p-6">No data found</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border rounded p-6">
        <h1 className="text-xl font-semibold">
          Application Submitted ✅
        </h1>
        <p className="text-sm text-gray-600">
          Thank you for applying to Mahavir Group.
        </p>
      </div>

      {/* EMAIL CONFIRMATION */}
      <div className="bg-blue-50 border border-blue-200 rounded p-6">
        <h2 className="font-medium mb-2">📧 Email Confirmation</h2>

        <p className="text-sm mb-3">
          A secure application link will be sent to:
          <br />
          <b>{data.email}</b>
        </p>

        {emailSent ? (
          <p className="text-green-700 text-sm font-medium">
            ✅ Confirmation email sent successfully
          </p>
        ) : (
          <button
            onClick={sendConfirmationEmail}
            disabled={emailLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {emailLoading ? 'Sending…' : 'Send Confirmation Email'}
          </button>
        )}

        {emailError && (
          <p className="text-red-600 text-sm mt-2">{emailError}</p>
        )}
      </div>

      {/* DETAILS */}
      <div className="bg-white border rounded p-6">
        <h2 className="font-medium mb-3">Your Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>Name:</b> {data.first_name} {data.last_name}</div>
          <div><b>Email:</b> {data.email}</div>
          <div><b>Phone:</b> {data.phone}</div>
          <div><b>Experience:</b> {data.experience_type}</div>
          <div><b>Qualification:</b> {data.highest_qualification}</div>
          <div><b>Expected CTC:</b> ₹{data.expected_ctc}</div>
        </div>

        {data.resume_url && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">🧾 Resume</h3>

            {data.resume_url.endsWith('.pdf') ? (
              <iframe
                src={data.resume_url}
                className="w-full h-[500px] border"
              />
            ) : (
              <a
                href={data.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Download Resume
              </a>
            )}
          </div>
        )}
      </div>

      {/* STATUS */}
      <div className="bg-white border rounded p-6">
        <span className="inline-block px-3 py-1 rounded bg-yellow-100 text-yellow-800">
          {data.status}
        </span>
      </div>

    </div>
  )
}