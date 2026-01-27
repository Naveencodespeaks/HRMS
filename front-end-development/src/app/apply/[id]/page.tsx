import CandidateForm from "@/components/forms/CandidateForm"

export default function ApplyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Apply for this Position
      </h1>
      <CandidateForm />
    </div>
  )
}