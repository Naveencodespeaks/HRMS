// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// interface LoginFormData {
//   email: string
//   password: string
// }

// export default function LoginForm() {
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
    
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         localStorage.setItem('token', data.token)
//         localStorage.setItem('userRole', data.role)
        
//         // Redirect based on role
//         switch(data.role) {
//           case 'admin':
//             router.push('/admin')
//             break
//           case 'recruiter':
//             router.push('/recruiter')
//             break
//           default:
//             router.push('/candidates')
//         }
//       } else {
//         alert(data.message || 'Login failed')
//       }
//     } catch (error) {
//       alert('Login error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
//       <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
//       <div className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({...formData, email: e.target.value})}
//           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           required
//         />
        
//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({...formData, password: e.target.value})}
//           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           required
//         />
        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </div>
//     </form>
//   )
// }






'use client'

import { useState } from 'react'

export default function CandidateForm() {
  const [resume, setResume] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    highest_qualification: '',
    experience_type: 'fresher',
    expected_ctc: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resume) {
      alert('Please upload resume')
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()

      // 📄 Resume file
      data.append('resume', resume)

      // 🧑 Candidate fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/candidates`,
        {
          method: 'POST',
          body: data, // ❗ Do NOT set Content-Type
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed to create candidate')
      }

      alert('Candidate created successfully')

      // Reset
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        highest_qualification: '',
        experience_type: 'fresher',
        expected_ctc: '',
      })
      setResume(null)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Add New Candidate</h2>

      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        type="text"
        name="highest_qualification"
        placeholder="Highest Qualification"
        value={formData.highest_qualification}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <select
        name="experience_type"
        value={formData.experience_type}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      >
        <option value="fresher">Fresher</option>
        <option value="experienced">Experienced</option>
      </select>

      <input
        type="number"
        name="expected_ctc"
        placeholder="Expected CTC"
        value={formData.expected_ctc}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      {/* 📎 Resume Upload */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files?.[0] || null)}
        className="w-full p-3 border rounded-lg"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Add Candidate'}
      </button>
    </form>
  )
}
