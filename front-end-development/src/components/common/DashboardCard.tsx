interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  onClick?: () => void
}

export default function DashboardCard({ title, value, subtitle, onClick }: DashboardCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}