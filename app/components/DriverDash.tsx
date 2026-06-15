"use client";

import { useState } from "react";
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

  if (!authed) {
    return (
      <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center mt-10 animate-slideUp">
          <span className="text-5xl">🚚</span>
          <h2 className="text-lg font-bold text-[#3A2D1E] mt-3 mb-1">
            Driver Dashboard
          </h2>
          <p className="text-sm text-[#9A8B7A] mb-6">Enter PIN to access dispatch</p>

          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="····"
            className="w-32 mx-auto block text-center text-2xl tracking-widest px-4 py-3 border-2 border-[#EDE6DD] rounded-xl bg-[#FDFBF8] text-[#3A2D1E] focus:border-[#E84B3A] focus:outline-none mb-4"
          />

          {error && <p className="text-xs text-[#E84B3A] mb-3">Wrong PIN</p>}

          <button
            onClick={() =>
              pin === DRIVER_PIN ? setAuthed(true) : setError(true)
            }
            className="w-32 mx-auto block py-3 rounded-xl bg-[#E84B3A] text-white text-sm font-bold hover:brightness-110 transition mb-3"
          >
            Unlock
          </button>

          <p className="text-xs text-[#9A8B7A]">Default PIN: 1234</p>
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
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-[#3A2D1E]">Dispatch</h1>
        <button
          onClick={() => {
            setAuthed(false);
            setPin("");
          }}
          className="px-3 py-2 rounded-lg text-xs font-bold text-[#E84B3A] border-2 border-[#E84B3A] bg-white hover:bg-[#FFF0ED] transition"
        >
          Lock
        </button>
      </div>

      {/* Truck Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
        <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
          Truck Status
        </h3>

        {truck.active ? (
          <div className="animate-slideUp">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></span>
              <span className="font-semibold text-[#3A2D1E] text-sm">
                Active — {AREAS.find((a) => a.id === truck.area)?.name}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    onUpdateTruck({
                      area: a.id,
                      heading: a.id,
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    truck.area === a.id
                      ? "bg-[#E84B3A] text-white"
                      : "bg-[#F5F0EA] text-[#3A2D1E] hover:bg-[#EDE6DD]"
                  }`}
                >
                  {a.short}
                  {heat[a.id] ? ` (${heat[a.id]})` : ""}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                onUpdateTruck({
                  active: false,
                  area: null,
                  heading: null,
                  startedAt: null,
                })
              }
              className="w-full py-2 rounded-lg text-xs font-bold text-[#E84B3A] border-2 border-[#E84B3A] bg-white hover:bg-[#FFF0ED] transition"
            >
              🛑 End Shift
            </button>
          </div>
        ) : (
          <div className="text-center animate-slideUp">
            <p className="text-sm text-[#9A8B7A] mb-3">Truck is parked</p>
            <select
              value={startArea}
              onChange={(e) => setStartArea(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#EDE6DD] rounded-xl bg-[#FDFBF8] text-[#3A2D1E] focus:border-[#E84B3A] focus:outline-none mb-3"
            >
              <option value="">Pick starting area...</option>
              {AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {heat[a.id] ? ` 🔥${heat[a.id]}` : ""}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (startArea) {
                  onUpdateTruck({
                    active: true,
                    area: startArea,
                    heading: startArea,
                    startedAt: Date.now(),
                  });
                  setStartArea("");
                }
              }}
              className="w-full py-3 rounded-xl bg-[#E84B3A] text-white text-sm font-bold hover:brightness-110 transition"
            >
              🚚 Start Shift
            </button>
          </div>
        )}
      </div>

      {/* Priority Areas */}
      {hotAreas.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
          <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
            Priority Areas
          </h3>
          {hotAreas.slice(0, 5).map(([aId, cnt]) => {
            const a = AREAS.find((x) => x.id === aId);
            return (
              <div key={aId} className="flex items-center gap-2 py-1">
                <span className="font-bold text-[#3A2D1E] text-xs w-20">
                  {a?.short}
                </span>
                <span className="text-sm">{"🔥".repeat(Math.min(cnt, 5))}</span>
                <span className="font-bold text-[#E84B3A] text-xs ml-auto">
                  {cnt}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
        <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
          Pending ({pending.length})
        </h3>

        {pending.length === 0 ? (
          <p className="text-sm text-[#9A8B7A]">All clear!</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => {
              const a = AREAS.find((x) => x.id === r.area);
              return (
                <div
                  key={r.id}
                  className="border-b border-[#F5F0EA] pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="font-bold text-[#3A2D1E] text-sm">{r.name}</p>
                  <p className="text-xs text-[#7A6B5A] my-1">
                    {a?.short} · 📍 {r.street} · 👥 {r.neighbors}
                    {r.totalItems > 0 && ` · $${r.totalPrice}`}
                  </p>
                  <p className="text-xs text-[#B0A090] mb-2">{timeAgo(r.ts)}</p>
                  {r.totalItems > 0 && (
                    <p className="text-xs text-[#7A6B5A] mb-2">
                      {TREATS.filter((t) => r.treats[t.id])
                        .map((t) => `${t.emoji}×${r.treats[t.id]}`)
                        .join("  ")}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateRequest(r.id, "accepted")}
                      className="flex-1 py-2 rounded-lg bg-[#4CAF50] text-white text-xs font-bold hover:brightness-110 transition"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onUpdateRequest(r.id, "completed")}
                      className="flex-1 py-2 rounded-lg bg-[#EDE6DD] text-[#7A6B5A] text-xs font-bold hover:bg-[#D4C4B0] transition"
                    >
                      ✗
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
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
          <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
            En Route ({accepted.length})
          </h3>
          <div className="space-y-2">
            {accepted.map((r) => {
              const a = AREAS.find((x) => x.id === r.area);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 border-b border-[#F5F0EA] last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-[#3A2D1E]">
                      {r.name} — {a?.short}
                    </p>
                    <p className="text-xs text-[#7A6B5A]">{r.street}</p>
                    {r.totalItems > 0 && (
                      <p className="text-xs text-[#9A8B7A]">
                        {r.totalItems} items · ${r.totalPrice}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onUpdateRequest(r.id, "completed")}
                    className="ml-2 px-3 py-2 rounded-lg bg-[#4CAF50] text-white text-xs font-bold hover:brightness-110 transition"
                  >
                    Done
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-4 text-center">
          Shift Stats
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#E84B3A]">
              {completed.length}
            </div>
            <div className="text-xs text-[#9A8B7A] mt-1">Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FFD93D]">
              {pending.length}
            </div>
            <div className="text-xs text-[#9A8B7A] mt-1">Waiting</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4CAF50]">
              {accepted.length}
            </div>
            <div className="text-xs text-[#9A8B7A] mt-1">En Route</div>
          </div>
        </div>
        <div className="text-center border-t border-[#EDE6DD] pt-4">
          <div className="text-3xl font-bold text-[#3A2D1E]">
            ${requests.reduce((s, r) => s + (r.totalPrice || 0), 0)}
          </div>
          <div className="text-xs text-[#9A8B7A] mt-1">Total Pre-orders</div>
        </div>
      </div>
    </div>
  );
}
