"use client";

import { AREAS } from "@/config/areas";
import { TREATS } from "@/config/menu";
import { IceCreamRequest } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface CommunityFeedProps {
  requests: IceCreamRequest[];
}

const statusStyles: Record<
  string,
  { bg: string; fg: string; text: string }
> = {
  pending: { bg: "#FFD93D", fg: "#3A2D1E", text: "Waiting" },
  accepted: { bg: "#4CAF50", fg: "#fff", text: "On the way" },
  completed: { bg: "#E0D8CE", fg: "#7A6B5A", text: "Served" },
};

export default function CommunityFeed({ requests }: CommunityFeedProps) {
  const sorted = [...requests].sort((a, b) => b.ts - a.ts);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-lg font-bold text-[#3A2D1E] mb-1">Community Feed</h1>
      <p className="text-sm text-[#9A8B7A] mb-4">Recent requests across the area</p>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 shadow-sm text-center animate-slideUp">
          <span className="text-5xl">🍦</span>
          <p className="text-sm text-[#9A8B7A] mt-4 font-semibold">
            No requests yet — ring the bell!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 40).map((r) => {
            const a = AREAS.find((x) => x.id === r.area);
            const s = statusStyles[r.status] || statusStyles.pending;

            return (
              <div
                key={r.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition animate-slideUp"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-[#3A2D1E]">{r.name}</span>
                    <span className="text-xs text-[#9A8B7A] ml-1">
                      · {a?.short}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ backgroundColor: s.bg, color: s.fg }}
                  >
                    {s.text}
                  </span>
                </div>
                <p className="text-xs text-[#7A6B5A] mb-1">
                  📍 {r.street} · 👥 {r.neighbors}
                  {r.totalItems > 0 && ` · 🍨 ${r.totalItems}`}
                </p>
                <p className="text-xs text-[#B0A090]">{timeAgo(r.ts)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
