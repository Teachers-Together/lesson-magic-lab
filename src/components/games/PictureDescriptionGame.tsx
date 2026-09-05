import * as React from "react";
import { Check, Clock, RotateCcw } from "lucide-react";
import type { GameItem } from "@/lib/game-contract";
import { GameChrome, NumberBadge } from "@/components/games/GameChrome";
import { AudioButton } from "@/components/games/AudioButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PictureDescriptionGameProps = {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PictureDescriptionGame({
  items,
  teacherMode,
  onComplete,
  onEvent,
}: PictureDescriptionGameProps) {
  const imageItem = items[0];
  const checklist = React.useMemo(() => items.slice(1), [items]);

  const [usedIds, setUsedIds] = React.useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);

  // Advisory timer only in independent-student mode; never run in teacherMode.
  React.useEffect(() => {
    if (done || teacherMode) return;
    const id = window.setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [done, teacherMode]);

  const selectedItem = checklist[selectedIndex] ?? checklist[0];

  const toggle = React.useCallback(
    (item: GameItem) => {
      setUsedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
          onEvent?.({ type: "unused", itemId: item.id });
        } else {
          next.add(item.id);
          onEvent?.({ type: "used", itemId: item.id });
        }
        return next;
      });
    },
    [onEvent],
  );

  const undo = React.useCallback(() => {
    setUsedIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      const last = Array.from(next).pop();
      if (last) {
        next.delete(last);
        onEvent?.({ type: "undo", itemId: last });
      }
      return next;
    });
  }, [onEvent]);

  const finish = React.useCallback(() => {
    if (done) return;
    setDone(true);
  }, [done]);

  const replaySelected = React.useCallback(() => {
    const item = selectedItem;
    if (!item) return;
    const text = item.exampleSentence || item.prompt;
    if (!text) return;
    onEvent?.({ type: "play", itemId: item.id });
  }, [selectedItem, onEvent]);

  const restart = React.useCallback(() => {
    setUsedIds(new Set());
    setSelectedIndex(0);
    setDone(false);
    setElapsed(0);
  }, []);

  React.useEffect(() => {
    if (!done) return;
    const used = checklist.filter((i) => usedIds.has(i.id));
    onComplete({
      correct: used.length,
      total: checklist.length,
      missedIds: checklist.filter((i) => !usedIds.has(i.id)).map((i) => i.id),
    });
  }, [done, checklist, usedIds, onComplete]);

  if (!imageItem || checklist.length === 0) {
    return (
      <GameChrome title="Picture Description" teacherMode={teacherMode}>
        <p className="text-center text-muted-foreground">
          Load one image item and at least one structure to tick off.
        </p>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Picture Description"
      {...(imageItem.targetStructure ? { targetStructure: imageItem.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={finish}
      onReplayAudio={replaySelected}
      progress={{ done: usedIds.size, total: checklist.length }}
    >
      {done ? (
        <div className="mx-auto grid max-w-3xl gap-6 py-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold">Speaking round complete</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {usedIds.size} of {checklist.length} structures used
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold">Structures used</h3>
            {checklist.filter((i) => usedIds.has(i.id)).length === 0 ? (
              <p className="text-muted-foreground">None ticked this round.</p>
            ) : (
              <ul className="grid gap-2">
                {checklist
                  .filter((i) => usedIds.has(i.id))
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-border bg-emerald-500/10 p-3"
                    >
                      <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                      <div>
                        <p className="font-semibold">{item.targetStructure || item.prompt}</p>
                        {item.exampleSentence ? (
                          <p className="text-sm text-muted-foreground">{item.exampleSentence}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="grid gap-4 rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold">Not used</h3>
            {checklist.filter((i) => !usedIds.has(i.id)).length === 0 ? (
              <p className="text-muted-foreground">Great work — every structure was used.</p>
            ) : (
              <ul className="grid gap-2">
                {checklist
                  .filter((i) => !usedIds.has(i.id))
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3"
                    >
                      <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-muted-foreground" />
                      <div>
                        <p className="font-semibold">{item.targetStructure || item.prompt}</p>
                        {item.exampleSentence ? (
                          <p className="text-sm text-muted-foreground">{item.exampleSentence}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="gap-2 rounded-xl" onClick={restart}>
              <RotateCcw className="size-5" />
              Describe another picture
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid h-full gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Image panel */}
          <div className="grid gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card lg:aspect-auto lg:h-full">
              {imageItem.imageUrl ? (
                <img
                  src={imageItem.imageUrl}
                  alt={imageItem.prompt || "Speaking picture"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center p-6 text-center text-muted-foreground">
                  <p>No image provided. Use the first item&apos;s imageUrl.</p>
                </div>
              )}
            </div>
          </div>

          {/* Checklist panel */}
          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-display text-base">
                  {usedIds.size}/{checklist.length}
                </Badge>
                <span className="text-sm font-semibold text-muted-foreground">structures used</span>
              </div>
              {!teacherMode ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Clock className="size-4" />
                  {formatTime(elapsed)}
                </div>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">Timer off in teacher mode</span>
              )}
            </div>

            <Progress value={(usedIds.size / checklist.length) * 100} className="h-3" />

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto rounded-3xl border border-border bg-card p-4">
              {checklist.map((item, idx) => {
                const isUsed = usedIds.has(item.id);
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      toggle(item);
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/60",
                    )}
                  >
                    {teacherMode ? (
                      <NumberBadge n={idx + 1} className="mt-0.5" />
                    ) : (
                      <Checkbox checked={isUsed} className="mt-1 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-lg font-bold">
                          {item.targetStructure || item.prompt}
                        </p>
                        {isUsed ? (
                          <Check className="size-5 shrink-0 text-emerald-500" />
                        ) : null}
                      </div>
                      {item.exampleSentence ? (
                        <p className="mt-1 text-sm text-muted-foreground">{item.exampleSentence}</p>
                      ) : null}
                      {item.l1Gloss ? (
                        <p className="mt-1 text-xs italic text-muted-foreground">{item.l1Gloss}</p>
                      ) : null}
                    </div>
                    {item.exampleSentence ? (
                      <div className="mt-0.5 shrink-0">
                        <AudioButton text={item.exampleSentence} rate={0.9} label="Play example" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="gap-2 rounded-xl" onClick={finish}>
                Finish round
              </Button>
            </div>
          </div>
        </div>
      )}
    </GameChrome>
  );
}

export default PictureDescriptionGame;
