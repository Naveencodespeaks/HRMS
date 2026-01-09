export default function CandidateDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Candidate Details</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Details for candidate ID: {params.id}</p>
      </div>
    </div>
  )
}