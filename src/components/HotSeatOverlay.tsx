import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Eye, EyeOff, Pause, Play, RotateCcw, SkipForward, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function HotSeatOverlay({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const { soundOn } = useStore();
  const words = useMemo(
    () => activity.contentData.map((c) => c.answer || c.prompt).filter(Boolean),
    [activity],
  );
  const [order, setOrder] = useState(() => words.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [duration, setDuration] = useState<30 | 60>(60);
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    setLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          window.clearInterval(tick.current ?? undefined);
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick.current ?? undefined);
  }, [running]);

  const word = words[order[idx] ?? 0] ?? "—";
  const next = () => {
    setReveal(false);
    setIdx((i) => (i + 1) % Math.max(1, order.length));
  };

  const gotIt = () => {
    tone("correct", soundOn);
    setScore((s) => s + 1);
    celebrate();
    next();
  };

  const restart = () => {
    setOrder([...words.keys()].sort(() => Math.random() - 0.5));
    setIdx(0);
    setScore(0);
    setLeft(duration);
    setRunning(true);
  };

  const urgent = left <= 10 && left > 0;

  return (
    <div className="animate-fade-in fixed inset-0 z-[60] flex flex-col bg-gradient-brand">
      {/* Curtain */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-primary-foreground/70 uppercase">
          Hot Seat Vocabulary
        </p>
        <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-primary-foreground sm:text-5xl">
          Student in the Hot Seat: Turn around!
        </h2>
        <p className="mt-3 max-w-2xl text-lg font-bold text-primary-foreground/80">
          Teammates, describe the hidden word!
        </p>

        <div
          className={cn(
            "mt-10 grid w-full max-w-xl place-items-center rounded-3xl border-4 border-primary-foreground/30 bg-foreground/25 px-8 py-10 backdrop-blur-sm",
            urgent && "animate-pulse border-action",
          )}
        >
          <Timer className="size-6 text-primary-foreground/70" />
          <p
            className={cn(
              "font-display text-7xl font-extrabold tabular-nums text-primary-foreground sm:text-8xl",
              urgent && "text-action",
            )}
          >
            {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm font-bold tracking-widest text-primary-foreground/70 uppercase">
            {left === 0 ? "Time's up!" : "Describe it — don't say it!"}
          </p>
        </div>

        <p className="font-display mt-6 text-2xl font-extrabold text-primary-foreground">
          Score: <span className="text-success">{score}</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={gotIt}
            size="lg"
            className="gap-2 bg-success font-bold text-success-foreground"
          >
            <Check className="size-5" /> Got It! (+Point)
          </Button>
          <Button onClick={next} size="lg" variant="secondary" className="gap-2 font-bold">
            <SkipForward className="size-5" /> Pass
          </Button>
          <Button
            onClick={() => setRunning((r) => !r)}
            size="lg"
            variant="ghost"
            className="gap-2 font-bold text-primary-foreground hover:text-primary-foreground"
          >
            {running ? <Pause className="size-5" /> : <Play className="size-5" />}
            {running ? "Pause" : "Resume"}
          </Button>
          <Button
            onClick={restart}
            size="lg"
            variant="ghost"
            className="gap-2 font-bold text-primary-foreground hover:text-primary-foreground"
          >
            <RotateCcw className="size-5" /> Restart round
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {([30, 60] as const).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={duration === d ? "default" : "outline"}
              onClick={() => {
                setDuration(d);
                setRunning(true);
              }}
              className="rounded-full font-bold"
            >
              {d}s
            </Button>
          ))}
        </div>
      </div>

      {/* Teacher-only translucent panel */}
      <div className="pointer-events-auto fixed right-4 bottom-4 w-64 rounded-2xl border border-primary-foreground/25 bg-foreground/60 p-4 text-left backdrop-blur-md">
        <p className="text-[10px] font-bold tracking-[0.2em] text-primary-foreground/60 uppercase">
          Teacher only
        </p>
        <p className="mt-2 min-h-8 font-display text-xl font-extrabold text-primary-foreground">
          {reveal ? word : "• • • • •"}
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setReveal((r) => !r)}
          className="mt-3 w-full gap-2 font-bold"
        >
          {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {reveal ? "Hide word" : "Reveal word"}
        </Button>
        <p className="mt-2 text-[11px] text-primary-foreground/60">
          Card {idx + 1} of {Math.max(1, words.length)}
        </p>
      </div>

      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        aria-label="Close Hot Seat"
        className="absolute top-4 right-4 text-primary-foreground hover:text-primary-foreground"
      >
        <X className="size-6" />
      </Button>
    </div>
  );
}
