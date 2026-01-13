'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateSuccessPage() {
  const router = useRouter()

  // 🚫 Refresh protection
  useEffect(() => {
    const handleReload = () => {
      router.replace('/candidates')
    }

    window.addEventListener('beforeunload', handleReload)
    return () =>
      window.removeEventListener('beforeunload', handleReload)
  }, [router])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/MahavirGroupLogo.png"
            alt="Mahavir Group"
            className="h-14"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Thank you for filling the form
        </h2>

        <p className="text-gray-600 mb-4">
          Thank you for submitting your details to
          <span className="font-semibold"> Mahavir Group</span>.
          Our team will review your profile and contact you shortly.
        </p>

        <p className="text-sm italic text-gray-500 mb-6">
          “Building Careers. Empowering Futures.”
        </p>

        <button
          onClick={() => router.replace('/candidates')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}
