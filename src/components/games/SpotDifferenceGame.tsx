import * as React from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------- data mapping ----------
// prompt          = object label (or an emoji if no imageUrl)
// answer          = grid cell in the STUDENT scene, "col,row" (0-based, 4x3)
// distractors[0]  = grid cell in the TEACHER scene; absent or equal to answer
//                   means the object is identical in both scenes (not a difference)
// targetStructure = drives the sentence frame ("prepositions", "there is", "comparative")

type Cell = { col: number; row: number };

const COLS = 4;
const ROWS = 3;

function parseCell(raw: string | undefined): Cell | null {
  if (!raw) return null;
  const m = raw.trim().match(/^(\d+)\s*,\s*(\d+)$/);
  if (!m) return null;
  const col = Number(m[1]);
  const row = Number(m[2]);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return null;
  return { col, row };
}

function isDifference(item: GameItem): boolean {
  const a = parseCell(item.answer);
  const b = parseCell(item.distractors?.[0]);
  if (!a) return false;
  if (!b) return false;
  return a.col !== b.col || a.row !== b.row;
}

function sentenceFrame(targetStructure?: string): string {
  const t = (targetStructure ?? "").toLowerCase();
  if (t.includes("preposition") || t.includes("place"))
    return "In my picture, the ___ is ___ the ___.";
  if (t.includes("there is") || t.includes("there are") || t.includes("there"))
    return "There is a ___ in my picture. / There are ___ in my picture.";
  if (t.includes("comparative") || t.includes("bigger") || t.includes("than"))
    return "The ___ in my picture is ___ than yours.";
  return "In my picture, the ___ is ___.";
}

function describeFound(item: GameItem): string {
  const b = parseCell(item.distractors?.[0]);
  return b
    ? `“The ${item.prompt} is in a different place.”`
    : `“The ${item.prompt} is only in my picture.”`;
}

// ---------- scene panel ----------

function ScenePanel(props: {
  label: string;
  items: GameItem[];
  positions: Map<string, Cell>;
  foundIds: Set<string>;
  teacherMode: boolean;
  clickable: boolean;
  numbers: Map<string, number>;
  onConfirm: (item: GameItem) => void;
}) {
  const { label, items, positions, foundIds, teacherMode, clickable, numbers, onConfirm } = props;

  const grid = React.useMemo(() => {
    const g: (GameItem | null)[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => null),
    );
    for (const item of items) {
      const cell = positions.get(item.id);
      if (cell) g[cell.row]![cell.col] = item;
    }
    return g;
  }, [items, positions]);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className="grid flex-1 gap-2"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
      >
        {grid.flatMap((rowItems, row) =>
          rowItems.map((item, col) => {
            if (!item) {
              return (
                <div
                  key={`${row}-${col}`}
                  className="rounded-lg border border-dashed border-border bg-muted/30"
                />
              );
            }
            const found = foundIds.has(item.id);
            const n = numbers.get(item.id);
            const cell = (
              <div
                className={cn(
                  "relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border bg-card p-1 transition",
                  clickable && !found && "cursor-pointer hover:border-primary hover:bg-accent",
                  found && "border-emerald-500 bg-emerald-500/10",
                )}
              >
                {teacherMode && n != null && !found && <NumberBadge n={n} />}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-4xl leading-none sm:text-5xl">{item.prompt}</span>
                )}
                <span className="text-center text-xs font-medium text-muted-foreground">
                  {item.prompt}
                </span>
                {found && (
                  <span className="absolute right-1 top-1 rounded-full bg-emerald-500 p-0.5 text-primary-foreground">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
            );
            return clickable && !found ? (
              <button
                key={item.id + cellKey(positions.get(item.id))}
                type="button"
                onClick={() => onConfirm(item)}
                className="text-left"
              >
                {cell}
              </button>
            ) : (
              <div key={item.id + cellKey(positions.get(item.id))}>{cell}</div>
            );
          }),
        )}
      </div>
    </Card>
  );
}

function cellKey(c: Cell | undefined): string {
  return c ? `-${c.col}-${c.row}` : "";
}

// ---------- main game ----------

export function SpotDifferenceGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const studentPositions = React.useMemo(() => {
    const m = new Map<string, Cell>();
    items.forEach((it, i) => {
      const cell = parseCell(it.answer) ?? { col: i % COLS, row: Math.floor(i / COLS) % ROWS };
      m.set(it.id, cell);
    });
    return m;
  }, [items]);

  const teacherPositions = React.useMemo(() => {
    const m = new Map<string, Cell>();
    items.forEach((it) => {
      const cell = parseCell(it.distractors?.[0]) ?? studentPositions.get(it.id) ?? null;
      if (cell) m.set(it.id, cell);
    });
    return m;
  }, [items, studentPositions]);

  const differences = React.useMemo(() => items.filter(isDifference), [items]);

  const [foundIds, setFoundIds] = React.useState<Set<string>>(new Set());
  const [foundList, setFoundList] = React.useState<GameItem[]>([]);
  const [studentView, setStudentView] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const numbers = React.useMemo(() => {
    const m = new Map<string, number>();
    differences.slice(0, 9).forEach((it, i) => m.set(it.id, i + 1));
    return m;
  }, [differences]);

  const confirm = React.useCallback(
    (item: GameItem) => {
      if (!isDifference(item) || foundIds.has(item.id)) return;
      setFoundIds((prev) => new Set(prev).add(item.id));
      setFoundList((prev) => [...prev, item]);
      onEvent?.({ type: "difference_found", itemId: item.id });
    },
    [foundIds, onEvent],
  );

  const undo = React.useCallback(() => {
    setFoundList((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1]!;
      setFoundIds((s) => {
        const next = new Set(s);
        next.delete(last.id);
        return next;
      });
      onEvent?.({ type: "undo", itemId: last.id });
      return prev.slice(0, -1);
    });
  }, [onEvent]);

  // number keys confirm differences in teacherMode
  React.useEffect(() => {
    if (!teacherMode) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 9) {
        const item = differences[n - 1];
        if (item) confirm(item);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [teacherMode, differences, confirm]);

  const allFound = foundIds.size >= differences.length && differences.length > 0;

  React.useEffect(() => {
    if (allFound && !done) {
      setDone(true);
      onComplete({ correct: differences.length, total: differences.length, missedIds: [] });
    }
  }, [allFound, done, differences.length, onComplete]);

  const frame = sentenceFrame(items[0]?.targetStructure);

  const finishEarly = () => {
    if (done) return;
    setDone(true);
    const missed = differences.filter((d) => !foundIds.has(d.id)).map((d) => d.id);
    onComplete({ correct: foundIds.size, total: differences.length, missedIds: missed });
  };

  return (
    <GameChrome
      title="Spot the Difference"
      {...(items[0]?.targetStructure ? { targetStructure: items[0].targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      progress={{ done: foundIds.size, total: differences.length }}
    >
      <div className="flex w-full max-w-6xl flex-col gap-4">
        {/* permanent sentence frame */}
        <Card className="border-primary/40 bg-primary/5 p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Say it like this
          </div>
          <div className="mt-1 text-xl font-bold sm:text-2xl">{frame}</div>
        </Card>

        {/* teacher controls */}
        {teacherMode && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={studentView ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStudentView((v) => !v)}
            >
              {studentView ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {studentView ? "Student view: ON" : "Student view: off"}
            </Button>
            <Badge variant="secondary">
              {foundIds.size} / {differences.length} differences found
            </Badge>
            {!done && (
              <Button variant="ghost" size="sm" onClick={finishEarly}>
                End round
              </Button>
            )}
          </div>
        )}

        {/* scenes */}
        <div
          className={cn(
            "grid gap-4",
            studentView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
          )}
          style={{ minHeight: 380 }}
        >
          <ScenePanel
            label={studentView ? "Your picture" : "Student's picture (A)"}
            items={items}
            positions={studentPositions}
            foundIds={foundIds}
            teacherMode={teacherMode}
            clickable={!done}
            numbers={numbers}
            onConfirm={confirm}
          />
          {!studentView && (
            <ScenePanel
              label="Teacher's picture (B)"
              items={items}
              positions={teacherPositions}
              foundIds={foundIds}
              teacherMode={false}
              clickable={false}
              numbers={numbers}
              onConfirm={() => undefined}
            />
          )}
        </div>

        {/* running list of finds */}
        <Card className="p-4">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Found differences
          </div>
          {foundList.length === 0 ? (
            <p className="mt-2 text-muted-foreground">
              {teacherMode
                ? "Student describes — you click the object to confirm."
                : "Describe your picture to find the differences!"}
            </p>
          ) : (
            <ul className="mt-2 space-y-1">
              {foundList.map((it) => (
                <li key={it.id} className="flex items-center gap-2 text-lg">
                  <span className="rounded-full bg-emerald-500 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="font-medium">{it.prompt}</span>
                  <span className="text-muted-foreground">{describeFound(it)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {done && (
          <Card className="border-emerald-500 bg-emerald-500/10 p-6 text-center">
            <div className="text-2xl font-bold">Round complete!</div>
            <p className="mt-1 text-muted-foreground">
              {foundIds.size} of {differences.length} differences found.
            </p>
          </Card>
        )}
      </div>
    </GameChrome>
  );
}
