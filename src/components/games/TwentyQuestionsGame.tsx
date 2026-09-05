import * as React from "react";
import { Check, Eye, EyeOff, HelpCircle, Minus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameChrome } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

const MAX_QUESTIONS = 20;

type AnswerKind = "yes" | "no" | "sortof";
type LogEntry = { n: number; kind: AnswerKind };
type RoundResult = { item: GameItem; found: boolean; questions: number };

const STARTERS: Record<string, string[]> = {
  "pre-A1": ["Is it…?", "Can it…?", "Does it…?"],
  A1: ["Is it…?", "Can it…?", "Does it…?"],
  A2: ["Is it…?", "Can it…?", "Does it…?"],
  B1: ["Would you find it…?", "Is it used for…?", "Has it got…?"],
  B2: ["Could it be described as…?", "Is it something people…?", "Would you associate it with…?"],
  C1: ["Might it be considered…?", "Does it tend to…?", "Is it the sort of thing that…?"],
};

function startersFor(cefr?: string): string[] {
  return STARTERS[cefr ?? "A2"] ?? STARTERS["A2"]!;
}

function hintsOf(item: GameItem): string[] {
  return (item.hint ?? "")
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean)
    .slice(0, 3);
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function TwentyQuestionsGame(props: Props) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [holder, setHolder] = React.useState<"tutor" | "student">("tutor");
  const [revealed, setRevealed] = React.useState(false);
  const [log, setLog] = React.useState<LogEntry[]>([]);
  /** Round end: null = playing; true = found; false = gave up / out of questions. */
  const [roundOver, setRoundOver] = React.useState<boolean | null>(null);
  const [results, setResults] = React.useState<RoundResult[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const item = items[index];
  const fallbackHints = React.useMemo(() => (item ? hintsOf(item) : []), [item]);
  const starters = React.useMemo(() => startersFor(item?.cefr), [item]);
  const questionCount = log.length;
  const outOfQuestions = questionCount >= MAX_QUESTIONS && roundOver === null;

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      const found = results.filter((r) => r.found).length;
      onComplete({
        correct: found,
        total: items.length,
        missedIds: results.filter((r) => !r.found).map((r) => r.item.id),
      });
    }
  }, [completed, results, items.length, onComplete]);

  const emit = React.useCallback(
    (type: string, it?: GameItem, extra?: { choice?: string; correct?: boolean }) => {
      if (!onEvent) return;
      onEvent({ type, ...(it ? { itemId: it.id } : {}), ...(extra ?? {}) });
    },
    [onEvent],
  );

  const answer = React.useCallback(
    (kind: AnswerKind) => {
      if (!item || roundOver !== null || questionCount >= MAX_QUESTIONS) return;
      setLog((l) => [...l, { n: l.length + 1, kind }]);
      emit("answer", item, { choice: kind });
    },
    [item, roundOver, questionCount, emit],
  );

  const undoLast = React.useCallback(() => {
    setLog((l) => l.slice(0, -1));
    emit("undo-answer", item);
  }, [item, emit]);

  const endRound = React.useCallback(
    (found: boolean) => {
      if (!item || roundOver !== null) return;
      setRoundOver(found);
      setRevealed(true);
      setResults((rs) => [...rs, { item, found, questions: questionCount }]);
      emit("guess", item, { choice: item.answer, correct: found });
    },
    [item, roundOver, questionCount, emit],
  );

  const nextRound = React.useCallback(() => {
    if (roundOver === null) return;
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
      setLog([]);
      setRevealed(false);
      setRoundOver(null);
      emit("next");
    } else {
      setCompleted(true);
      emit("complete");
    }
  }, [roundOver, index, items.length, emit]);

  // teacherMode keys: 1 Yes, 2 No, 3 Sort of, G guess (win)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!teacherMode) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "1") answer("yes");
      else if (e.key === "2") answer("no");
      else if (e.key === "3") answer("sortof");
      else if (e.key === "g" || e.key === "G") {
        if (roundOver === null) endRound(true);
        else nextRound();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [teacherMode, answer, endRound, nextRound, roundOver]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setLog([]);
    setRevealed(false);
    setRoundOver(null);
    setResults([]);
    emit("restart");
  }, [emit]);

  if (!item) {
    return (
      <GameChrome title="Twenty Questions" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const found = results.filter((r) => r.found);
    const avg =
      found.length > 0
        ? Math.round((found.reduce((s, r) => s + r.questions, 0) / found.length) * 10) / 10
        : 0;
    return (
      <GameChrome title="Twenty Questions" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-xl space-y-5 p-6 text-center">
          <h2 className="font-display text-2xl font-bold">Session complete</h2>
          <p className="text-muted-foreground">
            {found.length} of {results.length} words found
            {found.length > 0 ? ` · average ${avg} questions` : ""}
          </p>
          <div className="space-y-2 text-left">
            {results.map((r) => (
              <div
                key={r.item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-4 py-2.5"
              >
                <span className="font-semibold">{r.item.answer}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm",
                    r.found ? "text-[var(--success)]" : "text-destructive",
                  )}
                >
                  {r.found ? <Check className="size-4" /> : <X className="size-4" />}
                  {r.found ? `${r.questions} questions` : "not found"}
                </span>
              </div>
            ))}
          </div>
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="size-4" /> Play again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  const kindIcon = (k: AnswerKind) =>
    k === "yes" ? (
      <Check className="size-4 text-[var(--success)]" />
    ) : k === "no" ? (
      <X className="size-4 text-destructive" />
    ) : (
      <Minus className="size-4 text-[var(--action)]" />
    );

  return (
    <GameChrome
      title="Twenty Questions"
      teacherMode={teacherMode}
      onAdvance={nextRound}
      onUndo={undoLast}
      progress={{ done: index, total: items.length }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Roles + secret */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {(
              [
                ["tutor", "Tutor holds"],
                ["student", "Student holds"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setHolder(value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  holder === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRevealed((r) => !r)}
            className="gap-1.5"
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {revealed ? "Hide word" : "Reveal word"}
          </Button>
        </div>

        {/* Category + secret */}
        <Card className="p-6 text-center">
          <Badge variant="secondary" className="mb-2">
            {item.prompt}
          </Badge>
          <p className="font-display text-2xl font-bold sm:text-3xl">
            {revealed ? item.answer : "? ? ?"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {holder === "tutor" ? "The student asks; you answer." : "You hold the word; the tutor guesses."}{" "}
            {questionCount}/{MAX_QUESTIONS} questions asked
          </p>
          {revealed && fallbackHints.length > 0 ? (
            <div className="mt-3 rounded-xl bg-muted/50 p-3 text-left text-sm">
              <p className="mb-1 font-semibold text-muted-foreground">
                Fallback facts if the guesser stalls:
              </p>
              <ul className="list-inside list-disc space-y-0.5">
                {fallbackHints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        {/* Question starters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Question starters:
          </span>
          {starters.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
          {item.exampleSentence ? (
            <span className="text-sm italic text-muted-foreground">e.g. “{item.exampleSentence}”</span>
          ) : null}
        </div>

        {/* Answer buttons */}
        {roundOver === null ? (
          <div className="flex justify-center gap-3">
            {(
              [
                ["yes", "Yes", "border-[var(--success)] text-[var(--success)] hover:bg-[var(--success)]/10"],
                ["no", "No", "border-destructive text-destructive hover:bg-destructive/10"],
                ["sortof", "Sort of", "border-[var(--action)] text-[var(--action)] hover:bg-[var(--action)]/10"],
              ] as const
            ).map(([kind, label, cls], i) => (
              <Button
                key={kind}
                variant="outline"
                size="lg"
                onClick={() => answer(kind)}
                disabled={questionCount >= MAX_QUESTIONS}
                className={cn("min-w-28 border-2", cls)}
              >
                {teacherMode ? <span className="mr-1.5 font-bold opacity-60">{i + 1}</span> : null}
                {label}
              </Button>
            ))}
          </div>
        ) : null}

        {outOfQuestions ? (
          <p className="text-center font-semibold text-destructive">
            Twenty questions used — time to guess!
          </p>
        ) : null}

        {/* Guess / round end */}
        {roundOver === null ? (
          <div className="flex justify-center gap-3">
            <Button onClick={() => endRound(true)} className="gap-2">
              <HelpCircle className="size-4" /> Guessed it!
            </Button>
            <Button variant="outline" onClick={() => endRound(false)}>
              Give up — reveal
            </Button>
          </div>
        ) : (
          <Card
            className={cn(
              "border-l-4 p-5 text-center",
              roundOver
                ? "border-l-[var(--success)] bg-[var(--success)]/10"
                : "border-l-destructive bg-destructive/10",
            )}
          >
            <p className="font-display text-xl font-bold">
              {roundOver
                ? `Found it — “${item.answer}” in ${questionCount} questions!`
                : `It was “${item.answer}”.`}
            </p>
            <Button size="lg" onClick={nextRound} className="mt-3 min-w-40">
              {index + 1 < items.length ? "Next word" : "Finish"}
            </Button>
          </Card>
        )}

        {/* Question log */}
        {log.length > 0 ? (
          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What we know so far
            </p>
            <ol className="flex flex-wrap gap-1.5">
              {log.map((e) => (
                <li
                  key={e.n}
                  className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-semibold"
                >
                  <span className="text-muted-foreground">Q{e.n}</span>
                  {kindIcon(e.kind)}
                  {e.kind === "yes" ? "Yes" : e.kind === "no" ? "No" : "Sort of"}
                </li>
              ))}
            </ol>
          </Card>
        ) : null}
      </div>
    </GameChrome>
  );
}
