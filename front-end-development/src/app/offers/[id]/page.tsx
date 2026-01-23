'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { offersAPI } from '@/lib/offers.api'
import { Offer } from '@/types/offer'

export default function OfferDetailPage() {
  const { id } = useParams()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const data = await offersAPI.get(id as string)
        setOffer(data)
      } catch (err) {
        console.error('Failed to load offer', err)
      } finally {
        setLoading(false)
      }
    }

    loadOffer()
  }, [id])

  const updateOffer = async () => {
    if (!offer) return

    await offersAPI.update(offer.id, {
      status: offer.status,
      remarks: offer.remarks,
      joining_date: offer.joining_date,
    })

    alert('Offer updated successfully')
  }

  if (loading) return <div className="p-8">Loading offer...</div>
  if (!offer) return <div className="p-8">Offer not found</div>

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Offer Details</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Offered CTC</label>
          <input
            type="number"
            className="input"
            value={offer.offered_ctc}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Joining Date</label>
          <input
            type="date"
            className="input"
            value={offer.joining_date || ''}
            onChange={(e) =>
              setOffer({ ...offer, joining_date: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="input"
            value={offer.status}
            onChange={(e) =>
              setOffer({ ...offer, status: e.target.value as any })
            }
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SENT">SENT</option>
            <option value="ON_HOLD">ON HOLD</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            className="input"
            value={offer.remarks || ''}
            onChange={(e) =>
              setOffer({ ...offer, remarks: e.target.value })
            }
          />
        </div>

        <button
          onClick={updateOffer}
          className="btn-primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
