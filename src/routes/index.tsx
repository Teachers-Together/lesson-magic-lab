import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Users, TrendingUp, Gamepad2, ArrowRight, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GAME_TEMPLATES, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduPulse AI — AI-Generated Classroom Games" },
      {
        name: "description",
        content:
          "Turn any lesson into an interactive classroom game in seconds. AI-built quizzes, matchups, wheels and drag-and-drop activities for K-12 teachers.",
      },
      { property: "og:title", content: "EduPulse AI — AI-Generated Classroom Games" },
      {
        property: "og:description",
        content: "Generate playable, differentiated learning games from any lesson text in seconds.",
      },
    ],
  }),
  component: Dashboard,
});

const COMMUNITY = [
  { title: "Water Cycle Sprint", author: "Ms. Rivera", type: "Quiz", plays: "3.2k" },
  { title: "Idioms Matchup", author: "Mr. Osei", type: "Matchup", plays: "1.8k" },
  { title: "Periodic Table Wheel", author: "Dr. Kaur", type: "Wheel", plays: "980" },
  { title: "Fraction Sorting Bins", author: "Mrs. Chen", type: "Sorting", plays: "742" },
];

function Dashboard() {
  const { activities } = useStore();
  const totalPlays = activities.reduce((s, a) => s + a.plays, 0);
  const avg = activities.length
    ? Math.round(activities.reduce((s, a) => s + a.avgScore, 0) / activities.length)
    : 0;

  return (
    <AppShell
      title="Dashboard"
      subtitle="Your classroom at a glance"
      actions={
        <Button asChild className="bg-gradient-action text-action-foreground hover:opacity-90">
          <Link to="/create">
            <Sparkles className="size-4" /> New AI game
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-brand p-8 shadow-lift sm:p-10">
          <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
            AI Creator Hub
          </p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl leading-tight font-extrabold text-primary-foreground sm:text-4xl">
            Paste a lesson. Get five playable games. Differentiate in one click.
          </h2>
          <Button
            asChild
            className="mt-6 h-12 rounded-full bg-gradient-action px-7 text-base font-bold text-action-foreground hover:opacity-90"
          >
            <Link to="/create">
              Generate a game <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Activities created", value: activities.length, icon: Gamepad2, tint: "text-primary bg-primary/10" },
            { label: "Student plays", value: totalPlays, icon: Users, tint: "text-action bg-action/15" },
            { label: "Average score", value: `${avg}%`, icon: TrendingUp, tint: "text-success bg-success/15" },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className={`grid size-11 place-items-center rounded-2xl ${s.tint}`}>
                <s.icon className="size-5" />
              </span>
              <p className="font-display mt-4 text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Recent activities</h3>
              <Link to="/activities" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {activities.slice(0, 4).map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.gradeLevel} · {a.subject} · {a.plays} plays
                    </p>
                    <Progress value={a.avgScore} className="mt-2 h-1.5" />
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {a.gameType}
                  </Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/play/$activityId" params={{ activityId: a.id }}>
                      Play
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">Community templates</h3>
            <ul className="mt-4 space-y-3">
              {COMMUNITY.map((c) => (
                <li key={c.title} className="rounded-2xl bg-muted/60 p-3">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.author} · {c.type} · {c.plays} plays
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h3 className="font-display mb-4 text-lg font-bold">Game engines ready to use</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GAME_TEMPLATES.map((t) => (
              <Link
                key={t.type}
                to="/create"
                className="rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft"
              >
                <span className="text-2xl">{t.emoji}</span>
                <p className="mt-3 font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display flex items-center gap-2 text-lg font-bold">
            <Clock className="size-4 text-primary" /> Recent student analytics
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Amara O.", 98],
              ["Diego R.", 91],
              ["Wei L.", 84],
              ["Priya S.", 72],
            ].map(([name, score]) => (
              <div key={name as string} className="rounded-2xl bg-muted/60 p-4">
                <p className="text-sm font-semibold">{name}</p>
                <Progress value={score as number} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">{score}% average</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
