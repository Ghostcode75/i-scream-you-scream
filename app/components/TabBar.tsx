"use client";

import { IconIceCream, IconMapPin, IconBell, IconCar } from "@tabler/icons-react";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
}

const tabs = [
  { id: "request", label: "Request", icon: IconIceCream },
  { id: "track", label: "Track", icon: IconMapPin },
  { id: "feed", label: "Feed", icon: IconBell },
  { id: "drive", label: "Drive", icon: IconCar },
];

export default function TabBar({ activeTab, onTabChange, pendingCount }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE6DD] flex px-0 py-2 pb-[max(8px,env(safe-area-inset-bottom))] z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-all relative"
          >
            <Icon
              size={24}
              color={isActive ? "#E84B3A" : "#9A8B7A"}
              stroke={isActive ? 3 : 2}
            />
            <span
              className={`text-xs font-${isActive ? "700" : "500"} ${
                isActive ? "text-[#E84B3A]" : "text-[#9A8B7A]"
              }`}
            >
              {tab.label}
            </span>
            {tab.id === "feed" && pendingCount > 0 && (
              <span className="absolute top-1 right-[20%] bg-[#E84B3A] text-white text-xs font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
