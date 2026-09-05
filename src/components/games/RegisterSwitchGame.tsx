import * as React from "react";
import { ArrowRight, Ear, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameChrome } from "./GameChrome";
import { speakSequence, cancelSpeech, primeVoices } from "@/lib/voice";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Direction = "casual-to-formal" | "formal-to-casual";

type Ladder = {
  /** Group key = shared prompt text. */
  key: string;
  /** Rungs in item order: Direct → Polite → Very formal (reversed if direction flips). */
  rungs: GameItem[];
};

const RUNG_LABELS_3 = ["Direct", "Polite", "Very formal"];

function buildLadders(items: GameItem[]): Ladder[] {
  const map = new Map<string, GameItem[]>();
  for (const it of items) {
    const key = (it.prompt ?? "").trim() || it.id;
    const list = map.get(key) ?? [];
    list.push(it);
    map.set(key, list);
  }
  return [...map.entries()].map(([key, rungs]) => ({ key, rungs }));
}

function rungLabel(i: number, total: number): string {
  if (total === 3) return RUNG_LABELS_3[i] ?? `Rung ${i + 1}`;
  if (total === 2) return i === 0 ? "Direct" : "Polite";
  return "Version";
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function RegisterSwitchGame(props: Props) {
  const { items, teacherMode, lang, onComplete, onEvent } = props;

  const [direction, setDirection] = React.useState<Direction>("casual-to-formal");
  const [index, setIndex] = React.useState(0);
  /** How many rungs of the current ladder are revealed (0 = none yet). */
  const [revealed, setRevealed] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const ladders = React.useMemo(() => buildLadders(items), [items]);
  const ladder = ladders[index];
  const reversed = direction === "formal-to-casual";
  const rungs = React.useMemo(() => {
    if (!ladder) return [];
    return reversed ? [...ladder.rungs].reverse() : ladder.rungs;
  }, [ladder, reversed]);

  const totalRungs = rungs.length;
  const isLadder = totalRungs > 1;
  const firstRung = rungs[0];

  React.useEffect(() => {
    primeVoices();
    return () => cancelSpeech();
  }, []);

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      const functions = new Set(items.map((i) => i.targetStructure).filter(Boolean));
      onComplete({ correct: functions.size, total: items.length, missedIds: [] });
    }
  }, [completed, items, onComplete]);

  const emit = React.useCallback(
    (type: string, it?: GameItem) => {
      if (!onEvent) return;
      if (it) onEvent({ type, itemId: it.id });
      else onEvent({ type });
    },
    [onEvent],
  );

  const advance = React.useCallback(() => {
    if (!ladder) return;
    if (revealed < totalRungs) {
      const next = revealed + 1;
      setRevealed(next);
      emit("reveal", rungs[next - 1]);
    } else if (index + 1 < ladders.length) {
      setIndex((i) => i + 1);
      setRevealed(0);
      emit("next");
    } else {
      setCompleted(true);
      emit("complete");
    }
  }, [ladder, revealed, totalRungs, rungs, index, ladders.length, emit]);

  const hideAgain = React.useCallback(() => {
    if (revealed > 0) {
      setRevealed((r) => r - 1);
      emit("hide");
    } else if (index > 0) {
      setIndex((i) => i - 1);
      const prev = ladders[index - 1];
      setRevealed(prev ? prev.rungs.length : 0);
      emit("back");
    }
  }, [revealed, index, ladders, emit]);

  const readAloud = React.useCallback(() => {
    if (revealed === 0) return;
    const current = rungs[revealed - 1];
    if (!current) return;
    speakSequence([current.answer], { lang: lang ?? "en-US" });
    emit("read", current);
  }, [revealed, rungs, lang, emit]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setRevealed(0);
    emit("restart");
  }, [emit]);

  if (!ladder) {
    return (
      <GameChrome title="Register Switch" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const functions = [...new Set(items.map((i) => i.targetStructure).filter(Boolean))];
    return (
      <GameChrome title="Register Switch" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-xl space-y-4 p-6 text-center">
          <h2 className="font-display text-2xl font-bold">Session complete</h2>
          <p className="text-muted-foreground">
            {ladders.length} {ladders.length === 1 ? "message" : "messages"} reworked ·{" "}
            {reversed ? "Formal → Casual" : "Casual → Formal"}
          </p>
          <div className="rounded-xl bg-muted/50 p-4 text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Functions practised
            </p>
            <div className="flex flex-wrap gap-2">
              {functions.length > 0 ? (
                functions.map((f) => (
                  <Badge key={f} variant="secondary">
                    {f}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No functions tagged.</span>
              )}
            </div>
          </div>
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="size-4" /> Run it again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  const sourceRegister = reversed ? "Formal" : "Casual";
  const targetRegister = reversed ? "Casual" : "Formal";

  return (
    <GameChrome
      title="Register Switch"
      {...(firstRung?.targetStructure ? { targetStructure: firstRung.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      onUndo={hideAgain}
      onReplayAudio={readAloud}
      progress={{ done: index, total: ladders.length }}
    >
      <div className="space-y-5">
        {/* Direction toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {(
              [
                ["casual-to-formal", "Casual → Formal"],
                ["formal-to-casual", "Formal → Casual"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setDirection(value);
                  setRevealed(0);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  direction === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Source sentence */}
        <Card className="p-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Badge variant={reversed ? "secondary" : "default"}>{sourceRegister}</Badge>
            <ArrowRight className="size-4 text-muted-foreground" />
            <Badge variant={reversed ? "default" : "secondary"}>{targetRegister}</Badge>
            {firstRung?.targetStructure ? (
              <Badge variant="outline" className="ml-2">
                {firstRung.targetStructure}
              </Badge>
            ) : null}
          </div>
          <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            {isLadder ? ladder.key : firstRung?.prompt}
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Ear className="size-4" /> Student says the {targetRegister.toLowerCase()} version —
            then reveal it.
          </p>
        </Card>

        {/* Revealed rungs */}
        <div className="space-y-3">
          {rungs.slice(0, revealed).map((rung, i) => {
            const isLatest = i === revealed - 1;
            return (
              <Card
                key={rung.id}
                className={cn(
                  "border-l-4 p-4 text-left transition-all",
                  isLatest ? "border-l-primary bg-primary/5" : "border-l-muted opacity-80",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {rungLabel(i, totalRungs)}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{rung.answer}</p>
                    {rung.exampleSentence ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Also fine: <span className="italic">{rung.exampleSentence}</span>
                      </p>
                    ) : null}
                    {isLatest && rung.hint ? (
                      <p className="mt-2 rounded-lg bg-muted/60 px-3 py-1.5 text-sm">
                        <span className="font-semibold">What changed?</span> {rung.hint}
                      </p>
                    ) : null}
                  </div>
                  {isLatest ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={readAloud}
                      aria-label="Read this version aloud"
                    >
                      <Volume2 className="size-5" />
                    </Button>
                  ) : null}
                </div>
              </Card>
            );
          })}

          {revealed === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {isLadder
                ? `This message has ${totalRungs} rungs — reveal them one at a time.`
                : "Waiting for the student's version…"}{" "}
              Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">Space</kbd>{" "}
              to reveal.
            </p>
          ) : null}
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={advance} size="lg" className="min-w-40">
            {revealed < totalRungs
              ? isLadder
                ? `Reveal ${rungLabel(revealed, totalRungs)}`
                : "Reveal"
              : index + 1 < ladders.length
                ? "Next message"
                : "Finish"}
          </Button>
          {revealed > 0 ? (
            <Button variant="outline" size="lg" onClick={hideAgain}>
              Hide again
            </Button>
          ) : null}
        </div>
      </div>
    </GameChrome>
  );
}
