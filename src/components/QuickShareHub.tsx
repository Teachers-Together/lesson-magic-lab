import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePin, joinUrlFor, pinForActivity } from "@/lib/pins";
import { useStore } from "@/lib/store";

export function QuickShareHub() {
  const { activities } = useStore();
  const [activityId, setActivityId] = useState<string>("");
  const [pin, setPin] = useState<string | null>(null);
  const [copied, setCopied] = useState<"pin" | "url" | null>(null);

  useEffect(() => {
    if (!activityId && activities[0]) setActivityId(activities[0].id);
  }, [activities, activityId]);

  useEffect(() => {
    if (activityId) setPin(pinForActivity(activityId));
  }, [activityId]);

  const url = pin ? joinUrlFor(pin) : "";

  const copy = (text: string, which: "pin" | "url") => {
    void navigator.clipboard?.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-action text-action-foreground">
          <Share2 className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Quick Share Hub</h2>
          <p className="text-sm text-muted-foreground">
            Generate a game PIN and send students straight to the activity.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Activity
          </label>
          <Select value={activityId} onValueChange={setActivityId}>
            <SelectTrigger className="mt-2 h-12 rounded-2xl">
              <SelectValue placeholder="Choose an activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setPin(generatePin(activityId, 4))}
            disabled={!activityId}
            className="h-12 gap-2 rounded-2xl bg-gradient-brand font-bold text-primary-foreground hover:opacity-90"
          >
            <KeyRound className="size-4" /> Generate Invite PIN
          </Button>
          <Button
            variant="outline"
            onClick={() => setPin(generatePin(activityId, 6))}
            disabled={!activityId}
            className="h-12 rounded-2xl font-bold"
          >
            6-digit
          </Button>
        </div>
      </div>

      {pin ? (
        <div className="mt-6 grid gap-4 rounded-3xl bg-muted/60 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <button
            onClick={() => copy(pin, "pin")}
            className="rounded-2xl border-2 border-primary/40 bg-card px-6 py-4 text-center transition-colors hover:border-primary"
          >
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              PIN
            </p>
            <p className="font-display text-4xl font-extrabold tracking-[0.2em] text-primary tabular-nums">
              {pin}
            </p>
          </button>
          <div className="min-w-0">
            <Badge variant="secondary" className="gap-1.5">
              <Link2 className="size-3.5" /> Direct play link
            </Badge>
            <p className="mt-2 truncate font-mono text-sm">{url}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => copy(url, "url")} className="gap-2 font-bold">
                {copied === "url" ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied === "url" ? "Copied!" : "Copy link"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copy(pin, "pin")}
                className="gap-2 font-bold"
              >
                {copied === "pin" ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied === "pin" ? "Copied!" : "Copy PIN"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          No live PIN yet for this activity — generate one to share it with your class.
        </p>
      )}
    </section>
  );
}
