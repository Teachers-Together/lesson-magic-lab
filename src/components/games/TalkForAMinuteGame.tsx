import * as React from "react";
import { Ban, Check, Mic, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

const SPEAK_SECONDS = 60;

type Phase = "ready" | "prep" | "speak" | "followup";

type TopicResult = {
  item: GameItem;
  wordsUsed: string[];
  forbiddenSlips: string[];
  secondsSpoken: number;
};

function bulletsOf(item: GameItem): string[] {
  return (item.exampleSentence ?? "")
    .split("|")
    .map((b) => b.trim())
    .filter(Boolean);
}

function forbiddenOf(item: GameItem): string[] {
  return (item.hint ?? "")
    .split(",")
    .map((w) => w.trim())
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

export default function TalkForAMinuteGame(props: Props) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("ready");
  const [prepSeconds, setPrepSeconds] = React.useState<30 | 60>(30);
  const [elapsed, setElapsed] = React.useState(0);
  /** Speak seconds accumulated for THIS topic (stops when leaving speak). */
  const speakElapsedRef = React.useRef(0);
  const [used, setUsed] = React.useState<string[]>([]);
  const [slipped, setSlipped] = React.useState<string[]>([]);
  const [followUp, setFollowUp] = React.useState("");
  const [results, setResults] = React.useState<TopicResult[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const item = items[index];
  const bullets = React.useMemo(() => (item ? bulletsOf(item) : []), [item]);
  const targets = React.useMemo(() => (item?.distractors ?? []).slice(0, 4), [item]);
  const forbidden = React.useMemo(() => (item ? forbiddenOf(item) : []), [item]);

  // Advisory ticker: runs in prep and speak; never blocks anything.
  React.useEffect(() => {
    if (phase !== "prep" && phase !== "speak") return;
    setElapsed(0);
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  React.useEffect(() => {
    if (phase === "speak") speakElapsedRef.current = elapsed;
  }, [phase, elapsed]);

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      const allUsed = new Set(results.flatMap((r) => r.wordsUsed));
      onComplete({ correct: allUsed.size, total: items.length, missedIds: [] });
    }
  }, [completed, results, items.length, onComplete]);

  const emit = React.useCallback(
    (type: string, it?: GameItem, extra?: { choice?: string }) => {
      if (!onEvent) return;
      onEvent({ type, ...(it ? { itemId: it.id } : {}), ...(extra ?? {}) });
    },
    [onEvent],
  );

  const toggleWord = React.useCallback(
    (word: string) => {
      setUsed((u) => {
        const next = u.includes(word) ? u.filter((w) => w !== word) : [...u, word];
        return next;
      });
      if (item) emit("target-word", item, { choice: word });
    },
    [item, emit],
  );

  const slipWord = React.useCallback(
    (word: string) => {
      setSlipped((s) => (s.includes(word) ? s : [...s, word]));
      if (item) emit("forbidden-slip", item, { choice: word });
    },
    [item, emit],
  );

  const untickLast = React.useCallback(() => {
    setUsed((u) => u.slice(0, -1));
    emit("untick", item);
  }, [item, emit]);

  const finishTopic = React.useCallback(() => {
    if (!item) return;
    setResults((rs) => [
      ...rs,
      { item, wordsUsed: used, forbiddenSlips: slipped, secondsSpoken: speakElapsedRef.current },
    ]);
    emit("topic-done", item, followUp.trim() ? { choice: followUp.trim() } : undefined);
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
      setPhase("ready");
      setUsed([]);
      setSlipped([]);
      setFollowUp("");
      setElapsed(0);
      speakElapsedRef.current = 0;
    } else {
      setCompleted(true);
      emit("complete", item);
    }
  }, [item, used, slipped, followUp, index, items.length, emit]);

  const advance = React.useCallback(() => {
    if (!item) return;
    switch (phase) {
      case "ready":
        setPhase("prep");
        emit("prep-start", item);
        break;
      case "prep":
        setPhase("speak");
        emit("speak-start", item);
        break;
      case "speak":
        setPhase("followup");
        emit("speak-stop", item, { choice: `${speakElapsedRef.current}s` });
        break;
      case "followup":
        finishTopic();
        break;
    }
  }, [phase, item, finishTopic, emit]);

  // Number keys tick target words (1–4) during any phase.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const n = Number.parseInt(e.key, 10);
      if (n >= 1 && n <= targets.length) {
        const word = targets[n - 1];
        if (word) toggleWord(word);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [targets, toggleWord]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setPhase("ready");
    setUsed([]);
    setSlipped([]);
    setFollowUp("");
    setElapsed(0);
    speakElapsedRef.current = 0;
    setResults([]);
    emit("restart");
  }, [emit]);

  if (!item) {
    return (
      <GameChrome title="Talk for a Minute" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    return (
      <GameChrome title="Talk for a Minute" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-2xl space-y-5 p-6">
          <h2 className="text-center font-display text-2xl font-bold">Session complete</h2>
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.item.id} className="rounded-xl bg-muted/50 p-4 text-left">
                <p className="font-semibold">{r.item.prompt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1 text-[var(--success)]">
                    <Check className="size-4" />
                    {r.wordsUsed.length > 0 ? r.wordsUsed.join(", ") : "no target words used"}
                  </span>
                  {r.forbiddenSlips.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-destructive">
                      <Ban className="size-4" /> slipped: {r.forbiddenSlips.join(", ")}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Timer className="size-4" /> {r.secondsSpoken}s spoken
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" /> Run it again
            </Button>
          </div>
        </Card>
      </GameChrome>
    );
  }

  const phaseLimit = phase === "prep" ? prepSeconds : SPEAK_SECONDS;
  const overTime = elapsed >= phaseLimit;
  const barPct = Math.min(100, (elapsed / phaseLimit) * 100);

  return (
    <GameChrome
      title="Talk for a Minute"
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      onUndo={untickLast}
      progress={{ done: index, total: items.length }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Topic card */}
        <Card className="p-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Badge variant="secondary">{item.cefr ?? "B1"}</Badge>
            {item.targetStructure ? <Badge variant="outline">{item.targetStructure}</Badge> : null}
          </div>
          <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">{item.prompt}</p>
          {bullets.length > 0 ? (
            <ul className="mx-auto mt-4 max-w-md space-y-1 text-left text-muted-foreground">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        {/* Phase control */}
        {phase === "ready" ? (
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
              {([30, 60] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPrepSeconds(s)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    prepSeconds === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}s prep
                </button>
              ))}
            </div>
            <div>
              <Button size="lg" onClick={advance} className="min-w-44">
                Start prep
              </Button>
            </div>
          </div>
        ) : phase === "prep" || phase === "speak" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 uppercase tracking-wide",
                  phase === "speak" ? "text-primary" : "text-muted-foreground",
                )}
              >
                {phase === "speak" ? <Mic className="size-4" /> : <Timer className="size-4" />}
                {phase === "speak" ? "Speak" : "Prep"}
              </span>
              <span
                className={cn(
                  "tabular-nums",
                  overTime ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {elapsed}s / {phaseLimit}s{overTime ? " — over time (advisory only)" : ""}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-linear",
                  overTime ? "bg-destructive" : phase === "speak" ? "bg-primary" : "bg-secondary",
                )}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <div className="text-center">
              <Button size="lg" onClick={advance} className="min-w-44">
                {phase === "prep" ? "Start speaking" : "Stop / follow-up"}
              </Button>
            </div>
          </div>
        ) : (
          /* followup */
          <Card className="space-y-3 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Follow-up question (tutor)
            </p>
            <Textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Ask one rounding-off question, e.g. “Would you recommend it to a friend?”"
              rows={2}
            />
            <div className="text-center">
              <Button size="lg" onClick={advance} className="min-w-44">
                {index + 1 < items.length ? "Next topic" : "Finish"}
              </Button>
            </div>
          </Card>
        )}

        {/* Target vocabulary checklist */}
        {targets.length > 0 ? (
          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Try to use — tutor ticks as heard
            </p>
            <div className="flex flex-wrap gap-2">
              {targets.map((w, i) => {
                const isUsed = used.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleWord(w)}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      isUsed
                        ? "border-[var(--success)] bg-[var(--success)]/15 text-[var(--success)]"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    {isUsed ? <Check className="size-4" /> : null}
                    {w}
                    {teacherMode && !isUsed ? (
                      <NumberBadge n={i + 1} className="size-6 text-xs" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Card>
        ) : null}

        {/* Forbidden words */}
        {forbidden.length > 0 ? (
          <Card className="border-destructive/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-destructive">
              Taboo — may NOT be said
            </p>
            <div className="flex flex-wrap gap-2">
              {forbidden.map((w) => {
                const did = slipped.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => slipWord(w)}
                    disabled={did}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      did
                        ? "border-destructive bg-destructive/15 text-destructive line-through"
                        : "border-destructive/40 bg-card text-destructive hover:bg-destructive/10",
                    )}
                  >
                    <Ban className="size-4" />
                    {w}
                    {did ? " — slipped" : ""}
                  </button>
                );
              })}
            </div>
          </Card>
        ) : null}
      </div>
    </GameChrome>
  );
}
