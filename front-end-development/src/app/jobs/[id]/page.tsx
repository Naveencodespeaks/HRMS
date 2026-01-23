"use client";

import { useEffect, useState } from "react";
import { jobsAPI } from "@/lib/jobs.api";
import JobForm from "@/components/jobs/JobForm";

export default function JobDetail({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    jobsAPI.get(params.id).then(setJob);
  }, [params.id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Manage Job</h1>
      <JobForm job={job} />
    </div>
  );
}
