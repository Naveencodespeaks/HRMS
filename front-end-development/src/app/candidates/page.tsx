'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { candidatesAPI } from '@/lib/api-client'

const SUBMISSION_KEY = 'candidate_profile_submitted'

export default function CandidatePage() {
  const router = useRouter()

  /* ================= UI STATES ================= */
  const [isFresher, setIsFresher] = useState(true)
  const [joiningType, setJoiningType] =
    useState<'Immediate' | 'Date'>('Immediate')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    highest_qualification: '',
    previous_company: '',
    role: '',
    company_location: '',
    total_experience_years: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period_days: '',
    date_of_joining: '',
  })

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...form,
      experience_type: isFresher ? 'fresher' : 'experienced',
      previous_company: isFresher ? null : form.previous_company,
      role: isFresher ? null : form.role,
      company_location: isFresher ? null : form.company_location,
      total_experience_years: isFresher
        ? null
        : Number(form.total_experience_years),
      current_ctc: form.current_ctc
        ? Number(form.current_ctc)
        : null,
      expected_ctc: Number(form.expected_ctc),
      notice_period_days: form.notice_period_days
        ? Number(form.notice_period_days)
        : null,
      immediate_joining: joiningType === 'Immediate',
      date_of_joining:
        joiningType === 'Immediate' ? null : form.date_of_joining,
    }

    try {
      await candidatesAPI.create(payload)
      localStorage.setItem(SUBMISSION_KEY, 'true')
      router.replace('/candidates/success')
    } catch (err: any) {
      setError(err?.message || 'Failed to submit profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
      <p className="text-gray-600 mb-6">
        Please fill in your details carefully
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-lg shadow"
      >
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* PERSONAL INFORMATION */}
        <section>
          <h2 className="font-semibold text-lg mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="first_name" className="input" placeholder="First Name" onChange={handleChange} required />
            <input name="last_name" className="input" placeholder="Last Name" onChange={handleChange} required />
            <input name="phone" className="input" placeholder="Phone Number" onChange={handleChange} required />
            <input name="email" type="email" className="input md:col-span-2" placeholder="Email ID" onChange={handleChange} required />
            <textarea name="address" className="input md:col-span-2" placeholder="Address" onChange={handleChange} required />
          </div>
        </section>

        {/* EDUCATION & EXPERIENCE */}
        <section>
          <h2 className="font-semibold text-lg mb-4">
            Education & Experience
          </h2>

          <input
            name="highest_qualification"
            className="input mb-4"
            placeholder="Highest Qualification"
            onChange={handleChange}
            required
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isFresher}
                onChange={() => setIsFresher(true)}
              />
              Fresher
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!isFresher}
                onChange={() => setIsFresher(false)}
              />
              Experienced
            </label>
          </div>
        </section>

        {/* PROFESSIONAL DETAILS */}
        {!isFresher && (
          <section>
            <h2 className="font-semibold text-lg mb-4">
              Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="previous_company" className="input" placeholder="Previous Company" onChange={handleChange} />
              <input name="role" className="input" placeholder="Role / Designation" onChange={handleChange} />
              <input name="company_location" className="input" placeholder="Company Location" onChange={handleChange} />
              <input type="number" name="total_experience_years" className="input" placeholder="Experience (Years)" onChange={handleChange} />
            </div>
          </section>
        )}

        {/* COMPENSATION & AVAILABILITY */}
        <section>
          <h2 className="font-semibold text-lg mb-4">
            Compensation & Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="current_ctc" className="input" placeholder="Current CTC" onChange={handleChange} />
            <input type="number" name="expected_ctc" className="input" placeholder="Expected CTC" onChange={handleChange} required />
            <input type="number" name="notice_period_days" className="input" placeholder="Notice Period (Days)" onChange={handleChange} />

            <select
              className="input"
              value={joiningType}
              onChange={(e) =>
                setJoiningType(e.target.value as 'Immediate' | 'Date')
              }
            >
              <option value="Immediate">Immediate Joining</option>
              <option value="Date">Select Joining Date</option>
            </select>

            {joiningType === 'Date' && (
              <input
                type="date"
                name="date_of_joining"
                className="input md:col-span-2"
                onChange={handleChange}
                required
              />
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
