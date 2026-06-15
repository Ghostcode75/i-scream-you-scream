import { IceCreamRequest, TruckStatus } from "./types";

// In-memory storage for demo (will be replaced with Vercel KV)
let requestsStore: IceCreamRequest[] = [];
let truckStore: TruckStatus = {
  active: false,
  area: null,
  heading: null,
  startedAt: null,
};

export function getRequests(): IceCreamRequest[] {
  return [...requestsStore];
}

export function addRequest(request: IceCreamRequest): IceCreamRequest {
  requestsStore = [...requestsStore, request].slice(-150);
  return request;
}

export function updateRequest(
  id: string,
  updates: Partial<IceCreamRequest>
): IceCreamRequest | null {
  const index = requestsStore.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updated = { ...requestsStore[index], ...updates };
  requestsStore[index] = updated;
  return updated;
}

export function getTruck(): TruckStatus {
  return { ...truckStore };
}

export function updateTruck(updates: Partial<TruckStatus>): TruckStatus {
  truckStore = { ...truckStore, ...updates };
  return { ...truckStore };
}

export function getRequestsByStatus(
  status?: string
): IceCreamRequest[] {
  if (!status) return getRequests();
  return getRequests().filter((r) => r.status === status);
}

export function getHeatMap(): Record<string, number> {
  const heat: Record<string, number> = {};
  getRequests()
    .filter((r) => r.status === "pending")
    .forEach((r) => {
      heat[r.area] = (heat[r.area] || 0) + (r.neighbors || 1);
    });
  return heat;
}
