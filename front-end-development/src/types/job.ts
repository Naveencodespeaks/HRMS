export type JobStatus = "OPEN" | "CLOSED" | "ON_HOLD";

export interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  experience_min_years?: number;
  experience_max_years?: number;
  openings: number;
  description?: string;
  linkedin_url?: string;
  status: JobStatus;
  is_active: boolean;
  created_at: string;
}
