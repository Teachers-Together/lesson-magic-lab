import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameSummary } from "@/components/GameSummary";
import { buzz, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tile = { id: string; text: string };

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function pieces(answer: string): string[] {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  return words.length > 1 ? words : answer.trim().split("");
}

export function AnagramGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [track, setTrack] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());
  const dragged = useRef<Tile | null>(null);

  const item = items[i] ?? items[0];

  const all = useMemo<Tile[]>(() => {
    if (!item) return [];
    return shuffle(pieces(item.answer).map((text, idx) => ({ id: `${idx}-${text}`, text })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, round, activity.id]);

  const pile = all.filter((t) => !track.some((x) => x.id === t.id));

  const place = (t: Tile) => {
    setStatus("idle");
    tone("click", soundOn);
    setTrack((tr) => (tr.some((x) => x.id === t.id) ? tr : [...tr, t]));
  };
  const remove = (t: Tile) => {
    setStatus("idle");
    setTrack((tr) => tr.filter((x) => x.id !== t.id));
  };

  const check = () => {
    if (!item) return;
    const attempt = track.map((t) => t.text);
    const expected = pieces(item.answer);
    const ok =
      attempt.length === expected.length &&
      attempt.join(expected.length && expected[0]!.length > 1 ? " " : "").toLowerCase() ===
        item.answer.trim().toLowerCase();
    if (ok) {
      setStatus("ok");
      setScore((s) => s + 1);
      tone("correct", soundOn);
      setTimeout(() => {
        if (i + 1 >= items.length) {
          setDone(true);
          celebrate();
          tone("win", soundOn);
          recordPlay(activity.id, Math.round(((score + 1) / items.length) * 100));
        } else {
          setI(i + 1);
          setTrack([]);
          setStatus("idle");
        }
      }, 900);
    } else {
      setStatus("bad");
      setMisses((m) => m + 1);
      tone("wrong", soundOn);
      buzz([30, 40, 30]);
      setTimeout(() => setStatus("idle"), 600);
    }
  };

  if (!item) return <p className="text-muted-foreground">This activity has no content yet.</p>;

  if (done)
    return (
      <GameSummary
        score={score}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setI(0);
          setScore(0);
          setMisses(0);
          setTrack([]);
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div className={cn("mx-auto w-full max-w-3xl", adaptClass)}>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-muted-foreground">
          {i + 1} / {items.length}
        </span>
        <span className="rounded-full bg-success/15 px-3 py-1 text-success">Solved {score}</span>
        <span className="text-muted-foreground">Misses {misses}</span>
      </div>

      <div className="animate-pop mt-5 rounded-3xl bg-gradient-brand p-7 text-center shadow-lift">
        <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
          Unjumble
        </p>
        <p className="font-display mt-1 text-xl font-extrabold text-primary-foreground sm:text-2xl">
          {item.prompt}
        </p>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragged.current) place(dragged.current);
          dragged.current = null;
        }}
        className={cn(
          "mt-6 flex min-h-24 flex-wrap items-center gap-2 rounded-3xl border-2 border-dashed p-4 transition-all",
          status === "ok"
            ? "border-success bg-success/12"
            : status === "bad"
              ? "animate-shake border-destructive bg-destructive/10"
              : "border-border bg-muted/40",
        )}
      >
        {track.length === 0 ? (
          <span className="px-2 text-sm text-muted-foreground">
            Drag or tap the tiles below into the correct order…
          </span>
        ) : (
          track.map((t) => (
            <button
              key={t.id}
              onClick={() => remove(t)}
              className="rounded-xl bg-card px-4 py-3 font-display text-lg font-extrabold shadow-soft transition-transform hover:-translate-y-0.5"
            >
              {t.text}
            </button>
          ))
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {pile.map((t) => (
          <button
            key={t.id}
            draggable
            onDragStart={() => (dragged.current = t)}
            onClick={() => place(t)}
            className="animate-float cursor-grab rounded-2xl border-2 border-border bg-card px-4 py-3 font-display text-lg font-extrabold shadow-soft transition-all hover:-translate-y-1 hover:border-primary"
          >
            {t.text}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => setTrack([])}>
          Clear
        </Button>
        <Button
          onClick={check}
          disabled={track.length === 0}
          className={cn(
            "bg-gradient-action px-8 font-bold text-action-foreground",
            status === "ok" && "bg-success",
          )}
        >
          Check Arrangement
        </Button>
      </div>
    </div>
  );
}

export default AnagramGame;
