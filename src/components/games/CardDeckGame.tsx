import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameSummary } from "@/components/GameSummary";
import { celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export function CardDeckGame({
  activity,
  adaptClass,
}: {
  activity: Activity;
  adaptClass: string;
  lang?: string;
}) {
  const { soundOn, recordPlay } = useStore();
  const [round, setRound] = useState(0);
  const deck = useMemo(
    () => shuffle(activity.contentData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activity.id, round],
  );
  const [dealt, setDealt] = useState(0);
  const [dealing, setDealing] = useState(false);
  const [done, setDone] = useState(false);
  const start = useRef(Date.now());

  const current = dealt > 0 ? deck[dealt - 1] : undefined;
  const remaining = deck.length - dealt;

  const deal = () => {
    if (dealing || remaining === 0) return;
    setDealing(true);
    tone("click", soundOn);
    setTimeout(() => {
      setDealt((d) => d + 1);
      setDealing(false);
    }, 320);
  };

  const finish = () => {
    setDone(true);
    celebrate();
    tone("win", soundOn);
    recordPlay(activity.id, Math.round((dealt / Math.max(1, deck.length)) * 100));
  };

  if (done)
    return (
      <GameSummary
        score={dealt}
        total={deck.length}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setDealt(0);
          setDone(false);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,hsl(155_45%_28%),hsl(155_50%_18%))] p-6 shadow-lift sm:p-10",
        adaptClass,
      )}
    >
      <p className="text-center text-xs font-bold tracking-[0.3em] text-white/60 uppercase">
        Speaking prompt deck
      </p>

      <div className="mt-8 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
        <div className="relative mx-auto h-64 w-full max-w-sm">
          {/* remaining deck stack */}
          {Array.from({ length: Math.min(4, Math.max(remaining, 0)) }).map((_, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-3xl border-2 border-white/20 bg-gradient-brand shadow-lift"
              style={{
                transform: `translate(${idx * 6}px, ${idx * -6}px) rotate(${idx * -1.5}deg)`,
                zIndex: idx,
              }}
            />
          ))}

          {/* dealt card */}
          {current ? (
            <div
              key={current.id}
              className={cn(
                "absolute inset-0 z-20 flex flex-col justify-center gap-3 rounded-3xl border-2 border-action/70 bg-card p-6 text-center shadow-lift",
                dealing ? "animate-pop opacity-0" : "animate-pop",
              )}
            >
              <span className="text-xs font-bold tracking-widest text-action uppercase">
                {current.answer || "Roleplay"}
              </span>
              <p className="font-display text-xl leading-snug font-extrabold sm:text-2xl">
                {current.prompt}
              </p>
              <span className="text-xs text-muted-foreground">
                Card {dealt} of {deck.length}
              </span>
            </div>
          ) : remaining > 0 ? (
            <div className="absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-white/25 bg-gradient-brand text-center">
              <p className="font-display text-lg font-extrabold text-primary-foreground">
                Tap “Deal card” to begin
              </p>
            </div>
          ) : null}
        </div>

        {/* discard pile */}
        <div className="mx-auto h-40 w-32 shrink-0">
          <p className="mb-2 text-center text-[10px] font-bold tracking-widest text-white/60 uppercase">
            Discard
          </p>
          <div className="relative h-32 w-full">
            {dealt <= 1 ? (
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/25" />
            ) : (
              Array.from({ length: Math.min(4, dealt - 1) }).map((_, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 rounded-2xl border border-white/25 bg-white/85 shadow-soft"
                  style={{
                    transform: `translate(${idx * 3}px, ${idx * 3}px) rotate(${idx * 2.5 - 3}deg)`,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button
          onClick={deal}
          disabled={remaining === 0}
          className="bg-gradient-action px-10 py-6 font-display text-lg font-extrabold text-action-foreground hover:-translate-y-1"
        >
          {remaining === 0 ? "Deck empty" : "Deal card"}
        </Button>
        <Button variant="secondary" onClick={finish} disabled={dealt === 0} className="py-6">
          Finish session
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-white/70">{remaining} cards left in the deck</p>
    </div>
  );
}

export default CardDeckGame;
