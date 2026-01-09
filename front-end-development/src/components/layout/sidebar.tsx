'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SidebarProps = {
  role: 'admin' | 'recruiter'
}

const recruiterMenu = [
  { label: 'Dashboard', href: '/recruiter' },
  { label: 'Candidates', href: '/recruiter/candidates' },
  { label: 'Interviews', href: '/recruiter/interviews' },
  { label: 'Offers', href: '/recruiter/offers' },
  { label: 'Reports', href: '/recruiter/reports' },
]

const adminMenu = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Recruiters', href: '/admin/recruiters' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const menu = role === 'admin' ? adminMenu : recruiterMenu

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 text-xl font-bold border-b border-blue-700">
        Mahavir HRMS
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-700'
                  : 'hover:bg-blue-800'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-700 text-sm">
        Logged in as <br />
        <span className="font-semibold capitalize">{role}</span>
      </div>
    </aside>
  )
}
