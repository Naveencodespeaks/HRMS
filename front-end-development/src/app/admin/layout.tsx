'use client'

import NotificationBell from '@/components/notifications/NotificationBell'
import { adminNotificationSummaryMock } from '@/lib/notifications.mock'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-end">
        <NotificationBell summary={adminNotificationSummaryMock} />
      </header>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
