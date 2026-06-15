"use client";

import { useState, useEffect } from "react";
import { AREAS } from "@/config/areas";
import { TruckStatus, IceCreamRequest } from "@/lib/types";
import TruckLogo from "./TruckLogo";

interface TruckTrackerProps {
  truck: TruckStatus;
  requests: IceCreamRequest[];
  heat: Record<string, number>;
}

export default function TruckTracker({ truck, requests, heat }: TruckTrackerProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-lg font-bold text-[#3A2D1E] mb-4">Truck Tracker</h1>

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
        {truck.active ? (
          <div className="animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></span>
              <div>
                <p className="font-bold text-[#3A2D1E]">Truck is rolling!</p>
                <p className="text-xs text-[#9A8B7A]">
                  {truck.heading
                    ? `Heading to ${AREAS.find((a) => a.id === truck.heading)?.name}`
                    : `In ${AREAS.find((a) => a.id === truck.area)?.name}`}
                </p>
              </div>
            </div>

            <div className="bg-[#F5F0EA] rounded-xl p-4">
              <div className="grid grid-cols-5 gap-1.5">
                {AREAS.map((a) => {
                  const isTruck = truck.area === a.id || truck.heading === a.id;
                  const h = heat[a.id] || 0;

                  return (
                    <button
                      key={a.id}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg min-h-[60px] gap-1 transition-all ${
                        isTruck
                          ? "bg-[#E84B3A] text-white shadow-lg animate-scalePulse"
                          : h > 0
                            ? "bg-[#FFD93D] text-[#3A2D1E]"
                            : "bg-[#E8E2DA] text-[#3A2D1E]"
                      }`}
                    >
                      {isTruck && <span className="text-lg">🚚</span>}
                      <span className="text-xs font-bold leading-tight text-center">
                        {a.short}
                      </span>
                      {h > 0 && !isTruck && (
                        <span className="text-xs">🔥{h}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 animate-slideUp">
            <TruckLogo size={80} color="#CCC" />
            <p className="text-sm text-[#9A8B7A] mt-4 font-semibold">
              Truck isn't out right now
            </p>
            <p className="text-xs text-[#9A8B7A]">
              Submit a request to get it rolling!
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
          Demand by Area
        </h3>
        {hotAreas.length === 0 ? (
          <p className="text-sm text-[#9A8B7A]">No requests yet</p>
        ) : (
          hotAreas.map(([aId, cnt]) => {
            const a = AREAS.find((x) => x.id === aId);
            const max = hotAreas[0][1];
            const percentage = Math.max(12, (cnt / max) * 100);

            return (
              <div key={aId} className="flex items-center gap-3 py-2">
                <span className="text-xs font-bold text-[#3A2D1E] w-20">
                  {a?.short}
                </span>
                <div className="flex-1 h-2.5 bg-[#F5F0EA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFD93D] to-[#E84B3A] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#E84B3A] w-6 text-right">
                  {cnt}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
