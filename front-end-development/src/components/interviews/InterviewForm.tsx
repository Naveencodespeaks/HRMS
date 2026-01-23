'use client'

import { useState } from 'react'
import { interviewsAPI } from '@/lib/interviews.api'

export default function InterviewForm({
  candidateId,
  onSuccess,
}: {
  candidateId: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    round_number: 1,
    round_name: 'L1',
    interview_type: 'Technical',
    interviewer_name: '',
    interviewer_email: '',
    scheduled_at: '',
  })

  const submit = async () => {
    setLoading(true)
    try {
      await interviewsAPI.schedule({
        candidate_id: candidateId,
        ...form,
      })
      onSuccess()
      alert('Interview scheduled successfully ✅')
    } catch {
      alert('Failed to schedule interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">📅 Schedule Interview</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Round Number"
          value={form.round_number}
          onChange={(e) =>
            setForm({ ...form, round_number: Number(e.target.value) })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Round Name (L1, L2, HR)"
          value={form.round_name}
          onChange={(e) =>
            setForm({ ...form, round_name: e.target.value })
          }
          className="border p-2 rounded"
        />

        <select
          className="border p-2 rounded"
          value={form.interview_type}
          onChange={(e) =>
            setForm({ ...form, interview_type: e.target.value })
          }
        >
          <option>Technical</option>
          <option>HR</option>
          <option>Manager</option>
        </select>

        <input
          placeholder="Interviewer Name"
          value={form.interviewer_name}
          onChange={(e) =>
            setForm({ ...form, interviewer_name: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Interviewer Email"
          value={form.interviewer_email}
          onChange={(e) =>
            setForm({ ...form, interviewer_email: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) =>
            setForm({ ...form, scheduled_at: e.target.value })
          }
          className="border p-2 rounded col-span-2"
        />
      </div>

      <button
        disabled={loading}
        onClick={submit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Schedule Interview
      </button>
    </div>
  )
}
