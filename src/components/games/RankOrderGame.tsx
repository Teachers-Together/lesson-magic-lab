import * as React from "react";
import { Check, ListOrdered, RotateCcw, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

export type RankOrderGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (result: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (event: { type: string; itemId?: string; choice?: string; correct?: boolean }) => void;
  lang?: string;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Shuffle until the order differs from the correct one (when possible). */
function initialOrder(items: GameItem[]): GameItem[] {
  let shuffled = shuffle(items);
  if (items.length > 1) {
    let guard = 0;
    while (guard < 20 && shuffled.every((it, i) => Number.parseInt(it.answer, 10) === i + 1)) {
      shuffled = shuffle(items);
      guard += 1;
    }
  }
  return shuffled;
}

export default function RankOrderGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
}: RankOrderGameProps) {
  const ordered = React.useMemo(
    () =>
      [...items]
        .filter((it) => Number.parseInt(it.answer, 10) > 0)
        .sort((a, b) => Number.parseInt(a.answer, 10) - Number.parseInt(b.answer, 10)),
    [items],
  );

  const [rows, setRows] = React.useState<GameItem[]>(() => initialOrder(ordered));
  const [selected, setSelected] = React.useState<number | null>(null);
  const [pendingKey, setPendingKey] = React.useState<number | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const [feedback, setFeedback] = React.useState<boolean[] | null>(null);
  const [completed, setCompleted] = React.useState(false);
  const completedRef = React.useRef(false);

  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragStartY, setDragStartY] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const rowRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const swap = React.useCallback((a: number, b: number) => {
    if (a === b || a < 0 || b < 0) return;
    setRows((prev) => {
      if (a >= prev.length || b >= prev.length) return prev;
      const next = [...prev];
      [next[a], next[b]] = [next[b]!, next[a]!];
      return next;
    });
    setFeedback(null);
  }, []);

  function handleRowClick(index: number) {
    if (completed) return;
    if (selected === null) {
      setSelected(index);
      onEvent?.({ type: "select", itemId: rows[index]?.id });
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    swap(selected, index);
    onEvent?.({ type: "swap", itemId: rows[selected]?.id });
    setSelected(null);
  }

  function check() {
    if (completed) return;
    const result = rows.map((it, i) => Number.parseInt(it.answer, 10) === i + 1);
    setFeedback(result);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const allCorrect = result.every(Boolean);
    onEvent?.({
      type: allCorrect ? "complete" : "check",
      correct: allCorrect,
      choice: String(nextAttempts),
    });
    if (allCorrect && !completedRef.current) {
      completedRef.current = true;
      setCompleted(true);
      setSelected(null);
      onComplete({ correct: ordered.length, total: ordered.length, missedIds: [] });
    }
  }

  function reset() {
    completedRef.current = false;
    setRows(initialOrder(ordered));
    setSelected(null);
    setPendingKey(null);
    setAttempts(0);
    setFeedback(null);
    setCompleted(false);
  }

  // ---- pointer drag ----
  function onPointerDown(e: React.PointerEvent<HTMLLIElement>, index: number) {
    if (completed) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragIndex(index);
    setDragStartY(e.clientY);
    setDragOffset(0);
    setHoverIndex(index);
    setSelected(null);
  }

  function onPointerMove(e: React.PointerEvent<HTMLLIElement>) {
    if (dragIndex === null) return;
    setDragOffset(e.clientY - dragStartY);
    let found: number | null = null;
    rowRefs.current.forEach((el, i) => {
      if (!el || i === dragIndex) return;
      const rect = el.getBoundingClientRect();
      if (
        e.clientY >= rect.top - 16 &&
        e.clientY <= rect.bottom + 16 &&
        e.clientX >= rect.left - 16 &&
        e.clientX <= rect.right + 16
      ) {
        found = i;
      }
    });
    setHoverIndex(found);
  }

  function onPointerUp() {
    if (dragIndex !== null && hoverIndex !== null && hoverIndex !== dragIndex) {
      setRows((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(hoverIndex, 0, moved!);
        return next;
      });
      setFeedback(null);
      onEvent?.({ type: "drag", itemId: rows[dragIndex]?.id });
    }
    setDragIndex(null);
    setHoverIndex(null);
  }

  // ---- teacher keyboard: two numbers swap those rows ----
  React.useEffect(() => {
    if (!teacherMode || completed) return;
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      const n = Number.parseInt(e.key, 10);
      if (Number.isNaN(n) || n < 1 || n > rows.length) return;
      e.preventDefault();
      if (pendingKey === null) {
        setPendingKey(n - 1);
        onEvent?.({ type: "select", itemId: rows[n - 1]?.id });
      } else if (pendingKey === n - 1) {
        setPendingKey(null);
      } else {
        swap(pendingKey, n - 1);
        onEvent?.({ type: "swap", itemId: rows[pendingKey]?.id });
        setPendingKey(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [teacherMode, completed, pendingKey, rows, swap, onEvent]);

  if (ordered.length === 0) {
    return (
      <GameChrome title="Rank & Order" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No items to order.</p>
      </GameChrome>
    );
  }

  const target = ordered.find((i) => i.targetStructure)?.targetStructure;

  if (completed) {
    return (
      <GameChrome
        title="Rank & Order"
        teacherMode={teacherMode}
        {...(target ? { targetStructure: target } : {})}
        progress={{ done: ordered.length, total: ordered.length }}
      >
        <div className="mx-auto w-full max-w-2xl space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-lg sm:p-8">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Trophy className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-bold">Correct order!</h2>
            <p className="mt-2 text-muted-foreground">
              {attempts} {attempts === 1 ? "attempt" : "attempts"} to get it right.
            </p>
          </div>

          <ol className="space-y-2">
            {rows.map((row, i) => (
              <li
                key={row.id}
                className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-600 font-display text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="font-medium">{row.prompt}</span>
              </li>
            ))}
          </ol>

          <div className="flex justify-center">
            <Button onClick={reset} className="gap-2 rounded-xl" size="lg">
              <RotateCcw className="size-4" />
              Play again
            </Button>
          </div>
        </div>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Rank & Order"
      teacherMode={teacherMode}
      {...(target ? { targetStructure: target } : {})}
      progress={{ done: feedback?.filter(Boolean).length ?? 0, total: ordered.length }}
    >
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Tap a row, then tap another to swap them — or drag rows into place.
          </p>
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            Attempts: {attempts}
          </Badge>
        </div>

        <ol className="touch-none select-none space-y-2">
          {rows.map((row, i) => {
            const isSelected = selected === i || pendingKey === i;
            const isDragged = dragIndex === i;
            const isHover = hoverIndex === i && dragIndex !== null && dragIndex !== i;
            const state = feedback?.[i];
            return (
              <li
                key={row.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                onPointerDown={(e) => onPointerDown(e, i)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onClick={() => handleRowClick(i)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Position ${i + 1}: ${row.prompt}`}
                className={cn(
                  "relative flex cursor-grab items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 shadow-sm transition-colors active:cursor-grabbing",
                  state === true && "border-emerald-500/60 bg-emerald-500/10",
                  state === false && "border-rose-500/60 bg-rose-500/10",
                  state === undefined && "border-border",
                  isSelected && "border-primary ring-2 ring-primary/40",
                  isHover && "border-dashed border-primary",
                  isDragged && "relative z-20 opacity-90 shadow-xl",
                )}
                style={isDragged ? { transform: `translateY(${dragOffset}px)` } : undefined}
              >
                {teacherMode ? <NumberBadge n={i + 1} /> : null}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-display text-sm font-extrabold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium">{row.prompt}</span>
                {state === true ? <Check className="size-5 shrink-0 text-emerald-600" /> : null}
              </li>
            );
          })}
        </ol>

        <div className="flex justify-center pt-2">
          <Button onClick={check} size="lg" className="gap-2 rounded-xl px-8">
            <ListOrdered className="size-5" />
            Check
          </Button>
        </div>
      </div>
    </GameChrome>
  );
}
