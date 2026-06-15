"use client";

import { useState, useEffect } from "react";
import { IceCreamRequest, TruckStatus } from "@/lib/types";
import { genId } from "@/lib/utils";
import TabBar from "@/components/TabBar";
import RequestFlow from "@/components/RequestFlow";
import TruckTracker from "@/components/TruckTracker";
import CommunityFeed from "@/components/CommunityFeed";
import DriverDash from "@/components/DriverDash";
import Footer from "@/components/Footer";
import TruckLogo from "@/components/TruckLogo";

export default function Home() {
  const [tab, setTab] = useState("request");
  const [requests, setRequests] = useState<IceCreamRequest[]>([]);
  const [truck, setTruck] = useState<TruckStatus>({
    active: false,
    area: null,
    heading: null,
    startedAt: null,
  });
  const [loaded, setLoaded] = useState(false);

  // Initial load
  useEffect(() => {
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
          setTruck(data.data || {});
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  // Polling for updates
  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(async () => {
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
          setTruck(data.data || {});
        }
      } catch (error) {
        console.error("Error polling:", error);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [loaded]);

  const handleSubmitRequest = async (request: Partial<IceCreamRequest>) => {
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests((prev) => [...prev, data.data].slice(-150));
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleUpdateRequest = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-driver-pin": "1234",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? data.data : r))
        );
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleUpdateTruck = async (updates: Partial<TruckStatus>) => {
    try {
      const res = await fetch("/api/truck", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-driver-pin": "1234",
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        setTruck(data.data);
      }
    } catch (error) {
      console.error("Error updating truck:", error);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const heat: Record<string, number> = {};
  pending.forEach((r) => {
    heat[r.area] = (heat[r.area] || 0) + (r.neighbors || 1);
  });

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFE8D6]">
        <TruckLogo size={100} />
        <p className="text-[#9A8B7A] mt-4 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] via-[#FFE8D6] to-[#FFDBC5] flex flex-col">
      <main className="flex-1">
        {tab === "request" && (
          <RequestFlow onSubmit={handleSubmitRequest} heat={heat} truck={truck} />
        )}
        {tab === "track" && (
          <TruckTracker truck={truck} requests={requests} heat={heat} />
        )}
        {tab === "feed" && <CommunityFeed requests={requests} />}
        {tab === "drive" && (
          <DriverDash
            requests={requests}
            truck={truck}
            heat={heat}
            onUpdateRequest={handleUpdateRequest}
            onUpdateTruck={handleUpdateTruck}
          />
        )}
      </main>

      <Footer />
      <TabBar activeTab={tab} onTabChange={setTab} pendingCount={pending.length} />
    </div>
  );
}
