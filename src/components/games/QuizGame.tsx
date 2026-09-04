import { useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { GameSummary } from "@/components/GameSummary";
import { ControlLabel } from "@/components/ControlLabel";
import { usePlayMode } from "@/lib/playmode";
import { buzz, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const QUESTION_SECONDS = 25;

export function QuizGame({ activity, adaptClass }: { activity: Activity; adaptClass: string }) {
  const { soundOn, recordPlay } = useStore();
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(QUESTION_SECONDS);
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());

  const { controlMode, cashEnabled, secondChance, awardCorrect, awardWrong } = usePlayMode();
  const items = activity.contentData;
  const item = items[i] ?? items[0];
  const options = useMemo(
    () => {
      if (!item) return [];
      let pool = item.distractors.length ? [...item.distractors] : ["Not sure", "None of these"];
      if (secondChance && pool.length > 1) pool = pool.slice(0, pool.length - 1);
      return shuffle([item.answer, ...pool]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i, round, activity.id, secondChance],
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

  const next = (nextScore: number) => {
    if (i + 1 >= items.length) {
      setDone(true);
      celebrate();
      tone("win", soundOn);
      recordPlay(activity.id, Math.round((nextScore / items.length) * 100));
    } else {
      setI(i + 1);
      setPicked(null);
      setLeft(QUESTION_SECONDS);
    }
  };

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === item?.answer;
    const s = ok ? score + 1 : score;
    if (ok) {
      setScore(s);
      tone("correct", soundOn);
    } else {
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
    }
    setTimeout(() => next(s), 950);
  };

  if (!item) return <p className="text-muted-foreground">This activity has no content yet.</p>;

  if (done)
    return (
      <GameSummary
        score={score}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setI(0);
          setScore(0);
          setPicked(null);
          setLeft(QUESTION_SECONDS);
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div className={cn("mx-auto w-full max-w-3xl", adaptClass)}>
      <div className="flex items-center justify-between gap-4 text-sm font-semibold">
        <span className="text-muted-foreground">
          Question {i + 1} / {items.length}
        </span>
        <span className="rounded-full bg-success/15 px-3 py-1 text-success">Score {score}</span>
        <span
          className={cn(
            "rounded-full px-3 py-1 tabular-nums",
            left <= 5 ? "animate-pulse bg-destructive/15 text-destructive" : "bg-muted",
          )}
        >
          {left}s
        </span>
      </div>
      <Progress value={((i + (picked ? 1 : 0)) / items.length) * 100} className="mt-3 h-2.5" />

      <div className="animate-pop mt-6 rounded-3xl bg-gradient-brand p-8 text-center shadow-lift">
        <p className="font-display text-2xl leading-snug font-extrabold text-primary-foreground sm:text-3xl">
          {item.prompt}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isAnswer = opt === item.answer;
          const state = !picked ? "idle" : isAnswer ? "correct" : opt === picked ? "wrong" : "dim";
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={!!picked}
              className={cn(
                "rounded-2xl border-2 px-5 py-5 text-left text-base font-semibold transition-all duration-200",
                state === "idle" &&
                  "border-border bg-card hover:-translate-y-1 hover:border-primary hover:shadow-soft active:scale-[0.98]",
                state === "correct" && "border-success bg-success/15 text-success",
                state === "wrong" && "animate-shake border-destructive bg-destructive/12 text-destructive",
                state === "dim" && "border-border bg-card opacity-45",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
