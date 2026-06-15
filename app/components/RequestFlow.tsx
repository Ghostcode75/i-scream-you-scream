"use client";

import { useState } from "react";
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
    setSubmitted(true);
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
    return `🍦 I just requested the Ice Cream Man to ${areaName}! Get yours too — open the app and ring the bell!`;
  };

  if (submitted && lastReq) {
    return (
      <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center animate-slideUp">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-[#3A2D1E] mb-1">You rang the bell!</h2>
          <p className="text-sm text-[#9A8B7A] mb-4">Your request is in the queue</p>

          <div className="bg-[#E84B3A] text-white rounded-2xl p-4 my-4 inline-flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-90">Est. arrival</span>
            <span className="text-4xl font-bold leading-none">
              ~{AREAS.find((a) => a.id === area)?.eta} min
            </span>
            <span className="text-xs opacity-75">once the truck heads your way</span>
          </div>

          {totalItems > 0 && (
            <div className="bg-[#FFF8F0] rounded-xl p-4 my-4 text-left text-sm">
              <p className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-2">
                Pre-order
              </p>
              {TREATS.filter((t) => treats[t.id]).map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between text-[#3A2D1E] py-1 text-sm"
                >
                  <span>
                    {t.emoji} {t.name} × {treats[t.id]}
                  </span>
                  <span>${t.price * treats[t.id]}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-[#E84B3A] border-t border-[#EDE6DD] pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <p className="text-xs text-[#9A8B7A] mt-2">Pay at the truck — cash or card</p>
            </div>
          )}

          <div className="border-t border-[#F5F0EA] pt-4 mt-4">
            <p className="text-xs uppercase font-bold text-[#9A8B7A] tracking-wide mb-3">
              Tell the neighbors
            </p>
            <div className="flex gap-2 flex-wrap justify-center mb-4">
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
                      shareMsg()
                    )}`,
                    "_blank"
                  )
                }
                className="px-3 py-2 rounded-lg border-2 border-[#EDE6DD] bg-white text-xs font-semibold text-[#3A2D1E] hover:bg-[#FFF8F0] transition"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareMsg());
                  alert("Copied to clipboard!");
                }}
                className="px-3 py-2 rounded-lg border-2 border-[#EDE6DD] bg-white text-xs font-semibold text-[#3A2D1E] hover:bg-[#FFF8F0] transition"
              >
                📋 Copy
              </button>
              <button
                onClick={() =>
                  window.open(
                    `sms:?body=${encodeURIComponent(shareMsg())}`,
                    "_blank"
                  )
                }
                className="px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:brightness-110 transition"
              >
                💬 Text
              </button>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full mt-4 py-3 rounded-xl bg-[#3A2D1E] text-white font-bold hover:bg-[#2a2419] transition"
          >
            New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {step === 0 && (
        <div className="animate-slideUp">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <TruckLogo size={110} />
            </div>
            <h1 className="text-3xl font-bold text-[#3A2D1E] mb-1 leading-tight">
              I Scream,
              <br />
              You Scream
            </h1>
            <p className="text-sm text-[#7A6B5A] mb-2">
              Request the Ice Cream Man to cruise your street
            </p>
            <span className="inline-block bg-[#E84B3A] text-white text-xs font-bold px-4 py-1 rounded-full">
              Cedar City & Surrounding Areas
            </span>

            {truck.active && (
              <div className="mt-4 bg-white rounded-xl p-3 shadow-sm text-center text-sm font-semibold text-[#3A2D1E]">
                <span className="inline-block w-2 h-2 bg-[#4CAF50] rounded-full mr-2 animate-pulse"></span>
                Truck is out near
                <strong className="ml-1">
                  {AREAS.find((a) => a.id === truck.area)?.short || "—"}
                </strong>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#3A2D1E] mb-3">Where are you?</h2>
            <div className="grid grid-cols-2 gap-2">
              {AREAS.map((a) => {
                const h = heat[a.id] || 0;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setArea(a.id);
                      setStep(1);
                    }}
                    className={`text-left p-3 rounded-xl border-2 transition ${
                      area === a.id
                        ? "border-[#E84B3A] bg-[#FFF0ED]"
                        : "border-[#EDE6DD] bg-[#FDFBF8] hover:border-[#D4C4B0]"
                    }`}
                  >
                    <span className="block text-sm font-bold text-[#3A2D1E]">
                      {a.short}
                    </span>
                    <span className="block text-xs text-[#9A8B7A] mt-1">
                      {a.desc}
                    </span>
                    {h > 0 && (
                      <span className="text-xs bg-[#FFF3E0] rounded px-2 py-1 mt-2 inline-block">
                        🔥 {h}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slideUp">
          <h2 className="text-lg font-bold text-[#3A2D1E] mb-1">What street?</h2>
          <p className="text-sm text-[#9A8B7A] mb-4">Cross streets work great</p>
          <input
            type="text"
            placeholder="e.g. 200 N & Main"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#EDE6DD] rounded-xl bg-[#FDFBF8] text-[#3A2D1E] focus:border-[#E84B3A] focus:outline-none mb-3"
          />
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#EDE6DD] rounded-xl bg-[#FDFBF8] text-[#3A2D1E] focus:border-[#E84B3A] focus:outline-none mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-xl border-2 border-[#EDE6DD] bg-white text-sm font-semibold text-[#7A6B5A] hover:bg-[#FFF8F0] transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!street.trim()}
              className="flex-1 py-3 rounded-xl bg-[#3A2D1E] text-white text-sm font-bold disabled:opacity-40 hover:bg-[#2a2419] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slideUp">
          <h2 className="text-lg font-bold text-[#3A2D1E] mb-1">Pre-order treats</h2>
          <p className="text-sm text-[#9A8B7A] mb-4">Optional — buy at the truck too</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {TREATS.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition ${
                  treats[t.id]
                    ? "border-[#FF8FAB] bg-[#FFF5F7]"
                    : "border-[#EDE6DD] bg-[#FDFBF8]"
                }`}
              >
                <span className="text-2xl mb-1">{t.emoji}</span>
                <span className="text-xs font-bold text-[#3A2D1E] text-center line-clamp-2">
                  {t.name}
                </span>
                <span className="text-xs text-[#9A8B7A]">${t.price}</span>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => toggle(t.id, -1)}
                    disabled={!treats[t.id]}
                    className="w-6 h-6 rounded-full border-2 border-[#EDE6DD] bg-white flex items-center justify-center text-sm font-bold text-[#3A2D1E] hover:bg-[#FFF8F0] disabled:opacity-30 transition"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-bold">
                    {treats[t.id] || 0}
                  </span>
                  <button
                    onClick={() => toggle(t.id, 1)}
                    className="w-6 h-6 rounded-full border-2 border-[#EDE6DD] bg-white flex items-center justify-center text-sm font-bold text-[#3A2D1E] hover:bg-[#FFF8F0] transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 0 && (
            <div className="text-center text-sm text-[#3A2D1E] bg-[#FFF8F0] rounded-xl p-3 mb-4 font-semibold">
              {totalItems} item{totalItems > 1 ? "s" : ""} — <strong>${totalPrice}</strong>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border-2 border-[#EDE6DD] bg-white text-sm font-semibold text-[#7A6B5A] hover:bg-[#FFF8F0] transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl bg-[#3A2D1E] text-white text-sm font-bold hover:bg-[#2a2419] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slideUp">
          <h2 className="text-lg font-bold text-[#3A2D1E] mb-1">Rally the block</h2>
          <p className="text-sm text-[#9A8B7A] mb-6">
            More households = truck comes sooner
          </p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <button
              onClick={() => setNeighbors((n) => Math.max(1, n - 1))}
              className="w-12 h-12 rounded-full border-2 border-[#EDE6DD] bg-white flex items-center justify-center text-2xl font-bold text-[#3A2D1E] hover:bg-[#FFF8F0] transition"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#E84B3A] leading-none">
                {neighbors}
              </div>
              <div className="text-sm text-[#9A8B7A] mt-1">
                {neighbors === 1 ? "household" : "households"}
              </div>
            </div>
            <button
              onClick={() => setNeighbors((n) => Math.min(30, n + 1))}
              className="w-12 h-12 rounded-full border-2 border-[#EDE6DD] bg-white flex items-center justify-center text-2xl font-bold text-[#3A2D1E] hover:bg-[#FFF8F0] transition"
            >
              +
            </button>
          </div>

          <div className="bg-[#FFF8F0] rounded-xl p-4 mb-4 text-sm">
            <div className="flex justify-between py-1 border-b border-[#EDE6DD]">
              <span className="font-semibold text-[#9A8B7A]">Area</span>
              <span className="text-[#3A2D1E]">
                {AREAS.find((a) => a.id === area)?.name}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EDE6DD]">
              <span className="font-semibold text-[#9A8B7A]">Street</span>
              <span className="text-[#3A2D1E]">{street}</span>
            </div>
            {name && (
              <div className="flex justify-between py-1 border-b border-[#EDE6DD]">
                <span className="font-semibold text-[#9A8B7A]">Name</span>
                <span className="text-[#3A2D1E]">{name}</span>
              </div>
            )}
            {totalItems > 0 && (
              <div className="flex justify-between py-1 border-b border-[#EDE6DD]">
                <span className="font-semibold text-[#9A8B7A]">Pre-order</span>
                <span className="text-[#3A2D1E]">
                  {totalItems} items — ${totalPrice}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 font-bold">
              <span className="text-[#9A8B7A]">Households</span>
              <span className="text-[#E84B3A]">{neighbors}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl border-2 border-[#EDE6DD] bg-white text-sm font-semibold text-[#7A6B5A] hover:bg-[#FFF8F0] transition"
            >
              Back
            </button>
            <button
              onClick={submit}
              className="flex-1 py-3 rounded-xl bg-[#E84B3A] text-white text-base font-bold hover:brightness-110 transition"
            >
              🔔 Ring the Bell!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
