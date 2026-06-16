"use client";

import { IconMapPin, IconUsers, IconIceCream2, IconBell } from "@tabler/icons-react";
import { AREAS } from "@/config/areas";
import { IceCreamRequest } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface CommunityFeedProps {
  requests: IceCreamRequest[];
}

const statusConfig: Record<string, { bg: string; fg: string; label: string }> = {
  pending:   { bg: "bg-[#FFD93D]/20", fg: "text-[#B8860B]", label: "Waiting" },
  accepted:  { bg: "bg-[#4CAF50]/15", fg: "text-[#2E7D32]", label: "On the way" },
  completed: { bg: "bg-[#E8EDF0]",    fg: "text-[#6B7C88]", label: "Served" },
};

export default function CommunityFeed({ requests }: CommunityFeedProps) {
  const sorted = [...requests].sort((a, b) => b.ts - a.ts);

  return (
    <div className="pb-28 px-4 pt-6 max-w-lg mx-auto w-full">
      <div className="flex items-center gap-2 mb-1">
        <IconBell size={22} className="text-[#6EC6CE]" />
        <h1 className="text-lg font-bold text-[#3A2D1E]">Community Feed</h1>
      </div>
      <p className="text-sm text-[#8A9BA8] mb-4">Recent requests across the area</p>

      {sorted.length === 0 ? (
        <div className="card text-center py-12 animate-slideUp">
          <IconIceCream2 size={48} className="text-[#D4DDE2] mx-auto mb-3" />
          <p className="text-sm text-[#8A9BA8] font-semibold">No requests yet — ring the bell!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 40).map((r, i) => {
            const a = AREAS.find((x) => x.id === r.area);
            const s = statusConfig[r.status] || statusConfig.pending;
            return (
              <div
                key={r.id}
                className={`card !py-3.5 !px-4 animate-slideUp ${i < 5 ? `stagger-${i + 1}` : ""}`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="font-bold text-[#3A2D1E] text-[15px]">{r.name}</span>
                    <span className="text-xs text-[#8A9BA8] ml-1.5">· {a?.short}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${s.bg} ${s.fg}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#6B7C88]">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-[160px] sm:max-w-none">
                    <IconMapPin size={12} className="shrink-0" /> {r.street}
                  </span>
                  <span className="inline-flex items-center gap-0.5 shrink-0">
                    <IconUsers size={12} /> {r.neighbors}
                  </span>
                  {r.totalItems > 0 && (
                    <span className="inline-flex items-center gap-0.5 shrink-0">
                      <IconIceCream2 size={12} /> {r.totalItems}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#B0BEC5] mt-1">{timeAgo(r.ts)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
