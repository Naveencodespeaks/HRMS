// src/app/layout.tsx
import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mahavir HRMS',
  description: 'Human Resource Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {/* 🔑 PUBLIC LAYOUT — NO SIDEBAR */}
        {children}
      </body>
    </html>
  )
}