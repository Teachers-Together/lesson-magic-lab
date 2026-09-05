import confetti from "canvas-confetti";

export const BRAND_COLORS = ["#7c3aed", "#10b981", "#f97316", "#a78bfa", "#34d399"];

export function celebrate() {
  const base = { colors: BRAND_COLORS, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 90, spread: 70, origin: { y: 0.65 } });
  setTimeout(
    () => confetti({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0 } }),
    180,
  );
  setTimeout(
    () => confetti({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1 } }),
    280,
  );
}

export function burstAt(x: number, y: number) {
  confetti({
    colors: BRAND_COLORS,
    particleCount: 26,
    spread: 45,
    scalar: 0.8,
    startVelocity: 22,
    disableForReducedMotion: true,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  });
}

let ctx: AudioContext | null = null;
function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function tone(kind: "correct" | "wrong" | "click" | "win", enabled: boolean) {
  if (!enabled) return;
  const ac = audio();
  if (!ac) return;
  const notes =
    kind === "correct"
      ? [660, 880]
      : kind === "wrong"
        ? [220, 165]
        : kind === "win"
          ? [523, 659, 784, 1046]
          : [440];
  notes.forEach((f, i) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = kind === "wrong" ? "sawtooth" : "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, ac.currentTime + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.14, ac.currentTime + i * 0.1 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + i * 0.1 + 0.22);
    o.connect(g).connect(ac.destination);
    o.start(ac.currentTime + i * 0.1);
    o.stop(ac.currentTime + i * 0.1 + 0.25);
  });
}

export function buzz(pattern: number | number[] = 40) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

/** Massive multi-burst explosion locked to the EduPulse palette (purple, green, orange, white). */
export function megaCelebrate() {
  const colors = ["#7c3aed", "#10b981", "#f97316", "#ffffff"];
  const base = { colors, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 220, spread: 110, startVelocity: 45, origin: { y: 0.6 } });
  [0, 200, 400, 700].forEach((d, i) =>
    setTimeout(() => {
      confetti({ ...base, particleCount: 90, angle: 60, spread: 80, origin: { x: 0, y: 0.7 } });
      confetti({ ...base, particleCount: 90, angle: 120, spread: 80, origin: { x: 1, y: 0.7 } });
      if (i % 2 === 0)
        confetti({
          ...base,
          particleCount: 120,
          spread: 360,
          startVelocity: 30,
          scalar: 1.1,
          origin: { y: 0.4 },
        });
    }, d),
  );
}
