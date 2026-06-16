"use client";

import { useState, useEffect } from "react";
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
  IconArrowLeft,
} from "@tabler/icons-react";
import { AREAS } from "@/config/areas";
import { TREATS } from "@/config/menu";
import { IceCreamRequest, TruckStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import TruckLogo from "@/components/TruckLogo";

const DRIVER_PIN = "1234";

export default function OperatorPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [startArea, setStartArea] = useState("");
  const [requests, setRequests] = useState<IceCreamRequest[]>([]);
  const [truck, setTruck] = useState<TruckStatus>({
    active: false,
    area: null,
    heading: null,
    startedAt: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authed) return;
    const loadData = async () => {
      try {
        const [reqRes, truckRes] = await Promise.all([
          fetch("/api/request"),
          fetch("/api/truck"),
        ]);
        if (reqRes.ok) {
          const data = await reqRes.json();
          setRequests(data.data || []);
        }
        if (truckRes.ok) {
          const data = await truckRes.json();
          setTruck(data.data || { active: false, area: null, heading: null, startedAt: null });
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, [authed]);

  useEffect(() => {
    if (!authed || !loaded) return;
    const iv = setInterval(async () => {
      try {
        const [reqRes, truckRes] = await Promise.all([
          fetch("/api/request"),
          fetch("/api/truck"),
        ]);
        if (reqRes.ok) {
          const data = await reqRes.json();
          setRequests(data.data || []);
        }
        if (truckRes.ok) {
          const data = await truckRes.json();
          setTruck(data.data || truck);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(iv);
  }, [authed, loaded]);

  const handleUpdateRequest = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/request/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-driver-pin": pin },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === id ? data.data : r)));
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleUpdateTruck = async (updates: Partial<TruckStatus>) => {
    try {
      const res = await fetch("/api/truck", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-driver-pin": pin },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setTruck(data.data);
      }
    } catch (err) {
      console.error("Truck update error:", err);
    }
  };

  const heat: Record<string, number> = {};
  requests.filter((r) => r.status === "pending").forEach((r) => {
    heat[r.area] = (heat[r.area] || 0) + (r.neighbors || 1);
  });

  /* ─── Login Screen ─── */
  if (!authed) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#FFF9F5] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="card text-center max-w-sm w-full animate-slideUp">
            <div className="flex justify-center mb-4">
              <TruckLogo size={100} />
            </div>
            <div className="w-16 h-16 rounded-full bg-[#F0FAFB] flex items-center justify-center mx-auto mb-4">
              <IconLock size={28} className="text-[#6EC6CE]" />
            </div>
            <h1 className="text-xl mb-1">Operator Login</h1>
            <p className="text-sm text-[#8A9BA8] mb-6">Enter your PIN to access dispatch</p>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (pin === DRIVER_PIN) setAuthed(true);
                  else setError(true);
                }
              }}
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

            <a
              href="/"
              className="inline-flex items-center gap-1 text-xs text-[#B0BEC5] hover:text-[#6EC6CE] transition mt-6"
            >
              <IconArrowLeft size={14} /> Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen min-h-dvh bg-[#FFF9F5]">
        <TruckLogo size={100} className="animate-truck" />
        <p className="font-script text-xl text-[#E8729A] mt-4">Loading dispatch...</p>
      </div>
    );
  }

  const pending = requests
    .filter((r) => r.status === "pending")
    .sort((a, b) => a.ts - b.ts);
  const accepted = requests.filter((r) => r.status === "accepted").sort((a, b) => a.ts - b.ts);
  const completed = requests.filter((r) => r.status === "completed");
  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  /* ─── Dispatch Dashboard ─── */
  return (
    <div className="min-h-screen min-h-dvh bg-[#FFF9F5]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FFF9F5]/95 backdrop-blur-sm border-b border-[#E2E8EC] px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconTruckDelivery size={22} className="text-[#6EC6CE]" />
            <h1 className="text-lg font-bold text-[#3A2D1E]">Dispatch</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#6B7C88] border border-[#E2E8EC] bg-white hover:bg-[#F5F8FA] transition"
            >
              <IconArrowLeft size={12} /> Home
            </a>
            <button
              onClick={() => { setAuthed(false); setPin(""); setLoaded(false); }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#E8729A] border border-[#F4A7BA] bg-white hover:bg-[#FFF5F8] transition"
            >
              <IconLock size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Truck Status */}
        <div className="card mb-4 animate-slideUp">
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

              <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-5 gap-1.5 mb-4">
                {AREAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleUpdateTruck({ area: a.id, heading: a.id })}
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
                onClick={() => handleUpdateTruck({ active: false, area: null, heading: null, startedAt: null })}
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
                    handleUpdateTruck({ active: true, area: startArea, heading: startArea, startedAt: Date.now() });
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
          <div className="card mb-4 animate-slideUp stagger-1">
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

        {/* Pending Queue - chronological order */}
        <div className="card mb-4 animate-slideUp stagger-2">
          <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
            Request Queue ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <p className="text-sm text-[#B0BEC5]">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r, idx) => {
                const a = AREAS.find((x) => x.id === r.area);
                return (
                  <div key={r.id} className="border-b border-[#E8EDF0] pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-[#3A2D1E] text-sm">
                        <span className="text-[#6EC6CE] mr-1.5">#{idx + 1}</span>
                        {r.name}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-[#B0BEC5] shrink-0">
                        <IconClock size={10} /> {timeAgo(r.ts)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B7C88] mb-1">
                      <span className="inline-flex items-center gap-0.5 shrink-0">{a?.short}</span>
                      <span className="inline-flex items-center gap-0.5 truncate max-w-[160px] sm:max-w-none">
                        <IconMapPin size={11} /> {r.street}
                      </span>
                      <span className="inline-flex items-center gap-0.5 shrink-0">
                        <IconUsers size={11} /> {r.neighbors}
                      </span>
                      {r.totalItems > 0 && (
                        <span className="font-semibold text-[#E8729A] shrink-0">${r.totalPrice}</span>
                      )}
                    </div>
                    {r.totalItems > 0 && (
                      <p className="text-[11px] text-[#6B7C88] mb-2">
                        {TREATS.filter((t) => r.treats[t.id]).map((t) => `${t.emoji} x${r.treats[t.id]}`).join("  ")}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRequest(r.id, "accepted")}
                        className="flex-1 py-2 rounded-lg bg-[#4CAF50] text-white text-xs font-bold hover:brightness-110 transition inline-flex items-center justify-center gap-1"
                      >
                        <IconCheck size={14} /> Accept
                      </button>
                      <button
                        onClick={() => handleUpdateRequest(r.id, "completed")}
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
          <div className="card mb-4 animate-slideUp stagger-3">
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
                      onClick={() => handleUpdateRequest(r.id, "completed")}
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
      </main>
    </div>
  );
}
