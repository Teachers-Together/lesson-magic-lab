import * as React from "react";
import { Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GameChromeProps = {
  title: string;
  targetStructure?: string;
  teacherMode: boolean;
  onUndo?: () => void;
  onAdvance?: () => void;
  onReplayAudio?: () => void;
  progress?: { done: number; total: number };
  children: React.ReactNode;
};

export function GameChrome({
  title,
  targetStructure,
  teacherMode,
  onUndo,
  onAdvance,
  onReplayAudio,
  progress,
  children,
}: GameChromeProps) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          onAdvance?.();
          break;
        case "Backspace":
          e.preventDefault();
          onUndo?.();
          break;
        case "r":
        case "R":
          e.preventDefault();
          onReplayAudio?.();
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onAdvance, onUndo, onReplayAudio]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card/60 px-4 py-3 backdrop-blur-sm sm:px-6">
        <h1 className="font-display min-w-0 flex-1 truncate text-lg font-bold sm:text-xl">
          {title}
        </h1>
        {targetStructure ? (
          <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
            {targetStructure}
          </Badge>
        ) : null}
        {progress && progress.total > 0 ? (
          <span className="hidden shrink-0 text-sm font-semibold tabular-nums text-muted-foreground sm:inline-block">
            {progress.done}/{progress.total}
          </span>
        ) : null}
        {teacherMode ? (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1 rounded-lg"
            onClick={onUndo}
            aria-label="Undo last action"
          >
            <Undo2 className="size-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
        ) : null}
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto p-4 sm:p-6">
        <div className="w-full max-w-5xl">{children}</div>
      </div>

      {teacherMode ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 px-4 py-2 text-center text-sm font-semibold text-muted-foreground backdrop-blur-sm">
          1-9 answer · Space next · Backspace undo · R replay
        </div>
      ) : null}
    </div>
  );
}

export function NumberBadge({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-extrabold text-primary-foreground shadow ring-2 ring-background",
        className,
      )}
    >
      {n}
    </span>
  );
}
