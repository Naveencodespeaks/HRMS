import JobList from "@/components/jobs/JobList";

export default function JobsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <a href="/jobs/new" className="btn-primary">
          + Create Job
        </a>
      </div>

      <JobList />
    </div>
  );
}
