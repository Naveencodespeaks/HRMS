import { Interview } from '@/lib/interviews.api'

export default function InterviewList({
  interviews,
}: {
  interviews: Interview[]
}) {
  if (!interviews.length) {
    return <p className="text-gray-500">No interviews scheduled yet.</p>
  }

  return (
    <div className="space-y-4">
      {interviews.map((i) => (
        <div
          key={i.id}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">
                {i.round_name} – {i.interview_type}
              </p>
              <p className="text-sm text-gray-600">
                {i.scheduled_at
                  ? new Date(i.scheduled_at).toLocaleString()
                  : 'Not scheduled'}
              </p>
            </div>
            <span className="text-sm font-medium">
              {i.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
