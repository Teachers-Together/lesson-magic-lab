import * as React from "react";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

/**
 * MatchingPairsGame — a memory / pelmanism game for one-to-one lessons.
 *
 * Each GameItem is a pair: `prompt` on one card, `answer` on the other
 * (optional `imageUrl` replaces the prompt card's text with a picture).
 * Cards start face down; two flipped cards stay if they match, flip back
 * after a beat if not. Turns alternate between Tutor and Student.
 */
export type MatchingPairsGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  lang?: string;
  onComplete: (result: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (event: { type: string; itemId?: string; correct?: boolean }) => void;
};

type Side = "tutor" | "student";

type Card = {
  key: string;
  itemId: string;
  half: "prompt" | "answer";
  text: string;
  imageUrl?: string;
};

type PairStats = { flips: number; foundBy: Side | null };

const FLIP_BACK_MS = 900;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function buildCards(items: GameItem[]): Card[] {
  return shuffle(
    items.flatMap((it): Card[] => {
      const promptCard: Card = {
        key: `${it.id}-p`,
        itemId: it.id,
        half: "prompt",
        text: it.prompt,
      };
      if (it.imageUrl) promptCard.imageUrl = it.imageUrl;
      return [promptCard, { key: `${it.id}-a`, itemId: it.id, half: "answer", text: it.answer }];
    }),
  );
}

export default function MatchingPairsGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
}: MatchingPairsGameProps) {
  const [cards, setCards] = React.useState<Card[]>(() => buildCards(items));
  const [flipped, setFlipped] = React.useState<string[]>([]);
  const [matched, setMatched] = React.useState<Set<string>>(new Set());
  const [turn, setTurn] = React.useState<Side>("student");
  const [scores, setScores] = React.useState<Record<Side, number>>({ tutor: 0, student: 0 });
  const [stats, setStats] = React.useState<Record<string, PairStats>>({});
  const [completed, setCompleted] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const completedRef = React.useRef(false);

  const totalPairs = items.length;
  const foundPairs = matched.size;
  const busy = flipped.length === 2;

  const flipCard = React.useCallback(
    (key: string) => {
      if (completedRef.current) return;
      setFlipped((prev) => {
        if (prev.length === 2 || prev.includes(key)) return prev;
        const card = cards.find((c) => c.key === key);
        if (!card || matched.has(card.itemId)) return prev;

        setStats((s) => {
          const cur = s[card.itemId] ?? { flips: 0, foundBy: null };
          return { ...s, [card.itemId]: { ...cur, flips: cur.flips + 1 } };
        });

        const next = [...prev, key];
        if (next.length === 2) {
          const [aKey, bKey] = next as [string, string];
          const a = cards.find((c) => c.key === aKey)!;
          const b = cards.find((c) => c.key === bKey)!;
          const isMatch = a.itemId === b.itemId && a.half !== b.half;

          if (isMatch) {
            onEvent?.({ type: "match", itemId: a.itemId, correct: true });
            timerRef.current = window.setTimeout(() => {
              setMatched((m) => new Set(m).add(a.itemId));
              setFlipped([]);
              setScores((s) => {
                const scorer = turn;
                setStats((st) => ({
                  ...st,
                  [a.itemId]: { ...(st[a.itemId] ?? { flips: 0 }), foundBy: scorer },
                }));
                return { ...s, [scorer]: s[scorer] + 1 };
              });
            }, 450);
          } else {
            onEvent?.({ type: "no-match", itemId: a.itemId, correct: false });
            timerRef.current = window.setTimeout(() => {
              setFlipped([]);
              setTurn((t) => (t === "student" ? "tutor" : "student"));
            }, FLIP_BACK_MS);
          }
        }
        return next;
      });
    },
    [cards, matched, turn, onEvent],
  );

  // Complete when all pairs are found.
  React.useEffect(() => {
    if (foundPairs === totalPairs && totalPairs > 0 && !completedRef.current) {
      completedRef.current = true;
      const t = window.setTimeout(() => {
        setCompleted(true);
        onComplete({ correct: scores.tutor + scores.student, total: totalPairs, missedIds: [] });
      }, 600);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [foundPairs, totalPairs, scores, onComplete]);

  // Keyboard: number keys flip face-down cards.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key < "1" || e.key > "9") return;
      const idx = Number(e.key) - 1;
      const faceDown = cards.filter((c) => !matched.has(c.itemId) && !flipped.includes(c.key));
      const card = faceDown[idx];
      if (card && !busy) flipCard(card.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cards, matched, flipped, busy, flipCard]);

  React.useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const replay = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    completedRef.current = false;
    setCards(buildCards(items));
    setFlipped([]);
    setMatched(new Set());
    setTurn("student");
    setScores({ tutor: 0, student: 0 });
    setStats({});
    setCompleted(false);
  };

  const targetStructure = items.find((i) => i.targetStructure)?.targetStructure;

  // Face-down cards in order, for badges / number keys.
  const faceDown = cards.filter((c) => !matched.has(c.itemId) && !flipped.includes(c.key));

  if (completed) {
    const hardest = Object.entries(stats)
      .sort((a, b) => b[1].flips - a[1].flips)
      .slice(0, 3)
      .map(([itemId, s]) => {
        const item = items.find((i) => i.id === itemId);
        return { item, flips: s.flips, foundBy: s.foundBy };
      })
      .filter((h) => h.item);

    return (
      <GameChrome title="Matching Pairs" teacherMode={teacherMode}>
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Game over!</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(["student", "tutor"] as const).map((side) => (
              <div
                key={side}
                className={cn(
                  "rounded-2xl border-2 p-4",
                  scores[side] >= scores[side === "student" ? "tutor" : "student"]
                    ? "border-success bg-success/10"
                    : "border-border bg-muted/40",
                )}
              >
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {side === "student" ? "Student" : "Tutor"}
                </p>
                <p className="font-display mt-1 text-3xl font-extrabold tabular-nums">
                  {scores[side]}
                </p>
                <p className="text-xs text-muted-foreground">pairs</p>
              </div>
            ))}
          </div>
          {hardest.length > 0 ? (
            <div className="mt-6 text-left">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Hardest pairs (most flips)
              </p>
              <ul className="mt-2 space-y-2">
                {hardest.map((h) => (
                  <li
                    key={h.item!.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {h.item!.prompt} — {h.item!.answer}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-muted-foreground">
                      {h.flips} flips
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <button
            onClick={replay}
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 font-display text-base font-bold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Play again
          </button>
        </div>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Matching Pairs"
      {...(targetStructure ? { targetStructure } : {})}
      teacherMode={teacherMode}
      progress={{ done: foundPairs, total: totalPairs }}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-center gap-3">
          {(["student", "tutor"] as const).map((side) => (
            <div
              key={side}
              className={cn(
                "flex items-center gap-2 rounded-2xl border-2 px-4 py-2 transition-all",
                turn === side
                  ? "border-primary bg-primary/10 shadow-soft"
                  : "border-border bg-card opacity-70",
              )}
            >
              <span className="text-sm font-bold">{side === "student" ? "Student" : "Tutor"}</span>
              <span className="font-display text-lg font-extrabold tabular-nums">
                {scores[side]}
              </span>
              {turn === side ? (
                <span className="text-xs font-semibold text-primary">playing</span>
              ) : null}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "grid gap-2 sm:gap-3",
            cards.length <= 12 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-4",
          )}
        >
          {cards.map((card) => {
            const isMatched = matched.has(card.itemId);
            const isUp = isMatched || flipped.includes(card.key);
            const badgeIdx = faceDown.indexOf(card);
            return (
              <button
                key={card.key}
                onClick={() => !busy && flipCard(card.key)}
                disabled={isMatched}
                className={cn(
                  "relative grid min-h-20 place-items-center rounded-2xl border-2 p-2 text-center transition-all select-none sm:min-h-24",
                  isMatched
                    ? "border-success bg-success/10"
                    : isUp
                      ? "border-primary bg-card shadow-soft"
                      : "border-transparent bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5",
                )}
                aria-label={isUp ? card.text : "Face-down card"}
              >
                {teacherMode && !isUp && badgeIdx >= 0 && badgeIdx < 9 ? (
                  <span className="absolute -top-2 -left-2">
                    <NumberBadge n={badgeIdx + 1} className="size-7 text-sm" />
                  </span>
                ) : null}
                {isUp ? (
                  card.imageUrl && card.half === "prompt" ? (
                    <img
                      src={card.imageUrl}
                      alt={card.text}
                      className="max-h-16 w-full rounded-xl object-contain sm:max-h-20"
                    />
                  ) : (
                    <span className="text-sm font-semibold break-words sm:text-base">
                      {card.text}
                    </span>
                  )
                ) : (
                  <span className="font-display text-2xl font-extrabold text-primary-foreground/60">
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          Say the word as you flip it.
        </p>
      </div>
    </GameChrome>
  );
}
