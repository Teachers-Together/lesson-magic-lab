import * as React from "react";
import { ArrowRight, Lightbulb, Keyboard } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { speakSequence, cancelSpeech, primeVoices } from "@/lib/voice";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { AudioButton } from "@/components/games/AudioButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DictationGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
};

const RATES = [0.6, 0.8, 1.0] as const;

function normalize(word: string): string {
  return word.toLowerCase().replace(/[.,!?;:"'()\u2019\u2018\u201C\u201D-]+$/g, "").replace(/^[.,!?;:"'()\u2019\u2018\u201C\u201D-]+/g, "");
}

function targetOf(item: GameItem): string {
  return item.audioText ?? item.prompt;
}

function firstLetters(sentence: string): string {
  return sentence
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const stripped = w.replace(/[^A-Za-z'’-]/g, "");
      return stripped ? stripped[0] + " _".repeat(Math.max(0, Math.min(stripped.length - 1, 4))) : w;
    })
    .join("  ");
}

export function DictationGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
}: DictationGameProps) {
  const [index, setIndex] = React.useState(0);
  const [rate, setRate] = React.useState<number>(1.0);
  const [typed, setTyped] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [hintShown, setHintShown] = React.useState(false);
  const [results, setResults] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [done, setDone] = React.useState(false);

  const item = items[Math.min(index, items.length - 1)];
  const target = item ? targetOf(item) : "";

  React.useEffect(() => {
    primeVoices();
    return () => cancelSpeech();
  }, []);

  const play = React.useCallback(
    (r: number) => {
      if (!item) return;
      cancelSpeech();
      onEvent?.({ type: "play", itemId: item.id });
      void speakSequence([target], { rate: r });
    },
    [item, target, onEvent],
  );

  const check = React.useCallback(() => {
    if (!item || checked) return;
    const expected = target.split(/\s+/).filter(Boolean).map(normalize);
    const got = typed.split(/\s+/).filter(Boolean).map(normalize);
    const perfect =
      expected.length === got.length && expected.every((w, i) => w === got[i]);
    setChecked(true);
    setResults((r) => [...r, { id: item.id, correct: perfect }]);
    onEvent?.({ type: perfect ? "correct" : "incorrect", itemId: item.id });
  }, [item, checked, target, typed, onEvent]);

  const advance = React.useCallback(() => {
    if (done) return;
    if (!checked) {
      play(rate);
      return;
    }
    const next = index + 1;
    if (next >= items.length) {
      setDone(true);
      return;
    }
    setIndex(next);
    setTyped("");
    setChecked(false);
    setHintShown(false);
  }, [done, checked, play, rate, index, items.length]);

  const undo = React.useCallback(() => {
    if (done) {
      setDone(false);
      return;
    }
    if (checked) {
      setChecked(false);
      setResults((r) => r.slice(0, -1));
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
    setTyped("");
    setHintShown(false);
  }, [done, checked]);

  const finishedRef = React.useRef(false);
  React.useEffect(() => {
    if (!done || finishedRef.current) return;
    finishedRef.current = true;
    onComplete({
      correct: results.filter((r) => r.correct).length,
      total: results.length,
      missedIds: results.filter((r) => !r.correct).map((r) => r.id),
    });
  }, [done, results, onComplete]);

  // Word-level diff
  const diff = React.useMemo(() => {
    if (!checked) return null;
    const expectedWords = target.split(/\s+/).filter(Boolean);
    const typedWords = typed.split(/\s+/).filter(Boolean);
    const n = Math.max(expectedWords.length, typedWords.length);
    const rows: { expected: string; got: string; ok: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      const e = expectedWords[i] ?? "";
      const g = typedWords[i] ?? "";
      rows.push({ expected: e, got: g, ok: normalize(e) === normalize(g) });
    }
    return rows;
  }, [checked, target, typed]);

  if (!item) {
    return (
      <GameChrome title="Dictation" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No sentences loaded.</p>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Dictation"
      {...(item.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      onReplayAudio={() => play(rate)}
      progress={{ done: results.length, total: items.length }}
    >
      {done ? (
        <div className="grid gap-5 py-8 text-center">
          <h2 className="font-display text-3xl font-extrabold">Dictation complete</h2>
          <p className="text-xl font-semibold text-muted-foreground">
            {results.filter((r) => r.correct).length} of {results.length} sentences perfect
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {teacherMode ? (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-500 bg-card p-4 text-base font-semibold">
              <Keyboard className="size-6 shrink-0 text-amber-500" />
              Hand over remote control, or read the student&apos;s answer aloud and type it yourself.
            </div>
          ) : null}

          {/* Playback controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AudioButton text={target} rate={rate} label="Play sentence" />
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRate(r);
                  play(r);
                }}
                className={cn(
                  "rounded-full border-2 px-4 py-2 font-display text-lg font-bold transition",
                  rate === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary",
                )}
              >
                {r.toFixed(1)}x
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => setHintShown((h) => !h)}
            >
              <Lightbulb className="size-4" />
              {hintShown ? "Hide first letters" : "Reveal first letters"}
            </Button>
          </div>
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Replays are unlimited and never penalised.
          </p>

          {hintShown ? (
            <p className="rounded-2xl border border-border bg-muted/40 p-4 text-center font-mono text-xl font-bold tracking-wider">
              {firstLetters(target)}
            </p>
          ) : null}

          {/* Typing area */}
          <div className="grid gap-3">
            <textarea
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              readOnly={checked}
              rows={3}
              placeholder="Type what you hear…"
              aria-label="Type what you hear"
              className="w-full rounded-2xl border-2 border-border bg-card p-5 text-2xl font-semibold leading-snug focus:border-primary focus:outline-none"
            />
            {!checked ? (
              <div className="flex justify-center">
                <Button size="lg" className="gap-2 rounded-xl" onClick={check} disabled={!typed.trim()}>
                  {teacherMode ? <NumberBadge n={1} className="size-7 text-sm" /> : null}
                  Check
                </Button>
              </div>
            ) : null}
          </div>

          {/* Word-level diff */}
          {checked && diff ? (
            <div className="grid gap-4 rounded-3xl border border-border bg-card p-6">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  You wrote
                </p>
                <p className="flex flex-wrap gap-x-2 gap-y-1 text-2xl font-semibold leading-snug">
                  {diff.map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-lg px-1",
                        d.ok
                          ? "text-foreground"
                          : "bg-rose-500/15 text-rose-500 underline decoration-rose-500/60 decoration-2 underline-offset-4",
                      )}
                    >
                      {d.got || "∅"}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Correct sentence
                </p>
                <p className="flex flex-wrap gap-x-2 gap-y-1 text-2xl font-semibold leading-snug">
                  {diff.map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-lg px-1",
                        d.ok ? "text-foreground" : "bg-emerald-500/15 text-emerald-500",
                      )}
                    >
                      {d.expected}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="gap-2 rounded-xl" onClick={advance}>
                  <ArrowRight className="size-5" />
                  Next sentence
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </GameChrome>
  );
}

export default DictationGame;
