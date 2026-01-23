export type OfferStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "ON_HOLD";

export interface Offer {
  id: string;
  candidate_id: string;
  offered_ctc: number;
  joining_date?: string;
  remarks?: string;
  status: OfferStatus;
  created_at: string;
}
