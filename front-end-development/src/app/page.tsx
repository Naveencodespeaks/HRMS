import Link from "next/link"

export default function Dashboard() {
  return (
    <main className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mahavir Group Talent Acquisition Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Talent Acquisition Management System
        </p>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Candidates"
          value="128"
          link="/candidates"
        />
        <DashboardCard
          title="Scheduled Interviews"
          value="24"
          link="/interviews"
        />
        <DashboardCard
          title="Offers Released"
          value="12"
          link="/offers"
        />
        <DashboardCard
          title="Pending Reports"
          value="5"
          link="/reports"
        />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <ActionButton href="/candidates">➕ Add Candidate</ActionButton>
          <ActionButton href="/interviews">📅 Schedule Interview</ActionButton>
          <ActionButton href="/offers">📄 Create Offer</ActionButton>
          <ActionButton href="/reports">📊 View Reports</ActionButton>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg divide-y">
          <ActivityItem text="Candidate Naveen added" />
          <ActivityItem text="Interview scheduled for  sai" />
          <ActivityItem text="Offer released to Neeraj Kumar" />
          <ActivityItem text="Monthly report generated" />
        </div>
      </section>
    </main>
  )
}

/* ---------- Small reusable components ---------- */

function DashboardCard({
  title,
  value,
  link,
}: {
  title: string
  value: string
  link: string
}) {
  return (
    <Link
      href={link}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
    </Link>
  )
}

function ActionButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      {children}
    </Link>
  )
}

function ActivityItem({ text }: { text: string }) {
  return (
    <div className="p-4 text-sm text-gray-700 hover:bg-gray-50">
      {text}
    </div>
  )
}
