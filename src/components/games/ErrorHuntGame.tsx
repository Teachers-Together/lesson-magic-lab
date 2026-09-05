import * as React from "react";
import { Check, X, ArrowRight, CircleCheck } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------- data mapping ----------
// prompt          = sentence containing exactly one error (or zero errors)
// answer          = the corrected sentence (identical to prompt = "no error" item)
// targetStructure = error type: article, tense, word order, preposition, agreement, plural

function words(s: string): string[] {
  return s.trim().split(/\s+/);
}

/** Indices that differ between the flawed and corrected sentence. */
function errorSpan(prompt: string, answer: string): { start: number; end: number } | null {
  const a = words(prompt);
  const b = words(answer);
  if (prompt.trim() === answer.trim()) return null; // no-error item
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }
  return { start, end: endA };
}

/** Indices in the corrected sentence that changed (for highlight). */
function fixSpan(prompt: string, answer: string): { start: number; end: number } | null {
  const a = words(prompt);
  const b = words(answer);
  if (prompt.trim() === answer.trim()) return null;
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }
  return { start, end: endB };
}

function errorType(item: GameItem): string {
  return item.targetStructure?.trim() || "other";
}

type ItemStage =
  | { kind: "pick"; wrongClicks: number }
  | { kind: "say-correction" }
  | { kind: "revealed"; missed: boolean };

export function ErrorHuntGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
  lang?: string;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [stage, setStage] = React.useState<ItemStage>({ kind: "pick", wrongClicks: 0 });
  const [shaking, setShaking] = React.useState<number | "noerror" | null>(null);
  const [picked, setPicked] = React.useState<number | "noerror" | null>(null);
  const [hadWrong, setHadWrong] = React.useState(false);
  const [results, setResults] = React.useState<{ item: GameItem; missed: boolean }[]>([]);
  const [done, setDone] = React.useState(false);

  const item = items[index];
  const span = item ? errorSpan(item.prompt, item.answer) : null;
  const isNoError = span === null;

  const finishItem = React.useCallback(
    (missed: boolean) => {
      if (!item) return;
      setResults((prev) => [...prev, { item, missed }]);
      onEvent?.({ type: missed ? "miss" : "correct", itemId: item.id });
    },
    [item, onEvent],
  );

  const next = React.useCallback(() => {
    if (index + 1 >= items.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setStage({ kind: "pick", wrongClicks: 0 });
    setPicked(null);
    setShaking(null);
    setHadWrong(false);
  }, [index, items.length]);

  const completedRef = React.useRef(false);
  React.useEffect(() => {
    if (!done || completedRef.current) return;
    completedRef.current = true;
    onComplete({
      correct: results.filter((r) => !r.missed).length,
      total: items.length,
      missedIds: results.filter((r) => r.missed).map((r) => r.item.id),
    });
  }, [done, results, items.length, onComplete]);

  const pickWord = (wi: number) => {
    if (!item || stage.kind !== "pick") return;
    const hit = span !== null && wi >= span.start && wi <= span.end;
    if (hit) {
      setPicked(wi);
      setStage({ kind: "say-correction" });
      onEvent?.({ type: "found_error", itemId: item.id });
    } else {
      setShaking(wi);
      window.setTimeout(() => setShaking(null), 500);
      setHadWrong(true);
      setStage({ kind: "pick", wrongClicks: 1 });
      onEvent?.({ type: "wrong_pick", itemId: item.id });
    }
  };

  const pickNoError = () => {
    if (!item || stage.kind !== "pick") return;
    if (isNoError) {
      setPicked("noerror");
      setStage({ kind: "say-correction" });
      onEvent?.({ type: "found_error", itemId: item.id });
    } else {
      setShaking("noerror");
      window.setTimeout(() => setShaking(null), 500);
      setHadWrong(true);
      setStage({ kind: "pick", wrongClicks: 1 });
      onEvent?.({ type: "wrong_pick", itemId: item.id });
    }
  };

  const confirmCorrection = () => {
    if (stage.kind !== "say-correction") return;
    setStage({ kind: "revealed", missed: hadWrong });
    finishItem(hadWrong);
  };

  // keyboard: 1-9 pick words, 0 = no error
  React.useEffect(() => {
    if (!teacherMode || !item || done) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (stage.kind !== "pick") return;
      if (e.key === "0") {
        pickNoError();
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= 9) {
        pickWord(n - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherMode, item, done, stage.kind, span]);

  const handleAdvance = React.useCallback(() => {
    if (stage.kind === "revealed") next();
  }, [stage.kind, next]);

  // ---------- end summary grouped by error type ----------
  if (done) {
    const byType = new Map<string, { missed: number; total: number }>();
    for (const r of results) {
      const t = errorType(r.item);
      const cur = byType.get(t) ?? { missed: 0, total: 0 };
      cur.total++;
      if (r.missed) cur.missed++;
      byType.set(t, cur);
    }
    const missedIds = results.filter((r) => r.missed).map((r) => r.item.id);
    return (
      <GameChrome title="Error Hunt — Results" teacherMode={teacherMode}>
        <Card className="w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold">What to teach next week</h2>
          <p className="mt-1 text-muted-foreground">
            {results.length - missedIds.length} of {results.length} sentences handled correctly.
            Misses grouped by error type:
          </p>
          <div className="mt-4 space-y-2">
            {[...byType.entries()].map(([type, s]) => (
              <div
                key={type}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span className="text-lg font-medium capitalize">{type}</span>
                <Badge
                  variant={s.missed === 0 ? "secondary" : "destructive"}
                  className={cn(s.missed === 0 && "bg-emerald-500/15 text-emerald-600")}
                >
                  {s.missed === 0
                    ? `solid — ${s.total}/${s.total}`
                    : `${s.missed} of ${s.total} missed`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </GameChrome>
    );
  }

  if (!item) return null;

  const promptWords = words(item.prompt);
  const answerWords = words(item.answer);
  const fixed = fixSpan(item.prompt, item.answer);
  const missedThisItem = stage.kind === "revealed" ? stage.missed : hadWrong;

  return (
    <GameChrome
      title="Error Hunt"
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={handleAdvance}
      progress={{ done: index, total: items.length }}
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        <p className="text-lg text-muted-foreground">
          {stage.kind === "pick" &&
            "One word might be wrong. Student says which — you click it. (0 = no error)"}
          {stage.kind === "say-correction" &&
            "Good! Now the student says the corrected sentence out loud."}
          {stage.kind === "revealed" && "The corrected sentence:"}
        </p>

        {/* sentence */}
        <Card className="w-full p-6">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
            {(stage.kind === "revealed" ? answerWords : promptWords).map((w, wi) => {
              const isPicked = picked === wi && stage.kind !== "revealed";
              const isFixed =
                stage.kind === "revealed" && fixed !== null && wi >= fixed.start && wi <= fixed.end;
              const clickable = stage.kind === "pick";
              return (
                <button
                  key={wi}
                  type="button"
                  disabled={!clickable}
                  onClick={() => pickWord(wi)}
                  className={cn(
                    "relative rounded-lg px-2 py-1 text-2xl font-semibold transition sm:text-3xl",
                    clickable && "cursor-pointer hover:bg-accent",
                    isPicked && "bg-emerald-500/15 text-emerald-600 ring-2 ring-emerald-500",
                    isFixed && "bg-emerald-500/15 text-emerald-600 ring-2 ring-emerald-500",
                    shaking === wi && "animate-[shake-x_0.4s_ease-in-out] text-rose-500",
                  )}
                >
                  {teacherMode && clickable && wi < 9 && <NumberBadge n={wi + 1} />}
                  {w}
                </button>
              );
            })}
          </div>

          {/* no-error option */}
          <div className="mt-6 flex justify-center">
            <Button
              variant={picked === "noerror" ? "default" : "outline"}
              size="lg"
              disabled={stage.kind !== "pick"}
              onClick={pickNoError}
              className={cn(
                shaking === "noerror" && "animate-[shake-x_0.4s_ease-in-out] border-rose-500 text-rose-500",
                picked === "noerror" && "bg-emerald-500 text-white hover:bg-emerald-500",
              )}
            >
              {picked === "noerror" ? (
                <CircleCheck className="mr-2 h-5 w-5" />
              ) : null}
              No error (0)
            </Button>
          </div>
        </Card>

        {/* correction stage */}
        {stage.kind === "say-correction" && (
          <Button size="lg" className="text-lg" onClick={confirmCorrection}>
            <Check className="mr-2 h-5 w-5" />
            Correct — show the fix
          </Button>
        )}

        {stage.kind === "revealed" && (
          <div className="flex flex-col items-center gap-3">
            {missedThisItem ? (
              <Badge variant="destructive" className="gap-1">
                <X className="h-3 w-3" /> needed a hint first
              </Badge>
            ) : null}
            <Button size="lg" onClick={next}>
              {index + 1 >= items.length ? "See results" : "Next sentence"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </GameChrome>
  );
}

export default ErrorHuntGame;
