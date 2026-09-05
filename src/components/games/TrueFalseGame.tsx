import * as React from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Choice = "true" | "false";
type Phase = "asking" | "feedback" | "review";

export function TrueFalseGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
  lang?: string;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("asking");
  const [streak, setStreak] = React.useState(0);
  const [lastChoice, setLastChoice] = React.useState<Choice | null>(null);
  const [falseMarkedTrue, setFalseMarkedTrue] = React.useState<GameItem[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);
  const feedbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const item = items[index];

  React.useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      onComplete({
        correct: items.length - falseMarkedTrue.length,
        total: items.length,
        missedIds: falseMarkedTrue.map((i) => i.id),
      });
    }
  }, [completed, falseMarkedTrue, items.length, onComplete]);

  const answer = React.useCallback(
    (choice: Choice) => {
      if (phase !== "asking" || !item) return;

      const correct = choice === (item.answer as Choice);
      setLastChoice(choice);
      setPhase("feedback");
      setStreak((s) => (correct ? s + 1 : 0));

      if (item.answer === "false" && choice === "true") {
        setFalseMarkedTrue((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
      }

      onEvent?.({ type: "answer", itemId: item.id, choice, correct });

      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => {
        setPhase("review");
        feedbackTimer.current = null;
      }, 600);
    },
    [item, phase, onEvent],
  );

  const advance = React.useCallback(() => {
    if (completed || phase !== "review") return;
    if (index + 1 >= items.length) {
      setCompleted(true);
    } else {
      setIndex((i) => i + 1);
      setPhase("asking");
      setLastChoice(null);
    }
  }, [completed, index, items.length, phase]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (completed || phase !== "asking") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "1") {
        e.preventDefault();
        answer("true");
      } else if (e.key === "2") {
        e.preventDefault();
        answer("false");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, completed, phase]);

  if (completed || !item) {
    const mistakes = falseMarkedTrue;
    return (
    <GameChrome
      title="True or False — Summary"
      {...(items[0]?.targetStructure
        ? { targetStructure: items[0].targetStructure }
        : {})}
      teacherMode={teacherMode}
      progress={{ done: items.length, total: items.length }}
    >
        <Card className="mx-auto w-full max-w-3xl p-6 text-center">
          <h2 className="font-display text-2xl font-bold">Finished</h2>
          <p className="mt-2 text-muted-foreground">
            {mistakes.length === 0
              ? "No false statements slipped through — solid grammaticality judgment."
              : `You marked ${mistakes.length} false statement${mistakes.length === 1 ? "" : "s"} as true.`}
          </p>

          {mistakes.length > 0 && (
            <div className="mt-6 text-left">
              <p className="mb-3 font-semibold text-muted-foreground uppercase tracking-wide text-sm">
                Lesson plan for next week
              </p>
              <ul className="space-y-3">
                {mistakes.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-xl border border-border bg-muted/40 p-4"
                  >
                    <p className="font-medium text-foreground">{m.prompt}</p>
                    <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                      Correction: {m.exampleSentence ?? "—"}
                    </p>
                    {teacherMode && m.hint ? (
                      <p className="mt-1 text-xs text-muted-foreground">Tutor note: {m.hint}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="mt-6"
            onClick={() => {
              setIndex(0);
              setPhase("asking");
              setStreak(0);
              setLastChoice(null);
              setFalseMarkedTrue([]);
              setCompleted(false);
              completedRef.current = false;
            }}
          >
            Play again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  const isFalseStatement = item.answer === "false";
  const wasCorrect = lastChoice === (item.answer as Choice);

  return (
    <GameChrome
      title="True or False"
      targetStructure={items.find((i) => i.targetStructure)?.targetStructure}
      teacherMode={teacherMode}
      progress={{ done: index, total: items.length }}
      onAdvance={advance}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        {/* Statement */}
        <Card
          className={cn(
            "w-full p-6 text-center transition-colors",
            phase === "feedback" &&
              (wasCorrect
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-rose-500/50 bg-rose-500/10"),
          )}
        >
          <p className="font-display text-2xl font-semibold leading-snug md:text-3xl">
            {item.prompt}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Badge variant="secondary" className="text-sm">
              Streak {streak}
            </Badge>
            {teacherMode && item.hint ? (
              <span className="text-xs text-muted-foreground">Tutor: {item.hint}</span>
            ) : null}
          </div>
        </Card>

        {/* Feedback banner */}
        {phase !== "asking" && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl px-6 py-3 text-lg font-bold",
              wasCorrect
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
            )}
          >
            {wasCorrect ? <Check className="size-6" /> : <X className="size-6" />}
            {wasCorrect ? "Correct" : "Not quite"}
          </div>
        )}

        {/* Correction panel */}
        {phase === "review" && isFalseStatement && item.exampleSentence ? (
          <Card className="w-full border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Correction
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">{item.exampleSentence}</p>
          </Card>
        ) : null}

        {/* Targets */}
        <div className="grid w-full grid-cols-2 gap-4">
          <button
            type="button"
            disabled={phase !== "asking"}
            onClick={() => answer("true")}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-2xl py-10 text-2xl font-extrabold text-white shadow-lift transition",
              "bg-emerald-500 hover:bg-emerald-600 active:scale-95",
              "disabled:cursor-default disabled:opacity-60 disabled:active:scale-100",
            )}
            aria-label="True"
          >
            {teacherMode && (
              <span className="absolute left-3 top-3">
                <NumberBadge n={1} />
              </span>
            )}
            <span>TRUE</span>
            {lastChoice === "true" && phase !== "asking" && (
              <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/20">
                {wasCorrect ? <Check className="size-12" /> : <X className="size-12" />}
              </span>
            )}
          </button>

          <button
            type="button"
            disabled={phase !== "asking"}
            onClick={() => answer("false")}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-2xl py-10 text-2xl font-extrabold text-white shadow-lift transition",
              "bg-rose-500 hover:bg-rose-600 active:scale-95",
              "disabled:cursor-default disabled:opacity-60 disabled:active:scale-100",
            )}
            aria-label="False"
          >
            {teacherMode && (
              <span className="absolute left-3 top-3">
                <NumberBadge n={2} />
              </span>
            )}
            <span>FALSE</span>
            {lastChoice === "false" && phase !== "asking" && (
              <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/20">
                {wasCorrect ? <Check className="size-12" /> : <X className="size-12" />}
              </span>
            )}
          </button>
        </div>

        {phase === "review" && (
          <p className="text-sm font-medium text-muted-foreground">
            Press Space for the next statement
          </p>
        )}
      </div>
    </GameChrome>
  );
}

export default TrueFalseGame;
