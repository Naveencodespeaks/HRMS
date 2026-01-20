'use client'

import { useState } from 'react'

interface CandidateFormData {
  name: string
  email: string
  phone: string
  status: string
}

export default function CandidateForm() {
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'Applied'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Candidate created successfully')
        setFormData({ name: '', email: '', phone: '', status: 'Applied' })
      }
    } catch (error) {
      alert('Error creating candidate')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">Add New Candidate</h2>
      
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full p-3 border rounded-lg"
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full p-3 border rounded-lg"
        required
      />
      
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        className="w-full p-3 border rounded-lg"
        required
      />
      
      <select
        value={formData.status}
        onChange={(e) => setFormData({...formData, status: e.target.value})}
        className="w-full p-3 border rounded-lg"
      >
        <option value="Applied">Applied</option>
        <option value="Interview Scheduled">Interview Scheduled</option>
        <option value="Interviewed">Interviewed</option>
        <option value="Offer Sent">Offer Sent</option>
        <option value="Hired">Hired</option>
        <option value="Rejected">Rejected</option>
      </select>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Add Candidate
      </button>
    </form>
  )
}


