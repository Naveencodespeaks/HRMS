'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import InterviewForm from '@/components/interviews/InterviewForm'
import InterviewList from '@/components/interviews/InterviewList'
import { interviewsAPI, Interview } from '@/lib/interviews.api'

export default function InterviewSchedulerPage() {
  const { id } = useParams() // candidate_id
  const candidateId = id as string

  const [interviews, setInterviews] = useState<Interview[]>([])

  const load = async () => {
    const data = await interviewsAPI.listByCandidate(candidateId)
    setInterviews(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        🗓 Interview Scheduler
      </h1>

      <InterviewForm candidateId={candidateId} onSuccess={load} />

      <h2 className="text-xl font-semibold mb-4">
        Interview Timeline
      </h2>

      <InterviewList interviews={interviews} />
    </div>
  )
}
