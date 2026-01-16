'use client'

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="p-6 text-center">
      <p className="text-red-600 font-semibold">
        Failed to load notifications
      </p>

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  )
}
