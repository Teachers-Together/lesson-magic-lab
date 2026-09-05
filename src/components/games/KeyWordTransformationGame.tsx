import * as React from "react";
import { Check, KeyRound, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GameChrome } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Result = { item: GameItem; attempt: string; correct: boolean };

/** Normalize for grading: lowercase, strip punctuation, collapse spaces. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"’‘“”()-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(s: string): number {
  const t = s.trim();
  return t === "" ? 0 : t.split(/\s+/).length;
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function KeyWordTransformationGame(props: Props) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [entry, setEntry] = React.useState("");
  /** null = not yet attempted; after check, holds correctness. */
  const [checked, setChecked] = React.useState<boolean | null>(null);
  const [results, setResults] = React.useState<Result[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const item = items[index];
  const words = wordCount(entry);
  const lengthWarning = words > 0 && (words < 2 || words > 5);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [index, checked]);

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      const correct = results.filter((r) => r.correct).length;
      onComplete({
        correct,
        total: items.length,
        missedIds: results.filter((r) => !r.correct).map((r) => r.item.id),
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

  const check = React.useCallback(() => {
    if (!item || checked !== null || entry.trim() === "") return;
    const attempt = normalize(entry);
    const accepted = [item.answer, ...(item.distractors ?? [])].map(normalize);
    const correct = accepted.includes(attempt);
    setChecked(correct);
    setResults((rs) => [...rs, { item, attempt: entry.trim(), correct }]);
    emit("check", item, { choice: entry.trim(), correct });
  }, [item, checked, entry, emit]);

  const advance = React.useCallback(() => {
    if (!item) return;
    if (checked === null) {
      // Space before an attempt does nothing meaningful; require an attempt first.
      if (entry.trim() !== "") check();
      return;
    }
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
      setEntry("");
      setChecked(null);
      emit("next", item);
    } else {
      setCompleted(true);
      emit("complete", item);
    }
  }, [item, checked, entry, check, index, items.length, emit]);

  const clearEntry = React.useCallback(() => {
    if (checked === null) {
      setEntry("");
      inputRef.current?.focus();
      emit("clear", item);
    }
  }, [checked, item, emit]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setEntry("");
    setChecked(null);
    setResults([]);
    emit("restart");
  }, [emit]);

  if (!item) {
    return (
      <GameChrome title="Key Word Transformation" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const missed = results.filter((r) => !r.correct);
    const byPoint = new Map<string, Result[]>();
    for (const r of missed) {
      const key = r.item.hint ?? "Other";
      byPoint.set(key, [...(byPoint.get(key) ?? []), r]);
    }
    const correct = results.length - missed.length;
    return (
      <GameChrome title="Key Word Transformation" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-2xl space-y-5 p-6">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold">Session complete</h2>
            <p className="mt-1 text-muted-foreground">
              {correct} of {results.length} correct
            </p>
          </div>
          {missed.length > 0 ? (
            <div className="space-y-4 text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Missed, grouped by grammar point
              </p>
              {[...byPoint.entries()].map(([point, rs]) => (
                <div key={point} className="rounded-xl bg-muted/50 p-4">
                  <Badge variant="secondary" className="mb-2">
                    {point}
                  </Badge>
                  <ul className="space-y-2 text-sm">
                    {rs.map((r) => (
                      <li key={r.item.id}>
                        <p className="text-muted-foreground line-through decoration-destructive/60">
                          {r.attempt}
                        </p>
                        <p className="font-medium text-foreground">
                          {r.item.exampleSentence
                            ? r.item.exampleSentence.replace("______", r.item.answer)
                            : r.item.answer}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nothing missed — clean sweep.</p>
          )}
          <div className="text-center">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" /> Run it again
            </Button>
          </div>
        </Card>
      </GameChrome>
    );
  }

  const keyWord = (item.audioText ?? "").toUpperCase();
  const fullSentence = item.exampleSentence
    ? item.exampleSentence.replace("______", item.answer)
    : item.answer;

  return (
    <GameChrome
      title="Key Word Transformation"
      {...(item.hint ? { targetStructure: item.hint } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      onUndo={clearEntry}
      progress={{ done: index, total: items.length }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Original sentence */}
        <Card className="p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Original
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">
            {item.prompt}
          </p>
        </Card>

        {/* Key word */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-display text-2xl font-extrabold tracking-widest text-primary-foreground shadow">
            <KeyRound className="size-5" />
            {keyWord || "KEY WORD"}
          </span>
        </div>

        {/* Gapped target */}
        <Card className="p-5 text-center">
          <p className="text-lg leading-relaxed sm:text-xl">
            {(item.exampleSentence ?? "______").split("______").map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 ? (
                  <span
                    className={cn(
                      "mx-1 inline-block min-w-32 rounded border-b-4 px-2 align-baseline font-semibold",
                      checked === null
                        ? "border-primary text-foreground"
                        : checked
                          ? "border-[var(--success)] text-[var(--success)]"
                          : "border-destructive text-destructive",
                    )}
                  >
                    {entry.trim() || " "}
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </p>
        </Card>

        {/* Input */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (checked === null) check();
                  else advance();
                }
              }}
              disabled={checked !== null}
              placeholder="Complete the gap with 2–5 words, using the key word…"
              className="h-12 text-lg"
              aria-label="Your answer"
            />
            {checked === null ? (
              <Button size="lg" onClick={check} disabled={entry.trim() === ""}>
                Check
              </Button>
            ) : (
              <Button size="lg" onClick={advance}>
                {index + 1 < items.length ? "Next" : "Finish"}
              </Button>
            )}
          </div>
          <p
            className={cn(
              "text-right text-sm tabular-nums",
              lengthWarning ? "font-semibold text-destructive" : "text-muted-foreground",
            )}
          >
            {words} {words === 1 ? "word" : "words"}
            {lengthWarning ? " — use between 2 and 5 words" : ""}
          </p>
        </div>

        {/* Feedback */}
        {checked !== null ? (
          <Card
            className={cn(
              "border-l-4 p-5",
              checked
                ? "border-l-[var(--success)] bg-[var(--success)]/10"
                : "border-l-destructive bg-destructive/10",
            )}
          >
            <div className="flex items-start gap-3">
              {checked ? (
                <Check className="mt-0.5 size-5 shrink-0 text-[var(--success)]" />
              ) : (
                <X className="mt-0.5 size-5 shrink-0 text-destructive" />
              )}
              <div className="space-y-1.5">
                {checked ? (
                  <p className="text-lg font-semibold">{fullSentence}</p>
                ) : (
                  <>
                    {item.hint ? (
                      <p className="font-semibold">
                        Grammar point: <span className="text-primary">{item.hint}</span>
                      </p>
                    ) : null}
                    <p className="text-lg">
                      <span className="font-semibold">Model answer:</span> {fullSentence}
                    </p>
                    {item.distractors && item.distractors.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Also accepted: {item.distractors.join(" · ")}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Type the missing words — or the student says them and the tutor types.{" "}
            {teacherMode ? (
              <>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">Enter</kbd>{" "}
                checks.
              </>
            ) : null}
          </p>
        )}
      </div>
    </GameChrome>
  );
}
