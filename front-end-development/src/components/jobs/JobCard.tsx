import Link from "next/link";
import { Job } from "@/types/job";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="border rounded p-4 flex justify-between">
      <div>
        <h3 className="font-semibold">{job.title}</h3>
        <p className="text-sm text-gray-500">
          {job.department} • {job.location}
        </p>
        <p className="text-xs mt-1">
          Status: <span className="font-medium">{job.status}</span>
        </p>
      </div>

      <Link
        href={`/jobs/${job.id}`}
        className="text-blue-600 text-sm"
      >
        Manage
      </Link>
    </div>
  );
}
