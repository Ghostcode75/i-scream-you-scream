"use client";

import { useState } from "react";
import {
  IconBellRinging,
  IconChevronLeft,
  IconChevronRight,
  IconBrandFacebook,
  IconCopy,
  IconMessage,
  IconMapPin,
  IconUsers,
  IconRefresh,
  IconFlame,
} from "@tabler/icons-react";
import { AREAS } from "@/config/areas";
import { TREATS } from "@/config/menu";
import { TruckStatus } from "@/lib/types";
import { playJingle, genId } from "@/lib/utils";
import TruckLogo from "./TruckLogo";

interface RequestFlowProps {
  onSubmit: (request: any) => void;
  heat: Record<string, number>;
  truck: TruckStatus;
}

export default function RequestFlow({ onSubmit, heat, truck }: RequestFlowProps) {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [name, setName] = useState("");
  const [treats, setTreats] = useState<Record<string, number>>({});
  const [neighbors, setNeighbors] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [lastReq, setLastReq] = useState<any>(null);
  const [bellRinging, setBellRinging] = useState(false);

  const totalItems = Object.values(treats).reduce((a, b) => a + b, 0);
  const totalPrice = TREATS.reduce((s, t) => s + (treats[t.id] || 0) * t.price, 0);

  const toggle = (id: string, d: number) => {
    setTreats((p) => {
      const n = { ...p };
      n[id] = Math.max(0, (n[id] || 0) + d);
      if (n[id] === 0) delete n[id];
      return n;
    });
  };

  const submit = () => {
    setBellRinging(true);
    playJingle();
    const req = {
      id: genId(),
      area,
      street,
      name: name || "Neighbor",
      treats: { ...treats },
      totalItems,
      totalPrice,
      neighbors,
      status: "pending",
      ts: Date.now(),
    };
    onSubmit(req);
    setLastReq(req);
    setTimeout(() => {
      setSubmitted(true);
      setBellRinging(false);
    }, 600);
  };

  const reset = () => {
    setStep(0);
    setArea(null);
    setStreet("");
    setName("");
    setTreats({});
    setNeighbors(1);
    setSubmitted(false);
    setLastReq(null);
  };

  const shareMsg = () => {
    const areaName = AREAS.find((x) => x.id === area)?.name;
    return `I just requested the Ice Cream Man to ${areaName}! Get yours too — open the app and ring the bell!`;
  };

  /* ─── Confirmation Screen ─── */
  if (submitted && lastReq) {
    const areaEta = AREAS.find((a) => a.id === area)?.eta || 15;
    return (
      <div className="pb-28 px-4 pt-8 max-w-lg mx-auto w-full">
        <div className="card text-center animate-slideUp">
          <div className="w-16 h-16 rounded-full bg-[#E8F8F0] flex items-center justify-center mx-auto mb-4">
            <IconBellRinging size={32} className="text-[#4CAF50]" />
          </div>
          <h2 className="text-xl sm:text-2xl mb-1">You rang the bell!</h2>
          <p className="text-sm text-[#8A9BA8] mb-5">Your request is in the queue</p>

          <div className="inline-flex flex-col bg-gradient-to-br from-[#6EC6CE] to-[#5BB8C0] text-white rounded-2xl px-8 py-4 mb-5">
            <span className="text-[10px] uppercase tracking-widest opacity-80">Est. arrival</span>
            <span className="text-4xl font-extrabold leading-none my-1">~{areaEta} min</span>
            <span className="text-[11px] opacity-70">once the truck heads your way</span>
          </div>

          {totalItems > 0 && (
            <div className="bg-[#FFF9F5] rounded-xl p-4 my-4 text-left text-sm">
              <p className="text-[10px] uppercase font-bold text-[#8A9BA8] tracking-wide mb-2">Pre-order</p>
              {TREATS.filter((t) => treats[t.id]).map((t) => (
                <div key={t.id} className="flex justify-between text-[#3A2D1E] py-1">
                  <span>{t.emoji} {t.name} x {treats[t.id]}</span>
                  <span className="font-semibold">${t.price * treats[t.id]}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-[#E8729A] border-t border-[#E2E8EC] pt-2 mt-2 text-base">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <p className="text-[11px] text-[#8A9BA8] mt-2">Pay at the truck — cash or card</p>
            </div>
          )}

          <div className="border-t border-[#E2E8EC] pt-5 mt-5">
            <p className="text-[10px] uppercase font-bold text-[#8A9BA8] tracking-wide mb-3">
              Tell the neighbors
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs mx-auto">
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareMsg())}`,
                    "_blank"
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-xs font-semibold hover:brightness-110 transition"
              >
                <IconBrandFacebook size={16} />
                Share
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareMsg());
                  alert("Copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#E2E8EC] bg-white text-xs font-semibold text-[#3A2D1E] hover:bg-[#F5F8FA] transition"
              >
                <IconCopy size={16} />
                Copy
              </button>
              <button
                onClick={() =>
                  window.open(`sms:?body=${encodeURIComponent(shareMsg())}`, "_blank")
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:brightness-110 transition"
              >
                <IconMessage size={16} />
                Text
              </button>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full mt-2 py-3 rounded-xl bg-[#3A2D1E] text-white font-bold hover:bg-[#2a2419] transition inline-flex items-center justify-center gap-2"
          >
            <IconRefresh size={18} />
            New Request
          </button>
        </div>
      </div>
    );
  }

  /* ─── Step 0: Hero + Area Picker ─── */
  if (step === 0) {
    return (
      <div className="pb-28 px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="text-center mb-6 animate-slideUp">
          <div className="flex justify-center mb-3">
            <TruckLogo size={140} className="animate-truck" />
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

          {truck.active && (
            <div className="mt-4 bg-white rounded-xl p-3 shadow-sm inline-flex items-center gap-2 text-sm font-semibold text-[#3A2D1E]">
              <span className="w-2.5 h-2.5 bg-[#4CAF50] rounded-full animate-pulse shrink-0" />
              Truck is near{" "}
              <strong className="text-[#6EC6CE]">
                {AREAS.find((a) => a.id === truck.area)?.short || "—"}
              </strong>
            </div>
          )}
        </div>

        <div className="card animate-slideUp stagger-2">
          <h2 className="text-lg mb-1">Where are you?</h2>
          <p className="text-sm text-[#8A9BA8] mb-3">Pick your area to get started</p>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
            {AREAS.map((a) => {
              const h = heat[a.id] || 0;
              return (
                <button
                  key={a.id}
                  onClick={() => { setArea(a.id); setStep(1); }}
                  className="text-left p-3 rounded-xl border-2 border-[#E2E8EC] bg-white hover:border-[#6EC6CE] hover:bg-[#F0FAFB] active:bg-[#E8F6F8] transition relative group"
                >
                  <span className="block text-sm font-bold text-[#3A2D1E] group-hover:text-[#5BB8C0] transition">
                    {a.short}
                  </span>
                  <span className="block text-[11px] text-[#8A9BA8] mt-0.5">{a.desc}</span>
                  {h > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 text-[10px] bg-[#FFF3E0] text-[#E67E22] rounded-md px-1.5 py-0.5 font-bold">
                      <IconFlame size={10} /> {h}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 1: Street Input ─── */
  if (step === 1) {
    return (
      <div className="pb-28 px-4 pt-8 max-w-lg mx-auto w-full">
        <div className="card animate-slideUp">
          <div className="flex items-center gap-2 mb-1">
            <IconMapPin size={20} className="text-[#6EC6CE]" />
            <h2 className="text-lg">What street?</h2>
          </div>
          <p className="text-sm text-[#8A9BA8] mb-4">Cross streets work great</p>
          <input
            type="text"
            placeholder="e.g. 200 N & Main"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 border-2 border-[#E2E8EC] rounded-xl bg-[#FAFCFD] text-[#3A2D1E] text-base mb-3"
          />
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#E2E8EC] rounded-xl bg-[#FAFCFD] text-[#3A2D1E] text-base mb-5"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-xl border-2 border-[#E2E8EC] bg-white text-sm font-semibold text-[#6B7C88] hover:bg-[#F5F8FA] transition inline-flex items-center justify-center gap-1"
            >
              <IconChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!street.trim()}
              className="flex-[2] py-3 rounded-xl bg-[#6EC6CE] text-white text-sm font-bold disabled:opacity-40 hover:bg-[#5BB8C0] transition inline-flex items-center justify-center gap-1"
            >
              Next <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 2: Treat Menu ─── */
  if (step === 2) {
    return (
      <div className="pb-28 px-4 pt-8 max-w-lg mx-auto w-full">
        <div className="card animate-slideUp">
          <h2 className="text-lg mb-1">Pre-order treats</h2>
          <p className="text-sm text-[#8A9BA8] mb-4">Optional — you can buy at the truck too</p>

          <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {TREATS.map((t) => {
              const qty = treats[t.id] || 0;
              return (
                <div
                  key={t.id}
                  className={`flex flex-col items-center p-2 min-[400px]:p-2.5 sm:p-3 rounded-xl border-2 transition ${
                    qty > 0
                      ? "border-[#F4A7BA] bg-[#FFF5F8]"
                      : "border-[#E2E8EC] bg-white"
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1">{t.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#3A2D1E] text-center leading-tight min-h-[24px] flex items-center">
                    {t.name}
                  </span>
                  <span className="text-[11px] text-[#8A9BA8] mb-1.5">${t.price}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggle(t.id, -1)}
                      disabled={!qty}
                      className="w-7 h-7 rounded-full border border-[#E2E8EC] bg-white flex items-center justify-center text-sm font-bold text-[#3A2D1E] disabled:opacity-20"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums">{qty}</span>
                    <button
                      onClick={() => toggle(t.id, 1)}
                      className="w-7 h-7 rounded-full border border-[#6EC6CE] bg-[#F0FAFB] flex items-center justify-center text-sm font-bold text-[#5BB8C0]"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalItems > 0 && (
            <div className="text-center text-sm text-[#3A2D1E] bg-[#FFF9F5] rounded-xl p-3 mb-4 font-semibold border border-[#F4E8DD]">
              {totalItems} item{totalItems > 1 ? "s" : ""} — <span className="text-[#E8729A]">${totalPrice}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border-2 border-[#E2E8EC] bg-white text-sm font-semibold text-[#6B7C88] hover:bg-[#F5F8FA] transition inline-flex items-center justify-center gap-1"
            >
              <IconChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-[2] py-3 rounded-xl bg-[#6EC6CE] text-white text-sm font-bold hover:bg-[#5BB8C0] transition inline-flex items-center justify-center gap-1"
            >
              Next <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 3: Rally + Summary + Submit ─── */
  return (
    <div className="pb-28 px-4 pt-8 max-w-lg mx-auto w-full">
      <div className="card animate-slideUp">
        <div className="flex items-center gap-2 mb-1">
          <IconUsers size={20} className="text-[#6EC6CE]" />
          <h2 className="text-lg">Rally the block</h2>
        </div>
        <p className="text-sm text-[#8A9BA8] mb-5">More households = truck comes sooner</p>

        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            onClick={() => setNeighbors((n) => Math.max(1, n - 1))}
            className="w-12 h-12 rounded-full border-2 border-[#E2E8EC] bg-white flex items-center justify-center text-xl font-bold text-[#3A2D1E] hover:bg-[#F5F8FA]"
          >
            −
          </button>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-[#E8729A] leading-none tabular-nums">
              {neighbors}
            </div>
            <div className="text-sm text-[#8A9BA8] mt-1">
              {neighbors === 1 ? "household" : "households"}
            </div>
          </div>
          <button
            onClick={() => setNeighbors((n) => Math.min(30, n + 1))}
            className="w-12 h-12 rounded-full border-2 border-[#6EC6CE] bg-[#F0FAFB] flex items-center justify-center text-xl font-bold text-[#5BB8C0]"
          >
            +
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[#F5F8FA] rounded-xl p-4 mb-5 text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="font-semibold text-[#8A9BA8]">Area</span>
            <span className="text-[#3A2D1E]">{AREAS.find((a) => a.id === area)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[#8A9BA8]">Street</span>
            <span className="text-[#3A2D1E]">{street}</span>
          </div>
          {name && (
            <div className="flex justify-between">
              <span className="font-semibold text-[#8A9BA8]">Name</span>
              <span className="text-[#3A2D1E]">{name}</span>
            </div>
          )}
          {totalItems > 0 && (
            <div className="flex justify-between">
              <span className="font-semibold text-[#8A9BA8]">Pre-order</span>
              <span className="text-[#3A2D1E]">{totalItems} items — ${totalPrice}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-1 border-t border-[#E2E8EC]">
            <span className="text-[#8A9BA8]">Households</span>
            <span className="text-[#E8729A]">{neighbors}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStep(2)}
            className="flex-1 py-3 rounded-xl border-2 border-[#E2E8EC] bg-white text-sm font-semibold text-[#6B7C88] hover:bg-[#F5F8FA] transition inline-flex items-center justify-center gap-1"
          >
            <IconChevronLeft size={16} /> Back
          </button>
          <button
            onClick={submit}
            disabled={bellRinging}
            className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-[#E8729A] to-[#F4A7BA] text-white text-base font-bold hover:brightness-105 transition inline-flex items-center justify-center gap-2 shadow-md shadow-[#F4A7BA]/30"
          >
            <IconBellRinging size={20} className={bellRinging ? "animate-ring" : ""} />
            Ring the Bell!
          </button>
        </div>
      </div>
    </div>
  );
}
