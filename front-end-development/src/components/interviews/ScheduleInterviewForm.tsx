"use client";

import { useState } from "react";
import { interviewsAPI } from "@/lib/interviews.api";

export default function ScheduleInterviewForm({ candidateId }: { candidateId: string }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    round_number: 1,
    round_name: "L1",
    interview_type: "Technical",
    interviewer_name: "",
    interviewer_email: "",
    scheduled_at: "",
  });

  const submit = async () => {
    setLoading(true);
    await interviewsAPI.schedule({
      candidate_id: candidateId,
      ...form,
    });
    setLoading(false);
    alert("Interview Scheduled");
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <h3 className="font-semibold">Schedule Interview</h3>

      <input placeholder="Interviewer Name"
        onChange={e => setForm({ ...form, interviewer_name: e.target.value })}
        className="input" />

      <input placeholder="Interviewer Email"
        onChange={e => setForm({ ...form, interviewer_email: e.target.value })}
        className="input" />

      <input type="datetime-local"
        onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
        className="input" />

      <button onClick={submit} disabled={loading} className="btn-primary">
        {loading ? "Scheduling..." : "Schedule"}
      </button>
    </div>
  );
}
