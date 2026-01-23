type OfferTimelineProps = {
  status: string
  created_at: string
  updated_at: string
}

const steps = [
  { key: "CREATED", label: "Offer Created" },
  { key: "SENT", label: "Offer Sent" },
  { key: "VIEWED", label: "Candidate Viewed Offer" },
  { key: "ACCEPTED", label: "Offer Accepted" },
  { key: "REJECTED", label: "Offer Rejected" },
]

export default function OfferTimeline({
  status,
  created_at,
  updated_at,
}: OfferTimelineProps) {
  const currentIndex = steps.findIndex(
    (step) => step.key === status
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        📌 Offer Status Timeline
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isRejected = status === "REJECTED" && step.key === "REJECTED"

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  isRejected
                    ? "bg-red-600"
                    : isCompleted
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isCompleted ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {isCompleted && (
                  <p className="text-xs text-gray-500">
                    {index === 0
                      ? new Date(created_at).toLocaleString()
                      : new Date(updated_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
