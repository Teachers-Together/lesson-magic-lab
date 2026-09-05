import * as React from "react";
import { Play, RotateCcw, Turtle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameChrome, NumberBadge } from "./GameChrome";
import { speakSequence, cancelSpeech, primeVoices } from "@/lib/voice";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

type Syllable = { text: string; stressed: boolean };

/** "pho-TO-gra-pher" → [{text:"pho"},…] with the capitals syllable marked. */
function parseSyllables(answer: string): Syllable[] {
  return answer
    .split("-")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({ text: s.toLowerCase(), stressed: s === s.toUpperCase() && /[A-Z]/.test(s) }));
}

type PairGroup = { key: string; items: GameItem[] };

function groupPairs(items: GameItem[]): PairGroup[] {
  const map = new Map<string, GameItem[]>();
  for (const it of items) {
    const key = it.prompt.trim().toLowerCase();
    map.set(key, [...(map.get(key) ?? []), it]);
  }
  return [...map.entries()].map(([key, group]) => ({ key, items: group }));
}

type Props = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
};

export default function WordStressGame(props: Props) {
  const { items, teacherMode, lang, onComplete, onEvent } = props;

  const groups = React.useMemo(() => groupPairs(items), [items]);
  const [index, setIndex] = React.useState(0);
  /** itemId → picked syllable index; value -1 = wrong attempt, revealed. */
  const [picks, setPicks] = React.useState<Record<string, number>>({});
  const [wrongFlash, setWrongFlash] = React.useState<{ id: string; syll: number } | null>(null);
  const [results, setResults] = React.useState<{ item: GameItem; correct: boolean }[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const group = groups[index];
  const isPair = (group?.items.length ?? 0) > 1;
  const first = group?.items[0];

  React.useEffect(() => {
    primeVoices();
    return () => cancelSpeech();
  }, []);

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

  const speak = React.useCallback(
    (rate?: number) => {
      if (!group) return;
      speakSequence(
        group.items.map((i) => i.prompt),
        { lang: lang ?? "en-US", ...(rate !== undefined ? { rate } : {}) },
      );
      emit("play", group.items[0]);
    },
    [group, lang, emit],
  );

  const allSolved = React.useMemo(() => {
    if (!group) return false;
    return group.items.every((it) => {
      const sylls = parseSyllables(it.answer);
      const stressedIdx = sylls.findIndex((s) => s.stressed);
      return picks[it.id] === stressedIdx;
    });
  }, [group, picks]);

  const pick = React.useCallback(
    (it: GameItem, syllIdx: number) => {
      if (!group) return;
      const sylls = parseSyllables(it.answer);
      const stressedIdx = sylls.findIndex((s) => s.stressed);
      if (picks[it.id] === stressedIdx) return; // already solved
      const correct = syllIdx === stressedIdx;
      if (correct) {
        setPicks((p) => ({ ...p, [it.id]: syllIdx }));
        setResults((rs) => [...rs, { item: it, correct: true }]);
        emit("pick", it, { choice: sylls[syllIdx]?.text, correct: true });
      } else {
        setWrongFlash({ id: it.id, syll: syllIdx });
        emit("pick", it, { choice: sylls[syllIdx]?.text, correct: false });
        window.setTimeout(() => {
          setWrongFlash(null);
          setPicks((p) => ({ ...p, [it.id]: stressedIdx }));
          setResults((rs) => [...rs, { item: it, correct: false }]);
        }, 600);
      }
    },
    [group, picks, emit],
  );

  const advance = React.useCallback(() => {
    if (!allSolved) return;
    if (index + 1 < groups.length) {
      setIndex((i) => i + 1);
      setPicks({});
      emit("next");
    } else {
      setCompleted(true);
      emit("complete");
    }
  }, [allSolved, index, groups.length, emit]);

  // Number keys choose syllables (first unsolved word in the group).
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!teacherMode || !group) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const n = Number.parseInt(e.key, 10);
      if (Number.isNaN(n) || n < 1) return;
      const target =
        group.items.find((it) => {
          const sylls = parseSyllables(it.answer);
          return picks[it.id] !== sylls.findIndex((s) => s.stressed);
        }) ?? null;
      if (!target) return;
      const sylls = parseSyllables(target.answer);
      if (n <= sylls.length) pick(target, n - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [teacherMode, group, picks, pick]);

  const reset = React.useCallback(() => {
    completedRef.current = false;
    setCompleted(false);
    setIndex(0);
    setPicks({});
    setResults([]);
    setWrongFlash(null);
    emit("restart");
  }, [emit]);

  if (!group) {
    return (
      <GameChrome title="Word Stress" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items provided.</p>
      </GameChrome>
    );
  }

  if (completed) {
    const byPattern = new Map<string, { right: number; wrong: number; words: string[] }>();
    for (const r of results) {
      const key = r.item.targetStructure ?? "Other";
      const entry = byPattern.get(key) ?? { right: 0, wrong: 0, words: [] };
      if (r.correct) entry.right += 1;
      else {
        entry.wrong += 1;
        entry.words.push(r.item.prompt);
      }
      byPattern.set(key, entry);
    }
    return (
      <GameChrome title="Word Stress" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-2xl space-y-5 p-6">
          <h2 className="text-center font-display text-2xl font-bold">Session complete</h2>
          <p className="text-center text-muted-foreground">
            {results.filter((r) => r.correct).length} of {results.length} words stressed correctly
          </p>
          <div className="space-y-3 text-left">
            {[...byPattern.entries()].map(([pattern, e]) => (
              <div key={pattern} className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary">{pattern}</Badge>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      e.wrong > 0 ? "text-destructive" : "text-[var(--success)]",
                    )}
                  >
                    {e.right} right · {e.wrong} wrong
                  </span>
                </div>
                {e.words.length > 0 ? (
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    To revisit: {e.words.join(", ")}
                  </p>
                ) : null}
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

  return (
    <GameChrome
      title="Word Stress"
      {...(first?.targetStructure ? { targetStructure: first.targetStructure } : {})}
      teacherMode={teacherMode}
      onAdvance={advance}
      onReplayAudio={() => speak()}
      progress={{ done: index, total: groups.length }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => speak()} className="gap-2">
            <Play className="size-4" /> Play
          </Button>
          <Button variant="outline" onClick={() => speak(0.6)} className="gap-2">
            <Turtle className="size-4" /> Slow
          </Button>
        </div>

        {isPair ? (
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Same spelling, two words — say each and tap its stressed syllable. Which is the noun?
          </p>
        ) : (
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Say the word, then tap the stressed syllable.
          </p>
        )}

        {group.items.map((it) => {
          const sylls = parseSyllables(it.answer);
          const stressedIdx = sylls.findIndex((s) => s.stressed);
          const picked = picks[it.id];
          const solved = picked === stressedIdx;
          return (
            <Card key={it.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sylls.map((s, si) => {
                  const isPicked = picked === si;
                  const isWrong = wrongFlash?.id === it.id && wrongFlash.syll === si && !isPicked;
                  return (
                    <button
                      key={si}
                      type="button"
                      onClick={() => pick(it, si)}
                      disabled={solved}
                      className={cn(
                        "relative rounded-xl border-2 px-5 py-3 font-display text-2xl font-bold transition-all",
                        isPicked && solved
                          ? "-translate-y-1 border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)] shadow-lg"
                          : isWrong
                            ? "animate-pulse border-destructive bg-destructive/10 text-destructive"
                            : "border-border bg-card hover:border-primary/50 hover:bg-muted",
                      )}
                    >
                      {s.text}
                      {teacherMode && !solved ? (
                        <NumberBadge
                          n={si + 1}
                          className="absolute -right-3 -top-3 size-6 text-xs"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Stress-pattern dots */}
              <div className="flex justify-center gap-2" aria-hidden>
                {sylls.map((s, si) => (
                  <span
                    key={si}
                    className={cn(
                      "rounded-full transition-all",
                      solved && si === stressedIdx
                        ? "size-4 bg-[var(--success)]"
                        : solved
                          ? "size-2 bg-muted-foreground/40"
                          : "size-2 bg-muted",
                      !solved && "mt-1",
                    )}
                  />
                ))}
              </div>

              {solved && it.exampleSentence ? (
                <p className="text-center text-sm italic text-muted-foreground">
                  {it.exampleSentence}
                </p>
              ) : null}
            </Card>
          );
        })}

        <div className="text-center">
          <Button size="lg" onClick={advance} disabled={!allSolved} className="min-w-44">
            {index + 1 < groups.length ? "Next" : "Finish"}
          </Button>
        </div>
      </div>
    </GameChrome>
  );
}
