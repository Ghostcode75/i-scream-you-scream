"use client";

import { useState } from "react";
import {
  IconTruckDelivery,
  IconLock,
  IconLockOpen,
  IconCheck,
  IconX,
  IconPlayerStop,
  IconFlame,
  IconMapPin,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";
import { AREAS } from "@/config/areas";
import { TREATS } from "@/config/menu";
import { IceCreamRequest, TruckStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface DriverDashProps {
  requests: IceCreamRequest[];
  truck: TruckStatus;
  heat: Record<string, number>;
  onUpdateRequest: (id: string, status: string) => Promise<void>;
  onUpdateTruck: (updates: Partial<TruckStatus>) => Promise<void>;
}

const DRIVER_PIN = "1234";

export default function DriverDash({
  requests,
  truck,
  heat,
  onUpdateRequest,
  onUpdateTruck,
}: DriverDashProps) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [startArea, setStartArea] = useState("");

  /* ─── PIN Screen ─── */
  if (!authed) {
    return (
      <div className="pb-28 px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="card text-center mt-10 animate-slideUp">
          <div className="w-16 h-16 rounded-full bg-[#F0FAFB] flex items-center justify-center mx-auto mb-4">
            <IconLock size={28} className="text-[#6EC6CE]" />
          </div>
          <h2 className="text-lg mb-1">Driver Dashboard</h2>
          <p className="text-sm text-[#8A9BA8] mb-6">Enter PIN to access dispatch</p>

          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="····"
            autoFocus
            className="w-36 mx-auto block text-center text-2xl tracking-[0.5em] px-4 py-3 border-2 border-[#E2E8EC] rounded-xl bg-[#FAFCFD] text-[#3A2D1E] mb-4"
          />

          {error && <p className="text-xs text-[#E8729A] mb-3 font-semibold">Wrong PIN</p>}

          <button
            onClick={() => (pin === DRIVER_PIN ? setAuthed(true) : setError(true))}
            className="w-36 mx-auto block py-3 rounded-xl bg-[#6EC6CE] text-white text-sm font-bold hover:bg-[#5BB8C0] transition inline-flex items-center justify-center gap-2"
          >
            <IconLockOpen size={16} /> Unlock
          </button>
          <p className="text-[11px] text-[#B0BEC5] mt-4">Default PIN: 1234</p>
        </div>
      </div>
    );
  }

  const pending = requests
    .filter((r) => r.status === "pending")
    .sort((a, b) => (b.neighbors || 1) - (a.neighbors || 1));
  const accepted = requests.filter((r) => r.status === "accepted");
  const completed = requests.filter((r) => r.status === "completed");
  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  return (
    <div className="pb-28 px-4 pt-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <IconTruckDelivery size={22} className="text-[#6EC6CE]" />
          <h1 className="text-lg font-bold text-[#3A2D1E]">Dispatch</h1>
        </div>
        <button
          onClick={() => { setAuthed(false); setPin(""); }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#E8729A] border border-[#F4A7BA] bg-white hover:bg-[#FFF5F8] transition"
        >
          <IconLock size={12} /> Lock
        </button>
      </div>

      {/* Truck Status */}
      <div className="card mb-3 animate-slideUp">
        <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
          Truck Status
        </h3>
        {truck.active ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4CAF50]" />
              </span>
              <span className="font-semibold text-[#3A2D1E] text-sm">
                Active — {AREAS.find((a) => a.id === truck.area)?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 gap-1.5 mb-4">
              {AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onUpdateTruck({ area: a.id, heading: a.id })}
                  className={`px-2 py-2 rounded-lg text-[11px] font-semibold transition text-center ${
                    truck.area === a.id
                      ? "bg-[#6EC6CE] text-white shadow-sm"
                      : "bg-[#F5F8FA] text-[#3A2D1E] hover:bg-[#E8EDF0] active:bg-[#D4DDE2]"
                  }`}
                >
                  {a.short}
                  {heat[a.id] ? ` (${heat[a.id]})` : ""}
                </button>
              ))}
            </div>

            <button
              onClick={() => onUpdateTruck({ active: false, area: null, heading: null, startedAt: null })}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#E8729A] border border-[#F4A7BA] bg-white hover:bg-[#FFF5F8] transition inline-flex items-center justify-center gap-1.5"
            >
              <IconPlayerStop size={14} /> End Shift
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-[#8A9BA8] mb-3">Truck is parked</p>
            <select
              value={startArea}
              onChange={(e) => setStartArea(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E2E8EC] rounded-xl bg-[#FAFCFD] text-sm text-[#3A2D1E] mb-3"
            >
              <option value="">Pick starting area...</option>
              {AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}{heat[a.id] ? ` (${heat[a.id]} waiting)` : ""}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (startArea) {
                  onUpdateTruck({ active: true, area: startArea, heading: startArea, startedAt: Date.now() });
                  setStartArea("");
                }
              }}
              disabled={!startArea}
              className="w-full py-3 rounded-xl bg-[#6EC6CE] text-white text-sm font-bold hover:bg-[#5BB8C0] transition disabled:opacity-40 inline-flex items-center justify-center gap-2"
            >
              <IconTruckDelivery size={18} /> Start Shift
            </button>
          </div>
        )}
      </div>

      {/* Priority Areas */}
      {hotAreas.length > 0 && (
        <div className="card mb-3 animate-slideUp stagger-1">
          <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
            Priority Areas
          </h3>
          {hotAreas.slice(0, 5).map(([aId, cnt]) => {
            const a = AREAS.find((x) => x.id === aId);
            return (
              <div key={aId} className="flex items-center gap-2 py-1.5">
                <span className="font-bold text-[#3A2D1E] text-xs w-20 shrink-0">{a?.short}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: Math.min(cnt, 5) }).map((_, i) => (
                    <IconFlame key={i} size={14} className="text-[#E67E22]" />
                  ))}
                </span>
                <span className="font-bold text-[#E8729A] text-xs ml-auto tabular-nums">
                  {cnt} household{cnt > 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pending */}
      <div className="card mb-3 animate-slideUp stagger-2">
        <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
          Pending ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-sm text-[#B0BEC5]">All clear!</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => {
              const a = AREAS.find((x) => x.id === r.area);
              return (
                <div key={r.id} className="border-b border-[#E8EDF0] pb-3 last:border-0 last:pb-0">
                  <p className="font-bold text-[#3A2D1E] text-sm">{r.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B7C88] my-1">
                    <span className="inline-flex items-center gap-0.5 shrink-0">{a?.short}</span>
                    <span className="inline-flex items-center gap-0.5 truncate max-w-[140px] sm:max-w-none"><IconMapPin size={11} /> {r.street}</span>
                    <span className="inline-flex items-center gap-0.5 shrink-0"><IconUsers size={11} /> {r.neighbors}</span>
                    {r.totalItems > 0 && <span className="font-semibold text-[#E8729A] shrink-0">${r.totalPrice}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#B0BEC5] mb-2">
                    <IconClock size={10} /> {timeAgo(r.ts)}
                  </div>
                  {r.totalItems > 0 && (
                    <p className="text-[11px] text-[#6B7C88] mb-2">
                      {TREATS.filter((t) => r.treats[t.id]).map((t) => `${t.emoji} x${r.treats[t.id]}`).join("  ")}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateRequest(r.id, "accepted")}
                      className="flex-1 py-2 rounded-lg bg-[#4CAF50] text-white text-xs font-bold hover:brightness-110 transition inline-flex items-center justify-center gap-1"
                    >
                      <IconCheck size={14} /> Accept
                    </button>
                    <button
                      onClick={() => onUpdateRequest(r.id, "completed")}
                      className="flex-1 py-2 rounded-lg bg-[#E8EDF0] text-[#6B7C88] text-xs font-bold hover:bg-[#D4DDE2] transition inline-flex items-center justify-center gap-1"
                    >
                      <IconX size={14} /> Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* En Route */}
      {accepted.length > 0 && (
        <div className="card mb-3 animate-slideUp stagger-3">
          <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
            En Route ({accepted.length})
          </h3>
          <div className="space-y-2">
            {accepted.map((r) => {
              const a = AREAS.find((x) => x.id === r.area);
              return (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#E8EDF0] last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-[#3A2D1E] truncate">
                      {r.name} — {a?.short}
                    </p>
                    <p className="text-xs text-[#6B7C88] truncate">{r.street}</p>
                    {r.totalItems > 0 && (
                      <p className="text-[11px] text-[#8A9BA8]">{r.totalItems} items · ${r.totalPrice}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onUpdateRequest(r.id, "completed")}
                    className="ml-3 shrink-0 px-4 py-2 rounded-lg bg-[#4CAF50] text-white text-xs font-bold hover:brightness-110 transition inline-flex items-center gap-1"
                  >
                    <IconCheck size={14} /> Done
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="card animate-slideUp stagger-4">
        <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-4 text-center">
          Shift Stats
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#E8729A] tabular-nums">{completed.length}</div>
            <div className="text-[11px] text-[#8A9BA8] mt-0.5">Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#E6A817] tabular-nums">{pending.length}</div>
            <div className="text-[11px] text-[#8A9BA8] mt-0.5">Waiting</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#4CAF50] tabular-nums">{accepted.length}</div>
            <div className="text-[11px] text-[#8A9BA8] mt-0.5">En Route</div>
          </div>
        </div>
        <div className="text-center border-t border-[#E8EDF0] pt-4">
          <div className="text-3xl font-extrabold text-[#3A2D1E] tabular-nums">
            ${requests.reduce((s, r) => s + (r.totalPrice || 0), 0)}
          </div>
          <div className="text-[11px] text-[#8A9BA8] mt-0.5">Total Pre-orders</div>
        </div>
      </div>
    </div>
  );
}
