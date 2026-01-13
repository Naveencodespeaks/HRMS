'use client'

import { useRouter } from 'next/navigation'

export default function AdminQuickActions() {
  const router = useRouter()

  const actions = [
    {
      label: 'Add Candidate',
      sub: 'Create a new candidate',
      onClick: () => router.push('/admin/candidates'),
      primary: true,
    },
    {
      label: 'Schedule Interview',
      sub: 'Plan interviews',
      onClick: () => router.push('/admin/interviews'),
    },
    {
      label: 'Create Offer',
      sub: 'Release an offer',
      onClick: () => router.push('/admin/offers'),
    },
    {
      label: 'Export',
      sub: 'Download report',
      onClick: () => router.push('/admin/reports'),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={[
            'rounded-lg border p-4 text-left transition shadow-sm',
            'hover:shadow-md hover:border-gray-300',
            action.primary
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-900',
          ].join(' ')}
        >
          <div className="font-semibold">{action.label}</div>
          <div
            className={`text-sm mt-1 ${
              action.primary ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {action.sub}
          </div>
        </button>
      ))}
    </div>
  )
}
