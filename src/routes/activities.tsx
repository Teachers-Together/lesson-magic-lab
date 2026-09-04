import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Share2, Trash2, BarChart3, Search, Sparkles, Pencil } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GAME_TEMPLATES, useStore, type Activity } from "@/lib/store";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "My Activities — EduPulse AI" },
      {
        name: "description",
        content:
          "Your library of AI-generated classroom games. Play, edit, share, or review results for every activity you've built.",
      },
      { property: "og:title", content: "My Activities — EduPulse AI" },
      { property: "og:description", content: "Play, edit, share, and review your AI-built classroom games." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { activities, removeActivity, updateActivity } = useStore();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Activity | null>(null);
  const [editing, setEditing] = useState<Activity | null>(null);

  const filtered = activities.filter((a) =>
    (a.title + a.subject + a.gradeLevel).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell
      title="My Activities"
      subtitle={`${activities.length} saved games`}
      actions={
        <Button asChild className="bg-gradient-action text-action-foreground hover:opacity-90">
          <Link to="/create">
            <Sparkles className="size-4" /> New AI game
          </Link>
        </Button>
      }
    >
      <div className="relative mb-6 max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search activities…"
          className="rounded-2xl pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border-2 border-dashed border-border p-16 text-center">
          <div>
            <p className="font-semibold">No activities yet</p>
            <p className="text-sm text-muted-foreground">Head to the AI Creator Hub to make one.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => {
            const tpl = GAME_TEMPLATES.find((t) => t.type === a.gameType)!;
            return (
              <article
                key={a.id}
                className="flex flex-col rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-brand text-2xl">
                    {tpl.emoji}
                  </span>
                  <Badge variant="secondary">{tpl.name}</Badge>
                </div>
                <h3 className="font-display mt-4 text-lg leading-snug font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {a.gradeLevel} · {a.subject} · {a.contentData.length} items
                </p>
                <div className="mt-3">
                  <Progress value={a.avgScore} className="h-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.plays} plays · {a.avgScore}% avg score
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="bg-gradient-action text-action-foreground hover:opacity-90">
                    <Link to="/play/$activityId" params={{ activityId: a.id }}>
                      <Play className="size-4" /> Play
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `${window.location.origin}/play/${a.id}`;
                      navigator.clipboard?.writeText(url);
                      toast.success("Share link copied to clipboard");
                    }}
                  >
                    <Share2 className="size-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setResults(a)}>
                    <BarChart3 className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      removeActivity(a.id);
                      toast.success("Activity deleted");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={!!results} onOpenChange={(o) => !o && setResults(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{results?.title}</DialogTitle>
            <DialogDescription>Class results snapshot</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              ["Amara O.", 98],
              ["Diego R.", 91],
              ["Wei L.", 84],
              ["Priya S.", 72],
              ["Noah B.", 65],
            ].map(([n, s]) => (
              <div key={n as string}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{n}</span>
                  <span>{s}%</span>
                </div>
                <Progress value={s as number} className="mt-1 h-2" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit activity</DialogTitle>
            <DialogDescription>Tweak the title and question text.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="space-y-3">
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
              {editing.contentData.map((it, idx) => (
                <div key={it.id} className="rounded-2xl border border-border p-3">
                  <p className="mb-1.5 text-xs font-bold text-muted-foreground">Q{idx + 1}</p>
                  <Input
                    value={it.prompt}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        contentData: editing.contentData.map((c) =>
                          c.id === it.id ? { ...c, prompt: e.target.value } : c,
                        ),
                      })
                    }
                  />
                  <Input
                    value={it.answer}
                    className="mt-2 border-success/50 bg-success/8"
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        contentData: editing.contentData.map((c) =>
                          c.id === it.id ? { ...c, answer: e.target.value } : c,
                        ),
                      })
                    }
                  />
                </div>
              ))}
              <Button
                className="w-full bg-gradient-action text-action-foreground hover:opacity-90"
                onClick={() => {
                  updateActivity(editing.id, {
                    title: editing.title,
                    contentData: editing.contentData,
                  });
                  setEditing(null);
                  toast.success("Activity updated");
                }}
              >
                Save changes
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
