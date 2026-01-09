'use client'

import { useState, useEffect } from 'react'
import { candidatesAPI } from '@/lib/api-client'

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  status: string
  created_at: string
}

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const data = await candidatesAPI.getAll()
      setCandidates(data.items || data)
    } catch (err) {
      setError('Failed to fetch candidates')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await candidatesAPI.update(id, { status: newStatus })
      fetchCandidates() // Refresh list
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <div className="p-4">Loading candidates...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Candidates</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {candidate.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={candidate.status}
                    onChange={(e) => updateStatus(candidate.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offer Sent">Offer Sent</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => window.open(`mailto:${candidate.email}`)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => window.open(`tel:${candidate.phone}`)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Call
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}