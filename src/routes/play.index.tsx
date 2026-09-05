import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { GAME_TEMPLATES, useStore } from "@/lib/store";

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: "Student Play Zone — EduPulse AI" },
      {
        name: "description",
        content:
          "Pick a class activity and jump into a distraction-free, full-screen learning game.",
      },
      { property: "og:title", content: "Student Play Zone — EduPulse AI" },
      { property: "og:description", content: "Distraction-free full-screen play for students." },
    ],
  }),
  component: PlayIndex,
});

function PlayIndex() {
  const { activities } = useStore();
  return (
    <AppShell title="Student Play Zone" subtitle="Choose a game to launch full screen">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {activities.map((a) => {
          const tpl = GAME_TEMPLATES.find((t) => t.type === a.gameType)!;
          return (
            <Link
              key={a.id}
              to="/play/$activityId"
              params={{ activityId: a.id }}
              className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{tpl.emoji}</span>
                <Badge variant="secondary">{tpl.name}</Badge>
              </div>
              <h3 className="font-display mt-4 text-lg font-bold">{a.title}</h3>
              <p className="text-sm text-muted-foreground">
                {a.gradeLevel} · {a.contentData.length} items
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-action">
                <Play className="size-4" /> Start playing
              </span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
