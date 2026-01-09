'use client'

export default function RecruiterDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Recruitment Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Manage candidates, interviews, and offers efficiently
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm text-gray-500">Total Candidates</h2>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm text-gray-500">Interviews Today</h2>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm text-gray-500">Offers Released</h2>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm text-gray-500">Open Jobs</h2>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Candidates</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Position</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">Neeraj</td>
                  <td className="py-3 px-4 text-sm">software Developer</td>
                  <td className="py-3 px-4 text-sm">Interview Scheduled</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">Raju</td>
                  <td className="py-3 px-4 text-sm">React Developer</td>
                  <td className="py-3 px-4 text-sm">Under Review</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Interviews</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Candidate</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Time</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">Neeraj Kumar</td>
                  <td className="py-3 px-4 text-sm">10:00 AM</td>
                  <td className="py-3 px-4 text-sm">Technical</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">kiran kumar</td>
                  <td className="py-3 px-4 text-sm">2:00 PM</td>
                  <td className="py-3 px-4 text-sm">HR Round</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}