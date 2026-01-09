'use client'

import CandidateForm from '@/components/forms/CandidateForm'
import CandidatesList from '@/components/candidates/CandidatesList'

export default function AdminCandidates() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Candidate Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CandidateForm />
        </div>
        
        <div className="lg:col-span-2">
          <CandidatesList />
        </div>
      </div>
    </div>
  )
}