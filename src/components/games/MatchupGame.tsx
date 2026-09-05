import { useEffect, useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { ControlLabel } from "@/components/ControlLabel";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import { usePlayMode } from "@/lib/playmode";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const PAD = 16;

export function MatchupGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const { controlMode } = usePlayMode();
  const items = activity.contentData;
  const [round, setRound] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const start = useRef(Date.now());
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const moved = useRef(false);

  const left = useMemo(() => shuffle(items), [items, round]);
  const right = useMemo(() => shuffle(items), [items, round]);
  const done = matched.length === items.length;

  const targetUnder = (x: number, y: number) =>
    right.find((it) => {
      const el = targetRefs.current[it.id];
      if (!el || matched.includes(it.id)) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD;
    })?.id ?? null;

  const attempt = (
    sourceId: string | null,
    targetId: string,
    x = window.innerWidth / 2,
    y = window.innerHeight / 2,
  ) => {
    if (!sourceId || matched.includes(targetId)) return;
    setAttempts((a) => a + 1);
    if (sourceId === targetId) {
      const next = [...matched, targetId];
      setMatched(next);
      tone("correct", soundOn);
      burstAt(x, y);
      if (next.length === items.length) {
        celebrate();
        tone("win", soundOn);
        recordPlay(
          activity.id,
          Math.round((items.length / Math.max(items.length, attempts + 1)) * 100),
        );
      }
    } else {
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
      setWrongId(targetId);
      setTimeout(() => setWrongId(null), 500);
    }
    setSelectedId(null);
    setDragId(null);
    setOverId(null);
    setPos(null);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragId) return;
    moved.current = true;
    setPos({ x: e.clientX, y: e.clientY });
    setOverId(targetUnder(e.clientX, e.clientY));
  };

  const onUp = (e: React.PointerEvent) => {
    if (!dragId) return;
    const target = targetUnder(e.clientX, e.clientY);
    if (moved.current && target) {
      attempt(dragId, target, e.clientX, e.clientY);
    } else {
      // treat as a tap: toggle selection
      setSelectedId((s) => (s === dragId ? null : dragId));
      setDragId(null);
      setPos(null);
      setOverId(null);
    }
  };

  // teacher screen-control keyboard: number selects an item, letter places it
  useEffect(() => {
    if (!controlMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) {
        const it = left[Number(e.key) - 1];
        if (it && !matched.includes(it.id)) setSelectedId((s) => (s === it.id ? null : it.id));
      } else if (/^[a-z]$/i.test(e.key)) {
        const it = right[e.key.toLowerCase().charCodeAt(0) - 97];
        if (it && selectedId) attempt(selectedId, it.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (done)
    return (
      <GameSummary
        score={items.length}
        total={Math.max(items.length, attempts)}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setMatched([]);
          setAttempts(0);
          setSelectedId(null);
          start.current = Date.now();
        }}
      />
    );

  const activeId = dragId ?? selectedId;

  return (
    <div
      className={cn("mx-auto w-full max-w-4xl touch-none select-none", adaptClass)}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <p className="mb-5 text-center text-sm text-muted-foreground">
        Drag each term onto its matching definition — or tap a term, then tap its match.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Items</p>
          {left.map((it, li) => {
            const isMatched = matched.includes(it.id);
            return (
              <div
                key={it.id}
                onPointerDown={(e) => {
                  if (isMatched) return;
                  (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                  moved.current = false;
                  setDragId(it.id);
                  setPos({ x: e.clientX, y: e.clientY });
                }}
                className={cn(
                  "flex cursor-grab items-center gap-3 rounded-2xl border-2 px-4 py-4 font-semibold transition-all select-none",
                  isMatched
                    ? "border-success bg-success/12 text-success opacity-70"
                    : activeId === it.id
                      ? "-translate-y-0.5 scale-[1.02] border-action bg-action/15 shadow-lift"
                      : "border-border bg-card hover:border-primary hover:shadow-soft",
                  dragId === it.id && pos && "opacity-40",
                )}
              >
                <ControlLabel index={li} />
                <span>{it.prompt}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Definitions
          </p>
          {right.map((it, ri) => {
            const isMatched = matched.includes(it.id);
            return (
              <div
                key={it.id}
                ref={(el) => {
                  targetRefs.current[it.id] = el;
                }}
                onPointerUp={(e) => {
                  if (!dragId && selectedId) attempt(selectedId, it.id, e.clientX, e.clientY);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-4 transition-all",
                  isMatched
                    ? "animate-pop border-solid border-success bg-success/12 text-success"
                    : wrongId === it.id
                      ? "animate-shake border-destructive bg-destructive/10"
                      : overId === it.id
                        ? "scale-[1.03] border-action bg-action/12 shadow-lift"
                        : "border-border bg-muted/40",
                )}
              >
                <ControlLabel index={ri} style="letter" />
                <span>{it.answer}</span>
              </div>
            );
          })}
        </div>
      </div>

      {dragId && pos && moved.current ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-action px-4 py-2.5 font-semibold text-action-foreground shadow-lift"
          style={{ left: pos.x, top: pos.y }}
        >
          {items.find((i) => i.id === dragId)?.prompt}
        </div>
      ) : null}
    </div>
  );
}

export default MatchupGame;
