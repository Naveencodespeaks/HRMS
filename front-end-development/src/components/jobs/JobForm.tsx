"use client";

import { useState } from "react";
import { jobsAPI } from "@/lib/jobs.api";

export default function JobForm({ job }: { job?: any }) {
  const [form, setForm] = useState({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "",
    openings: job?.openings || 1,
    description: job?.description || "",
    status: job?.status || "OPEN",
  });

  const submit = async () => {
    if (job) {
      await jobsAPI.update(job.id, form);
      alert("Job updated");
    } else {
      await jobsAPI.create(form);
      alert("Job created");
    }
  };

  return (
    <div className="space-y-3">
      <input
        placeholder="Job Title"
        className="input"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Department"
        className="input"
        value={form.department}
        onChange={e => setForm({ ...form, department: e.target.value })}
      />

      <input
        placeholder="Location"
        className="input"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="input"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <select
        className="input"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
      >
        <option value="OPEN">OPEN</option>
        <option value="ON_HOLD">ON HOLD</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      <button onClick={submit} className="btn-primary">
        {job ? "Update Job" : "Create Job"}
      </button>
    </div>
  );
}
