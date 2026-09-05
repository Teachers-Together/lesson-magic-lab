import * as React from "react";
import { Check, Lightbulb, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GameChrome } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Result = { item: GameItem; attempts: number; correct: boolean };

/** Normalize for grading: lowercase, collapse spaces, trim. */
function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function WordFormationGame(props: Props) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [entry, setEntry] = React.useState("");
  const [stage, setStage] = React.useState<"input" | "hint" | "revealed" | "correct">("input");
  const [attempts, setAttempts] = React.useState(0);
  const [results, setResults] = React.useState<Result[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const item = items[index];

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [index, stage]);

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
      const payload: { type: string; itemId?: string; choice?: string; correct?: boolean } = {
        type,
      };
      if (it) payload.itemId = it.id;
      if (extra?.choice !== undefined) payload.choice = extra.choice;
      if (extra?.correct !== undefined) payload.correct = extra.correct;
      onEvent(payload);
    },
    [onEvent],
  );

  const accepted = React.useMemo(() => {
    if (!item) return [];
    return [item.answer, ...(item.distractors ?? [])].map(normalize);
  }, [item]);

  const check = React.useCallback(() => {
    if (!item || stage === "correct" || stage === "revealed" || entry.trim() === "") return;
    const attempt = normalize(entry);
    const correct = accepted.includes(attempt);
    if (correct) {
      setStage("correct");
      setResults((rs) => [...rs, { item, attempts: attempts + 1, correct: true }]);
      emit("check", item, { choice: entry.trim(), correct: true });
    } else {
      if (attempts === 0) {
        setStage("hint");
        setAttempts(1);
        setEntry("");
        emit("check", item, { choice: entry.trim(), correct: false });
      } else {
        setStage("revealed");
        setResults((rs) => [...rs, { item, attempts: attempts + 1, correct: false }]);
        emit("check", item, { choice: entry.trim(), correct: false });
      }
    }
  }, [item, stage, entry, accepted, attempts, emit]);

  const advance = React.useCallback(() => {
    if (!item) return;
    if (stage !== "correct" && stage !== "revealed") return;
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
      setEntry("");
      setStage("input");
      setAttempts(0);
      emit("next", item);
    } else {
      setCompleted(true);
      emit("complete", item);
    }
  }, [item, stage, index, items.length, emit]);

  const clearEntry = React.useCallback(() => {
    if (stage === "input" || stage === "hint") {
      setEntry("");
      inputRef.current?.focus();
      emit("clear", item);
    }
  }, [stage, item, emit]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setEntry("");
    setStage("input");
    setAttempts(0);
    setResults([]);
    emit("restart");
  }, [emit]);

  if (!item) {
    return (
      <GameChrome title="Word Formation" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const missed = results.filter((r) => !r.correct);
    const byFamily = new Map<string, Result[]>();
    for (const r of missed) {
      const key = r.item.targetStructure ?? "Other";
      byFamily.set(key, [...(byFamily.get(key) ?? []), r]);
    }
    const correct = results.length - missed.length;
    return (
      <GameChrome title="Word Formation" teacherMode={teacherMode}>
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
                Missed, grouped by family
              </p>
              {[...byFamily.entries()].map(([family, rs]) => (
                <div key={family} className="rounded-xl bg-muted/50 p-4">
                  <Badge variant="secondary" className="mb-2">
                    {family}
                  </Badge>
                  <ul className="space-y-3 text-sm">
                    {rs.map((r) => (
                      <li key={r.item.id}>
                        <p className="text-muted-foreground">
                          {r.attempts} {r.attempts === 1 ? "attempt" : "attempts"}
                        </p>
                        <p className="font-medium text-foreground">
                          {r.item.prompt.replace(/_{2,}/, r.item.answer)}
                        </p>
                        {r.item.hint ? (
                          <p className="text-xs text-muted-foreground">{r.item.hint}</p>
                        ) : null}
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

  const root = (item.audioText ?? "").toUpperCase() || "ROOT";
  const resolved = stage === "correct" || stage === "revealed";
  const fullSentence = item.prompt.replace(/_{2,}/, item.answer);

  const familyForms = React.useMemo(() => {
    if (!item) return [];
    const forms = [root, item.answer, ...(item.distractors ?? [])];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const f of forms) {
      const key = normalize(f);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(f);
      if (out.length >= 5) break;
    }
    return out;
  }, [item, root]);

  return (
    <GameChrome
      title="Word Formation"
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      onUndo={clearEntry}
      progress={{ done: index, total: items.length }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <Card className="p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Complete the sentence
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">
            {item.prompt.split(/_{2,}/).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 ? (
                  <span
                    className={cn(
                      "mx-1 inline-block min-w-24 rounded border-b-4 px-2 align-baseline font-semibold",
                      resolved
                        ? stage === "correct"
                          ? "border-[var(--success)] text-[var(--success)]"
                          : "border-destructive text-destructive"
                        : "border-primary text-foreground",
                    )}
                  >
                    {resolved ? item.answer : entry.trim() || "\u00A0"}
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </p>
        </Card>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-display text-2xl font-extrabold tracking-widest text-primary-foreground shadow">
            {root}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!resolved) check();
                  else advance();
                }
              }}
              disabled={resolved}
              placeholder="Type the correct form of the root word…"
              className="h-12 text-lg"
              aria-label="Your answer"
            />
            {!resolved ? (
              <Button size="lg" onClick={check} disabled={entry.trim() === ""}>
                Check
              </Button>
            ) : (
              <Button size="lg" onClick={advance}>
                {index + 1 < items.length ? "Next" : "Finish"}
              </Button>
            )}
          </div>
        </div>

        {stage === "hint" ? (
          <Card className="border-l-4 border-l-amber-500 bg-amber-500/10 p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <div className="space-y-1">
                <p className="text-lg font-semibold">Hint</p>
                <p className="text-foreground">{item.hint}</p>
                <p className="text-sm text-muted-foreground">You have one more try.</p>
              </div>
            </div>
          </Card>
        ) : stage === "revealed" ? (
          <Card className="border-l-4 border-l-destructive bg-destructive/10 p-5">
            <div className="flex items-start gap-3">
              <X className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="space-y-1">
                {item.hint ? (
                  <p className="font-semibold">
                    Change: <span className="text-primary">{item.hint}</span>
                  </p>
                ) : null}
                <p className="text-lg">
                  <span className="font-semibold">Model answer:</span> {fullSentence}
                </p>
              </div>
            </div>
          </Card>
        ) : stage === "correct" ? (
          <Card className="border-l-4 border-l-[var(--success)] bg-[var(--success)]/10 p-5">
            <div className="flex items-start gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-[var(--success)]" />
              <p className="text-lg font-semibold">{fullSentence}</p>
            </div>
          </Card>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Type the missing form of the root word.
          </p>
        )}

        {resolved ? (
          <Card className="p-5">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Family
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {familyForms.map((form, i) => (
                <Badge
                  key={i}
                  variant={i === 0 ? "default" : "secondary"}
                  className="px-3 py-1 text-base"
                >
                  {form}
                </Badge>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </GameChrome>
  );
}
