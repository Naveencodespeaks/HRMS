export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <p className="text-gray-600 mb-6">
        View and download interview, candidate, and offer reports.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Candidate Report</h3>
          <p className="text-sm text-gray-500">All candidates status</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Interview Report</h3>
          <p className="text-sm text-gray-500">Interview outcomes</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Offer Report</h3>
          <p className="text-sm text-gray-500">Offers issued</p>
        </div>
      </div>
    </div>
  )
}
    