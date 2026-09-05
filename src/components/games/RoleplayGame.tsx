import * as React from "react";
import { ArrowLeftRight, RotateCcw, Volume2 } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { speakSequence, cancelSpeech } from "@/lib/voice";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RoleplayGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
  lang?: string;
  /** Function label shown at the lowest support level, e.g. "order politely". */
  targetStructure?: string;
};

type SupportLevel = 0 | 1 | 2; // 0 = full text, 1 = first word, 2 = function label only

const SUPPORT_LABELS = ["Full text", "First word", "Function label"] as const;

function AudioButton({ text, label, lang }: { text: string; label: string; lang?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        cancelSpeech();
        void speakSequence([text], lang ? { rate: 0.95, lang } : { rate: 0.95 });
      }}
      aria-label={label}
      className="inline-grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground shadow transition hover:scale-105"
    >
      <Volume2 className="size-5" />
    </button>
  );
}

export function RoleplayGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
  targetStructure,
  lang,
}: RoleplayGameProps) {
  const roles = React.useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      if (item.answer && !seen.includes(item.answer)) seen.push(item.answer);
    }
    while (seen.length < 2) seen.push(seen.length === 0 ? "Role A" : "Role B");
    return seen.slice(0, 2);
  }, [items]);

  // studentRole: index into `roles` whose lines are hidden
  const [studentRole, setStudentRole] = React.useState(1);
  const [support, setSupport] = React.useState<SupportLevel>(0);
  const [lineIndex, setLineIndex] = React.useState(0);
  const done = lineIndex >= items.length;

  const advance = React.useCallback(() => {
    setLineIndex((i) => Math.min(i + 1, items.length));
  }, [items.length]);

  const completedRef = React.useRef(false);
  React.useEffect(() => {
    if (!done || completedRef.current) return;
    completedRef.current = true;
    onEvent?.({ type: "complete" });
    onComplete({ correct: items.length, total: items.length, missedIds: [] });
  }, [done, items.length, onComplete, onEvent]);

  const undo = React.useCallback(() => {
    setLineIndex((i) => Math.max(0, i - 1));
  }, []);

  const replayAudio = React.useCallback(() => {
    const item = items[Math.min(lineIndex, items.length - 1)];
    if (item) {
      cancelSpeech();
      void speakSequence([item.prompt], lang ? { rate: 0.95, lang } : { rate: 0.95 });
    }
  }, [items, lineIndex, lang]);

  const swapRoles = React.useCallback(() => {
    setStudentRole((r) => (r === 0 ? 1 : 0));
    setLineIndex(0);
    onEvent?.({ type: "swap-roles" });
  }, [onEvent]);

  const runAgainLessHelp = React.useCallback(() => {
    setSupport((s) => (s < 2 ? ((s + 1) as SupportLevel) : s));
    setLineIndex(0);
    onEvent?.({ type: "reduce-support" });
  }, [onEvent]);

  const hiddenFor = (role: string) => role === roles[studentRole];

  const lineDisplay = (item: GameItem): string => {
    if (support === 0) return item.prompt;
    if (support === 1) return item.prompt.split(/\s+/)[0] + " …";
    return targetStructure ?? "…";
  };

  return (
    <GameChrome
      title="Roleplay Dialogue"
      {...(targetStructure ? { targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      onReplayAudio={replayAudio}
      progress={{ done: Math.min(lineIndex, items.length), total: items.length }}
    >
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2">
          <span className="text-sm font-semibold text-muted-foreground">Support</span>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={support}
            onChange={(e) => setSupport(Number(e.target.value) as SupportLevel)}
            aria-label="Support level"
            className="w-32 accent-primary"
          />
          <span className="w-28 text-sm font-bold">{SUPPORT_LABELS[support]}</span>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={swapRoles}>
          <ArrowLeftRight className="size-4" />
          Swap Roles
        </Button>
      </div>

      {done ? (
        <div className="grid place-items-center gap-5 py-10 text-center">
          <p className="font-display text-3xl font-extrabold">Dialogue complete!</p>
          <p className="text-muted-foreground">
            You played the {roles[studentRole]}. Now run it again with less help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2 rounded-xl" onClick={runAgainLessHelp}>
              <RotateCcw className="size-5" />
              Run it again with less help
            </Button>
            <Button size="lg" variant="outline" className="gap-2 rounded-xl" onClick={swapRoles}>
              <ArrowLeftRight className="size-5" />
              Swap roles &amp; restart
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role, ri) => (
            <div key={role} className="flex flex-col gap-3">
              <h2
                className={cn(
                  "rounded-xl px-4 py-2 text-center font-display text-lg font-bold",
                  ri === studentRole
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {role}
                {ri === studentRole ? " — you" : ""}
              </h2>
              {items.map((item, i) => {
                if (item.answer !== role) return null;
                const isCurrent = i === lineIndex;
                const isPast = i < lineIndex;
                const hidden = hiddenFor(role) && !isPast;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 transition",
                      isCurrent
                        ? "border-primary bg-primary/10 text-xl font-bold shadow-lg ring-2 ring-primary"
                        : "border-border bg-card text-base",
                      isPast && "opacity-60",
                    )}
                  >
                    {teacherMode && isCurrent ? <NumberBadge n={i + 1} /> : null}
                    <div className="min-w-0 flex-1">
                      <p className={cn(isCurrent && "leading-snug")}>
                        {hidden ? lineDisplay(item) : item.prompt}
                      </p>
                      {isCurrent && hidden && support === 0 && item.exampleSentence ? (
                        <p className="mt-1 text-sm font-normal text-muted-foreground">
                          e.g. {item.exampleSentence}
                        </p>
                      ) : null}
                    </div>
                    <AudioButton
                      text={item.prompt}
                      label={`Play line ${i + 1}`}
                      {...(lang ? { lang } : {})}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </GameChrome>
  );
}

export default RoleplayGame;
