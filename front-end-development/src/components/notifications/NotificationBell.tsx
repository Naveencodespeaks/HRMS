'use client'

import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { AdminNotificationSummary } from '@/lib/notifications.mock'

type Props = {
  summary: AdminNotificationSummary
}

export default function NotificationBell({ summary }: Props) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/admin/notifications')}
      className="relative p-2 rounded-full hover:bg-gray-100"
    >
      <Bell className="w-6 h-6 text-gray-700" />

      {/* Red Badge */}
      {summary.unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-semibold">
          {summary.unreadCount}
        </span>
      )}
    </button>
  )
}
