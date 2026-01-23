'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

  const [resume, setResume] = useState<File | null>(null)

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleExperienceToggle = (fresher: boolean) => {
    setIsFresher(fresher)

    if (fresher) {
      // Clear experienced-only fields
      setForm((prev) => ({
        ...prev,
        previous_company: '',
        role: '',
        company_location: '',
        total_experience_years: '',
        current_ctc: '',
        notice_period_days: '',
      }))
    }
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!resume) {
      setError('Please upload resume')
      setIsSubmitting(false)
      return
    }

    if (!isFresher && (!form.current_ctc || !form.expected_ctc)) {
      setError('Current CTC and Expected CTC are required for experienced candidates')
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()

      /* Resume */
      formData.append('resume', resume)

      /* Personal Info */
      formData.append('first_name', form.first_name)
      formData.append('last_name', form.last_name)
      formData.append('phone', form.phone)
      formData.append('email', form.email)
      formData.append('address', form.address)

      /* Education */
      formData.append('highest_qualification', form.highest_qualification)
      formData.append(
        'experience_type',
        isFresher ? 'fresher' : 'experienced'
      )

      /* Professional (Experienced only) */
      if (!isFresher) {
        formData.append('previous_company', form.previous_company)
        formData.append('role', form.role)
        formData.append('company_location', form.company_location)
        formData.append(
          'total_experience_years',
          form.total_experience_years
        )
        formData.append('current_ctc', form.current_ctc)
      }

      /* Compensation */
      formData.append('expected_ctc', form.expected_ctc)

      if (form.notice_period_days) {
        formData.append('notice_period_days', form.notice_period_days)
      }

      formData.append(
        'immediate_joining',
        joiningType === 'Immediate' ? 'true' : 'false'
      )

      if (joiningType === 'Date') {
        formData.append('date_of_joining', form.date_of_joining)
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.detail || 'Failed to submit profile')
      }

      localStorage.setItem(SUBMISSION_KEY, 'true')
      router.replace('/candidates/success')
    } catch (err: any) {
      setError(err.message)
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
          <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
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
          <h2 className="font-semibold text-lg mb-4">Education & Experience</h2>

          <input
            name="highest_qualification"
            className="input mb-4"
            placeholder="Highest Qualification"
            onChange={handleChange}
            required
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" checked={isFresher} onChange={() => handleExperienceToggle(true)} />
              Fresher
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={!isFresher} onChange={() => handleExperienceToggle(false)} />
              Experienced
            </label>
          </div>
        </section>

        {/* EXPERIENCE DETAILS */}
        {!isFresher && (
          <section>
            <h2 className="font-semibold text-lg mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="previous_company" className="input" placeholder="Previous Company" onChange={handleChange} required />
              <input name="role" className="input" placeholder="Role / Designation" onChange={handleChange} required />
              <input name="company_location" className="input" placeholder="Company Location" onChange={handleChange} required />
              <input type="number" name="total_experience_years" className="input" placeholder="Experience (Years)" onChange={handleChange} required />
            </div>
          </section>
        )}

        {/* COMPENSATION */}
        <section>
          <h2 className="font-semibold text-lg mb-4">Compensation & Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {!isFresher && (
              <>
                <input type="number" name="current_ctc" className="input" placeholder="Current CTC" onChange={handleChange} required />
                <input type="number" name="expected_ctc" className="input" placeholder="Expected CTC" onChange={handleChange} required />
              </>
            )}

            {isFresher && (
              <input type="number" name="expected_ctc" className="input md:col-span-2" placeholder="Expected CTC" onChange={handleChange} required />
            )}

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

        {/* RESUME */}
        <section>
          <h2 className="font-semibold text-lg mb-4">Resume</h2>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            required
            className="input"
          />
          <p className="text-xs text-gray-500 mt-1">
            PDF / DOC / DOCX only
          </p>
        </section>

        {/* SUBMIT */}
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







// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// const SUBMISSION_KEY = 'candidate_profile_submitted'

// export default function CandidatePage() {
//   const router = useRouter()

//   /* ================= UI STATES ================= */
//   const [isFresher, setIsFresher] = useState(true)
//   const [joiningType, setJoiningType] =
//     useState<'Immediate' | 'Date'>('Immediate')
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   /* ================= FORM STATE ================= */
//   const [form, setForm] = useState({
//     first_name: '',
//     last_name: '',
//     phone: '',
//     email: '',
//     address: '',
//     highest_qualification: '',
//     previous_company: '',
//     role: '',
//     company_location: '',
//     total_experience_years: '',
//     current_ctc: '',
//     expected_ctc: '',
//     notice_period_days: '',
//     date_of_joining: '',
//   })

//   const [resume, setResume] = useState<File | null>(null)

//   /* ================= HANDLERS ================= */
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleExperienceToggle = (fresher: boolean) => {
//     setIsFresher(fresher)

//     if (fresher) {
//       setForm((prev) => ({
//         ...prev,
//         previous_company: '',
//         role: '',
//         company_location: '',
//         total_experience_years: '',
//         current_ctc: '',
//         notice_period_days: '',
//       }))
//     }
//   }

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)

//     if (!resume) {
//       setError('Please upload resume')
//       setIsSubmitting(false)
//       return
//     }

//     if (!isFresher && (!form.current_ctc || !form.expected_ctc)) {
//       setError(
//         'Current CTC and Expected CTC are required for experienced candidates'
//       )
//       setIsSubmitting(false)
//       return
//     }

//     try {
//       const formData = new FormData()

//       /* Resume */
//       formData.append('resume', resume)

//       /* Personal Info */
//       formData.append('first_name', form.first_name)
//       formData.append('last_name', form.last_name)
//       formData.append('phone', form.phone)
//       formData.append('email', form.email)
//       formData.append('address', form.address)

//       /* Education */
//       formData.append('highest_qualification', form.highest_qualification)
//       formData.append(
//         'experience_type',
//         isFresher ? 'fresher' : 'experienced'
//       )

//       /* Professional (Experienced only) */
//       if (!isFresher) {
//         formData.append('previous_company', form.previous_company)
//         formData.append('role', form.role)
//         formData.append('company_location', form.company_location)

//         formData.append(
//           'total_experience_years',
//           String(Number(form.total_experience_years))
//         )

//         formData.append(
//           'current_ctc',
//           String(Number(form.current_ctc))
//         )
//       }

//       /* Compensation */
//       formData.append(
//         'expected_ctc',
//         String(Number(form.expected_ctc))
//       )

//       if (form.notice_period_days) {
//         formData.append(
//           'notice_period_days',
//           String(Number(form.notice_period_days))
//         )
//       }

//       /* Joining */
//       formData.append(
//         'immediate_joining',
//         joiningType === 'Immediate' ? 'true' : 'false'
//       )

//       if (joiningType === 'Date') {
//         formData.append('date_of_joining', form.date_of_joining)
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/candidates`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       )

//       if (!res.ok) {
//         const err = await res.json()
//         throw new Error(err?.detail || 'Failed to submit profile')
//       }

//       localStorage.setItem(SUBMISSION_KEY, 'true')
//       router.replace('/candidates/success')
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   /* ================= UI ================= */
//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
//       <p className="text-gray-600 mb-6">
//         Please fill in your details carefully
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="space-y-8 bg-white p-8 rounded-lg shadow"
//       >
//         {error && (
//           <div className="bg-red-50 text-red-700 p-3 rounded">
//             {error}
//           </div>
//         )}

//         {/* PERSONAL INFORMATION */}
//         <section>
//           <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input name="first_name" className="input" placeholder="First Name" onChange={handleChange} required />
//             <input name="last_name" className="input" placeholder="Last Name" onChange={handleChange} required />
//             <input name="phone" className="input" placeholder="Phone Number" onChange={handleChange} required />
//             <input name="email" type="email" className="input md:col-span-2" placeholder="Email ID" onChange={handleChange} required />
//             <textarea name="address" className="input md:col-span-2" placeholder="Address" onChange={handleChange} required />
//           </div>
//         </section>

//         {/* EDUCATION & EXPERIENCE */}
//         <section>
//           <h2 className="font-semibold text-lg mb-4">Education & Experience</h2>

//           <input
//             name="highest_qualification"
//             className="input mb-4"
//             placeholder="Highest Qualification"
//             onChange={handleChange}
//             required
//           />

//           <div className="flex gap-6">
//             <label className="flex items-center gap-2">
//               <input type="radio" checked={isFresher} onChange={() => handleExperienceToggle(true)} />
//               Fresher
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" checked={!isFresher} onChange={() => handleExperienceToggle(false)} />
//               Experienced
//             </label>
//           </div>
//         </section>

//         {/* EXPERIENCE DETAILS */}
//         {!isFresher && (
//           <section>
//             <h2 className="font-semibold text-lg mb-4">Professional Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input name="previous_company" className="input" placeholder="Previous Company" onChange={handleChange} required />
//               <input name="role" className="input" placeholder="Role / Designation" onChange={handleChange} required />
//               <input name="company_location" className="input" placeholder="Company Location" onChange={handleChange} required />
//               <input type="number" name="total_experience_years" className="input" placeholder="Experience (Years)" onChange={handleChange} required />
//             </div>
//           </section>
//         )}

//         {/* COMPENSATION */}
//         <section>
//           <h2 className="font-semibold text-lg mb-4">Compensation & Availability</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {!isFresher && (
//               <>
//                 <input type="number" name="current_ctc" className="input" placeholder="Current CTC" onChange={handleChange} required />
//                 <input type="number" name="expected_ctc" className="input" placeholder="Expected CTC" onChange={handleChange} required />
//               </>
//             )}

//             {isFresher && (
//               <input type="number" name="expected_ctc" className="input md:col-span-2" placeholder="Expected CTC" onChange={handleChange} required />
//             )}

//             <input type="number" name="notice_period_days" className="input" placeholder="Notice Period (Days)" onChange={handleChange} />

//             <select
//               className="input"
//               value={joiningType}
//               onChange={(e) =>
//                 setJoiningType(e.target.value as 'Immediate' | 'Date')
//               }
//             >
//               <option value="Immediate">Immediate Joining</option>
//               <option value="Date">Select Joining Date</option>
//             </select>

//             {joiningType === 'Date' && (
//               <input
//                 type="date"
//                 name="date_of_joining"
//                 className="input md:col-span-2"
//                 onChange={handleChange}
//                 required
//               />
//             )}
//           </div>
//         </section>

//         {/* RESUME */}
//         <section>
//           <h2 className="font-semibold text-lg mb-4">Resume</h2>
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={(e) => setResume(e.target.files?.[0] || null)}
//             required
//             className="input"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             PDF / DOC / DOCX only
//           </p>
//         </section>

//         {/* SUBMIT */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isSubmitting ? 'Saving...' : 'Save Profile'}
//         </button>
//       </form>
//     </div>
//   )
// }
