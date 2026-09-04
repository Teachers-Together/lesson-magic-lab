import { labelFor, usePlayMode } from "@/lib/playmode";
import { cn } from "@/lib/utils";

/**
 * Big call-out badge rendered on interactive items while Teacher Screen-Control
 * mode is active, so students watching a screenshare can shout "Box 3!" / "Answer B!".
 */
export function ControlLabel({
  index,
  style = "number",
  className,
}: {
  index: number;
  style?: "letter" | "number";
  className?: string;
}) {
  const { controlMode } = usePlayMode();
  if (!controlMode) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none z-30 inline-grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-action font-display text-lg font-extrabold text-action-foreground shadow-lift ring-2 ring-background",
        className,
      )}
    >
      {labelFor(index, style)}
    </span>
  );
}
