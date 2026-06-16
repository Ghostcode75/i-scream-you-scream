"use client";

import { IconIceCream2, IconMapPin, IconBell, IconTruckDelivery } from "@tabler/icons-react";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
}

const tabs = [
  { id: "request", label: "Order", Icon: IconIceCream2 },
  { id: "track", label: "Track", Icon: IconMapPin },
  { id: "feed", label: "Feed", Icon: IconBell },
  { id: "drive", label: "Drive", Icon: IconTruckDelivery },
];

export default function TabBar({ activeTab, onTabChange, pendingCount }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E2E8EC] z-50 pb-[max(6px,env(safe-area-inset-bottom))]">
      {/* Decorative wave top edge */}
      <div className="absolute -top-[6px] left-0 right-0 overflow-hidden h-[6px]">
        <svg viewBox="0 0 400 6" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 6 Q50 0 100 6 T200 6 T300 6 T400 6 V6 H0Z" fill="white" fillOpacity="0.95" />
        </svg>
      </div>
      <div className="flex px-2 pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl relative transition-colors ${
                isActive ? "text-[#6EC6CE]" : "text-[#9AABB5]"
              }`}
            >
              <tab.Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] leading-tight ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
              {tab.id === "feed" && pendingCount > 0 && (
                <span className="absolute top-1 right-[22%] bg-[#E8729A] text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
