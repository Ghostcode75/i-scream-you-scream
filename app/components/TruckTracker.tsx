"use client";

import { useState, useEffect } from "react";
import { IconTruckDelivery, IconFlame, IconMapPin } from "@tabler/icons-react";
import { AREAS } from "@/config/areas";
import { TruckStatus } from "@/lib/types";
import TruckLogo from "./TruckLogo";

interface TruckTrackerProps {
  truck: TruckStatus;
  heat: Record<string, number>;
}

export default function TruckTracker({ truck, heat }: TruckTrackerProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(i);
  }, []);

  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  return (
    <section className="animate-slideUp stagger-2">
      <div className="flex items-center justify-center gap-2 mb-4">
        <IconMapPin size={22} className="text-[#6EC6CE]" />
        <h2 className="text-lg font-bold text-[#3A2D1E]">Truck Tracker</h2>
      </div>

      <div className="card mb-3">
        {truck.active ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4CAF50]" />
              </span>
              <div>
                <p className="font-bold text-[#3A2D1E] text-base">Truck is rolling!</p>
                <p className="text-xs text-[#8A9BA8]">
                  {truck.heading
                    ? `Heading to ${AREAS.find((a) => a.id === truck.heading)?.name}`
                    : `In ${AREAS.find((a) => a.id === truck.area)?.name}`}
                </p>
              </div>
            </div>

            <div className="bg-[#F5F8FA] rounded-xl p-2.5 sm:p-4">
              <div className="grid grid-cols-3 min-[400px]:grid-cols-5 gap-1.5 sm:gap-2">
                {AREAS.map((a) => {
                  const isTruck = truck.area === a.id || truck.heading === a.id;
                  const h = heat[a.id] || 0;
                  return (
                    <div
                      key={a.id}
                      className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg min-h-[48px] sm:min-h-[62px] gap-0.5 transition-all ${
                        isTruck
                          ? "bg-[#6EC6CE] text-white shadow-lg"
                          : h > 0
                            ? "bg-[#FFD93D]/60 text-[#3A2D1E]"
                            : "bg-[#E8EDF0] text-[#6B7C88]"
                      }`}
                      style={{
                        transform: isTruck && pulse ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.4s ease",
                      }}
                    >
                      {isTruck && <IconTruckDelivery size={16} strokeWidth={2.5} />}
                      <span className="text-[9px] sm:text-[10px] font-bold leading-tight text-center">
                        {a.short}
                      </span>
                      {h > 0 && !isTruck && (
                        <span className="flex items-center gap-px text-[9px]">
                          <IconFlame size={9} className="text-[#E67E22]" />{h}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <TruckLogo size={100} muted />
            </div>
            <p className="text-sm text-[#8A9BA8] font-semibold mb-1">
              Truck isn&apos;t out right now
            </p>
            <p className="text-xs text-[#B0BEC5]">Submit a request to get it rolling!</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-xs uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
          Demand by Area
        </h3>
        {hotAreas.length === 0 ? (
          <p className="text-sm text-[#B0BEC5]">No requests yet</p>
        ) : (
          hotAreas.map(([aId, cnt]) => {
            const a = AREAS.find((x) => x.id === aId);
            const max = hotAreas[0][1];
            const pct = Math.max(12, (cnt / max) * 100);
            return (
              <div key={aId} className="flex items-center gap-3 py-1.5">
                <span className="text-xs font-bold text-[#3A2D1E] w-20 shrink-0">{a?.short}</span>
                <div className="flex-1 h-2.5 bg-[#E8EDF0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6EC6CE] to-[#F4A7BA] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#E8729A] w-6 text-right tabular-nums">{cnt}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
