import '@/styles/globals.css'
// import '@fullcalendar/daygrid/index.css'
// import '@fullcalendar/timegrid/index.css'
// import '@fullcalendar/common/index.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mahavir CRM',
  description: 'Candidate Relationship Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-blue-900 text-white p-6">
            <h1 className="text-xl font-bold mb-6">Mahavir HRMS</h1>

            <nav className="space-y-3 text-sm">
              <a href="/" className="block hover:text-blue-300">
                Dashboard
              </a>
              <a href="/candidates" className="block hover:text-blue-300">
                Candidates
              </a>
              <a href="/interviews" className="block hover:text-blue-300">
                Interviews
              </a>
              <a href="/offers" className="block hover:text-blue-300">
                Offers
              </a>
              <a href="/reports" className="block hover:text-blue-300">
                Reports
              </a>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}
