import { Link } from "@tanstack/react-router";
import { Trophy, Timer, Target, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const LEADERBOARD = [
  { name: "Amara O.", score: 98 },
  { name: "Diego R.", score: 94 },
  { name: "Wei L.", score: 90 },
  { name: "Priya S.", score: 85 },
];

export function GameSummary({
  score,
  total,
  seconds,
  onReplay,
}: {
  score: number;
  total: number;
  seconds: number;
  onReplay: () => void;
}) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  const board = [...LEADERBOARD, { name: "You", score: pct }].sort((a, b) => b.score - a.score);

  return (
    <div className="animate-pop mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-gradient-action text-action-foreground">
          <Trophy className="size-6" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold">Game complete!</h2>
          <p className="text-sm text-muted-foreground">Nice work — here's how you did.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-success/12 p-4 text-center">
          <Target className="mx-auto size-5 text-success" />
          <p className="mt-2 text-2xl font-bold text-success">{pct}%</p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
        <div className="rounded-2xl bg-secondary p-4 text-center">
          <Trophy className="mx-auto size-5 text-primary" />
          <p className="mt-2 text-2xl font-bold text-primary">
            {score}/{total}
          </p>
          <p className="text-xs text-muted-foreground">Correct</p>
        </div>
        <div className="rounded-2xl bg-action/15 p-4 text-center">
          <Timer className="mx-auto size-5 text-action" />
          <p className="mt-2 text-2xl font-bold">{seconds}s</p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold">Class leaderboard</p>
        <ul className="space-y-1.5">
          {board.map((row, i) => (
            <li
              key={row.name}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                row.name === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <span className="font-medium">
                {i + 1}. {row.name}
              </span>
              <span className="font-bold">{row.score}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onReplay} className="flex-1 bg-gradient-action text-action-foreground hover:opacity-90">
          <RotateCcw className="size-4" /> Play again
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to="/activities">Back to activities</Link>
        </Button>
      </div>
    </div>
  );
}
