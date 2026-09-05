import * as React from "react";
import { Play, Repeat, Rabbit, ArrowRight } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { speakSequence, cancelSpeech } from "@/lib/voice";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MinimalPairsGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
  lang?: string;
};

type Side = 0 | 1;

const CONTRAST_FALLBACK = "Other contrasts";

export function MinimalPairsGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
  lang,
}: MinimalPairsGameProps) {
  const [index, setIndex] = React.useState(0);
  const [spoken, setSpoken] = React.useState<Side>(0);
  const [choice, setChoice] = React.useState<Side | null>(null);
  const [results, setResults] = React.useState<
    { id: string; contrast: string; word: string; correct: boolean }[]
  >([]);
  const [bothRound, setBothRound] = React.useState(false);
  const [bothIndex, setBothIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const item = items[Math.min(index, items.length - 1)];
  const words = React.useMemo(() => (item ? [item.prompt, item.answer] : ["", ""]), [item]);
  const contrast = item?.targetStructure ?? CONTRAST_FALLBACK;

  const say = React.useCallback(
    (text: string, rate: number) => {
      cancelSpeech();
      void speakSequence([text], lang ? { rate, lang } : { rate });
    },
    [lang],
  );

  // Pick a fresh random side whenever we land on a new item.
  React.useEffect(() => {
    if (bothRound || done) return;
    const side = (Math.random() < 0.5 ? 0 : 1) as Side;
    setSpoken(side);
    setChoice(null);
  }, [index, bothRound, done]);

  const playSpoken = React.useCallback(
    (rate = 1) => {
      const w = words[spoken];
      if (w) {
        say(w, rate);
        onEvent?.({ type: "play", ...(item ? { itemId: item.id } : {}) });
      }
    },
    [words, spoken, say, onEvent, item],
  );

  const playBoth = React.useCallback(
    (pair: GameItem | undefined, rate = 0.85) => {
      if (!pair) return;
      cancelSpeech();
      void speakSequence([pair.prompt, pair.answer], lang ? { rate, lang } : { rate });
    },
    [lang],
  );

  const commit = React.useCallback(
    (side: Side) => {
      if (!item || choice !== null) return;
      const correct = side === spoken;
      setChoice(side);
      setResults((r) => [...r, { id: item.id, contrast, word: words[spoken] ?? "", correct }]);
      onEvent?.({ type: correct ? "correct" : "incorrect", itemId: item.id });
    },
    [item, choice, spoken, contrast, words, onEvent],
  );

  const advance = React.useCallback(() => {
    if (done) return;
    if (bothRound) {
      setBothIndex((i) => {
        const next = i + 1;
        if (next >= items.length) {
          setDone(true);
          return i;
        }
        return next;
      });
      return;
    }
    if (choice === null) {
      playSpoken();
      return;
    }
    setIndex((i) => {
      const next = i + 1;
      if (next >= items.length) {
        setBothRound(true);
        setBothIndex(0);
        return i;
      }
      return next;
    });
  }, [done, bothRound, choice, items.length, playSpoken]);

  const undo = React.useCallback(() => {
    if (done) {
      setDone(false);
      return;
    }
    if (bothRound) {
      if (bothIndex === 0) {
        setBothRound(false);
        setIndex(Math.max(0, items.length - 1));
        setResults((r) => r.slice(0, -1));
      } else {
        setBothIndex((i) => i - 1);
      }
      return;
    }
    if (choice !== null) {
      setChoice(null);
      setResults((r) => r.slice(0, -1));
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  }, [done, bothRound, bothIndex, choice, items.length]);

  // Number keys 1 / 2 commit a side.
  React.useEffect(() => {
    if (!teacherMode || bothRound || done) return;
    function onKeyDown(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "1" || e.key === "2") {
        e.preventDefault();
        commit((Number(e.key) - 1) as Side);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [teacherMode, bothRound, done, commit]);

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

  const byContrast = React.useMemo(() => {
    const map = new Map<string, { total: number; missed: string[] }>();
    for (const r of results) {
      const entry = map.get(r.contrast) ?? { total: 0, missed: [] };
      entry.total += 1;
      if (!r.correct) entry.missed.push(r.word);
      map.set(r.contrast, entry);
    }
    return [...map.entries()];
  }, [results]);

  const bothItem = items[bothIndex];

  return (
    <GameChrome
      title="Minimal Pairs"
      {...(item?.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      onReplayAudio={() => (bothRound ? playBoth(bothItem) : playSpoken())}
      progress={{ done: results.length, total: items.length }}
    >
      {done ? (
        <div className="grid gap-6 py-6">
          <h2 className="text-center font-display text-3xl font-extrabold">Listening summary</h2>
          <div className="grid gap-3">
            {byContrast.map(([c, data]) => {
              const missed = data.missed.length;
              const ok = missed === 0;
              return (
                <div
                  key={c}
                  className={cn(
                    "flex flex-wrap items-center gap-3 rounded-2xl border p-4",
                    ok ? "border-emerald-500 bg-card" : "border-rose-500 bg-card",
                  )}
                >
                  <span className="font-display text-2xl font-bold">{c}</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-bold",
                      ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white",
                    )}
                  >
                    {data.total - missed}/{data.total} heard correctly
                  </span>
                  {missed > 0 ? (
                    <span className="text-sm text-muted-foreground">
                      Confused on: {data.missed.join(", ")}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : bothRound ? (
        <div className="grid gap-6 py-4 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Comparison round — listen to the pair together
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[bothItem?.prompt, bothItem?.answer].map((w, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-8 font-display text-4xl font-extrabold sm:text-5xl"
              >
                {w}
              </div>
            ))}
          </div>
          {bothItem?.targetStructure ? (
            <p className="font-display text-2xl font-bold">{bothItem.targetStructure}</p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2 rounded-xl" onClick={() => playBoth(bothItem)}>
              <Play className="size-5" />
              Play both
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => playBoth(bothItem, 0.6)}
            >
              <Rabbit className="size-5" />
              Slow
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 rounded-xl" onClick={advance}>
              <ArrowRight className="size-5" />
              Next
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Pair {Math.min(bothIndex + 1, items.length)} of {items.length}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2 rounded-xl" onClick={() => playSpoken()}>
              <Play className="size-5" />
              Play
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => playSpoken(0.6)}
            >
              <Rabbit className="size-5" />
              Slow
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => playSpoken()}
            >
              <Repeat className="size-5" />
              Repeat
            </Button>
          </div>
          <p className="text-center text-base font-semibold text-muted-foreground">
            Which word did you hear? Repeat as many times as you like.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {words.map((w, i) => {
              const side = i as Side;
              const revealed = choice !== null;
              const isSpoken = side === spoken;
              const isChoice = side === choice;
              return (
                <button
                  key={w + i}
                  type="button"
                  onClick={() => commit(side)}
                  className={cn(
                    "flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 transition",
                    "border-border bg-card hover:border-primary",
                    revealed && isSpoken && "border-emerald-500 ring-4 ring-emerald-500/30",
                    revealed && isChoice && !isSpoken && "border-rose-500 ring-4 ring-rose-500/30",
                    revealed && "cursor-default",
                  )}
                >
                  {teacherMode ? <NumberBadge n={i + 1} /> : null}
                  {item?.imageUrl && i === 0 ? (
                    <img
                      src={item.imageUrl}
                      alt={w}
                      className="h-24 w-auto rounded-xl object-contain"
                    />
                  ) : null}
                  <span className="font-display text-4xl font-extrabold sm:text-5xl">{w}</span>
                  {revealed && isSpoken ? (
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-bold text-white">
                      This one was spoken
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {choice !== null ? (
            <div className="flex justify-center">
              <Button size="lg" className="gap-2 rounded-xl" onClick={advance}>
                <ArrowRight className="size-5" />
                Next pair
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </GameChrome>
  );
}

export default MinimalPairsGame;
