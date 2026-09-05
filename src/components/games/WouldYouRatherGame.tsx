import * as React from "react";
import { ArrowLeftRight, Check, MessagesSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameChrome, NumberBadge } from "./GameChrome";
import { speakSequence, cancelSpeech, primeVoices } from "@/lib/voice";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

/** Advisory discussion time per card (seconds). Never a cut-off. */
const SUGGESTED_SECONDS = 120;

const LANGUAGE_STRIPS: Record<string, string[]> = {
  "pre-A1": ["I'd rather…", "I like…"],
  A1: ["I'd rather…", "I prefer… because…"],
  A2: ["I'd rather… because…", "I prefer… to…"],
  B1: ["On the one hand…", "I'd say…", "It depends, but…"],
  B2: ["Having said that…", "That depends on…", "I'm inclined to…"],
  C1: ["All things considered…", "I'm torn between…", "On balance…"],
};

function stripFor(cefr?: string): string[] {
  return LANGUAGE_STRIPS[cefr ?? "B1"] ?? LANGUAGE_STRIPS["B1"]!;
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function WouldYouRatherGame(props: Props) {
  const { items, teacherMode, lang, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  /** "A" = prompt, "B" = answer. */
  const [picked, setPicked] = React.useState<"A" | "B" | null>(null);
  /** Tutor has swapped sides: now argues the OTHER option. */
  const [swapped, setSwapped] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [covered, setCovered] = React.useState<GameItem[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const item = items[index];
  const strip = React.useMemo(() => stripFor(item?.cefr), [item]);

  React.useEffect(() => {
    primeVoices();
    return () => cancelSpeech();
  }, []);

  React.useEffect(() => {
    if (completed && !completedRef.current) {
      completedRef.current = true;
      onComplete({ correct: covered.length, total: items.length, missedIds: [] });
    }
  }, [completed, covered.length, items.length, onComplete]);

  // Advisory timer — runs once a side is picked, purely informational.
  React.useEffect(() => {
    if (!picked || completed) return;
    setElapsed(0);
    const t = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [picked, index, completed]);

  const emit = React.useCallback(
    (type: string, choice?: string) => {
      const base: { type: string; itemId?: string; choice?: string } = { type };
      if (item) base.itemId = item.id;
      if (choice !== undefined) base.choice = choice;
      onEvent?.(base);
    },
    [item, onEvent],
  );

  const choose = React.useCallback(
    (side: "A" | "B") => {
      if (picked || !item) return;
      setPicked(side);
      setCovered((prev) => (prev.some((c) => c.id === item.id) ? prev : [...prev, item]));
      emit("pick", side === "A" ? item.prompt : item.answer);
    },
    [picked, item, emit],
  );

  const advance = React.useCallback(() => {
    if (completed) return;
    if (!picked) return; // nothing to advance past yet
    if (index + 1 >= items.length) {
      cancelSpeech();
      setCompleted(true);
    } else {
      cancelSpeech();
      setIndex((i) => i + 1);
      setPicked(null);
      setSwapped(false);
      setElapsed(0);
    }
  }, [completed, picked, index, items.length]);

  const readAloud = React.useCallback(() => {
    if (!item) return;
    const lines = [`Would you rather… ${item.prompt}?`, `Or… ${item.answer}?`];
    if (picked && item.exampleSentence) lines.push(item.exampleSentence);
    void speakSequence(lines, lang ? { lang } : undefined);
  }, [item, picked, lang]);

  // Number keys choose side 1/2 (teacherMode); plain typing also works.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (completed || !item) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "1") {
        e.preventDefault();
        choose("A");
      } else if (e.key === "2") {
        e.preventDefault();
        choose("B");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, completed, item]);

  const reset = () => {
    completedRef.current = false;
    cancelSpeech();
    setCompleted(false);
    setIndex(0);
    setPicked(null);
    setSwapped(false);
    setElapsed(0);
    setCovered([]);
  };

  if (!item) {
    return (
      <GameChrome title="Would You Rather" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No cards to play.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const structures = Array.from(
      new Set(covered.map((c) => c.targetStructure).filter((s): s is string => Boolean(s))),
    );
    return (
      <GameChrome
        title="Would You Rather — Summary"
        teacherMode={teacherMode}
        progress={{ done: items.length, total: items.length }}
      >
        <div className="mx-auto w-full max-w-3xl">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">Discussion complete</h2>
            <p className="mt-2 text-muted-foreground">
              {covered.length} of {items.length} cards covered.
            </p>

            <div className="mt-6 text-left">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Prompts covered
              </p>
              <ul className="space-y-2">
                {covered.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-sm font-medium">
                      {c.prompt} <span className="text-muted-foreground">or</span> {c.answer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {structures.length > 0 && (
              <div className="mt-6 text-left">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Structures practised
                </p>
                <div className="flex flex-wrap gap-2">
                  {structures.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
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

  // Which side the student argues after a swap.
  const studentSide: "A" | "B" | null = picked
    ? swapped
      ? picked === "A"
        ? "B"
        : "A"
      : picked
    : null;
  const timerPct = Math.min(100, (elapsed / SUGGESTED_SECONDS) * 100);

  const renderCard = (side: "A" | "B", text: string) => {
    const isPicked = picked === side;
    const isStudentArguing = studentSide === side;
    return (
      <button
        type="button"
        disabled={picked !== null}
        onClick={() => choose(side)}
        className={cn(
          "relative flex min-h-40 flex-col items-center justify-center rounded-3xl border-2 p-6 text-center shadow-soft transition sm:min-h-56",
          "select-none",
          isPicked
            ? "border-primary bg-primary/10"
            : picked
              ? "border-border bg-muted/40 opacity-50"
              : "border-border bg-card hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5",
          "disabled:cursor-default disabled:hover:translate-y-0",
        )}
        aria-label={`Option ${side === "A" ? 1 : 2}: ${text}`}
      >
        {teacherMode && (
          <span className="absolute left-3 top-3">
            <NumberBadge n={side === "A" ? 1 : 2} className="size-8 text-base" />
          </span>
        )}
        <span
          className={cn(
            "font-display text-2xl font-extrabold leading-snug sm:text-3xl",
            isPicked ? "text-primary" : "text-foreground",
          )}
        >
          {text}
        </span>
        {isStudentArguing && picked && (
          <Badge className="mt-3" variant={swapped ? "default" : "secondary"}>
            {swapped ? "Now argue this side!" : "Student's side"}
          </Badge>
        )}
        {isPicked && <Check className="absolute right-4 top-4 size-7 text-primary" />}
      </button>
    );
  };

  return (
    <GameChrome
      title="Would You Rather"
      teacherMode={teacherMode}
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      progress={{ done: index, total: items.length }}
      onAdvance={advance}
      onReplayAudio={readAloud}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5">
        {/* Language to use strip */}
        <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Language to use
          </span>
          {strip.map((phrase) => (
            <Badge key={phrase} variant="secondary" className="text-sm">
              {phrase}
            </Badge>
          ))}
          {item.cefr && <Badge variant="outline">{item.cefr}</Badge>}
        </div>

        {/* Prompt line */}
        <p className="font-display text-xl font-semibold text-muted-foreground">
          Would you rather…
        </p>

        {/* The two options */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {renderCard("A", item.prompt)}
          {renderCard("B", item.answer)}
        </div>

        {picked && (
          <>
            {/* Follow-up question + advisory timer */}
            <Card className="w-full p-5">
              <div className="flex items-start gap-3">
                <MessagesSquare className="mt-1 size-6 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Follow-up
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {item.exampleSentence ?? "Why did you choose that?"}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                  {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-linear",
                    timerPct < 100 ? "bg-primary" : "bg-success",
                  )}
                  style={{ width: `${timerPct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                About {Math.round(SUGGESTED_SECONDS / 60)} minutes is plenty — keep talking as long
                as it's flowing.
              </p>
            </Card>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant={swapped ? "default" : "outline"}
                onClick={() => setSwapped((s) => !s)}
                className="gap-2"
              >
                <ArrowLeftRight className="size-4" />
                {swapped ? "Swap back" : "Swap sides — tutor argues the other side"}
              </Button>
              <p className="text-sm font-medium text-muted-foreground">
                Press Space for the next card
              </p>
            </div>
          </>
        )}
      </div>
    </GameChrome>
  );
}
