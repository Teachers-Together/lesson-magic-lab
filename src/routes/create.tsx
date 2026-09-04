import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Wand2, Save, Play, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADAPTATIONS,
  ESL_ARCHETYPES,
  GAME_TEMPLATES,
  adaptContent,
  generateContent,
  uid,
  useStore,
  type Adaptation,
  type ContentItem,
  type GameType,
} from "@/lib/store";
import { celebrate } from "@/lib/fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "AI Creator Hub — EduPulse AI" },
      {
        name: "description",
        content:
          "Generate a complete classroom game from a prompt or lesson notes, then differentiate it for dyslexia, ELL, or simplified reading in one click.",
      },
      { property: "og:title", content: "AI Creator Hub — EduPulse AI" },
      {
        property: "og:description",
        content: "Prompt in, playable differentiated game out — in seconds.",
      },
    ],
  }),
  component: CreatorHub,
});

const GRADES = ["Kindergarten", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
const STAGES = [
  "Scaffolding curriculum standards…",
  "Mining your lesson text for key concepts…",
  "Designing interactive vectors…",
  "Balancing distractor difficulty…",
  "Rendering playable assets…",
];

function CreatorHub() {
  const { addActivity } = useStore();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [notes, setNotes] = useState("");
  const [grade, setGrade] = useState("Grade 3");
  const [subject, setSubject] = useState("General");
  const [gameType, setGameType] = useState<GameType>("quiz");
  const [stage, setStage] = useState(-1);
  const [base, setBase] = useState<ContentItem[] | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [adaptation, setAdaptation] = useState<Adaptation>("standard");

  const generating = stage >= 0 && stage < STAGES.length;

  useEffect(() => {
    if (!generating) return;
    const t = setTimeout(() => setStage((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [stage, generating]);

  useEffect(() => {
    if (stage !== STAGES.length) return;
    const generated = generateContent(prompt, notes);
    setBase(generated);
    setItems(generated);
    setAdaptation("standard");
    setStage(-1);
    celebrate();
    toast.success("Game assets generated");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const run = () => {
    if (!prompt.trim() && !notes.trim()) {
      toast.error("Add a prompt or paste some lesson text first");
      return;
    }
    setBase(null);
    setStage(0);
  };

  const applyAdaptation = (mode: Adaptation) => {
    if (!base) return;
    setAdaptation(mode);
    setItems(adaptContent(base, mode));
    toast.success(`Adapted: ${ADAPTATIONS.find((a) => a.id === mode)!.label}`);
  };

  const edit = (id: string, patch: Partial<ContentItem>) =>
    setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const save = (thenPlay: boolean) => {
    const id = uid();
    addActivity({
      id,
      title: prompt.trim() ? prompt.trim().slice(0, 60) : `${subject} activity`,
      subject,
      gradeLevel: grade,
      gameType,
      contentData: items,
      adaptation,
      createdAt: new Date().toISOString(),
      plays: 0,
      avgScore: 0,
    });
    toast.success("Saved to My Activities");
    navigate({ to: thenPlay ? "/play/$activityId" : "/activities", params: { activityId: id } });
  };

  return (
    <AppShell title="AI Creator Hub" subtitle="Prompt in, playable game out">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <Label className="text-xs font-bold tracking-widest text-primary uppercase">
              Step 1 · Tell the AI
            </Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to teach today? (e.g., 3rd-grade fractions, Spanish past tense)"
              className="mt-3 h-14 rounded-2xl text-base"
            />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste lesson text / notes (optional) — the AI will mine it for key concepts."
              className="mt-3 min-h-36 rounded-2xl"
            />

            <p className="mt-5 text-xs font-bold tracking-widest text-action uppercase">
              ESL quick-starts
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ESL_ARCHETYPES.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    setPrompt(a.prompt);
                    setGameType(a.gameType);
                    setSubject(a.subject);
                    setGrade(a.grade);
                    toast.success(`ESL archetype loaded: ${a.label}`);
                  }}
                  className="rounded-full border-2 border-border px-3.5 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-action hover:bg-action/10"
                >
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <Label className="text-xs font-bold tracking-widest text-primary uppercase">
              Step 2 · Configure
            </Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-sm">Grade level</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["General", "ESL / ELL", "Mathematics", "Science", "Language Arts", "World Languages", "Social Studies"].map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Label className="mt-5 block text-sm">Game type</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {GAME_TEMPLATES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setGameType(t.type)}
                  className={cn(
                    "rounded-2xl border-2 p-3 text-left transition-all",
                    gameType === t.type
                      ? "border-primary bg-primary/8 shadow-soft"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <p className="text-sm font-bold">
                    {t.emoji} {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.blurb}</p>
                </button>
              ))}
            </div>

            <Button
              onClick={run}
              disabled={generating}
              className="mt-5 h-12 w-full rounded-2xl bg-gradient-action text-base font-bold text-action-foreground hover:opacity-90"
            >
              {generating ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              Generate Game Assets
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {generating ? (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
              <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-action transition-all duration-500"
                  style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <ul className="space-y-4">
                {STAGES.map((s, idx) => (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                        idx < stage
                          ? "bg-success text-success-foreground"
                          : idx === stage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {idx < stage ? <Check className="size-4" /> : idx + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        idx === stage && "animate-pulse text-foreground",
                        idx > stage && "text-muted-foreground",
                      )}
                    >
                      Step {idx + 1}: {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {base && !generating ? (
            <>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <Wand2 className="size-4 text-action" />
                  <h3 className="font-display font-bold">The Magic Switch · Differentiate & Adapt</h3>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {ADAPTATIONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => applyAdaptation(a.id)}
                      className={cn(
                        "rounded-2xl border-2 p-3 text-left transition-all",
                        adaptation === a.id
                          ? "border-action bg-action/12 shadow-soft"
                          : "border-border hover:border-action/50",
                      )}
                    >
                      <p className="text-sm font-bold">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display font-bold">Preview & edit</h3>
                  <Badge variant="secondary">{items.length} items</Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {items.map((it, idx) => (
                    <div
                      key={it.id}
                      className={cn(
                        "rounded-2xl border border-border p-3",
                        adaptation === "dyslexia" && "dyslexia-mode",
                      )}
                    >
                      <p className="mb-1.5 text-xs font-bold text-muted-foreground">Q{idx + 1}</p>
                      <Textarea
                        value={it.prompt}
                        onChange={(e) => edit(it.id, { prompt: e.target.value })}
                        className="min-h-16 rounded-xl"
                      />
                      <Input
                        value={it.answer}
                        onChange={(e) => edit(it.id, { answer: e.target.value })}
                        className="mt-2 rounded-xl border-success/50 bg-success/8"
                      />
                      {gameType === "quiz" ? (
                        <Input
                          value={it.distractors.join(" | ")}
                          onChange={(e) =>
                            edit(it.id, { distractors: e.target.value.split("|").map((s) => s.trim()) })
                          }
                          placeholder="Wrong answers separated by |"
                          className="mt-2 rounded-xl text-sm"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={() => save(false)} variant="outline" className="flex-1">
                    <Save className="size-4" /> Save activity
                  </Button>
                  <Button
                    onClick={() => save(true)}
                    className="flex-1 bg-gradient-action text-action-foreground hover:opacity-90"
                  >
                    <Play className="size-4" /> Save & play
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          {!base && !generating ? (
            <div className="grid min-h-64 place-items-center rounded-3xl border-2 border-dashed border-border p-10 text-center">
              <div>
                <Sparkles className="animate-float mx-auto size-10 text-primary" />
                <p className="mt-4 font-semibold">Your generated game will appear here</p>
                <p className="text-sm text-muted-foreground">
                  Describe a topic, pick an engine, and hit Generate.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
