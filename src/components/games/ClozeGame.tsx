import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameSummary } from "@/components/GameSummary";
import { ControlLabel } from "@/components/ControlLabel";
import { usePlayMode } from "@/lib/playmode";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const BLANK = /_{2,}/;

export function ClozeGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const { cashEnabled, awardCorrect, awardWrong } = usePlayMode();
  const [round, setRound] = useState(0);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const start = useRef(Date.now());
  const dragged = useRef<string | null>(null);

  const bank = useMemo(
    () =>
      shuffle([
        ...items.map((it) => it.answer),
        ...items.flatMap((it) => it.distractors.slice(0, 1)),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, round],
  );

  const done = items.length > 0 && items.every((it) => filled[it.id] === it.answer);

  const drop = (id: string, word: string, x: number, y: number) => {
    const item = items.find((it) => it.id === id);
    if (!item || filled[id]) return;
    if (word.toLowerCase() === item.answer.toLowerCase()) {
      const next = { ...filled, [id]: item.answer };
      setFilled(next);
      tone("correct", soundOn);
      burstAt(x, y);
      if (cashEnabled) awardCorrect();
      if (items.every((it) => next[it.id] === it.answer)) {
        celebrate();
        tone("win", soundOn);
        recordPlay(activity.id, Math.max(20, 100 - misses * 8));
      }
    } else {
      setMisses((m) => m + 1);
      setWrongId(id);
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
      if (cashEnabled) awardWrong();
      setTimeout(() => setWrongId(null), 550);
    }
  };

  if (done)
    return (
      <GameSummary
        score={items.length}
        total={items.length + misses}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setFilled({});
          setMisses(0);
          start.current = Date.now();
        }}
      />
    );

  const used = new Set(Object.values(filled).map((w) => w.toLowerCase()));

  return (
    <div className={cn("mx-auto w-full max-w-3xl", adaptClass)}>
      <p className="mb-5 text-center text-sm text-muted-foreground">
        Drag a word from the bank into each blank — or tap a word, then tap the blank.
      </p>

      <div className="space-y-4 rounded-3xl border-2 border-border bg-card p-6 shadow-soft sm:p-8">
        {items.map((it) => {
          const parts = it.prompt.split(BLANK);
          const value = filled[it.id];
          return (
            <p key={it.id} className="text-lg leading-relaxed font-medium sm:text-xl">
              {parts[0]}
              <span
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragged.current) drop(it.id, dragged.current, e.clientX, e.clientY);
                  dragged.current = null;
                }}
                onClick={(e) => {
                  if (dragged.current) drop(it.id, dragged.current, e.clientX, e.clientY);
                  dragged.current = null;
                }}
                className={cn(
                  "mx-1 inline-flex min-w-28 justify-center rounded-lg border-2 px-3 py-1 align-middle text-base font-bold transition-all",
                  value
                    ? "animate-pop border-success bg-success/12 text-success"
                    : wrongId === it.id
                      ? "animate-shake border-destructive bg-destructive/10"
                      : "border-dashed border-primary/50 bg-muted/50",
                )}
              >
                {value ?? "\u00a0"}
              </span>
              {parts.slice(1).join(" ")}
            </p>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3 rounded-3xl bg-muted/40 p-5">
        {bank.map((word, idx) => {
          const spent = used.has(word.toLowerCase());
          return (
            <Button
              key={`${word}-${idx}`}
              variant="outline"
              draggable={!spent}
              disabled={spent}
              onDragStart={() => (dragged.current = word)}
              onClick={() => (dragged.current = word)}
              className={cn(
                "h-auto cursor-grab gap-2 rounded-full border-2 px-5 py-2 font-semibold",
                spent && "opacity-35",
              )}
            >
              <ControlLabel index={idx} className="size-7 text-sm" />
              {word}
            </Button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Filled {Object.keys(filled).length} / {items.length} · Misses {misses}
      </p>
    </div>
  );
}

export default ClozeGame;
