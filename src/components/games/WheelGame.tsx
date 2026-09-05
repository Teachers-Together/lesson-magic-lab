import { useEffect, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { Button } from "@/components/ui/button";
import { buzz, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SLICE_COLORS = [
  "oklch(0.48 0.22 292)",
  "oklch(0.72 0.18 158)",
  "oklch(0.72 0.18 48)",
  "oklch(0.62 0.19 320)",
  "oklch(0.58 0.16 268)",
  "oklch(0.66 0.14 200)",
];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

export function WheelGame({ activity, adaptClass }: { activity: Activity; adaptClass: string; lang?: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const slice = 360 / items.length;

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [challenge, setChallenge] = useState<number | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const start = useRef(Date.now());

  const velocity = useRef(0);
  const raf = useRef<number | null>(null);
  const drag = useRef<{ active: boolean; lastAngle: number; lastTime: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const stopAt = (final: number) => {
    const normalized = ((final % 360) + 360) % 360;
    const idx = Math.floor(((360 - normalized + slice / 2) % 360) / slice) % items.length;
    setSpinning(false);
    setChallenge(idx);
    setRevealed(false);
    tone("click", soundOn);
  };

  const animate = () => {
    raf.current = requestAnimationFrame(() => {
      velocity.current *= 0.985;
      setAngle((a) => {
        const next = a + velocity.current;
        if (Math.abs(velocity.current) < 0.12) {
          velocity.current = 0;
          stopAt(next);
          return next;
        }
        animate();
        return next;
      });
    });
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const launch = (v: number) => {
    if (spinning) return;
    velocity.current = Math.max(6, Math.min(38, Math.abs(v))) * Math.sign(v || 1);
    setSpinning(true);
    buzz(20);
    animate();
  };

  const angleFromEvent = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  };

  const onDown = (e: React.PointerEvent) => {
    if (spinning) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { active: true, lastAngle: angleFromEvent(e), lastTime: performance.now() };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current?.active) return;
    const a = angleFromEvent(e);
    let delta = a - drag.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const dt = Math.max(8, performance.now() - drag.current.lastTime);
    velocity.current = (delta / dt) * 16;
    drag.current = { active: true, lastAngle: a, lastTime: performance.now() };
    setAngle((prev) => prev + delta);
  };
  const onUp = () => {
    if (!drag.current?.active) return;
    drag.current = null;
    launch(velocity.current * 1.6 || 14);
  };

  const answer = (correct: boolean) => {
    if (challenge === null) return;
    const item = items[challenge];
    const next = item && correct && !solved.includes(item.id) ? [...solved, item.id] : solved;
    setSolved(next);
    tone(correct ? "correct" : "wrong", soundOn);
    if (!correct) buzz([30, 40, 30]);
    setChallenge(null);
    if (next.length === items.length) {
      setDone(true);
      celebrate();
      tone("win", soundOn);
      recordPlay(activity.id, 100);
    }
  };

  if (done)
    return (
      <GameSummary
        score={items.length}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setSolved([]);
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div className={cn("mx-auto flex w-full max-w-2xl flex-col items-center", adaptClass)}>
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Flick the wheel with your finger or mouse — the harder you swipe, the longer it spins.
      </p>

      <div className="relative w-full max-w-md touch-none select-none">
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1 text-3xl drop-shadow">
          🔻
        </div>
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="w-full cursor-grab active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <g transform={`rotate(${angle} 100 100)`}>
            {items.map((it, idx) => {
              const a0 = idx * slice;
              const a1 = a0 + slice;
              const [x0, y0] = polar(100, 100, 94, a0);
              const [x1, y1] = polar(100, 100, 94, a1);
              const [tx, ty] = polar(100, 100, 60, a0 + slice / 2);
              return (
                <g key={it.id}>
                  <path
                    d={`M100 100 L${x0} ${y0} A94 94 0 ${slice > 180 ? 1 : 0} 1 ${x1} ${y1} Z`}
                    fill={SLICE_COLORS[idx % SLICE_COLORS.length]}
                    opacity={solved.includes(it.id) ? 0.35 : 1}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="white"
                    fontSize="7"
                    fontWeight="700"
                    textAnchor="middle"
                    transform={`rotate(${a0 + slice / 2} ${tx} ${ty})`}
                  >
                    {it.prompt.slice(0, 18)}
                  </text>
                </g>
              );
            })}
          </g>
          <circle cx="100" cy="100" r="16" fill="white" stroke="oklch(0.48 0.22 292)" strokeWidth="3" />
        </svg>
      </div>

      <Button
        onClick={() => launch(18 + Math.random() * 14)}
        disabled={spinning}
        className="mt-6 h-12 rounded-full bg-gradient-action px-10 text-lg font-extrabold text-action-foreground hover:opacity-90"
      >
        {spinning ? "Spinning…" : "SPIN"}
      </Button>
      <p className="mt-3 text-sm text-muted-foreground">
        Solved {solved.length} / {items.length}
      </p>

      {challenge !== null ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/95 p-6 backdrop-blur">
          <div className="animate-pop w-full max-w-lg rounded-3xl bg-card p-8 text-center shadow-lift">
            <p className="text-xs font-bold tracking-widest text-action uppercase">
              Micro-challenge
            </p>
            <p className="font-display mt-3 text-3xl font-extrabold">{items[challenge]?.prompt}</p>
            {revealed ? (
              <p className="animate-pop mt-4 rounded-2xl bg-success/12 p-4 text-lg font-semibold text-success">
                {items[challenge]?.answer}
              </p>
            ) : (
              <Button variant="outline" className="mt-6" onClick={() => setRevealed(true)}>
                Reveal answer
              </Button>
            )}
            {revealed ? (
              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-success text-success-foreground hover:opacity-90" onClick={() => answer(true)}>
                  I got it
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => answer(false)}>
                  Missed it
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default WheelGame;
