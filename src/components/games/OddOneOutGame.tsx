import * as React from "react";
import { Check, X, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Phase = "asking" | "review";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function buildCards(item: GameItem): string[] {
  const options = [item.answer, ...(item.distractors ?? [])];
  while (options.length < 4) options.push("—");
  return shuffle(options.slice(0, 4));
}

export default function OddOneOutGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("asking");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [missed, setMissed] = React.useState<GameItem[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const item = items[index];
  const cards = React.useMemo(() => (item ? buildCards(item) : []), [item]);
  const targetStructure = React.useMemo(
    () => items.find((i) => i.targetStructure)?.targetStructure,
    [items],
  );

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      onComplete({
        correct: correctCount,
        total: items.length,
        missedIds: missed.map((m) => m.id),
      });
    }
  }, [completed, correctCount, items.length, missed, onComplete]);

  const emit = React.useCallback(
    (type: string, choice?: string, correct?: boolean) => {
      const base: { type: string; itemId?: string; choice?: string; correct?: boolean } = { type };
      if (item) base.itemId = item.id;
      if (choice !== undefined) base.choice = choice;
      if (correct !== undefined) base.correct = correct;
      onEvent?.(base);
    },
    [item, onEvent],
  );

  const choose = React.useCallback(
    (option: string) => {
      if (phase !== "asking" || !item) return;
      const isCorrect = option === item.answer;
      setSelected(option);
      setPhase("review");
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setMissed((prev) => (prev.some((m) => m.id === item.id) ? prev : [...prev, item]));
      }
      emit("answer", option, isCorrect);
    },
    [item, phase, emit],
  );

  const advance = React.useCallback(() => {
    if (completed || phase !== "review") return;
    if (index + 1 >= items.length) {
      setCompleted(true);
    } else {
      setIndex((i) => i + 1);
      setPhase("asking");
      setSelected(null);
    }
  }, [completed, index, items.length, phase]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (completed || phase !== "asking" || cards.length === 0) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      const n = Number.parseInt(e.key, 10);
      if (Number.isNaN(n) || n < 1 || n > cards.length) return;
      e.preventDefault();
      choose(cards[n - 1]!);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cards, choose, completed, phase]);

  const reset = () => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setPhase("asking");
    setSelected(null);
    setCorrectCount(0);
    setMissed([]);
  };

  if (!item) {
    return (
      <GameChrome title="Odd One Out" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items to play.</p>
      </GameChrome>
    );
  }

  if (completed) {
    return (
      <GameChrome
        title="Odd One Out — Summary"
        teacherMode={teacherMode}
        {...(targetStructure ? { targetStructure } : {})}
        progress={{ done: items.length, total: items.length }}
      >
        <div className="mx-auto w-full max-w-3xl">
          <Card className="p-6 text-center sm:p-8">
            <h2 className="font-display text-2xl font-bold">Finished</h2>
            <p className="mt-2 text-muted-foreground">
              {missed.length === 0
                ? "Every category sorted — excellent!"
                : `You missed ${missed.length} categor${missed.length === 1 ? "y" : "ies"}.`}
            </p>

            {missed.length > 0 && (
              <div className="mt-6 text-left">
                <p className="mb-3 font-semibold uppercase tracking-wide text-muted-foreground text-sm">
                  Categories to revisit
                </p>
                <ul className="space-y-3">
                  {missed.map((m) => (
                    <li key={m.id} className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">{m.answer}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="text-muted-foreground">{(m.distractors ?? []).join(", ")}</span>
                      </div>
                      <p className="mt-2 flex items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <Lightbulb className="mt-0.5 size-4 shrink-0" />
                        {m.hint}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={reset} className="mt-6">
              Play again
            </Button>
          </Card>
        </div>
      </GameChrome>
    );
  }

  const isCorrect = selected === item.answer;

  return (
    <GameChrome
      title="Odd One Out"
      teacherMode={teacherMode}
      {...(targetStructure ? { targetStructure } : {})}
      progress={{ done: index, total: items.length }}
      onAdvance={advance}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        {/* Prompt */}
        <Card className="w-full p-5 text-center">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            {item.prompt?.trim() || "Find the odd one out."}
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Say why before you choose.
          </p>
        </Card>

        {/* Feedback banner */}
        {phase === "review" && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl px-6 py-3 text-lg font-bold",
              isCorrect
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
            )}
          >
            {isCorrect ? <Check className="size-6" /> : <X className="size-6" />}
            {isCorrect ? "Correct" : "Not quite"}
          </div>
        )}

        {/* Reason panel */}
        {phase === "review" && item.hint && (
          <Card
            className={cn(
              "w-full border-l-4 p-5 text-left",
              isCorrect
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-rose-500 bg-rose-500/5",
            )}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Why
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">{item.hint}</p>
          </Card>
        )}

        {/* Cards */}
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-5">
          {cards.map((card, i) => {
            const chosen = selected === card;
            const showResult = phase === "review" && chosen;
            return (
              <button
                key={`${card}-${i}`}
                type="button"
                disabled={phase !== "asking"}
                onClick={() => choose(card)}
                className={cn(
                  "relative flex min-h-28 flex-col items-center justify-center rounded-2xl border-2 p-4 text-center text-xl font-extrabold shadow-soft transition sm:min-h-36 sm:text-2xl",
                  "select-none",
                  showResult && isCorrect
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : showResult && !isCorrect
                      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : phase === "review"
                        ? "border-border bg-muted/40 opacity-60"
                        : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5",
                  "disabled:cursor-default disabled:hover:translate-y-0",
                )}
                aria-label={`Option ${i + 1}: ${card}`}
              >
                {teacherMode && (
                  <span className="absolute left-3 top-3">
                    <NumberBadge n={i + 1} className="size-8 text-base" />
                  </span>
                )}
                <span className="break-words">{card}</span>
                {showResult && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/10">
                    {isCorrect ? (
                      <Check className="size-12 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="size-12 text-rose-600 dark:text-rose-400" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {phase === "review" && (
          <p className="text-sm font-medium text-muted-foreground">
            Press Space for the next set
          </p>
        )}
      </div>
    </GameChrome>
  );
}
