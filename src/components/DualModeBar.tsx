import { Flame, Hand, MonitorPlay, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePlayMode } from "@/lib/playmode";
import { cn } from "@/lib/utils";

export function DualModeBar({
  showCashToggle,
  showHotSeat,
}: {
  showCashToggle?: boolean;
  showHotSeat?: boolean;
}) {
  const { mode, setMode, roomCode, cashEnabled, setCashEnabled, hotSeat, setHotSeat } = usePlayMode();


  return (
    <div className="border-b border-border bg-muted/40 px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Teacher controls · Mode
        </span>

        <div className="flex rounded-full border-2 border-border bg-card p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMode("independent")}
            className={cn(
              "rounded-full gap-2 text-xs font-bold",
              mode === "independent" && "bg-gradient-brand text-primary-foreground hover:text-primary-foreground",
            )}
          >
            <Hand className="size-4" /> Independent Student Play
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMode("control")}
            className={cn(
              "rounded-full gap-2 text-xs font-bold",
              mode === "control" && "bg-gradient-action text-action-foreground hover:text-action-foreground",
            )}
          >
            <MonitorPlay className="size-4" /> Teacher Screen-Control
          </Button>
        </div>

        {mode === "independent" ? (
          <Badge variant="secondary" className="gap-1.5 font-mono text-sm tracking-[0.2em]">
            <Users className="size-3.5" /> {roomCode}
          </Badge>
        ) : (
          <Badge className="gap-1.5 bg-action/15 text-action">
            Students call out the numbers — you click for them
          </Badge>
        )}

        {showCashToggle ? (
          <label className="ml-auto flex items-center gap-2 text-xs font-bold">
            <Sparkles className="size-4 text-action" />
            Edu-Cash mode
            <Switch checked={cashEnabled} onCheckedChange={setCashEnabled} />
          </label>
        ) : null}
      </div>
    </div>
  );
}
