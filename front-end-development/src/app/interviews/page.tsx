'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import InterviewForm from '@/components/interviews/InterviewForm'
import InterviewList from '@/components/interviews/InterviewList'
import { interviewsAPI, Interview } from '@/lib/interviews.api'

export default function InterviewSchedulerPage() {
  const params = useParams()

  // candidate_id (ONLY valid if route is /interviews/[id])
  const candidateId = params?.id as string | undefined

  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    // 🔐 SAFETY GUARD (THIS FIXES YOUR ERROR)
    if (!candidateId) {
      setInterviews([])
      setLoading(false)
      return
    }

    const data = await interviewsAPI.listByCandidate(candidateId)
    setInterviews(data)
    setLoading(false)
  }, [candidateId])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        🗓 Interview Scheduler
      </h1>

      {/* Disable form if candidateId missing */}
      <InterviewForm
        candidateId={candidateId}
        onSuccess={load}
        disabled={!candidateId}
      />

      <h2 className="text-xl font-semibold mb-4">
        Interview Timeline
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading interviews...</p>
      ) : !candidateId ? (
        <p className="text-red-500">
          No candidate selected. Please open interviews from a
          candidate profile.
        </p>
      ) : (
        <InterviewList interviews={interviews} />
      )}
    </div>
  )
}
