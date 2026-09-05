import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { speak, cancel } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Token = { id: string; text: string };

const ADVERBS = [
  "never",
  "always",
  "often",
  "usually",
  "sometimes",
  "rarely",
  "already",
  "just",
  "still",
  "ever",
  "seldom",
];
const AUXILIARIES = [
  "do",
  "does",
  "did",
  "is",
  "are",
  "am",
  "was",
  "were",
  "have",
  "has",
  "had",
  "can",
  "could",
  "will",
  "would",
  "should",
  "must",
  "may",
  "might",
];
const ARTICLES = ["a", "an", "the"];
const PREPOSITIONS = ["to", "in", "on", "at", "from", "with", "for", "by", "about", "into"];

const clean = (w: string) => w.toLowerCase().replace(/[.,!?;:]/g, "");

function splitWords(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
}

/** Pattern lookup that names the problem instead of just marking it wrong. */
function diagnose(attempt: string[], correct: string[]): string {
  const a = attempt.map(clean);
  const c = correct.map(clean);

  if (a.length !== c.length) {
    return a.length < c.length
      ? "Some words are still in the tray — the sentence is not finished."
      : "There are more words here than the sentence needs.";
  }

  const isQuestion = correct[correct.length - 1]?.endsWith("?") ?? false;

  // Auxiliary / subject inversion in questions.
  if (isQuestion) {
    const auxCorrect = c.findIndex((w) => AUXILIARIES.includes(w));
    const auxAttempt = a.findIndex((w) => AUXILIARIES.includes(w));
    if (auxCorrect === 0 && auxAttempt > 0) {
      return "In questions the auxiliary comes before the subject — start with it.";
    }
  } else {
    const auxAttempt = a.findIndex((w) => AUXILIARIES.includes(w));
    if (auxAttempt === 0 && c.findIndex((w) => AUXILIARIES.includes(w)) > 0) {
      return "This is a statement, so the subject comes before the auxiliary, not after it.";
    }
  }

  // Adverb of frequency placement.
  for (const adv of ADVERBS) {
    const ia = a.indexOf(adv);
    const ic = c.indexOf(adv);
    if (ia !== -1 && ic !== -1 && ia !== ic) {
      return `The adverb "${adv}" is in the wrong place — it goes after the auxiliary and before the main verb.`;
    }
  }

  // Article separated from its noun.
  for (let i = 0; i < a.length; i++) {
    if (ARTICLES.includes(a[i]!) && i === a.length - 1) {
      return `"${a[i]}" cannot end a sentence — an article goes directly before its noun.`;
    }
  }

  // Preposition placement.
  for (const prep of PREPOSITIONS) {
    const ia = a.indexOf(prep);
    const ic = c.indexOf(prep);
    if (ia !== -1 && ic !== -1 && Math.abs(ia - ic) > 0 && ia > ic) {
      return `The preposition "${prep}" comes earlier — it belongs before the place or thing it points to.`;
    }
    if (ia !== -1 && ic !== -1 && ia < ic) {
      return `The preposition "${prep}" comes later in the sentence, after the verb phrase.`;
    }
  }

  // First mismatch fallback, still named rather than an X.
  const firstBad = a.findIndex((w, i) => w !== c[i]);
  if (firstBad === 0) return "The sentence starts with the wrong word — begin with the subject.";
  if (firstBad > -1) {
    return `Everything up to "${attempt[firstBad - 1]}" is right; "${attempt[firstBad]}" is not what comes next.`;
  }
  return "Almost — check the word order once more.";
}

export function SentenceBuilderGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [slots, setSlots] = React.useState<(Token | null)[]>([]);
  const [tray, setTray] = React.useState<Token[]>([]);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [solved, setSolved] = React.useState(false);
  const [hintUsed, setHintUsed] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [missed, setMissed] = React.useState<string[]>([]);
  const [finished, setFinished] = React.useState(false);
  const [attempted, setAttempted] = React.useState(false);

  const item = items[index];
  const words = React.useMemo(() => (item ? splitWords(item.answer) : []), [item]);

  const setupRound = React.useCallback(
    (target: GameItem | undefined) => {
      if (!target) return;
      const w = splitWords(target.answer);
      const tokens: Token[] = w.map((text, i) => ({ id: `${i}-${text}`, text }));
      setSlots(Array.from({ length: w.length }, () => null));
      setTray(shuffle(tokens));
      setFeedback(null);
      setSolved(false);
      setHintUsed(false);
      setSelected(null);
      setAttempted(false);
    },
    [],
  );

  React.useEffect(() => {
    setupRound(items[index]);
  }, [index, items, setupRound]);

  const placeIntoSlot = (token: Token, slotIndex: number) => {
    setFeedback(null);
    setSlots((prev) => {
      const next = [...prev];
      const displaced = next[slotIndex] ?? null;
      next[slotIndex] = token;
      if (displaced) setTray((t) => [...t, displaced]);
      return next;
    });
    setTray((t) => t.filter((x) => x.id !== token.id));
    setSelected(null);
    onEvent?.({ type: "place-word", itemId: item?.id ?? "" });
  };

  const firstEmptySlot = () => slots.findIndex((s) => s === null);

  const clickTrayWord = (token: Token) => {
    const target = firstEmptySlot();
    if (target === -1) {
      setSelected(token.id);
      return;
    }
    placeIntoSlot(token, target);
  };

  const clickSlot = (slotIndex: number) => {
    const chosen = tray.find((t) => t.id === selected);
    if (chosen) {
      placeIntoSlot(chosen, slotIndex);
      return;
    }
    const current = slots[slotIndex];
    if (current) {
      setFeedback(null);
      setSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
      setTray((t) => [...t, current]);
    }
  };

  const undo = () => {
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i]) {
        clickSlot(i);
        return;
      }
    }
  };

  const check = () => {
    if (!item) return;
    const filled = slots.filter(Boolean) as Token[];
    const attempt = filled.map((t) => t.text);
    const ok =
      filled.length === words.length &&
      attempt.map(clean).join(" ") === words.map(clean).join(" ");
    setAttempted(true);
    if (ok) {
      setSolved(true);
      setFeedback(null);
      setCorrectCount((n) => (attempted || hintUsed ? n : n + 1));
      onEvent?.({ type: "correct", itemId: item.id });
    } else {
      setFeedback(diagnose(attempt, words));
      setMissed((m) => (m.includes(item.id) ? m : [...m, item.id]));
      onEvent?.({ type: "incorrect", itemId: item.id });
    }
  };

  const hint = () => {
    if (!words.length) return;
    setHintUsed(true);
    const firstWord = words[0]!;
    const token = tray.find((t) => clean(t.text) === clean(firstWord));
    if (token) placeIntoSlot(token, 0);
    setFeedback(`Locked in the first word: "${firstWord}".`);
  };

  const advance = React.useCallback(() => {
    if (!item) return;
    if (index + 1 >= items.length) {
      setFinished(true);
      onComplete({ correct: correctCount, total: items.length, missedIds: missed });
    } else {
      setIndex((i) => i + 1);
    }
  }, [correctCount, index, item, items.length, missed, onComplete]);

  const replayAudio = React.useCallback(() => {
    if (!item) return;
    cancel();
    speak(item.audioText ?? item.answer, { rate: 0.85 });
  }, [item]);

  // Number keys place tray words in teacherMode.
  React.useEffect(() => {
    if (!teacherMode) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const token = tray[Number(e.key) - 1];
      if (token) {
        e.preventDefault();
        clickTrayWord(token);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!items.length) {
    return <p className="p-6 text-muted-foreground">No sentences to build yet.</p>;
  }

  if (finished) {
    return (
      <GameChrome title="Sentence Builder" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <h2 className="text-3xl font-bold">Set finished</h2>
          <p className="mt-3 text-xl text-muted-foreground">
            {correctCount} of {items.length} sentences built first time.
          </p>
          {missed.length ? (
            <div className="mt-6 text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Worth revisiting
              </p>
              <ul className="mt-2 space-y-1 text-lg">
                {missed.map((id) => (
                  <li key={id}>{items.find((x) => x.id === id)?.answer}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button
            className="mt-8"
            size="lg"
            onClick={() => {
              setIndex(0);
              setCorrectCount(0);
              setMissed([]);
              setFinished(false);
              setupRound(items[0]);
            }}
          >
            Run the set again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Sentence Builder"
      {...(item?.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      onReplayAudio={replayAudio}
      progress={{ done: index, total: items.length }}
    >
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{item?.prompt}</p>
        </div>

        {/* Slots */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {slots.map((slot, i) => (
            <button
              key={i}
              type="button"
              onClick={() => clickSlot(i)}
              className={cn(
                "min-h-16 min-w-24 rounded-xl border-2 px-5 py-3 text-2xl font-bold transition-colors",
                slot
                  ? solved
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                    : "border-border bg-card text-card-foreground"
                  : "border-dashed border-border bg-muted text-muted-foreground",
                selected && !slot && "border-primary",
              )}
            >
              {slot ? slot.text : <span className="opacity-40">•</span>}
            </button>
          ))}
        </div>

        {/* Feedback that names the problem */}
        <div className="min-h-16 text-center">
          {solved ? (
            <p className="text-2xl font-bold text-emerald-500">Correct word order.</p>
          ) : feedback ? (
            <p className="mx-auto max-w-3xl rounded-xl bg-muted px-5 py-3 text-xl font-semibold text-foreground">
              {feedback}
            </p>
          ) : null}
        </div>

        {/* Tray */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tray.map((token, i) => (
            <button
              key={token.id}
              type="button"
              onClick={() => clickTrayWord(token)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 bg-card px-5 py-3 text-2xl font-bold text-card-foreground transition-transform hover:-translate-y-0.5",
                selected === token.id ? "border-primary ring-2 ring-ring" : "border-border",
              )}
            >
              {teacherMode && i < 9 ? <NumberBadge n={i + 1} /> : null}
              {token.text}
            </button>
          ))}
          {tray.length === 0 ? (
            <p className="text-lg text-muted-foreground">Tray empty — check the sentence.</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={check} disabled={solved}>
            Check sentence
          </Button>
          <Button size="lg" variant="secondary" onClick={hint} disabled={solved || hintUsed}>
            Hint: lock first word
          </Button>
          <Button size="lg" variant="outline" onClick={undo}>
            Undo
          </Button>
          <Button size="lg" variant="outline" onClick={replayAudio}>
            Hear it
          </Button>
          <Button size="lg" variant={solved ? "default" : "ghost"} onClick={advance}>
            {index + 1 >= items.length ? "Finish" : "Next sentence"}
          </Button>
        </div>

        {item?.hint ? (
          <div className="text-center">
            <Badge variant="secondary" className="text-base">
              Teacher note: {item.hint}
            </Badge>
          </div>
        ) : null}
      </div>
    </GameChrome>
  );
}

export default SentenceBuilderGame;
