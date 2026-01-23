"use client";

import InterviewUpdateForm from "@/components/interviews/InterviewUpdateForm";

export default function InterviewDetail({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Interview Result</h1>
      <InterviewUpdateForm interviewId={params.id} />
    </div>
  );
}
