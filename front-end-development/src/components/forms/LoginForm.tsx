'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userRole', data.role)
        
        // Redirect based on role
        switch(data.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'recruiter':
            router.push('/recruiter')
            break
          default:
            router.push('/candidates')
        }
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (error) {
      alert('Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}