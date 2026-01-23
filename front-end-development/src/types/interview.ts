export type InterviewStatus =
  | "SCHEDULED"
  | "PENDING"
  | "PASSED"
  | "FAILED"
  | "ON_HOLD";

export interface Interview {
  id: string;
  candidate_id: string;
  job_id?: string | null;
  round_number: number;
  round_name?: string;
  interview_type?: string;
  interviewer_name?: string;
  interviewer_email?: string;
  status: InterviewStatus;
  feedback?: string;
  rating?: number;
  scheduled_at: string;
  completed_at?: string | null;
}
