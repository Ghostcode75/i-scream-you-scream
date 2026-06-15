import { useState, useEffect, useCallback, useRef } from "react";

// ─── Data ────────────────────────────────────────────────
const AREAS = [
  { id: "cc-north", name: "Cedar City North", short: "CC North", desc: "North of Center St", eta: 10 },
  { id: "cc-south", name: "Cedar City South", short: "CC South", desc: "South of Center St", eta: 10 },
  { id: "cc-west", name: "Cedar City West", short: "CC West", desc: "West of Main St", eta: 12 },
  { id: "cc-east", name: "Cedar City East", short: "CC East", desc: "SUU / College area", eta: 10 },
  { id: "enoch", name: "Enoch", short: "Enoch", desc: "Enoch city limits", eta: 18 },
  { id: "kanarraville", name: "Kanarraville", short: "Kanarraville", desc: "South on I-15", eta: 22 },
  { id: "parowan", name: "Parowan", short: "Parowan", desc: "North on I-15", eta: 25 },
  { id: "summit", name: "Summit", short: "Summit", desc: "Between Cedar & Parowan", eta: 20 },
  { id: "brian-head", name: "Brian Head", short: "Brian Head", desc: "Up the canyon", eta: 35 },
  { id: "cedar-highlands", name: "Cedar Highlands", short: "Highlands", desc: "East bench area", eta: 15 },
];

const TREATS = [
  { id: "cone", emoji: "🍦", name: "Soft Serve Cone", price: 3 },
  { id: "dipped", emoji: "🫕", name: "Dipped Cone", price: 4 },
  { id: "sundae", emoji: "🍨", name: "Sundae", price: 5 },
  { id: "pop", emoji: "🧊", name: "Bomb Pop", price: 2 },
  { id: "drumstick", emoji: "🥁", name: "Drumstick", price: 3 },
  { id: "sandwich", emoji: "🍪", name: "Ice Cream Sandwich", price: 3 },
  { id: "shake", emoji: "🥤", name: "Milkshake", price: 5 },
  { id: "float", emoji: "🫧", name: "Root Beer Float", price: 4 },
  { id: "banana", emoji: "🍌", name: "Banana Split", price: 6 },
  { id: "snow", emoji: "❄️", name: "Snow Cone", price: 3 },
  { id: "mochi", emoji: "🍡", name: "Mochi Ice Cream", price: 4 },
  { id: "cookie", emoji: "🥠", name: "Cookie Dough Bites", price: 3 },
];

const DRIVER_PIN = "1234";

const JINGLE = [
  { f: 523, d: 140 }, { f: 587, d: 140 }, { f: 659, d: 140 }, { f: 698, d: 180 },
  { f: 659, d: 140 }, { f: 587, d: 140 }, { f: 523, d: 280 },
  { f: 0, d: 100 },
  { f: 659, d: 140 }, { f: 698, d: 140 }, { f: 784, d: 280 },
];

function playJingle() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;
    JINGLE.forEach(({ f, d }) => {
      if (f === 0) { t += d / 1000; return; }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + d / 1000);
      t += d / 1000;
    });
  } catch (e) {}
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function genId() { return Math.random().toString(36).slice(2, 10); }

// ─── SVG Truck ───────────────────────────────────────────
function TruckSVG({ size = 90, color = "#E84B3A" }) {
  return (
    <svg viewBox="0 0 120 52" width={size} height={size * 52 / 120} fill="none">
      <rect x="2" y="8" width="80" height="32" rx="4" fill="#F9F4EE" stroke="#3A2D1E" strokeWidth="2" />
      <rect x="82" y="16" width="30" height="24" rx="3" fill={color} stroke="#3A2D1E" strokeWidth="2" />
      <rect x="88" y="20" width="18" height="10" rx="2" fill="#B8E4F9" />
      <rect x="8" y="12" width="12" height="14" rx="2" fill="#FFD93D" />
      <rect x="24" y="12" width="12" height="14" rx="2" fill="#FF8FAB" />
      <rect x="40" y="12" width="12" height="14" rx="2" fill="#8FD8A8" />
      <rect x="56" y="12" width="12" height="14" rx="2" fill="#B8E4F9" />
      <text x="18" y="36" fontSize="7" fill="#3A2D1E" fontWeight="bold" textAnchor="middle">ICE</text>
      <text x="44" y="36" fontSize="7" fill="#3A2D1E" fontWeight="bold" textAnchor="middle">CREAM</text>
      <circle cx="24" cy="44" r="6" fill="#555" stroke="#3A2D1E" strokeWidth="2" />
      <circle cx="24" cy="44" r="2.5" fill="#999" />
      <circle cx="94" cy="44" r="6" fill="#555" stroke="#3A2D1E" strokeWidth="2" />
      <circle cx="94" cy="44" r="2.5" fill="#999" />
      <polygon points="38,8 44,8 41,1" fill="#FFD93D" stroke="#3A2D1E" strokeWidth="1" />
      <circle cx="41" cy="1" r="4" fill="#FF8FAB" stroke="#3A2D1E" strokeWidth="1" />
    </svg>
  );
}

// ─── Storage ─────────────────────────────────────────────
async function loadData(key, fallback) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}
async function saveData(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), true); } catch {}
}

// ─── Main App ────────────────────────────────────────────
export default function IceCreamMan() {
  const [tab, setTab] = useState("request");
  const [requests, setRequests] = useState([]);
  const [truck, setTruck] = useState({ active: false, area: null, heading: null, startedAt: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [r, t] = await Promise.all([
        loadData("icecream-reqs", []),
        loadData("icecream-truck", { active: false, area: null, heading: null, startedAt: null }),
      ]);
      setRequests(r);
      setTruck(t);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      const [r, t] = await Promise.all([loadData("icecream-reqs", []), loadData("icecream-truck", truck)]);
      setRequests(r);
      setTruck(t);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  const addReq = async (req) => {
    const u = [...requests, req].slice(-150);
    setRequests(u);
    await saveData("icecream-reqs", u);
  };
  const updateReq = async (id, patch) => {
    const u = requests.map(r => r.id === id ? { ...r, ...patch } : r);
    setRequests(u);
    await saveData("icecream-reqs", u);
  };
  const updateTruck = async (t) => {
    setTruck(t);
    await saveData("icecream-truck", t);
  };

  if (!loaded) return (
    <div style={S.loadScreen}>
      <TruckSVG size={100} />
      <p style={{ color: "#9A8B7A", marginTop: 16, fontFamily: "system-ui" }}>Loading...</p>
    </div>
  );

  const pending = requests.filter(r => r.status === "pending");
  const heat = {};
  pending.forEach(r => { heat[r.area] = (heat[r.area] || 0) + (r.neighbors || 1); });

  return (
    <div style={S.shell}>
      <div style={S.content}>
        {tab === "request" && <RequestFlow onSubmit={addReq} heat={heat} truck={truck} />}
        {tab === "track" && <TrackView truck={truck} requests={requests} heat={heat} />}
        {tab === "feed" && <FeedView requests={requests} />}
        {tab === "drive" && <DriverDash requests={requests} truck={truck} onUpdateReq={updateReq} onUpdateTruck={updateTruck} heat={heat} />}
      </div>
      <nav style={S.tabBar}>
        {[
          { id: "request", icon: "🍦", label: "Request" },
          { id: "track", icon: "📍", label: "Track" },
          { id: "feed", icon: "🔔", label: "Feed", badge: pending.length || null },
          { id: "drive", icon: "🚚", label: "Drive" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ ...S.tabBtn, ...(tab === t.id ? S.tabBtnActive : {}) }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#E84B3A" : "#9A8B7A", fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</span>
            {t.badge > 0 && <span style={S.tabBadge}>{t.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// REQUEST FLOW
// ═════════════════════════════════════════════════════════
function RequestFlow({ onSubmit, heat, truck }) {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(null);
  const [street, setStreet] = useState("");
  const [name, setName] = useState("");
  const [treats, setTreats] = useState({});
  const [neighbors, setNeighbors] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [lastReq, setLastReq] = useState(null);

  const totalItems = Object.values(treats).reduce((a, b) => a + b, 0);
  const totalPrice = TREATS.reduce((s, t) => s + (treats[t.id] || 0) * t.price, 0);

  const toggle = (id, d) => setTreats(p => {
    const n = { ...p }; n[id] = Math.max(0, (n[id] || 0) + d);
    if (n[id] === 0) delete n[id]; return n;
  });

  const submit = () => {
    playJingle();
    const req = { id: genId(), area, street, name: name || "Neighbor", treats: { ...treats }, totalItems, totalPrice, neighbors, status: "pending", ts: Date.now() };
    onSubmit(req); setLastReq(req); setSubmitted(true);
  };

  const reset = () => {
    setStep(0); setArea(null); setStreet(""); setName(""); setTreats({}); setNeighbors(1);
    setSubmitted(false); setLastReq(null);
  };

  const shareMsg = () => {
    const a = AREAS.find(x => x.id === area);
    return `🍦 I just requested the Ice Cream Man to ${a?.name}! Get yours too — open the app and ring the bell!`;
  };

  if (submitted && lastReq) {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 4 }}>🎉</div>
          <h2 style={S.h2}>You rang the bell!</h2>
          <p style={S.muted}>Your request is in the queue</p>
          <div style={S.etaPill}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.85 }}>Est. arrival</span>
            <span style={{ fontSize: 32, fontWeight: 800 }}>~{AREAS.find(a => a.id === lastReq.area)?.eta} min</span>
            <span style={{ fontSize: 10, opacity: 0.75 }}>once the truck heads your way</span>
          </div>
          {totalItems > 0 && (
            <div style={{ ...S.receiptBox, textAlign: "left" }}>
              <p style={S.receiptTitle}>Pre-order</p>
              {TREATS.filter(t => treats[t.id]).map(t => (
                <div key={t.id} style={S.receiptLine}>
                  <span>{t.emoji} {t.name} × {treats[t.id]}</span>
                  <span>${t.price * treats[t.id]}</span>
                </div>
              ))}
              <div style={S.receiptTotal}><span>Total</span><span>${totalPrice}</span></div>
              <p style={{ fontSize: 11, color: "#9A8B7A", margin: "8px 0 0" }}>Pay at the truck — cash or card</p>
            </div>
          )}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "2px solid #F5F0EA" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7A", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Tell the neighbors</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <button style={S.shareBtn} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareMsg())}`, "_blank")}>
                📘 Facebook
              </button>
              <button style={S.shareBtn} onClick={() => { navigator.clipboard?.writeText(shareMsg()); alert("Copied!"); }}>
                📋 Copy
              </button>
              <button style={{ ...S.shareBtn, background: "#25D366", color: "#fff", borderColor: "#25D366" }}
                onClick={() => window.open(`sms:?body=${encodeURIComponent(shareMsg())}`, "_blank")}>
                💬 Text
              </button>
            </div>
          </div>
          <button onClick={reset} style={{ ...S.btnFlat, marginTop: 20 }}>New Request</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {step === 0 && (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <TruckSVG size={110} />
            <h1 style={S.heroTitle}>I Scream,{"\n"}You Scream</h1>
            <p style={{ fontSize: 15, color: "#7A6B5A", margin: "0 0 10px" }}>Request the Ice Cream Man to cruise your street</p>
            <span style={S.heroBadge}>Cedar City & Surrounding Areas</span>
            {truck.active && (
              <div style={S.liveBanner}>
                <span style={S.liveDot} />
                Truck is out near <strong>{AREAS.find(a => a.id === truck.area)?.short || "—"}</strong>
              </div>
            )}
          </div>
          <div style={S.card}>
            <h2 style={S.h2}>Where are you?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {AREAS.map(a => {
                const h = heat[a.id] || 0;
                return (
                  <button key={a.id} onClick={() => { setArea(a.id); setStep(1); }}
                    style={{ ...S.areaBtn, ...(area === a.id ? S.areaBtnOn : {}) }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3A2D1E" }}>{a.short}</span>
                    <span style={{ display: "block", fontSize: 11, color: "#9A8B7A", marginTop: 2 }}>{a.desc}</span>
                    {h > 0 && <span style={S.heatTag}>🔥 {h}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {step === 1 && (
        <div style={S.card}>
          <h2 style={S.h2}>What street?</h2>
          <p style={S.muted}>Cross streets work great</p>
          <input style={S.input} placeholder="e.g. 200 N & Main" value={street} onChange={e => setStreet(e.target.value)} />
          <input style={{ ...S.input, marginTop: 10 }} placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} />
          <div style={S.navRow}>
            <button onClick={() => setStep(0)} style={S.btnFlat}>Back</button>
            <button onClick={() => setStep(2)} disabled={!street.trim()} style={{ ...S.btnPrimary, opacity: street.trim() ? 1 : 0.4 }}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={S.card}>
          <h2 style={S.h2}>Pre-order treats</h2>
          <p style={S.muted}>Optional — buy at the truck too</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {TREATS.map(t => (
              <div key={t.id} style={{ ...S.treatCard, ...(treats[t.id] ? { borderColor: "#FF8FAB", background: "#FFF5F7" } : {}) }}>
                <span style={{ fontSize: 24 }}>{t.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#3A2D1E", textAlign: "center", lineHeight: 1.2 }}>{t.name}</span>
                <span style={{ fontSize: 11, color: "#9A8B7A" }}>${t.price}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <button onClick={() => toggle(t.id, -1)} style={S.qtyBtn} disabled={!treats[t.id]}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{treats[t.id] || 0}</span>
                  <button onClick={() => toggle(t.id, 1)} style={S.qtyBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
          {totalItems > 0 && (
            <div style={{ textAlign: "center", fontSize: 14, color: "#3A2D1E", background: "#FFF8F0", borderRadius: 10, padding: 10, marginTop: 12 }}>
              {totalItems} item{totalItems > 1 ? "s" : ""} — <strong>${totalPrice}</strong>
            </div>
          )}
          <div style={S.navRow}>
            <button onClick={() => setStep(1)} style={S.btnFlat}>Back</button>
            <button onClick={() => setStep(3)} style={S.btnPrimary}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={S.card}>
          <h2 style={S.h2}>Rally the block</h2>
          <p style={S.muted}>More households = truck comes sooner</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, margin: "20px 0" }}>
            <button onClick={() => setNeighbors(n => Math.max(1, n - 1))} style={S.qtyBtnLg}>−</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#E84B3A", lineHeight: 1 }}>{neighbors}</div>
              <div style={S.muted}>{neighbors === 1 ? "household" : "households"}</div>
            </div>
            <button onClick={() => setNeighbors(n => Math.min(30, n + 1))} style={S.qtyBtnLg}>+</button>
          </div>
          <div style={S.summaryBox}>
            <Row label="Area" val={AREAS.find(a => a.id === area)?.name} />
            <Row label="Street" val={street} />
            {name && <Row label="Name" val={name} />}
            {totalItems > 0 && <Row label="Pre-order" val={`${totalItems} items — $${totalPrice}`} />}
            <Row label="Households" val={neighbors} />
          </div>
          <div style={S.navRow}>
            <button onClick={() => setStep(2)} style={S.btnFlat}>Back</button>
            <button onClick={submit} style={S.btnRing}>🔔 Ring the Bell!</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, val }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#3A2D1E", padding: "3px 0" }}>
      <span style={{ fontWeight: 600, color: "#9A8B7A" }}>{label}</span>
      <span>{val}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// TRACK VIEW
// ═════════════════════════════════════════════════════════
function TrackView({ truck, requests, heat }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const i = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(i); }, []);

  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  return (
    <div style={S.page}>
      <h1 style={{ ...S.h2, marginBottom: 16 }}>Truck Tracker</h1>

      <div style={S.card}>
        {truck.active ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ ...S.liveDot, width: 14, height: 14 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "#3A2D1E", fontSize: 17 }}>Truck is rolling!</p>
                <p style={S.muted}>
                  {truck.heading ? `Heading to ${AREAS.find(a => a.id === truck.heading)?.name}` : `In ${AREAS.find(a => a.id === truck.area)?.name}`}
                </p>
              </div>
            </div>
            <div style={{ background: "#F5F0EA", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                {AREAS.map(a => {
                  const isTruck = truck.area === a.id || truck.heading === a.id;
                  const h = heat[a.id] || 0;
                  return (
                    <div key={a.id} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "8px 2px", borderRadius: 10, minHeight: 48, gap: 2,
                      background: isTruck ? "#E84B3A" : h > 0 ? "#FFD93D" : "#E8E2DA",
                      color: isTruck ? "#fff" : "#3A2D1E",
                      transform: isTruck && pulse ? "scale(1.1)" : "scale(1)",
                      transition: "all 0.4s",
                      boxShadow: isTruck ? "0 0 12px rgba(232,75,58,0.4)" : "none",
                    }}>
                      {isTruck && <span style={{ fontSize: 14 }}>🚚</span>}
                      <span style={{ fontSize: 8, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>{a.short}</span>
                      {h > 0 && !isTruck && <span style={{ fontSize: 8 }}>🔥{h}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <TruckSVG size={80} color="#CCC" />
            <p style={{ ...S.muted, marginTop: 14, fontSize: 15 }}>Truck isn't out right now</p>
            <p style={S.muted}>Submit a request to get it rolling!</p>
          </div>
        )}
      </div>

      <div style={{ ...S.card, marginTop: 12 }}>
        <h3 style={S.h3}>Demand by Area</h3>
        {hotAreas.length === 0 ? <p style={S.muted}>No requests yet</p> : hotAreas.map(([aId, cnt]) => {
          const a = AREAS.find(x => x.id === aId);
          const max = hotAreas[0][1];
          return (
            <div key={aId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3A2D1E", minWidth: 95 }}>{a?.short}</span>
              <div style={{ flex: 1, height: 10, background: "#F5F0EA", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.max(12, (cnt / max) * 100)}%`, background: "linear-gradient(90deg, #FFD93D, #E84B3A)", borderRadius: 5, transition: "width 0.5s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E84B3A", minWidth: 24, textAlign: "right" }}>{cnt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// FEED VIEW
// ═════════════════════════════════════════════════════════
function FeedView({ requests }) {
  const sorted = [...requests].sort((a, b) => b.ts - a.ts);
  const stl = { pending: { bg: "#FFD93D", fg: "#3A2D1E", t: "Waiting" }, accepted: { bg: "#4CAF50", fg: "#fff", t: "On the way" }, completed: { bg: "#E0D8CE", fg: "#7A6B5A", t: "Served" } };

  return (
    <div style={S.page}>
      <h1 style={{ ...S.h2, marginBottom: 4 }}>Community Feed</h1>
      <p style={{ ...S.muted, marginBottom: 16 }}>Recent requests across the area</p>
      {sorted.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
          <span style={{ fontSize: 48 }}>🍦</span>
          <p style={{ ...S.muted, marginTop: 12 }}>No requests yet — ring the bell!</p>
        </div>
      ) : sorted.slice(0, 40).map(r => {
        const a = AREAS.find(x => x.id === r.area);
        const s = stl[r.status] || stl.pending;
        return (
          <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 8px rgba(58,45,30,0.05)", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#3A2D1E", fontSize: 15 }}>{r.name}</span>
                <span style={{ color: "#9A8B7A", fontSize: 13 }}> · {a?.short}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: s.bg, color: s.fg, textTransform: "uppercase" }}>{s.t}</span>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#7A6B5A" }}>
              📍 {r.street} · 👥 {r.neighbors}{r.totalItems > 0 && ` · 🍨 ${r.totalItems}`}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#B0A090" }}>{timeAgo(r.ts)}</p>
          </div>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// DRIVER DASHBOARD
// ═════════════════════════════════════════════════════════
function DriverDash({ requests, truck, onUpdateReq, onUpdateTruck, heat }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  if (!authed) return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign: "center", marginTop: 40 }}>
        <span style={{ fontSize: 48 }}>🚚</span>
        <h2 style={{ ...S.h2, marginTop: 8 }}>Driver Dashboard</h2>
        <p style={S.muted}>Enter pin to access dispatch</p>
        <input style={{ ...S.input, textAlign: "center", letterSpacing: 8, fontSize: 24, maxWidth: 180, margin: "16px auto" }}
          type="password" maxLength={4} value={pin} placeholder="····"
          onChange={e => { setPin(e.target.value); setErr(false); }} />
        {err && <p style={{ color: "#E84B3A", fontSize: 13 }}>Wrong pin</p>}
        <button onClick={() => pin === DRIVER_PIN ? setAuthed(true) : setErr(true)}
          style={{ ...S.btnPrimary, maxWidth: 180, margin: "8px auto 0" }}>Unlock</button>
        <p style={{ ...S.muted, marginTop: 16, fontSize: 11 }}>Default pin: 1234</p>
      </div>
    </div>
  );

  const pending = requests.filter(r => r.status === "pending").sort((a, b) => (b.neighbors || 1) - (a.neighbors || 1));
  const accepted = requests.filter(r => r.status === "accepted");
  const completed = requests.filter(r => r.status === "completed");
  const hotAreas = Object.entries(heat).sort((a, b) => b[1] - a[1]);

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ ...S.h2, margin: 0 }}>Dispatch</h1>
        <button onClick={() => { setAuthed(false); setPin(""); }} style={{ ...S.btnFlat, fontSize: 12, padding: "6px 12px", flex: "none" }}>Lock</button>
      </div>

      {/* Truck controls */}
      <div style={S.card}>
        <h3 style={S.h3}>Truck Status</h3>
        {truck.active ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ ...S.liveDot, width: 12, height: 12 }} />
              <span style={{ fontWeight: 600, color: "#3A2D1E" }}>Active — {AREAS.find(a => a.id === truck.area)?.name}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {AREAS.map(a => (
                <button key={a.id} onClick={() => onUpdateTruck({ ...truck, area: a.id, heading: a.id })}
                  style={{ padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    background: truck.area === a.id ? "#E84B3A" : "#F5F0EA", color: truck.area === a.id ? "#fff" : "#3A2D1E" }}>
                  {a.short}{heat[a.id] ? ` (${heat[a.id]})` : ""}
                </button>
              ))}
            </div>
            <button onClick={() => onUpdateTruck({ active: false, area: null, heading: null, startedAt: null })}
              style={{ ...S.btnFlat, color: "#E84B3A", borderColor: "#E84B3A", flex: "none" }}>🛑 End Shift</button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={S.muted}>Truck is parked</p>
            <select id="startArea" style={{ ...S.input, maxWidth: 220, margin: "10px auto" }} defaultValue="">
              <option value="" disabled>Pick starting area...</option>
              {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}{heat[a.id] ? ` 🔥${heat[a.id]}` : ""}</option>)}
            </select>
            <button onClick={() => { const s = document.getElementById("startArea")?.value; if (s) onUpdateTruck({ active: true, area: s, heading: s, startedAt: Date.now() }); }}
              style={{ ...S.btnPrimary, maxWidth: 220, margin: "10px auto 0" }}>🚚 Start Shift</button>
          </div>
        )}
      </div>

      {/* Priority */}
      {hotAreas.length > 0 && (
        <div style={{ ...S.card, marginTop: 12 }}>
          <h3 style={S.h3}>Priority Areas</h3>
          {hotAreas.slice(0, 5).map(([aId, cnt]) => {
            const a = AREAS.find(x => x.id === aId);
            return (
              <div key={aId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#3A2D1E", minWidth: 95 }}>{a?.short}</span>
                <span style={{ fontSize: 18 }}>{"🔥".repeat(Math.min(cnt, 5))}</span>
                <span style={{ fontWeight: 700, color: "#E84B3A", fontSize: 14 }}>{cnt} household{cnt > 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pending */}
      <div style={{ ...S.card, marginTop: 12 }}>
        <h3 style={S.h3}>Pending ({pending.length})</h3>
        {pending.length === 0 && <p style={S.muted}>All clear!</p>}
        {pending.map(r => {
          const a = AREAS.find(x => x.id === r.area);
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F5F0EA" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, color: "#3A2D1E", fontSize: 14 }}>{r.name}</p>
                <p style={{ margin: "2px 0", fontSize: 12, color: "#7A6B5A" }}>{a?.short} · 📍 {r.street} · 👥 {r.neighbors}{r.totalItems > 0 && ` · $${r.totalPrice}`}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#B0A090" }}>{timeAgo(r.ts)}</p>
                {r.totalItems > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11, color: "#7A6B5A" }}>
                    {TREATS.filter(t => r.treats[t.id]).map(t => `${t.emoji}×${r.treats[t.id]}`).join("  ")}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onUpdateReq(r.id, { status: "accepted" })}
                  style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#4CAF50", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>✓</button>
                <button onClick={() => onUpdateReq(r.id, { status: "completed" })}
                  style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#EDE6DD", color: "#7A6B5A", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>✗</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accepted */}
      {accepted.length > 0 && (
        <div style={{ ...S.card, marginTop: 12 }}>
          <h3 style={S.h3}>En Route ({accepted.length})</h3>
          {accepted.map(r => {
            const a = AREAS.find(x => x.id === r.area);
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F5F0EA" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#3A2D1E" }}>{r.name} — {a?.short} · {r.street}</p>
                  {r.totalItems > 0 && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#7A6B5A" }}>{r.totalItems} items · ${r.totalPrice}</p>}
                </div>
                <button onClick={() => onUpdateReq(r.id, { status: "completed" })}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#4CAF50", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Done</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div style={{ ...S.card, marginTop: 12, textAlign: "center" }}>
        <h3 style={S.h3}>Shift Stats</h3>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: "#E84B3A" }}>{completed.length}</div><div style={S.muted}>Served</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: "#FFD93D" }}>{pending.length}</div><div style={S.muted}>Waiting</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: "#4CAF50" }}>{accepted.length}</div><div style={S.muted}>En Route</div></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#3A2D1E" }}>${requests.reduce((s, r) => s + (r.totalPrice || 0), 0)}</div>
          <div style={S.muted}>Total Pre-orders</div>
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────
const S = {
  shell: { minHeight: "100vh", background: "linear-gradient(170deg, #FFF8F0 0%, #FFE8D6 40%, #FFDBC5 100%)", fontFamily: "'Fredoka','Nunito',system-ui,-apple-system,sans-serif", display: "flex", flexDirection: "column" },
  content: { flex: 1, paddingBottom: 80 },
  loadScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF8F0" },
  page: { padding: "20px 16px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  tabBar: { position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: "#fff", borderTop: "1px solid #EDE6DD", padding: "6px 0 max(6px, env(safe-area-inset-bottom))", zIndex: 100 },
  tabBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "none", background: "none", cursor: "pointer", padding: "6px 0", position: "relative", fontFamily: "inherit" },
  tabBtnActive: {},
  tabBadge: { position: "absolute", top: 2, right: "22%", background: "#E84B3A", color: "#fff", fontSize: 9, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 30, fontWeight: 800, color: "#3A2D1E", margin: "8px 0 4px", lineHeight: 1.1, letterSpacing: "-0.5px", whiteSpace: "pre-line" },
  heroBadge: { display: "inline-block", background: "#E84B3A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase" },
  liveBanner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, background: "#fff", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#3A2D1E", boxShadow: "0 2px 12px rgba(58,45,30,0.08)" },
  liveDot: { width: 10, height: 10, borderRadius: "50%", background: "#4CAF50", display: "inline-block", boxShadow: "0 0 6px rgba(76,175,80,0.6)" },
  card: { background: "#fff", borderRadius: 16, padding: "22px 18px", boxShadow: "0 2px 16px rgba(58,45,30,0.07)", marginBottom: 12 },
  h2: { fontSize: 19, fontWeight: 700, color: "#3A2D1E", margin: "0 0 4px" },
  h3: { fontSize: 13, fontWeight: 700, color: "#9A8B7A", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" },
  muted: { fontSize: 13, color: "#9A8B7A", margin: "0 0 12px" },
  input: { width: "100%", padding: "14px 16px", fontSize: 15, border: "2px solid #EDE6DD", borderRadius: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#FDFBF8", color: "#3A2D1E", display: "block" },
  areaBtn: { textAlign: "left", padding: "12px 14px", border: "2px solid #EDE6DD", borderRadius: 12, background: "#FDFBF8", cursor: "pointer", position: "relative", fontFamily: "inherit" },
  areaBtnOn: { borderColor: "#E84B3A", background: "#FFF0ED" },
  heatTag: { position: "absolute", top: 6, right: 8, fontSize: 10, background: "#FFF3E0", borderRadius: 6, padding: "2px 6px" },
  treatCard: { display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 6px 8px", border: "2px solid #EDE6DD", borderRadius: 12, background: "#FDFBF8", gap: 2, transition: "border-color 0.15s" },
  qtyBtn: { width: 28, height: 28, borderRadius: "50%", border: "2px solid #EDE6DD", background: "#fff", fontSize: 16, fontWeight: 700, color: "#3A2D1E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: "inherit" },
  qtyBtnLg: { width: 48, height: 48, borderRadius: "50%", border: "2px solid #EDE6DD", background: "#fff", fontSize: 24, fontWeight: 700, color: "#3A2D1E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: "inherit" },
  summaryBox: { background: "#FFF8F0", borderRadius: 12, padding: "14px 16px", marginBottom: 12 },
  navRow: { display: "flex", gap: 10, marginTop: 16 },
  btnFlat: { flex: 1, padding: "13px", borderRadius: 12, border: "2px solid #EDE6DD", background: "#fff", fontSize: 14, fontWeight: 600, color: "#7A6B5A", cursor: "pointer", fontFamily: "inherit" },
  btnPrimary: { flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "#3A2D1E", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "block" },
  btnRing: { flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "#E84B3A", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px" },
  etaPill: { display: "inline-flex", flexDirection: "column", background: "#E84B3A", color: "#fff", borderRadius: 16, padding: "14px 32px", margin: "16px 0" },
  receiptBox: { background: "#FFF8F0", borderRadius: 12, padding: "14px 16px", margin: "16px 0" },
  receiptTitle: { fontSize: 11, fontWeight: 700, color: "#9A8B7A", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" },
  receiptLine: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3A2D1E", padding: "3px 0" },
  receiptTotal: { display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#E84B3A", borderTop: "2px solid #EDE6DD", paddingTop: 8, marginTop: 8 },
  shareBtn: { padding: "10px 16px", borderRadius: 10, border: "2px solid #EDE6DD", background: "#FDFBF8", fontSize: 13, fontWeight: 600, color: "#3A2D1E", cursor: "pointer", fontFamily: "inherit" },
};
