import { useEffect, useMemo, useRef, useState } from "react";
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
const PAD = 16;

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
  const { cashEnabled, awardCorrect, awardWrong, controlMode } = usePlayMode();
  const [round, setRound] = useState(0);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragWord, setDragWord] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const start = useRef(Date.now());
  const blankRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const moved = useRef(false);

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

  const blankUnder = (x: number, y: number) =>
    items.find((it) => {
      const el = blankRefs.current[it.id];
      if (!el || filled[it.id]) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD;
    })?.id ?? null;

  const drop = (id: string, word: string, x: number, y: number) => {
    const item = items.find((it) => it.id === id);
    setSelected(null);
    setDragWord(null);
    setPos(null);
    setHoverId(null);
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

  const onMove = (e: React.PointerEvent) => {
    if (!dragWord) return;
    moved.current = true;
    setPos({ x: e.clientX, y: e.clientY });
    setHoverId(blankUnder(e.clientX, e.clientY));
  };

  const onUp = (e: React.PointerEvent) => {
    if (!dragWord) return;
    const id = blankUnder(e.clientX, e.clientY);
    if (moved.current && id) {
      drop(id, dragWord, e.clientX, e.clientY);
    } else {
      setSelected((s) => (s === dragWord ? null : dragWord));
      setDragWord(null);
      setPos(null);
      setHoverId(null);
    }
  };

  const used = new Set(Object.values(filled).map((w) => w.toLowerCase()));

  useEffect(() => {
    if (!controlMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) {
        const word = bank[Number(e.key) - 1];
        if (word && !used.has(word.toLowerCase())) setSelected((s) => (s === word ? null : word));
      } else if (/^[a-z]$/i.test(e.key)) {
        const it = items[e.key.toLowerCase().charCodeAt(0) - 97];
        if (it && selected) drop(it.id, selected, window.innerWidth / 2, window.innerHeight / 2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
          setSelected(null);
          start.current = Date.now();
        }}
      />
    );

  const active = dragWord ?? selected;

  return (
    <div
      className={cn("mx-auto w-full max-w-3xl touch-none select-none", adaptClass)}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
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
                ref={(el) => {
                  blankRefs.current[it.id] = el;
                }}
                onPointerUp={(e) => {
                  if (!dragWord && selected) drop(it.id, selected, e.clientX, e.clientY);
                }}
                className={cn(
                  "mx-1 inline-flex min-w-28 justify-center rounded-lg border-2 px-3 py-1 align-middle text-base font-bold transition-all",
                  value
                    ? "animate-pop border-success bg-success/12 text-success"
                    : wrongId === it.id
                      ? "animate-shake border-destructive bg-destructive/10"
                      : hoverId === it.id
                        ? "border-action bg-action/12 shadow-lift"
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
              disabled={spent}
              onPointerDown={(e) => {
                if (spent) return;
                (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                moved.current = false;
                setDragWord(word);
                setPos({ x: e.clientX, y: e.clientY });
              }}
              className={cn(
                "h-auto cursor-grab gap-2 rounded-full border-2 px-5 py-2 font-semibold",
                spent && "opacity-35",
                active === word && !spent && "border-action bg-action/15 shadow-lift",
              )}
            >
              <ControlLabel index={idx} className="size-7 text-sm" />
              {word}
            </Button>
          );
        })}
      </div>

      {dragWord && pos && moved.current ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action px-5 py-2 font-semibold text-action-foreground shadow-lift"
          style={{ left: pos.x, top: pos.y }}
        >
          {dragWord}
        </div>
      ) : null}

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Filled {Object.keys(filled).length} / {items.length} · Misses {misses}
      </p>
    </div>
  );
}

export default ClozeGame;
