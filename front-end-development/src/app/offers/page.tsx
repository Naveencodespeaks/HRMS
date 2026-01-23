'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { offersAPI } from '@/lib/offers.api'
import { Offer } from '@/types/offer'

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await offersAPI.list()
        setOffers(data)
      } catch (err) {
        console.error('Failed to load offers', err)
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [])

  if (loading) {
    return <div className="p-8">Loading offers...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Offers</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">CTC</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joining Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {offers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No offers found
                </td>
              </tr>
            )}

            {offers.map((offer) => (
              <tr key={offer.id} className="border-t">
                <td className="p-4">₹{offer.offered_ctc}</td>
                <td className="p-4 font-medium">{offer.status}</td>
                <td className="p-4">
                  {offer.joining_date
                    ? new Date(offer.joining_date).toDateString()
                    : '—'}
                </td>
                <td className="p-4">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
