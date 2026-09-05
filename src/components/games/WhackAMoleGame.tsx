import { useEffect, useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Mole = { key: number; hole: number; text: string; correct: boolean };

const HOLES = 9;
const ROUND_SECONDS = 45;

export function WhackAMoleGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const target = items[0]?.answer ?? "Correct";

  const pool = useMemo(
    () =>
      items.map((it) => ({
        text: it.prompt,
        correct: it.answer === target,
      })),
    [items, target],
  );

  const [round, setRound] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<"none" | "bad">("none");
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());
  const seq = useRef(0);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, round]);

  useEffect(() => {
    if (done || pool.length === 0) return;
    const spawn = setInterval(() => {
      const pick = pool[Math.floor(Math.random() * pool.length)]!;
      const hole = Math.floor(Math.random() * HOLES);
      const key = ++seq.current;
      setMoles((m) => (m.some((x) => x.hole === hole) ? m : [...m, { key, hole, ...pick }]));
      setTimeout(() => setMoles((m) => m.filter((x) => x.key !== key)), 2000);
    }, 750);
    return () => clearInterval(spawn);
  }, [done, pool, round]);

  useEffect(() => {
    if (!done) return;
    celebrate();
    tone("win", soundOn);
    recordPlay(activity.id, Math.max(0, Math.min(100, score * 5)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const whack = (m: Mole, e: React.MouseEvent) => {
    setMoles((all) => all.filter((x) => x.key !== m.key));
    setAttempts((a) => a + 1);
    if (m.correct) {
      setScore((s) => s + 1);
      setHits((h) => h + 1);
      tone("correct", soundOn);
      burstAt(e.clientX, e.clientY);
    } else {
      setScore((s) => Math.max(0, s - 1));
      setLeft((s) => Math.max(0, s - 3));
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
      setFlash("bad");
      setTimeout(() => setFlash("none"), 400);
    }
  };

  if (done)
    return (
      <GameSummary
        score={hits}
        total={Math.max(hits, attempts)}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setMoles([]);
          setScore(0);
          setHits(0);
          setAttempts(0);
          setLeft(ROUND_SECONDS);
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl rounded-3xl p-4 transition-colors",
        flash === "bad" && "animate-shake bg-destructive/10",
        adaptClass,
      )}
    >
      <div className="rounded-3xl bg-gradient-brand p-5 text-center shadow-lift">
        <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
          Whack only
        </p>
        <p className="font-display text-2xl font-extrabold text-primary-foreground">{target}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span className="rounded-full bg-success/15 px-3 py-1 text-success">Score {score}</span>
        <span className="text-muted-foreground">Hits {hits}</span>
        <span
          className={cn(
            "rounded-full px-3 py-1 tabular-nums",
            left <= 8 ? "animate-pulse bg-destructive/15 text-destructive" : "bg-muted",
          )}
        >
          {left}s
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {Array.from({ length: HOLES }).map((_, hole) => {
          const mole = moles.find((m) => m.hole === hole);
          return (
            <div
              key={hole}
              className="relative grid aspect-square place-items-end overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100 to-amber-200/70 p-2 dark:from-muted dark:to-muted/60"
            >
              <div className="absolute inset-x-3 bottom-3 h-1/3 rounded-[50%] bg-foreground/25" />
              {mole ? (
                <button
                  onClick={(e) => whack(mole, e)}
                  className="animate-pop relative z-10 mx-auto mb-4 w-full rounded-2xl bg-action px-2 py-3 text-sm font-extrabold text-action-foreground shadow-lift transition-transform hover:-translate-y-1 active:scale-95"
                >
                  {mole.text}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WhackAMoleGame;
