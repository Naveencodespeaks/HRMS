"use client";

import { useEffect, useState } from "react";
import { jobsAPI } from "@/lib/jobs.api";
import { Job } from "@/types/job";
import JobCard from "./JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobsAPI.list().then(setJobs);
  }, []);

  if (!jobs.length) return <p>No jobs created yet.</p>;

  return (
    <div className="space-y-3">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
