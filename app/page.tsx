"use client";

import { useState, useEffect } from "react";
import { IceCreamRequest, TruckStatus } from "@/lib/types";
import RequestSection from "@/components/RequestSection";
import TruckTracker from "@/components/TruckTracker";
import Footer from "@/components/Footer";
import TruckLogo from "@/components/TruckLogo";

export default function Home() {
  const [requests, setRequests] = useState<IceCreamRequest[]>([]);
  const [truck, setTruck] = useState<TruckStatus>({
    active: false,
    area: null,
    heading: null,
    startedAt: null,
  });
  const [loaded, setLoaded] = useState(false);

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
          setTruck(data.data || { active: false, area: null, heading: null, startedAt: null });
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
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
    }, 7000);
    return () => clearInterval(iv);
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
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const heat: Record<string, number> = {};
  pending.forEach((r) => {
    heat[r.area] = (heat[r.area] || 0) + (r.neighbors || 1);
  });

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen min-h-dvh bg-[#FFF9F5]">
        <TruckLogo size={130} className="animate-truck" />
        <p className="font-script text-2xl text-[#E8729A] mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#FFF9F5] flex flex-col">
      {/* Hero */}
      <header className="text-center pt-8 pb-4 px-4 animate-slideUp">
        <div className="flex justify-center mb-3">
          <TruckLogo size={130} className="animate-truck" />
        </div>
        <h1 className="font-script text-3xl min-[400px]:text-4xl sm:text-5xl text-[#E8729A] mb-1 tracking-wide">
          I Scream, You Scream
        </h1>
        <p className="text-sm sm:text-base text-[#6B7C88] mb-3">
          Request the Ice Cream Man to cruise your street
        </p>
        <span className="inline-block bg-gradient-to-r from-[#6EC6CE] to-[#5BB8C0] text-white text-[10px] sm:text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider">
          Cedar City & Surrounding Areas
        </span>
      </header>

      {/* Main content: side-by-side on desktop, stacked on mobile */}
      <main className="flex-1 px-4 pb-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="max-w-lg mx-auto w-full lg:max-w-none">
            <RequestSection
              onSubmit={handleSubmitRequest}
              heat={heat}
              truck={truck}
            />
          </div>
          <div className="max-w-lg mx-auto w-full lg:max-w-none">
            <TruckTracker truck={truck} heat={heat} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
