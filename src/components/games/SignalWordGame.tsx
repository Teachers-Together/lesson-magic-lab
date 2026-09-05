import * as React from "react";
import { Check, X, Lightbulb, ArrowRight, RotateCcw } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { speakSequence, cancelSpeech } from "@/lib/voice";

/** Single speech entry point for this game. Never bare speak(), never window.speechSynthesis. */
function say(text: string, rate: number, lang?: string) {
  void speakSequence([text], lang ? { rate, lang } : { rate });
}
import { cn } from "@/lib/utils";

/*
  DATA MAPPING
  ------------
  ROUND 1 (sorting)  — item WITHOUT distractors
    prompt          = the signal word ("altogether", "each", "therefore")
    answer          = the operation / thinking move it signals ("add", "divide", "conclude")
    hint            = teacher-only explanation, never auto-shown
    exampleSentence = a sentence the tutor can read aloud

  ROUND 2 (word problems) — item WITH distractors
    prompt          = the short word problem
    answer          = the CORRECT operation
    distractors     = other OPERATIONS only (never wrong arithmetic)
    hint            = why that operation, for the tutor
    targetStructure = the signal word the problem hangs on
*/

function isProblem(item: GameItem): boolean {
  return Array.isArray(item.distractors) && item.distractors.length > 0;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const ai = a[i] as T;
    a[i] = a[j] as T;
    a[j] = ai;
  }
  return a;
}

type Placement = { itemId: string; bin: string; correct: boolean };

export function SignalWordGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const sortItems = React.useMemo(() => items.filter((i) => !isProblem(i)), [items]);
  const problemItems = React.useMemo(() => items.filter(isProblem), [items]);

  const bins = React.useMemo(() => {
    const seen: string[] = [];
    for (const i of sortItems) if (!seen.includes(i.answer)) seen.push(i.answer);
    return seen;
  }, [sortItems]);

  const [round, setRound] = React.useState<1 | 2>(sortItems.length ? 1 : 2);
  const [placements, setPlacements] = React.useState<Placement[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showHint, setShowHint] = React.useState(false);

  // round 2 state
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Placement[]>([]);
  const [done, setDone] = React.useState(false);

  const placedIds = placements.map((p) => p.itemId);
  const remaining = sortItems.filter((i) => !placedIds.includes(i.id));

  const problem = problemItems[index];

  /** Options for round 2: the correct operation plus other OPERATIONS only. */
  const options = React.useMemo(() => {
    if (!problem) return [] as string[];
    const pool = [problem.answer, ...(problem.distractors ?? [])];
    const unique: string[] = [];
    for (const o of pool) if (!unique.includes(o)) unique.push(o);
    return shuffle(unique);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]);

  React.useEffect(() => {
    setShowHint(false);
    setPicked(null);
  }, [index, round]);

  React.useEffect(() => () => cancelSpeech(), []);

  // ---------- round 1 actions ----------
  const placeInBin = React.useCallback(
    (bin: string) => {
      const item = sortItems.find((i) => i.id === selected);
      if (!item) return;
      const correct = item.answer === bin;
      setPlacements((p) => [...p, { itemId: item.id, bin, correct }]);
      setSelected(null);
      onEvent?.({ type: correct ? "sort-correct" : "sort-incorrect", itemId: item.id });
    },
    [selected, sortItems, onEvent],
  );

  const undo = React.useCallback(() => {
    if (round === 1) {
      if (selected) {
        setSelected(null);
        return;
      }
      setPlacements((p) => p.slice(0, -1));
      return;
    }
    if (picked) {
      setPicked(null);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
    setAnswers((a) => a.slice(0, -1));
    setDone(false);
  }, [round, selected, picked]);

  // ---------- round 2 actions ----------
  const choose = React.useCallback(
    (op: string) => {
      if (!problem || picked) return;
      setPicked(op);
      const correct = op === problem.answer;
      setAnswers((a) => [...a, { itemId: problem.id, bin: op, correct }]);
      onEvent?.({ type: correct ? "answer-correct" : "answer-incorrect", itemId: problem.id });
    },
    [problem, picked, onEvent],
  );

  const finishRound2 = React.useCallback(
    (all: Placement[]) => {
      setDone(true);
      const combined = [...placements, ...all];
      onComplete({
        correct: combined.filter((c) => c.correct).length,
        total: combined.length,
        missedIds: combined.filter((c) => !c.correct).map((c) => c.itemId),
      });
    },
    [placements, onComplete],
  );

  const advance = React.useCallback(() => {
    if (round === 1) {
      if (remaining.length === 0 && problemItems.length) setRound(2);
      return;
    }
    if (!picked) return;
    if (index + 1 < problemItems.length) {
      setIndex((i) => i + 1);
    } else if (!done) {
      finishRound2(answers);
    }
  }, [round, remaining.length, problemItems.length, picked, index, done, answers, finishRound2]);

  const replayAudio = React.useCallback(() => {
    cancelSpeech();
    if (round === 1) {
      const item = sortItems.find((i) => i.id === selected) ?? remaining[0];
      if (item) speak(item.audioText ?? item.exampleSentence ?? item.prompt, { rate: 0.85 });
      return;
    }
    if (problem) speak(problem.audioText ?? problem.prompt, { rate: 0.85 });
  }, [round, sortItems, selected, remaining, problem]);

  // ---------- number keys ----------
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > 9) return;
      e.preventDefault();
      if (round === 1) {
        if (selected) {
          const bin = bins[n - 1];
          if (bin) placeInBin(bin);
        } else {
          const item = remaining[n - 1];
          if (item) setSelected(item.id);
        }
      } else {
        const op = options[n - 1];
        if (op) choose(op);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [round, selected, bins, remaining, options, placeInBin, choose]);

  const totalSteps = sortItems.length + problemItems.length;
  const doneSteps = placements.length + answers.length;

  // ---------- summary ----------
  if (done) {
    const combined = [...placements, ...answers];
    const missed = combined.filter((c) => !c.correct);
    return (
      <GameChrome title="Signal Words" teacherMode={teacherMode} progress={{ done: totalSteps, total: totalSteps }}>
        <Card className="space-y-4 p-6 text-center">
          <h2 className="font-display text-3xl font-extrabold">
            {combined.filter((c) => c.correct).length} / {combined.length} right
          </h2>
          {missed.length ? (
            <div className="mx-auto max-w-xl space-y-2 text-left">
              <p className="text-sm font-semibold text-muted-foreground">Words to revisit</p>
              {missed.map((m) => {
                const it = items.find((i) => i.id === m.itemId);
                if (!it) return null;
                return (
                  <div key={m.itemId} className="rounded-lg border border-border p-3">
                    <p className="font-semibold">{it.prompt}</p>
                    <p className="text-sm text-muted-foreground">
                      said <span className="text-rose-500">{m.bin}</span> · correct:{" "}
                      <span className="text-emerald-500">{it.answer}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Every signal word matched to the right operation.</p>
          )}
          <Button
            className="gap-2"
            onClick={() => {
              setPlacements([]);
              setAnswers([]);
              setIndex(0);
              setPicked(null);
              setDone(false);
              setRound(sortItems.length ? 1 : 2);
            }}
          >
            <RotateCcw className="size-4" /> Run it again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  // ---------- round 1 ----------
  if (round === 1) {
    const activeItem = sortItems.find((i) => i.id === selected);
    return (
      <GameChrome
        title="Signal Words · Round 1 — sort the words"
        teacherMode={teacherMode}
        onUndo={undo}
        onAdvance={advance}
        onReplayAudio={replayAudio}
        progress={{ done: doneSteps, total: totalSteps }}
      >
        <div className="space-y-6 pb-16">
          <p className="text-center text-lg text-muted-foreground">
            {selected ? "Which operation does it signal? Click a bin." : "Pick a word, then its operation."}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {remaining.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 text-2xl font-bold text-card-foreground transition",
                  selected === item.id && "border-primary ring-4 ring-ring/30",
                )}
              >
                {teacherMode && i < 9 ? <NumberBadge n={i + 1} /> : null}
                {item.prompt}
              </button>
            ))}
            {remaining.length === 0 ? (
              <Button size="lg" className="gap-2" onClick={advance}>
                Round 2 — word problems <ArrowRight className="size-5" />
              </Button>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bins.map((bin, i) => {
              const inBin = placements.filter((p) => p.bin === bin);
              return (
                <button
                  key={bin}
                  onClick={() => placeInBin(bin)}
                  disabled={!selected}
                  className={cn(
                    "min-h-40 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-3 text-left transition",
                    selected && "border-primary/70 bg-muted",
                  )}
                >
                  <div className="mb-2 flex items-center gap-2">
                    {teacherMode && i < 9 ? <NumberBadge n={i + 1} /> : null}
                    <span className="font-display text-xl font-extrabold capitalize">{bin}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inBin.map((p) => {
                      const it = sortItems.find((s) => s.id === p.itemId);
                      return (
                        <span
                          key={p.itemId}
                          className={cn(
                            "flex items-center gap-1 rounded-md px-2 py-1 text-base font-semibold",
                            p.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white",
                          )}
                        >
                          {p.correct ? <Check className="size-4" /> : <X className="size-4" />}
                          {it?.prompt}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>

          {teacherMode && activeItem ? (
            <Card className="mx-auto max-w-2xl border-dashed p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Lightbulb className="size-4" /> Teacher only
              </div>
              {activeItem.hint ? <p className="text-base">{activeItem.hint}</p> : null}
              {activeItem.exampleSentence ? (
                <p className="mt-1 text-base italic text-muted-foreground">{activeItem.exampleSentence}</p>
              ) : null}
              <p className="mt-1 text-sm">
                Answer: <span className="font-bold capitalize">{activeItem.answer}</span>
              </p>
            </Card>
          ) : null}
        </div>
      </GameChrome>
    );
  }

  // ---------- round 2 ----------
  if (!problem) {
    return (
      <GameChrome title="Signal Words" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">No word problems in this set.</p>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Signal Words · Round 2 — which operation?"
      {...(problem.targetStructure ? { targetStructure: problem.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      onReplayAudio={replayAudio}
      progress={{ done: doneSteps, total: totalSteps }}
    >
      <div className="space-y-6 pb-16">
        <Card className="p-6">
          <p className="text-center font-display text-3xl font-bold leading-snug">{problem.prompt}</p>
        </Card>

        <p className="text-center text-lg text-muted-foreground">
          Say which operation you need — and which word tells you.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((op, i) => {
            const isAnswer = op === problem.answer;
            const state = picked ? (isAnswer ? "right" : op === picked ? "wrong" : "idle") : "idle";
            return (
              <button
                key={op}
                onClick={() => choose(op)}
                disabled={!!picked}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 text-left text-2xl font-bold capitalize text-card-foreground transition",
                  state === "right" && "border-emerald-500 bg-emerald-500 text-white",
                  state === "wrong" && "border-rose-500 bg-rose-500 text-white",
                )}
              >
                {teacherMode && i < 9 ? <NumberBadge n={i + 1} /> : null}
                {op}
                {state === "right" ? <Check className="ml-auto size-6" /> : null}
                {state === "wrong" ? <X className="ml-auto size-6" /> : null}
              </button>
            );
          })}
        </div>

        {picked ? (
          <div className="flex flex-col items-center gap-3">
            {problem.hint ? (
              showHint ? (
                <Card className="max-w-2xl border-dashed p-4 text-center text-base">{problem.hint}</Card>
              ) : (
                <Button variant="outline" className="gap-2" onClick={() => setShowHint(true)}>
                  <Lightbulb className="size-4" /> Why this operation?
                </Button>
              )
            ) : null}
            <Button size="lg" className="gap-2" onClick={advance}>
              {index + 1 < problemItems.length ? "Next problem" : "Finish"} <ArrowRight className="size-5" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-base">
              Problem {index + 1} of {problemItems.length}
            </Badge>
          </div>
        )}
      </div>
    </GameChrome>
  );
}

/* ------------------------------------------------------------------ */
/* Example data sets                                                    */
/* ------------------------------------------------------------------ */

export const MATHS_SIGNAL_ITEMS: GameItem[] = [
  { id: "m-w1", prompt: "altogether", answer: "add", hint: "Combining separate groups into one total.", exampleSentence: "How many cakes do they have altogether?" },
  { id: "m-w2", prompt: "each", answer: "divide", hint: "Sharing a total equally between groups.", exampleSentence: "Each child gets the same number of pencils." },
  { id: "m-w3", prompt: "per", answer: "divide", hint: "A rate: one unit of something for each unit of another.", exampleSentence: "The cost per ticket is $4." },
  { id: "m-w4", prompt: "remaining", answer: "subtract", hint: "What is left after some is taken away.", exampleSentence: "How many apples are remaining?" },
  { id: "m-w5", prompt: "twice as many", answer: "multiply", hint: "Multiply by 2.", exampleSentence: "Sam has twice as many marbles as Ana." },
  { id: "m-w6", prompt: "fewer than", answer: "subtract", hint: "A comparison showing a smaller amount.", exampleSentence: "Ben has 5 fewer than Mia." },
  { id: "m-w7", prompt: "difference", answer: "subtract", hint: "The gap between two amounts.", exampleSentence: "What is the difference between 9 and 4?" },
  { id: "m-w8", prompt: "product", answer: "multiply", hint: "The result of multiplying.", exampleSentence: "Find the product of 6 and 3." },

  {
    id: "m-p1",
    prompt: "Ana has 7 stickers. Ben has 5 stickers. How many do they have altogether?",
    answer: "add",
    distractors: ["subtract", "multiply", "divide"],
    hint: "\"Altogether\" joins the two groups, so we add.",
    targetStructure: "altogether",
  },
  {
    id: "m-p2",
    prompt: "24 pencils are shared equally between 6 children. How many does each child get?",
    answer: "divide",
    distractors: ["multiply", "add", "subtract"],
    hint: "\"Each\" with an equal share means division.",
    targetStructure: "each",
  },
  {
    id: "m-p3",
    prompt: "A box holds 12 eggs. 5 eggs are used. How many are remaining?",
    answer: "subtract",
    distractors: ["add", "divide", "multiply"],
    hint: "\"Remaining\" means what is left, so we take away.",
    targetStructure: "remaining",
  },
  {
    id: "m-p4",
    prompt: "Leo reads 8 pages. Mia reads twice as many pages as Leo. How many does Mia read?",
    answer: "multiply",
    distractors: ["add", "subtract", "divide"],
    hint: "\"Twice as many\" is multiplication by 2, not adding 2.",
    targetStructure: "twice as many",
  },
  {
    id: "m-p5",
    prompt: "Tickets cost $4 per person. There are 5 people. What is the total cost?",
    answer: "multiply",
    distractors: ["divide", "add", "subtract"],
    hint: "A rate (\"per\") times the number of people gives the total.",
    targetStructure: "per",
  },
];

export const SCIENCE_SIGNAL_ITEMS: GameItem[] = [
  { id: "s-w1", prompt: "observe", answer: "describe", hint: "Say only what you can see, hear or measure.", exampleSentence: "Observe what happens to the ice." },
  { id: "s-w2", prompt: "predict", answer: "guess ahead", hint: "Say what will happen before it happens.", exampleSentence: "Predict what will happen if we add salt." },
  { id: "s-w3", prompt: "classify", answer: "group", hint: "Put things into groups by shared features.", exampleSentence: "Classify these animals by habitat." },
  { id: "s-w4", prompt: "evidence", answer: "support", hint: "Facts you use to back up a claim.", exampleSentence: "What evidence supports your answer?" },
  { id: "s-w5", prompt: "therefore", answer: "conclude", hint: "Signals the conclusion that follows.", exampleSentence: "The plant had no light; therefore it died." },

  {
    id: "s-p1",
    prompt: "\"The water in the open cup went down over three days. Therefore...\" What is the task?",
    answer: "conclude",
    distractors: ["describe", "group", "guess ahead"],
    hint: "\"Therefore\" asks for the conclusion that follows from the data.",
    targetStructure: "therefore",
  },
  {
    id: "s-p2",
    prompt: "\"Sort these materials into metals and non-metals.\" What is the task?",
    answer: "group",
    distractors: ["describe", "conclude", "support"],
    hint: "Sorting by shared features is classifying.",
    targetStructure: "classify",
  },
  {
    id: "s-p3",
    prompt: "\"What will happen to the balloon if we heat the air inside it?\" What is the task?",
    answer: "guess ahead",
    distractors: ["describe", "group", "support"],
    hint: "A question about what will happen asks for a prediction.",
    targetStructure: "predict",
  },
];

export const SOCIAL_STUDIES_SIGNAL_ITEMS: GameItem[] = [
  { id: "ss-w1", prompt: "cause", answer: "reason", hint: "The reason something happened.", exampleSentence: "One cause of the war was trade." },
  { id: "ss-w2", prompt: "effect", answer: "result", hint: "What happened as a result.", exampleSentence: "The effect was a rise in prices." },
  { id: "ss-w3", prompt: "compare", answer: "find similarities", hint: "Look for what is the same.", exampleSentence: "Compare the two cities." },
  { id: "ss-w4", prompt: "in contrast", answer: "find differences", hint: "Signals a difference between two things.", exampleSentence: "In contrast, the south stayed rural." },

  {
    id: "ss-p1",
    prompt: "\"The north built factories. In contrast, the south...\" What is the task?",
    answer: "find differences",
    distractors: ["find similarities", "reason", "result"],
    hint: "\"In contrast\" always signals a difference.",
    targetStructure: "in contrast",
  },
  {
    id: "ss-p2",
    prompt: "\"Prices rose because the harvest failed.\" The failed harvest is the...?",
    answer: "reason",
    distractors: ["result", "find similarities", "find differences"],
    hint: "\"Because\" introduces the cause — the reason.",
    targetStructure: "cause",
  },
  {
    id: "ss-p3",
    prompt: "\"Both cities grew beside a river.\" What is the task?",
    answer: "find similarities",
    distractors: ["find differences", "reason", "result"],
    hint: "\"Both\" points to something shared, so we compare.",
    targetStructure: "compare",
  },
];

export default SignalWordGame;
