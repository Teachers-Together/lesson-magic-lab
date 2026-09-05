import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Timer, Zap } from "lucide-react";
import { GameSummary } from "@/components/GameSummary";
import { ControlLabel } from "@/components/ControlLabel";
import { buzz, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const QUESTION_SECONDS = 30;

export function GameshowQuizGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(QUESTION_SECONDS);
  const [hidden, setHidden] = useState<string[]>([]);
  const [double, setDouble] = useState(false);
  const [lifelines, setLifelines] = useState({ fifty: true, time: true, double: true });
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());

  const item = items[i] ?? items[0];
  const options = useMemo(
    () =>
      item
        ? shuffle([
            item.answer,
            ...(item.distractors.length ? item.distractors : ["Not sure", "None of these"]),
          ])
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i, round, activity.id],
  );

  useEffect(() => {
    if (done || picked) return;
    if (left <= 0) {
      setPicked("__timeout__");
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, picked, done]);

  const next = (nextPoints: number, nextCorrect: number) => {
    if (i + 1 >= items.length) {
      setDone(true);
      celebrate();
      tone("win", soundOn);
      recordPlay(activity.id, Math.round((nextCorrect / items.length) * 100));
    } else {
      setI(i + 1);
      setPicked(null);
      setLeft(QUESTION_SECONDS);
      setHidden([]);
      setDouble(false);
    }
  };

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === item?.answer;
    const p = ok ? points + (double ? 2 : 1) : points;
    const c = ok ? correct + 1 : correct;
    if (ok) {
      setPoints(p);
      setCorrect(c);
      tone("correct", soundOn);
    } else {
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
    }
    setTimeout(() => next(p, c), 1000);
  };

  const useFifty = () => {
    if (!lifelines.fifty || !item || picked) return;
    setLifelines((l) => ({ ...l, fifty: false }));
    setHidden(shuffle(options.filter((o) => o !== item.answer)).slice(0, 2));
    tone("click", soundOn);
  };
  const useTime = () => {
    if (!lifelines.time || picked) return;
    setLifelines((l) => ({ ...l, time: false }));
    setLeft((s) => s + 30);
    tone("click", soundOn);
  };
  const useDouble = () => {
    if (!lifelines.double || picked) return;
    setLifelines((l) => ({ ...l, double: false }));
    setDouble(true);
    tone("click", soundOn);
  };

  if (!item) return <p className="text-muted-foreground">This activity has no content yet.</p>;

  if (done)
    return (
      <GameSummary
        score={correct}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setI(0);
          setPoints(0);
          setCorrect(0);
          setPicked(null);
          setLeft(QUESTION_SECONDS);
          setHidden([]);
          setDouble(false);
          setLifelines({ fifty: true, time: true, double: true });
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  const pct = Math.max(0, Math.min(1, left / QUESTION_SECONDS));
  const R = 34;
  const circ = 2 * Math.PI * R;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl rounded-[2rem] bg-gradient-brand p-5 shadow-lift ring-4 ring-action/60 sm:p-8",
        adaptClass,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-primary-foreground/70 uppercase">
            Round {i + 1} / {items.length}
          </p>
          <p className="font-display text-3xl font-extrabold text-action drop-shadow-[0_0_12px_hsl(var(--action)/0.6)]">
            {points} pts
          </p>
        </div>

        <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0">
          <circle cx="42" cy="42" r={R} className="fill-none stroke-primary-foreground/20" strokeWidth="8" />
          <circle
            cx="42"
            cy="42"
            r={R}
            className={cn("fill-none transition-all duration-1000", left <= 6 ? "stroke-destructive" : "stroke-action")}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            transform="rotate(-90 42 42)"
          />
          <text
            x="42"
            y="48"
            textAnchor="middle"
            className="fill-primary-foreground font-display text-xl font-extrabold"
          >
            {left}
          </text>
        </svg>
      </div>

      <div className="animate-pop mt-5 rounded-3xl border-2 border-action/60 bg-background/95 p-7 text-center shadow-lift">
        {double ? (
          <span className="mb-2 inline-block rounded-full bg-gradient-action px-3 py-1 text-xs font-extrabold text-action-foreground">
            DOUBLE SCORE ACTIVE
          </span>
        ) : null}
        <p className="font-display text-2xl leading-snug font-extrabold sm:text-3xl">{item.prompt}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt, oi) => {
          if (hidden.includes(opt))
            return <div key={opt} className="rounded-2xl border-2 border-dashed border-primary-foreground/20 opacity-30" />;
          const isAnswer = opt === item.answer;
          const state = !picked ? "idle" : isAnswer ? "correct" : opt === picked ? "wrong" : "dim";
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={!!picked}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 px-5 py-5 text-left text-base font-bold transition-all duration-200",
                state === "idle" &&
                  "border-primary-foreground/25 bg-background/90 hover:-translate-y-1 hover:border-action hover:shadow-lift active:scale-[0.98]",
                state === "correct" && "border-success bg-success text-success-foreground",
                state === "wrong" && "animate-shake border-destructive bg-destructive/90 text-destructive-foreground",
                state === "dim" && "border-primary-foreground/20 bg-background/60 opacity-45",
              )}
            >
              <ControlLabel index={oi} style="letter" />
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        {[
          { key: "fifty", label: "50 / 50", icon: Sparkles, on: lifelines.fifty, run: useFifty },
          { key: "time", label: "+30 Sec", icon: Timer, on: lifelines.time, run: useTime },
          { key: "double", label: "Double", icon: Zap, on: lifelines.double, run: useDouble },
        ].map((l) => (
          <button
            key={l.key}
            onClick={l.run}
            disabled={!l.on || !!picked}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-extrabold tracking-wide uppercase transition-all",
              l.on
                ? "border-action bg-action/15 text-action hover:-translate-y-1 hover:bg-action hover:text-action-foreground"
                : "border-primary-foreground/15 text-primary-foreground/35",
            )}
          >
            <l.icon className="size-5" />
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameshowQuizGame;
