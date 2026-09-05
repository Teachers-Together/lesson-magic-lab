import { useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const BIN_TONES = [
  "text-primary border-primary/40 bg-primary/8",
  "text-action border-action/40 bg-action/8",
  "text-success border-success/40 bg-success/8",
];

export function GroupSortGame({ activity, adaptClass }: { activity: Activity; adaptClass: string; lang?: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;

  const bins = useMemo(() => [...new Set(items.map((i) => i.answer))].slice(0, 3), [items]);
  const words = useMemo(
    () => items.filter((i) => bins.includes(i.answer)).sort(() => Math.random() - 0.5),
    [items, bins],
  );

  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverBin, setHoverBin] = useState<string | null>(null);
  const [rejectBin, setRejectBin] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const start = useRef(Date.now());
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const done = Object.keys(placed).length === words.length && words.length > 0;

  const binUnder = (x: number, y: number) =>
    bins.find((b) => {
      const el = binRefs.current[b];
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }) ?? null;

  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX, y: e.clientY });
    setHoverBin(binUnder(e.clientX, e.clientY));
  };

  const onUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    const bin = binUnder(e.clientX, e.clientY);
    const word = words.find((w) => w.id === dragging);
    if (bin && word && word.answer === bin) {
      const next = { ...placed, [word.id]: bin };
      setPlaced(next);
      tone("correct", soundOn);
      burstAt(e.clientX, e.clientY);
      if (Object.keys(next).length === words.length) {
        celebrate();
        tone("win", soundOn);
        recordPlay(activity.id, Math.max(20, 100 - misses * 8));
      }
    } else if (bin) {
      setMisses((m) => m + 1);
      tone("wrong", soundOn);
      buzz([25, 35, 25]);
      setRejectBin(bin);
      setTimeout(() => setRejectBin(null), 500);
    }
    setDragging(null);
    setPos(null);
    setHoverBin(null);
  };

  if (done)
    return (
      <GameSummary
        score={words.length}
        total={words.length + misses}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setPlaced({});
          setMisses(0);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div
      key={round}
      className={cn("mx-auto w-full max-w-5xl touch-none select-none", adaptClass)}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <p className="mb-5 text-center text-sm text-muted-foreground">
        Drag every word into the right group — correct bins glow green, wrong ones push the word back.
      </p>

      <div className={cn("grid gap-4", bins.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        {bins.map((b, i) => {
          const inBin = Object.entries(placed).filter(([, v]) => v === b);
          const hot = hoverBin === b;
          const bad = rejectBin === b;
          return (
            <div
              key={b}
              ref={(el) => {
                binRefs.current[b] = el;
              }}
              className={cn(
                "min-h-48 rounded-3xl border-2 p-4 transition-all duration-200",
                BIN_TONES[i % BIN_TONES.length],
                hot && "scale-[1.03] border-success bg-success/15 shadow-lift",
                bad && "animate-shake border-destructive bg-destructive/10",
              )}
            >
              <p className="font-display text-lg font-extrabold">{b}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {inBin.map(([id]) => (
                  <span
                    key={id}
                    className="animate-pop rounded-lg bg-success/20 px-3 py-1.5 text-sm font-semibold text-success"
                  >
                    {words.find((w) => w.id === id)?.prompt}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex min-h-20 flex-wrap justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-muted/40 p-4">
        {words
          .filter((w) => !placed[w.id])
          .map((w, i) => (
            <div
              key={w.id}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture?.(e.pointerId);
                setDragging(w.id);
                setPos({ x: e.clientX, y: e.clientY });
              }}
              className={cn(
                "animate-float cursor-grab rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm font-bold shadow-soft active:cursor-grabbing",
                dragging === w.id && "opacity-30",
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {w.prompt}
            </div>
          ))}
      </div>

      {dragging && pos ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-action px-4 py-2.5 text-sm font-bold text-action-foreground shadow-lift"
          style={{ left: pos.x, top: pos.y }}
        >
          {words.find((w) => w.id === dragging)?.prompt}
        </div>
      ) : null}

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Sorted {Object.keys(placed).length} / {words.length} · Misses {misses}
      </p>
    </div>
  );
}

export default GroupSortGame;
