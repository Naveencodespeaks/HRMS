"use client";

import { useState } from "react";
import { interviewsAPI } from "@/lib/interviews.api";

export default function InterviewUpdateForm({ interviewId }: { interviewId: string }) {
  const [status, setStatus] = useState("PASSED");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | undefined>();

  const submit = async () => {
    await interviewsAPI.update(interviewId, { status, feedback, rating });
    alert("Interview Updated");
  };

  return (
    <div className="space-y-3">
      <select onChange={e => setStatus(e.target.value)} className="input">
        <option value="PASSED">PASSED</option>
        <option value="FAILED">FAILED</option>
        <option value="ON_HOLD">ON HOLD</option>
      </select>

      <textarea
        placeholder="Feedback"
        onChange={e => setFeedback(e.target.value)}
        className="input"
      />

      <input
        type="number"
        placeholder="Rating (1–5)"
        onChange={e => setRating(Number(e.target.value))}
        className="input"
      />

      <button onClick={submit} className="btn-primary">
        Submit Result
      </button>
    </div>
  );
}
