import { apiRequest } from "./api-client";
import { Job } from "@/types/job";

export const jobsAPI = {
  create: (payload: Partial<Job>) =>
    apiRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: (): Promise<Job[]> => apiRequest("/jobs"),

  get: (id: string): Promise<Job> => apiRequest(`/jobs/${id}`),

  update: (id: string, payload: Partial<Job>) =>
    apiRequest(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    apiRequest(`/jobs/${id}`, { method: "DELETE" }),
};
