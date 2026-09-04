import * as React from "react";
import { Dices, Star, ArrowLeftRight, Flame, Flag } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { GameChrome } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------- data mapping ----------
// prompt         = the speaking prompt on the square
// distractors[0] = optional square marker: "bonus" | "swap" | "challenge"
// Squares are laid out around the edge of the play area, start at bottom-left.

type Marker = "bonus" | "swap" | "challenge" | null;

function markerOf(item: GameItem): Marker {
  const m = item.distractors?.[0]?.toLowerCase();
  if (m === "bonus" || m === "swap" || m === "challenge") return m;
  return null;
}

type Coord = { col: number; row: number };

/** Perimeter path, clockwise from bottom-left. */
function trackCoords(count: number): { coords: Coord[]; cols: number; rows: number } {
  const cols = 7;
  const rows = Math.max(3, Math.ceil((count - (2 * cols - 2)) / 2) + 1);
  const coords: Coord[] = [];
  // bottom row: left → right
  for (let c = 0; c < cols; c++) coords.push({ col: c, row: rows - 1 });
  // right column: up
  for (let r = rows - 2; r >= 0; r--) coords.push({ col: cols - 1, row: r });
  // top row: right → left
  for (let c = cols - 2; c >= 0; c--) coords.push({ col: c, row: 0 });
  // left column: down
  for (let r = 1; r < rows - 1; r++) coords.push({ col: 0, row: r });
  return { coords, cols, rows };
}

type Phase =
  | { kind: "roll" }
  | { kind: "moving"; target: number; roll: number }
  | { kind: "prompt"; square: number; marker: Marker }
  | { kind: "won"; winner: number };

const PLAYERS = ["Teacher", "Student"] as const;

export function BoardTrackGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
}) {
  const { items, onComplete, onEvent } = props;

  const { coords, cols, rows } = React.useMemo(() => trackCoords(items.length), [items.length]);
  const lastSquare = items.length - 1;

  const [positions, setPositions] = React.useState<[number, number]>([0, 0]);
  const [current, setCurrent] = React.useState<0 | 1>(1); // student starts
  const [phase, setPhase] = React.useState<Phase>({ kind: "roll" });
  const [die, setDie] = React.useState(1);
  const [rolling, setRolling] = React.useState(false);
  const [answered, setAnswered] = React.useState(0);
  const timeouts = React.useRef<number[]>([]);

  React.useEffect(() => {
    const stash = timeouts.current;
    return () => stash.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(window.setTimeout(fn, ms));
  };

  const roll = React.useCallback(() => {
    if (rolling || phase.kind !== "roll") return;
    setRolling(true);
    const final = 1 + Math.floor(Math.random() * 6);
    // spin animation: flash random faces, then settle
    let ticks = 0;
    const spin = window.setInterval(() => {
      setDie(1 + Math.floor(Math.random() * 6));
      ticks++;
      if (ticks >= 8) {
        window.clearInterval(spin);
        setDie(final);
        setRolling(false);
        onEvent?.({ type: "roll" });
        // hop square by square
        const start = positions[current];
        const target = Math.min(start + final, lastSquare);
        setPhase({ kind: "moving", target, roll: final });
        for (let step = 1; step <= target - start; step++) {
          later(() => {
            setPositions((prev) => {
              const next: [number, number] = [...prev] as [number, number];
              next[current] = Math.min(prev[current] + 1, lastSquare);
              return next;
            });
          }, step * 250);
        }
        later(() => {
          if (target >= lastSquare) {
            setPhase({ kind: "won", winner: current });
            onComplete({
              correct: answered,
              total: Math.max(answered, 1),
              missedIds: [],
            });
          } else {
            setPhase({ kind: "prompt", square: target, marker: markerOf(items[target]!) });
          }
        }, (target - start) * 250 + 300);
      }
    }, 90);
  }, [rolling, phase.kind, positions, current, lastSquare, items, answered, onComplete, onEvent]);

  // Space = roll, via GameChrome
  const handleAdvance = React.useCallback(() => {
    if (phase.kind === "roll") roll();
  }, [phase.kind, roll]);

  const doneAnswering = () => {
    if (phase.kind !== "prompt") return;
    setAnswered((a) => a + 1);
    const marker = phase.marker;
    if (marker === "bonus") {
      // same player rolls again
      setPhase({ kind: "roll" });
      onEvent?.({ type: "bonus" });
      return;
    }
    if (marker === "swap") {
      setPositions((prev) => [prev[1], prev[0]]);
      onEvent?.({ type: "swap" });
    }
    setCurrent((c) => (c === 0 ? 1 : 0));
    setPhase({ kind: "roll" });
  };

  const cellAt = (col: number, row: number) => coords.findIndex((c) => c.col === col && c.row === row);

  const markerBadge = (m: Marker) =>
    m === "bonus" ? (
      <Star className="h-3.5 w-3.5 text-amber-500" />
    ) : m === "swap" ? (
      <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
    ) : m === "challenge" ? (
      <Flame className="h-3.5 w-3.5 text-rose-500" />
    ) : null;

  return (
    <GameChrome
      title="Speaking Board"
      {...(items[0]?.targetStructure ? { targetStructure: items[0].targetStructure } : {})}
      teacherMode={props.teacherMode}
      onAdvance={handleAdvance}
      progress={{
        done: Math.max(positions[0], positions[1]),
        total: lastSquare,
      }}
    >
      <div className="flex w-full max-w-6xl flex-col items-center gap-4">
        {/* status bar: turn + positions + die */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {PLAYERS.map((name, i) => (
            <Badge
              key={name}
              variant={current === i ? "default" : "secondary"}
              className="gap-2 px-3 py-1.5 text-sm"
            >
              <span
                className={cn(
                  "inline-block h-3 w-3 rounded-full",
                  i === 0 ? "bg-primary-foreground/70" : "bg-emerald-500",
                )}
              />
              {name}: square {positions[i as 0 | 1] + 1}
              {current === i && phase.kind !== "won" && " · your turn"}
            </Badge>
          ))}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground",
                rolling && "animate-pulse",
              )}
            >
              {die}
            </span>
            <Button
              size="sm"
              onClick={roll}
              disabled={rolling || phase.kind !== "roll"}
            >
              <Dices className="mr-2 h-4 w-4" />
              Roll (Space)
            </Button>
          </div>
        </div>

        {/* board */}
        <Card className="w-full p-3">
          <div
            className="grid w-full gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(64px, 1fr))`,
            }}
          >
            {Array.from({ length: rows * cols }, (_, idx) => {
              const col = idx % cols;
              const row = Math.floor(idx / cols);
              const squareIdx = cellAt(col, row);
              if (squareIdx < 0 || squareIdx >= items.length) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center rounded-md bg-muted/20"
                  />
                );
              }
              const item = items[squareIdx]!;
              const m = markerOf(item);
              const teacherHere = positions[0] === squareIdx;
              const studentHere = positions[1] === squareIdx;
              const isLast = squareIdx === lastSquare;
              return (
                <div
                  key={idx}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 rounded-md border p-1 text-center",
                    isLast ? "border-amber-500 bg-amber-500/10" : "border-border bg-card",
                    (teacherHere || studentHere) && "ring-2 ring-primary",
                  )}
                >
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    {squareIdx + 1}
                    {isLast ? <Flag className="h-3 w-3 text-amber-500" /> : markerBadge(m)}
                  </div>
                  <div className="line-clamp-2 text-[11px] leading-tight">{item.prompt}</div>
                  <div className="flex gap-1">
                    {teacherHere && (
                      <span className="h-3.5 w-3.5 rounded-full bg-primary" title="Teacher" />
                    )}
                    {studentHere && (
                      <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" title="Student" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* prompt overlay */}
        {phase.kind === "prompt" && (
          <Card className="w-full border-primary p-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Badge variant="secondary">
                {PLAYERS[current]} · square {phase.square + 1}
              </Badge>
              {phase.marker === "bonus" && (
                <Badge className="bg-amber-500 text-white">Bonus — roll again after!</Badge>
              )}
              {phase.marker === "swap" && (
                <Badge>Swap — you trade places!</Badge>
              )}
              {phase.marker === "challenge" && (
                <Badge variant="destructive">Challenge — answer in a full sentence!</Badge>
              )}
            </div>
            <p className="text-3xl font-bold leading-snug sm:text-4xl">
              {items[phase.square]?.prompt}
            </p>
            {items[phase.square]?.exampleSentence && (
              <p className="mt-3 text-lg text-muted-foreground">
                e.g. {items[phase.square]?.exampleSentence}
              </p>
            )}
            <Button size="lg" className="mt-6 text-lg" onClick={doneAnswering}>
              Done — good answer
            </Button>
          </Card>
        )}

        {/* winner overlay */}
        {phase.kind === "won" && (
          <Card className="w-full border-emerald-500 bg-emerald-500/10 p-8 text-center">
            <div className="text-3xl font-bold">
              🏆 {PLAYERS[phase.winner]} wins!
            </div>
            <p className="mt-2 text-muted-foreground">
              Final position — Teacher: {positions[0] + 1} · Student: {positions[1] + 1}
            </p>
          </Card>
        )}
      </div>
    </GameChrome>
  );
}
