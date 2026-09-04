import { useRef, useState } from "react";
import { Check, Gift, X } from "lucide-react";
import { GameSummary } from "@/components/GameSummary";
import { Button } from "@/components/ui/button";
import { burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LID_TONES = [
  "from-primary to-primary/70",
  "from-action to-action/70",
  "from-success to-success/70",
];

export function OpenBoxGame({ activity, adaptClass }: { activity: Activity; adaptClass: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;

  const [openId, setOpenId] = useState<string | null>(null);
  const [answered, setAnswered] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const start = useRef(Date.now());

  const open = items.find((i) => i.id === openId) ?? null;
  const done = answered.length === items.length && items.length > 0;

  const markAnswered = (id: string, x: number, y: number) => {
    const next = [...answered, id];
    setAnswered(next);
    setOpenId(null);
    tone("correct", soundOn);
    burstAt(x, y);
    if (next.length === items.length) {
      celebrate();
      tone("win", soundOn);
      recordPlay(activity.id, 100);
    }
  };

  if (done)
    return (
      <GameSummary
        score={items.length}
        total={items.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setAnswered([]);
          setOpenId(null);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div key={round} className={cn("mx-auto w-full max-w-4xl", adaptClass)}>
      <p className="mb-5 text-center text-sm text-muted-foreground">
        Tap a mystery box to reveal a speaking prompt — perfect for whiteboard warm-ups.
      </p>

      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {items.map((it, i) => {
          const used = answered.includes(it.id);
          return (
            <button
              key={it.id}
              disabled={used}
              onClick={() => {
                tone("click", soundOn);
                setOpenId(it.id);
              }}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-3xl border-2 transition-all duration-300",
                used
                  ? "border-border bg-muted/60 opacity-45"
                  : "border-transparent bg-gradient-to-br shadow-lift hover:-translate-y-1 hover:scale-[1.03]",
                !used && LID_TONES[i % LID_TONES.length],
              )}
              style={{ perspective: "700px" }}
            >
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-3xl bg-white/25 transition-transform duration-500",
                  !used && "group-hover:[transform:rotateX(-38deg)]",
                )}
              />
              <span
                className={cn(
                  "font-display relative grid h-full place-items-center text-4xl font-extrabold sm:text-5xl",
                  used ? "text-muted-foreground" : "text-white",
                )}
              >
                {used ? <Check className="size-8" /> : i + 1}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Answered {answered.length} / {items.length}
      </p>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 p-5 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-pop w-full max-w-lg rounded-3xl border-2 border-action/40 bg-card p-8 text-center shadow-lift"
          >
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-action text-action-foreground">
              <Gift className="size-7" />
            </span>
            <p className="font-display mt-5 text-2xl leading-snug font-extrabold">{open.prompt}</p>
            {open.answer ? (
              <p className="mt-3 text-sm font-semibold text-primary">Focus: {open.answer}</p>
            ) : null}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-2xl"
                onClick={() => setOpenId(null)}
              >
                <X className="size-4" /> Close
              </Button>
              <Button
                className="h-12 flex-1 rounded-2xl bg-gradient-action font-bold text-action-foreground hover:opacity-90"
                onClick={(e) => markAnswered(open.id, e.clientX, e.clientY)}
              >
                <Check className="size-4" /> Mark as Answered
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
