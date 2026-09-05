import * as React from "react";
import { Check, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameChrome } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Phase = "playing" | "solved" | "failed";

const MAX_WRONG = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function lettersOf(answer: string): string[] {
  return answer.toUpperCase().split("");
}

function isSolved(answer: string, guessed: Set<string>): boolean {
  return lettersOf(answer).every((ch) => ch === " " || guessed.has(ch));
}

/** A flower that loses one petal per wrong guess. */
function Flower({ wrong }: { wrong: number }) {
  const petalsLeft = MAX_WRONG - wrong;
  return (
    <svg viewBox="0 0 120 140" className="h-36 w-32" aria-hidden>
      {/* stem */}
      <path
        d="M60 70 C 58 95, 62 115, 60 132"
        stroke="var(--success)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* leaf */}
      <path
        d="M60 108 C 45 100, 38 108, 34 118 C 46 120, 56 116, 60 108 Z"
        fill="var(--success)"
        opacity={petalsLeft > 0 ? 1 : 0.3}
      />
      {/* petals */}
      {Array.from({ length: MAX_WRONG }).map((_, i) => {
        const angle = (i / MAX_WRONG) * Math.PI * 2 - Math.PI / 2;
        const cx = 60 + Math.cos(angle) * 24;
        const cy = 52 + Math.sin(angle) * 24;
        const alive = i < petalsLeft;
        return (
          <ellipse
            key={i}
            cx={alive ? cx : cx + Math.cos(angle) * 14}
            cy={alive ? cy : cy + 40 + i * 4}
            rx="13"
            ry="19"
            transform={`rotate(${(angle * 180) / Math.PI + 90} ${alive ? cx : cx + Math.cos(angle) * 14} ${alive ? cy : cy + 40 + i * 4})`}
            fill={alive ? "var(--primary)" : "var(--muted)"}
            opacity={alive ? 0.9 : 0.25}
            style={{ transition: "all 500ms ease" }}
          />
        );
      })}
      {/* flower center */}
      <circle cx="60" cy="52" r="14" fill="var(--action)" />
      <circle cx="60" cy="52" r="14" fill="none" stroke="var(--background)" strokeWidth="2" />
    </svg>
  );
}

export default function HangmanGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
}: {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (result: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (event: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
}) {
  const [index, setIndex] = React.useState(0);
  const [guessed, setGuessed] = React.useState<Set<string>>(new Set());
  const [wrong, setWrong] = React.useState<string[]>([]);
  const [phase, setPhase] = React.useState<Phase>("playing");
  const [solvedCount, setSolvedCount] = React.useState(0);
  const [missedIds, setMissedIds] = React.useState<string[]>([]);
  const [usedLetters, setUsedLetters] = React.useState<string[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const item = items[index];
  const answer = item?.answer ?? "";

  const guess = React.useCallback(
    (raw: string) => {
      if (phase !== "playing" || completed) return;
      const letter = raw.toUpperCase();
      if (!/^[A-Z]$/.test(letter) || guessed.has(letter)) return;

      const nextGuessed = new Set(guessed);
      nextGuessed.add(letter);
      setGuessed(nextGuessed);
      setUsedLetters((prev) => [...prev, letter]);

      const hit = lettersOf(answer).includes(letter);
      const base = { type: "guess", choice: letter, correct: hit };
      onEvent?.(item ? { ...base, itemId: item.id } : base);

      if (hit) {
        if (isSolved(answer, nextGuessed)) {
          setPhase("solved");
          setSolvedCount((c) => c + 1);
          onEvent?.(item ? { type: "solved", itemId: item.id } : { type: "solved" });
        }
      } else {
        const nextWrong = [...wrong, letter];
        setWrong(nextWrong);
        if (nextWrong.length >= MAX_WRONG) {
          setPhase("failed");
          setMissedIds((prev) => [...prev, item?.id ?? ""]);
          onEvent?.(item ? { type: "failed", itemId: item.id } : { type: "failed" });
        }
      }
    },
    [phase, completed, guessed, answer, wrong, item, onEvent],
  );

  // Physical keyboard — student calls the letter, tutor (or student) presses it.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        guess(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [guess]);

  const finish = React.useCallback(
    (solved: number, missed: string[]) => {
      if (completedRef.current) return;
      completedRef.current = true;
      setCompleted(true);
      onComplete({ correct: solved, total: items.length, missedIds: missed });
    },
    [items.length, onComplete],
  );

  const advance = React.useCallback(() => {
    if (phase === "playing") return;
    if (index + 1 >= items.length) {
      finish(solvedCount, missedIds.filter(Boolean));
      return;
    }
    setIndex((i) => i + 1);
    setGuessed(new Set());
    setWrong([]);
    setPhase("playing");
  }, [phase, index, items.length, finish, solvedCount, missedIds]);

  const reset = () => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setGuessed(new Set());
    setWrong([]);
    setPhase("playing");
    setSolvedCount(0);
    setMissedIds([]);
    setUsedLetters([]);
  };

  if (!item) return null;

  if (completed) {
    const missed = items.filter((it) => missedIds.includes(it.id));
    return (
      <GameChrome title="Hangman" teacherMode={teacherMode}>
        <div className="animate-pop mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Round complete!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Solved {solvedCount} of {items.length} words.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Letters used</p>
            <div className="flex flex-wrap gap-1.5">
              {usedLetters.length ? (
                usedLetters.map((l, i) => (
                  <Badge key={`${l}-${i}`} variant="secondary" className="font-mono">
                    {l}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </div>

          {missed.length ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Words to revisit</p>
              <ul className="space-y-1.5">
                {missed.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm"
                  >
                    <span className="font-bold uppercase tracking-wider">{m.answer}</span>
                    <span className="text-muted-foreground">{m.prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-success/12 px-3 py-2 text-sm font-semibold text-success">
              Every word solved — fantastic!
            </p>
          )}

          <Button
            onClick={reset}
            className="mt-6 w-full bg-gradient-action text-action-foreground hover:opacity-90"
          >
            <RotateCcw className="size-4" /> Play again
          </Button>
        </div>
      </GameChrome>
    );
  }

  const cells = lettersOf(answer);

  return (
    <GameChrome
      title="Hangman"
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      progress={{ done: index, total: items.length }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        {/* Clue */}
        <div className="w-full rounded-3xl border border-border bg-card p-5 text-center shadow-lift">
          <p className="text-lg font-semibold sm:text-xl">{item.prompt}</p>
          {teacherMode && item.hint ? (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Lightbulb className="size-4 text-action" /> {item.hint}
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
          <Flower wrong={wrong.length} />

          <div className="flex min-w-0 flex-col items-center gap-4">
            {/* Blanks */}
            <div className="flex max-w-full flex-wrap items-end justify-center gap-2">
              {cells.map((ch, i) =>
                ch === " " ? (
                  <span key={i} className="w-5" aria-hidden />
                ) : (
                  <span
                    key={i}
                    className={cn(
                      "grid size-10 place-items-center rounded-xl border-b-4 font-display text-2xl font-extrabold uppercase transition-colors sm:size-12 sm:text-3xl",
                      guessed.has(ch) || phase === "failed"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-transparent",
                    )}
                    aria-label={guessed.has(ch) || phase === "failed" ? ch : "blank"}
                  >
                    {ch}
                  </span>
                ),
              )}
            </div>

            {/* Feedback / result */}
            {phase === "solved" ? (
              <div className="animate-pop w-full max-w-md rounded-2xl bg-success/12 p-4 text-center">
                <p className="flex items-center justify-center gap-2 font-bold text-success">
                  <Check className="size-5" /> Solved!
                </p>
                {item.exampleSentence ? (
                  <p className="mt-1.5 text-sm text-foreground">{item.exampleSentence}</p>
                ) : null}
                <Button onClick={advance} className="mt-3 bg-success text-white hover:opacity-90">
                  {index + 1 >= items.length ? "See results" : "Next word"}
                </Button>
              </div>
            ) : phase === "failed" ? (
              <div className="animate-pop w-full max-w-md rounded-2xl bg-destructive/10 p-4 text-center">
                <p className="font-bold text-destructive">
                  Out of petals! The word was{" "}
                  <span className="uppercase tracking-wider">{answer}</span>
                </p>
                {item.exampleSentence ? (
                  <p className="mt-1.5 text-sm text-foreground">{item.exampleSentence}</p>
                ) : null}
                <Button
                  onClick={advance}
                  className="mt-3 bg-gradient-action text-action-foreground hover:opacity-90"
                >
                  {index + 1 >= items.length ? "See results" : "Next word"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Wrong letters */}
        <div className="flex min-h-8 flex-wrap items-center justify-center gap-1.5">
          {wrong.length ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Not in the word:
              </span>
              {wrong.map((l) => (
                <span
                  key={l}
                  className="grid size-8 place-items-center rounded-lg bg-destructive/15 font-mono text-sm font-bold text-destructive line-through"
                >
                  {l}
                </span>
              ))}
            </>
          ) : null}
        </div>

        {/* On-screen keyboard */}
        <div className="flex max-w-xl flex-wrap justify-center gap-1.5">
          {ALPHABET.map((letter) => {
            const used = guessed.has(letter);
            const isWrong = wrong.includes(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={used || phase !== "playing"}
                onClick={() => guess(letter)}
                className={cn(
                  "grid size-9 place-items-center rounded-lg border font-mono text-sm font-bold shadow-sm transition-all sm:size-10 sm:text-base",
                  used && isWrong
                    ? "border-destructive/30 bg-destructive/15 text-destructive/60"
                    : used
                      ? "border-success/40 bg-success/15 text-success"
                      : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:bg-secondary",
                  phase !== "playing" && !used && "opacity-40",
                  "disabled:cursor-not-allowed disabled:hover:translate-y-0",
                )}
                aria-label={`Guess letter ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {teacherMode
            ? "Student says a letter — you press it. Space for the next word."
            : "Click a letter or type it on your keyboard."}
        </p>
      </div>
    </GameChrome>
  );
}
