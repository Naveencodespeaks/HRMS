'use client'

import { useRouter } from 'next/navigation'

export default function NotificationDropdown({
  onClose,
}: {
  onClose: () => void
}) {
  const router = useRouter()

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">
        <p className="font-semibold">New Applications</p>
        <p className="text-xs text-gray-500">Last 15 minutes</p>
      </div>

      <ul className="max-h-64 overflow-y-auto">
        {[
          { role: 'Software Developer', count: 6 },
          { role: 'React Developer', count: 4 },
          { role: 'QA Engineer', count: 2 },
          { role: 'Intern', count: 2 },
        ].map((item) => (
          <li
            key={item.role}
            className="flex justify-between px-4 py-2 hover:bg-gray-50 text-sm"
          >
            <span>{item.role}</span>
            <span className="font-semibold">{item.count}</span>
          </li>
        ))}
      </ul>

      <div className="p-3 border-t">
        <button
          onClick={() => {
            onClose()
            router.push('/admin/notifications')
          }}
          className="w-full text-center text-sm font-medium text-blue-600 hover:underline"
        >
          View all candidates
        </button>
      </div>
    </div>
  )
}
