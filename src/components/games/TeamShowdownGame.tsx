import { useEffect, useMemo, useState } from "react";
import { Bomb, Check, RefreshCw, Repeat, Skull, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { celebrate, tone } from "@/lib/fx";
import { useStore, type Activity } from "@/lib/store";
import { LeaderboardOverlay } from "@/components/LeaderboardOverlay";
import { cn } from "@/lib/utils";

type Chance = "swap" | "thief" | "bomb";

const CHANCE_META: Record<Chance, { title: string; blurb: string; icon: typeof Bomb }> = {
  swap: { title: "Points Swap!", blurb: "Team scores are instantly swapped.", icon: Repeat },
  thief: { title: "The Thief!", blurb: "Steal 25 points from the other team.", icon: Skull },
  bomb: { title: "The Bomb!", blurb: "Your score drops all the way to zero.", icon: Bomb },
};

const TILE_TONES = [
  "from-primary to-primary/70",
  "from-action to-action/70",
  "from-success to-success/70",
];

type Tile = { n: number; chance: Chance | null; itemIndex: number };

export function TeamShowdownGame({ activity, adaptClass }: { activity: Activity; adaptClass: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const [round, setRound] = useState(0);

  const tiles = useMemo<Tile[]>(() => {
    const count = Math.min(16, Math.max(12, items.length));
    const chancePositions = new Set<number>();
    while (chancePositions.size < 3) chancePositions.add(Math.floor(Math.random() * count));
    const chances: Chance[] = ["swap", "thief", "bomb"];
    const order = [...chancePositions];
    return Array.from({ length: count }, (_, i) => ({
      n: i + 1,
      chance: order.includes(i) ? (chances[order.indexOf(i)] ?? null) : null,
      itemIndex: i % Math.max(1, items.length),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, round]);

  const [used, setUsed] = useState<number[]>([]);
  const [open, setOpen] = useState<Tile | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [turn, setTurn] = useState<0 | 1>(0);
  const [correct, setCorrect] = useState<[number, number]>([0, 0]);
  const [attempts, setAttempts] = useState<[number, number]>([0, 0]);

  const pick = (t: Tile) => {
    if (used.includes(t.n)) return;
    tone("click", soundOn);
    setOpen(t);
    setRevealed(false);
  };

  const finishTile = (n: number) => {
    setUsed((u) => [...u, n]);
    setOpen(null);
    setRevealed(false);
    setTurn((t) => (t === 0 ? 1 : 0));
  };

  const score = (isCorrect: boolean) => {
    setAttempts(([a, b]) => (turn === 0 ? [a + 1, b] : [a, b + 1]));
    if (isCorrect) {
      setCorrect(([a, b]) => (turn === 0 ? [a + 1, b] : [a, b + 1]));
      tone("correct", soundOn);
      setScores(([a, b]) => (turn === 0 ? [a + 15, b] : [a, b + 15]));
    } else {
      tone("wrong", soundOn);
    }
    if (open) finishTile(open.n);
  };

  const applyChance = (c: Chance, n: number) => {
    setScores(([a, b]) => {
      if (c === "swap") return [b, a];
      if (c === "thief")
        return turn === 0 ? [a + 25, Math.max(0, b - 25)] : [Math.max(0, a - 25), b + 25];
      return turn === 0 ? [0, b] : [a, 0];
    });
    tone(c === "bomb" ? "wrong" : "correct", soundOn);
    finishTile(n);
  };

  const allDone = used.length >= tiles.length;
  const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 1 : 2;

  const restart = () => {
    setUsed([]);
    setScores([0, 0]);
    setCorrect([0, 0]);
    setAttempts([0, 0]);
    setTurn(0);
    setOpen(null);
    setRound((r) => r + 1);
  };

  useEffect(() => {
    if (!allDone) return;
    recordPlay(activity.id, Math.min(100, Math.max(scores[0], scores[1])));
    celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  if (allDone) {
    return (
      <LeaderboardOverlay
        teams={[
          { name: "Team 1", score: scores[0], correct: correct[0], attempts: attempts[0] },
          { name: "Team 2", score: scores[1], correct: correct[1], attempts: attempts[1] },
        ]}
        onPlayAgain={restart}
      />
    );
  }

  const item = open ? items[open.itemIndex] : undefined;
  const ChanceIcon = open?.chance ? CHANCE_META[open.chance].icon : null;

  return (
    <div className={cn("w-full max-w-4xl", adaptClass)}>
      <p className="mb-4 text-center text-sm font-bold tracking-wide text-muted-foreground uppercase">
        Team {turn + 1}, pick a tile
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {tiles.map((t, i) => {
          const done = used.includes(t.n);
          return (
            <button
              key={t.n}
              onClick={() => pick(t)}
              disabled={done}
              className={cn(
                "aspect-square rounded-2xl bg-gradient-to-br font-display text-3xl font-extrabold text-white shadow-soft transition-all",
                TILE_TONES[i % 3],
                done ? "scale-95 opacity-25" : "hover:-translate-y-1 hover:shadow-lift active:scale-95",
              )}
            >
              {t.n}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className={cn("rounded-2xl border-2 p-4 text-center", turn === 0 ? "border-primary bg-primary/10" : "border-border bg-card")}>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Team 1</p>
          <p className="font-display text-3xl font-extrabold text-primary tabular-nums">{scores[0]}</p>
        </div>
        <div className={cn("rounded-2xl border-2 p-4 text-center", turn === 1 ? "border-action bg-action/10" : "border-border bg-card")}>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Team 2</p>
          <p className="font-display text-3xl font-extrabold text-action tabular-nums">{scores[1]}</p>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/70 p-4 backdrop-blur-sm">
          <div className="animate-pop w-full max-w-xl rounded-3xl border-2 border-border bg-card p-8 text-center shadow-lift">
            {open.chance ? (
              <>
                {ChanceIcon ? <ChanceIcon className="mx-auto size-14 text-action" /> : null}
                <h3 className="font-display mt-4 text-3xl font-extrabold text-action">
                  {CHANCE_META[open.chance].title}
                </h3>
                <p className="mt-2 text-muted-foreground">{CHANCE_META[open.chance].blurb}</p>
                <Button
                  onClick={() => applyChance(open.chance as Chance, open.n)}
                  className="mt-6 bg-gradient-action font-bold text-action-foreground"
                >
                  Apply to Team {turn + 1}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Tile {open.n} · Team {turn + 1}
                </p>
                <h3 className="font-display mt-3 text-2xl font-extrabold">{item?.prompt}</h3>
                {revealed ? (
                  <p className="mt-4 rounded-2xl bg-success/12 px-4 py-3 text-lg font-bold text-success">
                    {item?.answer}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {!revealed ? (
                    <Button onClick={() => setRevealed(true)} className="bg-gradient-brand font-bold text-primary-foreground">
                      Check answer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => score(true)} className="gap-2 bg-success font-bold text-success-foreground">
                        <Check className="size-4" /> Correct (+15 pts)
                      </Button>
                      <Button onClick={() => score(false)} variant="outline" className="gap-2 font-bold">
                        <X className="size-4" /> Incorrect
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
