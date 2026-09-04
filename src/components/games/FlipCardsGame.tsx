import { useMemo, useRef, useState } from "react";
import { GameSummary } from "@/components/GameSummary";
import { buzz, burstAt, celebrate, tone } from "@/lib/fx";
import type { Activity } from "@/lib/store";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Token = { text: string; correct: boolean };

function buildTokens(prompt: string, answer: string): Token[] {
  const answerWords = answer.split(/\s+/).filter(Boolean);
  const key = answerWords[0] ?? answer;
  const decoys = prompt.split(/\s+/).filter((w) => w.length > 3).slice(0, 5);
  const pool = [...new Set([key, ...answerWords.slice(1, 2), ...decoys])];
  return pool
    .map((text) => ({ text: text.replace(/[.,?]$/, ""), correct: text === key }))
    .sort(() => Math.random() - 0.5);
}

export function FlipCardsGame({ activity, adaptClass }: { activity: Activity; adaptClass: string }) {
  const { soundOn, recordPlay } = useStore();
  const items = activity.contentData;
  const [round, setRound] = useState(0);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const start = useRef(Date.now());

  const tokenMap = useMemo(() => {
    const m: Record<string, Token[]> = {};
    items.forEach((it) => (m[it.id] = buildTokens(it.prompt, it.answer)));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, round]);

  const done = solved.length === items.length;

  const click = (id: string, token: Token, e: React.MouseEvent) => {
    if (solved.includes(id)) return;
    if (token.correct) {
      const next = [...solved, id];
      setSolved(next);
      tone("correct", soundOn);
      burstAt(e.clientX, e.clientY);
      if (next.length === items.length) {
        celebrate();
        tone("win", soundOn);
        recordPlay(activity.id, Math.max(20, 100 - misses * 10));
      }
    } else {
      setMisses((m) => m + 1);
      tone("wrong", soundOn);
      buzz([25, 35, 25]);
      setShakeId(id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  if (done)
    return (
      <GameSummary
        score={items.length}
        total={items.length + misses}
        seconds={Math.round((Date.now() - start.current) / 1000)}
        onReplay={() => {
          setRound((r) => r + 1);
          setFlipped([]);
          setSolved([]);
          setMisses(0);
          start.current = Date.now();
        }}
      />
    );

  return (
    <div className={cn("mx-auto w-full max-w-5xl", adaptClass)}>
      <p className="mb-5 text-center text-sm text-muted-foreground">
        Tap a card to flip it, then click the highlighted key word inside the sentence.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const isFlipped = flipped.includes(it.id);
          const isSolved = solved.includes(it.id);
          return (
            <div
              key={it.id}
              className={cn("flip-scene h-56", shakeId === it.id && "animate-shake")}
            >
              <div
                className="flip-inner"
                style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <button
                  onClick={() => setFlipped((f) => [...new Set([...f, it.id])])}
                  className="flip-face grid w-full place-items-center rounded-3xl bg-gradient-brand p-6 text-center shadow-soft transition-transform hover:-translate-y-1"
                >
                  <span className="font-display text-xl font-extrabold text-primary-foreground">
                    {it.prompt.slice(0, 60)}
                  </span>
                  <span className="text-xs text-primary-foreground/70">Tap to flip</span>
                </button>

                <div
                  className={cn(
                    "flip-face flip-back flex flex-col justify-center gap-3 rounded-3xl border-2 bg-card p-5",
                    isSolved ? "border-success bg-success/10" : "border-border",
                  )}
                >
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    {isSolved ? "Correct!" : "Click the key word"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(tokenMap[it.id] ?? []).map((tk, idx) => (
                      <button
                        key={`${tk.text}-${idx}`}
                        onClick={(e) => click(it.id, tk, e)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm font-semibold transition-all",
                          isSolved && tk.correct
                            ? "bg-success text-success-foreground"
                            : "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground",
                        )}
                      >
                        {tk.text}
                      </button>
                    ))}
                  </div>
                  {isSolved ? (
                    <p className="text-sm font-medium text-success">{it.answer}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Solved {solved.length} / {items.length} · Misses {misses}
      </p>
    </div>
  );
}
