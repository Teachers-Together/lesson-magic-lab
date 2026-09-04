import { useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NOTE_TONES = ["bg-action/25", "bg-primary/15", "bg-success/20", "bg-secondary"];

export function SortingGame({ activity, adaptClass }: { activity: Activity; adaptClass: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;

  const bins = useMemo(() => [...new Set(items.map((i) => i.answer))].slice(0, 4), [items]);
  const notes = useMemo(
    () => items.filter((i) => bins.includes(i.answer)).sort(() => Math.random() - 0.5),
    [items, bins],
  );

  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverBin, setHoverBin] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const start = useRef(Date.now());
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const done = Object.keys(placed).length === notes.length && notes.length > 0;

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
    const note = notes.find((n) => n.id === dragging);
    if (bin && note && note.answer === bin) {
      const next = { ...placed, [note.id]: bin };
      setPlaced(next);
      tone("correct", soundOn);
      burstAt(e.clientX, e.clientY);
      if (Object.keys(next).length === notes.length) {
        celebrate();
        tone("win", soundOn);
        recordPlay(activity.id, Math.max(20, 100 - misses * 8));
      }
    } else if (bin) {
      setMisses((m) => m + 1);
      tone("wrong", soundOn);
      buzz([25, 35, 25]);
    }
    setDragging(null);
    setPos(null);
    setHoverBin(null);
  };

  if (done)
    return (
      <GameSummary
        score={notes.length}
        total={notes.length + misses}
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
        Drag each sticky note into the bin it belongs to — bins swell when you're over the right zone.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {notes
          .filter((n) => !placed[n.id])
          .map((n, i) => (
            <div
              key={n.id}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture?.(e.pointerId);
                setDragging(n.id);
                setPos({ x: e.clientX, y: e.clientY });
              }}
              className={cn(
                "animate-float cursor-grab rounded-xl px-4 py-3 text-sm font-bold shadow-soft transition-transform active:cursor-grabbing",
                NOTE_TONES[i % NOTE_TONES.length],
                dragging === n.id && "opacity-30",
              )}
              style={{ animationDelay: `${i * 0.25}s`, rotate: `${(i % 3) - 1}deg` }}
            >
              {n.prompt}
            </div>
          ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {bins.map((b) => {
          const inBin = Object.entries(placed).filter(([, v]) => v === b);
          const hot = hoverBin === b;
          return (
            <div
              key={b}
              ref={(el) => {
                binRefs.current[b] = el;
              }}
              className={cn(
                "relative min-h-36 overflow-hidden rounded-3xl border-2 border-dashed p-4 transition-all duration-200",
                hot ? "scale-[1.03] border-action bg-action/10 shadow-lift" : "border-border bg-muted/40",
              )}
            >
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M2,20 C25,2 75,2 98,20 C99,55 92,88 50,98 C8,88 1,55 2,20 Z"
                  fill="none"
                  stroke="currentColor"
                  className={hot ? "text-action" : "text-transparent"}
                  strokeWidth="1"
                />
              </svg>
              <p className="font-display relative text-lg font-extrabold">{b}</p>
              <div className="relative mt-3 flex flex-wrap gap-2">
                {inBin.map(([id]) => (
                  <span
                    key={id}
                    className="animate-pop rounded-lg bg-success/20 px-3 py-1.5 text-sm font-semibold text-success"
                  >
                    {notes.find((n) => n.id === id)?.prompt}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {dragging && pos ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-action px-4 py-3 text-sm font-bold text-action-foreground shadow-lift"
          style={{ left: pos.x, top: pos.y, rotate: "-3deg" }}
        >
          {notes.find((n) => n.id === dragging)?.prompt}
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Placed {Object.keys(placed).length} / {notes.length} · Misses {misses}
      </p>
    </div>
  );
}
