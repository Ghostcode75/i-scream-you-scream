export type RequestStatus = "pending" | "accepted" | "completed";

export interface IceCreamRequest {
  id: string;
  area: string;
  street: string;
  name: string;
  treats: Record<string, number>;
  totalItems: number;
  totalPrice: number;
  neighbors: number;
  status: RequestStatus;
  ts: number;
}

export interface TruckStatus {
  active: boolean;
  area: string | null;
  heading: string | null;
  startedAt: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
