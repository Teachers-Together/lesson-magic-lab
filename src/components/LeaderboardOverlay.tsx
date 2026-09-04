import { useEffect } from "react";
import { Crown, RefreshCw, Sparkles, Target, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { megaCelebrate } from "@/lib/fx";
import { cn } from "@/lib/utils";

export type TeamResult = { name: string; score: number; correct?: number; attempts?: number };

const PODIUM_STYLE = [
  { h: "h-40 sm:h-52", bg: "bg-gradient-to-b from-success to-success/70", place: "1st" },
  { h: "h-28 sm:h-36", bg: "bg-gradient-to-b from-action to-action/70", place: "2nd" },
  { h: "h-20 sm:h-24", bg: "bg-gradient-to-b from-action/80 to-primary/70", place: "3rd" },
];

export function LeaderboardOverlay({
  teams,
  onPlayAgain,
  onClose,
}: {
  teams: TeamResult[];
  onPlayAgain: () => void;
  onClose?: () => void;
}) {
  useEffect(() => {
    megaCelebrate();
  }, []);

  const ranked = [...teams].sort((a, b) => b.score - a.score);
  const order = [ranked[1], ranked[0], ranked[2]].filter(Boolean) as TeamResult[]; // 2nd, 1st, 3rd
  const totalAttempts = teams.reduce((s, t) => s + (t.attempts ?? 0), 0);
  const totalCorrect = teams.reduce((s, t) => s + (t.correct ?? 0), 0);
  const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const top = ranked[0];

  return (
    <div className="animate-fade-in fixed inset-0 z-[70] overflow-y-auto bg-gradient-brand px-4 py-10">
      {onClose ? (
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          aria-label="Close leaderboard"
          className="absolute top-4 right-4 text-primary-foreground hover:text-primary-foreground"
        >
          <X className="size-6" />
        </Button>
      ) : null}

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-primary-foreground/70 uppercase">
          Final results
        </p>
        <h2 className="font-display mt-2 text-4xl font-extrabold text-primary-foreground sm:text-5xl">
          Classroom Leaderboard
        </h2>

        <div className="mt-12 flex items-end justify-center gap-3 sm:gap-6">
          {order.map((t) => {
            const rank = ranked.indexOf(t);
            const style = PODIUM_STYLE[rank] ?? PODIUM_STYLE[2]!;
            return (
              <div key={t.name} className="flex w-28 flex-col items-center sm:w-40">
                {rank === 0 ? <Crown className="size-8 text-action" /> : null}
                <p className="font-display truncate text-base font-extrabold text-primary-foreground sm:text-lg">
                  {t.name}
                </p>
                <p className="font-display text-2xl font-extrabold text-primary-foreground/90 tabular-nums">
                  {t.score}
                </p>
                <div
                  className={cn(
                    "animate-scale-in mt-3 grid w-full place-items-center rounded-t-2xl border-x-4 border-t-4 border-primary-foreground/20 shadow-lift",
                    style.h,
                    style.bg,
                  )}
                >
                  <span className="font-display text-3xl font-extrabold text-white/90">{style.place}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-auto h-3 w-full max-w-2xl rounded-b-xl bg-primary-foreground/25" />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-primary-foreground/20 bg-foreground/20 p-5 backdrop-blur-sm">
            <Target className="mx-auto size-6 text-success" />
            <p className="font-display mt-2 text-3xl font-extrabold text-primary-foreground tabular-nums">
              {accuracy}%
            </p>
            <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
              Total class accuracy
            </p>
          </div>
          <div className="rounded-3xl border border-primary-foreground/20 bg-foreground/20 p-5 backdrop-blur-sm">
            <Trophy className="mx-auto size-6 text-action" />
            <p className="font-display mt-2 truncate text-2xl font-extrabold text-primary-foreground">
              {top?.name ?? "—"}
            </p>
            <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
              Top earning team · {top?.score ?? 0} pts
            </p>
          </div>
          <div className="grid place-items-center rounded-3xl border border-primary-foreground/20 bg-foreground/20 p-5 backdrop-blur-sm">
            <Button
              onClick={onPlayAgain}
              className="h-12 gap-2 rounded-full bg-gradient-action px-6 font-bold text-action-foreground hover:opacity-90"
            >
              <RefreshCw className="size-4" /> Play Again / Remix
            </Button>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-primary-foreground/70">
              <Sparkles className="size-3" /> Reshuffles tiles &amp; chance cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
