export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Web Audio API jingle player
export const JINGLE = [
  { f: 523, d: 140 },
  { f: 587, d: 140 },
  { f: 659, d: 140 },
  { f: 698, d: 180 },
  { f: 659, d: 140 },
  { f: 587, d: 140 },
  { f: 523, d: 280 },
  { f: 0, d: 100 },
  { f: 659, d: 140 },
  { f: 698, d: 140 },
  { f: 784, d: 280 },
];

export function playJingle(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    let t = ctx.currentTime;
    JINGLE.forEach(({ f, d }) => {
      if (f === 0) {
        t += d / 1000;
        return;
      }
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
  } catch (e) {
    // Audio context not available
  }
}
