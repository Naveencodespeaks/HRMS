import Link from "next/link";
import { Interview } from "@/types/interview";

export default function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <div className="border p-3 rounded flex justify-between">
      <div>
        <p className="font-medium">
          Round {interview.round_number} – {interview.round_name}
        </p>
        <p className="text-sm text-gray-500">
          {interview.interview_type} | {interview.status}
        </p>
      </div>

      <Link href={`/interviews/${interview.id}`} className="text-blue-600">
        View
      </Link>
    </div>
  );
}
