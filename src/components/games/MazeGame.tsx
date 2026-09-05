import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Heart } from "lucide-react";
import { GameSummary } from "@/components/GameSummary";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const COLS = 11;
const ROWS = 9;
const START = { r: 4, c: 5 };

const isWall = (r: number, c: number) =>
  r % 2 === 1 && c % 2 === 1 && !(r === START.r && c === START.c);

type Cell = { r: number; c: number };
const key = (p: Cell) => `${p.r}:${p.c}`;

const SPOTS: Cell[] = [
  { r: 0, c: 0 },
  { r: 0, c: COLS - 1 },
  { r: ROWS - 1, c: 0 },
  { r: ROWS - 1, c: COLS - 1 },
];

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export function MazeGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;

  const [level, setLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Cell>(START);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [enemies, setEnemies] = useState<(Cell & { dir: number })[]>([
    { r: 2, c: 1, dir: 1 },
    { r: 6, c: 9, dir: -1 },
    { r: 4, c: 2, dir: 1 },
  ]);
  const start = useRef(Date.now());
  const boardRef = useRef<HTMLDivElement>(null);

  const item = items[Math.min(level, items.length - 1)];
  const finished = level >= items.length || lives <= 0;

  const tokens = useMemo(() => {
    if (!item) return [] as { text: string; correct: boolean; at: Cell }[];
    const options = shuffle([
      { text: item.answer, correct: true },
      ...item.distractors.slice(0, 3).map((d) => ({ text: d, correct: false })),
    ]);
    return options.map((o, i) => ({ ...o, at: SPOTS[i % SPOTS.length]! }));
  }, [item, level]);

  const hit = useCallback(
    (next: Cell) => {
      const token = tokens.find((t) => key(t.at) === key(next));
      if (!token) return;
      if (token.correct) {
        setScore((s) => s + 1);
        setFlash("good");
        tone("correct", soundOn);
        const rect = boardRef.current?.getBoundingClientRect();
        burstAt(rect ? rect.left + rect.width / 2 : 200, rect ? rect.top + rect.height / 2 : 200);
        setTimeout(() => {
          setFlash(null);
          setPlayer(START);
          setLevel((l) => l + 1);
        }, 550);
      } else {
        setFlash("bad");
        tone("wrong", soundOn);
        buzz([30, 40, 30]);
        setLives((l) => l - 1);
        setTimeout(() => {
          setFlash(null);
          setPlayer(START);
        }, 450);
      }
    },
    [tokens, soundOn],
  );

  const move = useCallback(
    (dr: number, dc: number) => {
      if (flash || finished) return;
      setPlayer((p) => {
        const next = {
          r: Math.max(0, Math.min(ROWS - 1, p.r + dr)),
          c: Math.max(0, Math.min(COLS - 1, p.c + dc)),
        };
        if (isWall(next.r, next.c)) return p;
        hit(next);
        return next;
      });
    },
    [flash, finished, hit],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      move(d[0], d[1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setEnemies((prev) =>
        prev.map((e) => {
          let c = e.c + e.dir;
          let dir = e.dir;
          if (c < 0 || c > COLS - 1 || isWall(e.r, c)) {
            dir = -e.dir;
            c = e.c + dir;
            if (c < 0 || c > COLS - 1 || isWall(e.r, c)) c = e.c;
          }
          return { ...e, c, dir };
        }),
      );
    }, 420);
    return () => clearInterval(id);
  }, [finished]);

  useEffect(() => {
    if (finished || flash) return;
    if (enemies.some((e) => e.r === player.r && e.c === player.c)) {
      tone("wrong", soundOn);
      buzz(80);
      setLives((l) => l - 1);
      setFlash("bad");
      setTimeout(() => {
        setFlash(null);
        setPlayer(START);
      }, 400);
    }
  }, [enemies, player, finished, flash, soundOn]);

  useEffect(() => {
    if (level === items.length && items.length > 0) {
      celebrate();
      tone("win", soundOn);
      recordPlay(activity.id, Math.round((score / items.length) * 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  if (finished)
    return (
      <GameSummary
        score={score}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setLevel(0);
          setLives(3);
          setScore(0);
          setPlayer(START);
          start.current = Date.now();
        }}
      />
    );

  const dpad = [
    { label: "Up", icon: ArrowUp, d: [-1, 0], cls: "col-start-2 row-start-1" },
    { label: "Left", icon: ArrowLeft, d: [0, -1], cls: "col-start-1 row-start-2" },
    { label: "Down", icon: ArrowDown, d: [1, 0], cls: "col-start-2 row-start-2" },
    { label: "Right", icon: ArrowRight, d: [0, 1], cls: "col-start-3 row-start-2" },
  ] as const;

  return (
    <div className={cn("mx-auto w-full max-w-3xl", adaptClass)}>
      <div className="rounded-3xl border-2 border-primary/30 bg-card p-4 shadow-lift sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Level {level + 1} / {items.length}
          </span>
          <span className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn("size-4", i < lives ? "fill-action text-action" : "text-muted")}
              />
            ))}
          </span>
        </div>
        <p className="font-display mt-2 text-center text-xl font-extrabold sm:text-2xl">
          {item?.prompt}
        </p>

        <div
          ref={boardRef}
          className={cn(
            "mt-4 grid gap-[2px] rounded-2xl bg-primary/10 p-[6px] transition-colors duration-200",
            flash === "good" && "bg-success/30",
            flash === "bad" && "animate-shake bg-destructive/20",
          )}
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const wall = isWall(r, c);
            const token = tokens.find((t) => t.at.r === r && t.at.c === c);
            const isPlayer = player.r === r && player.c === c;
            const enemy = enemies.some((e) => e.r === r && e.c === c);
            return (
              <div
                key={i}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-[4px] text-[9px] font-bold sm:text-[11px]",
                  wall ? "bg-primary/70" : "bg-background",
                )}
              >
                {token ? (
                  <span className="absolute inset-0 grid place-items-center rounded-[4px] bg-action/25 px-0.5 text-center leading-none text-foreground">
                    {token.text}
                  </span>
                ) : null}
                {enemy ? (
                  <span className="absolute size-[70%] animate-pulse rounded-md bg-destructive" />
                ) : null}
                {isPlayer ? (
                  <span className="absolute size-[78%] rounded-full bg-gradient-action shadow-soft ring-2 ring-action" />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="hidden text-sm text-muted-foreground sm:block">
            Use the arrow keys to reach the correct answer — dodge the red blocks.
          </p>
          <div className="mx-auto grid grid-cols-3 grid-rows-2 gap-2 sm:mx-0">
            {dpad.map((b) => (
              <button
                key={b.label}
                aria-label={b.label}
                onClick={() => move(b.d[0], b.d[1])}
                className={cn(
                  "grid size-12 place-items-center rounded-2xl border-2 border-border bg-muted/60 transition-all active:scale-95 active:border-action active:bg-action/20",
                  b.cls,
                )}
              >
                <b.icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MazeGame;
