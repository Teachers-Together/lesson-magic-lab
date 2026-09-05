import { useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { ControlLabel } from "@/components/ControlLabel";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export function MatchupGame({ activity, adaptClass }: { activity: Activity; adaptClass: string; lang?: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const [round, setRound] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const start = useRef(Date.now());

  const left = useMemo(() => shuffle(items), [items, round]);
  const right = useMemo(() => shuffle(items), [items, round]);
  const done = matched.length === items.length;

  const attempt = (targetId: string, x = window.innerWidth / 2, y = window.innerHeight / 2) => {
    if (!dragId) return;
    setAttempts((a) => a + 1);
    if (dragId === targetId) {
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
    setDragId(null);
    setOverId(null);
  };

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
          start.current = Date.now();
        }}
      />
    );

  return (
    <div className={cn("mx-auto w-full max-w-4xl", adaptClass)}>
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
                draggable={!isMatched}
                onDragStart={() => setDragId(it.id)}
                onDragEnd={() => setDragId(null)}
                onClick={() => !isMatched && setDragId(dragId === it.id ? null : it.id)}
                className={cn(
                  "flex cursor-grab items-center gap-3 rounded-2xl border-2 px-4 py-4 font-semibold transition-all select-none",
                  isMatched
                    ? "border-success bg-success/12 text-success opacity-70"
                    : dragId === it.id
                      ? "-translate-y-0.5 scale-[1.02] border-action bg-action/15 shadow-lift"
                      : "border-border bg-card hover:border-primary hover:shadow-soft",
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
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(it.id);
                }}
                onDragLeave={() => setOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  attempt(it.id, e.clientX, e.clientY);
                }}
                onClick={(e) => attempt(it.id, e.clientX, e.clientY)}
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
    </div>
  );
}

export default MatchupGame;
