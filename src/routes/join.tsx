import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolvePin } from "@/lib/pins";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join a Game with a PIN — EduPulse AI" },
      {
        name: "description",
        content: "Enter your class game PIN and your name to jump straight into today's EduPulse AI activity.",
      },
      { property: "og:title", content: "Join a Game with a PIN — EduPulse AI" },
      { property: "og:description", content: "Type the PIN your teacher shared and start playing instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ pin: typeof s['pin'] === "string" ? (s['pin'] as string) : undefined }),
  component: JoinPage,
});

function JoinPage() {
  const { pin: pinFromUrl } = Route.useSearch();
  const navigate = useNavigate();
  const [pin, setPin] = useState(pinFromUrl ?? "");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const activityId = resolvePin(pin);
    if (!activityId) {
      setError("That PIN isn't active. Double-check with your teacher.");
      return;
    }
    if (typeof window !== "undefined" && name.trim()) {
      window.localStorage.setItem("edupulse.playerName", name.trim());
    }
    navigate({ to: "/play/$activityId", params: { activityId } });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-brand px-4 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border-2 border-border bg-card p-8 text-center shadow-lift"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-action text-action-foreground">
          <KeyRound className="size-7" />
        </span>
        <h1 className="font-display mt-5 text-3xl font-extrabold">Join the game</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ask your teacher for today's PIN.</p>

        <Input
          inputMode="numeric"
          autoFocus
          placeholder="0000"
          maxLength={6}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          className="mt-8 h-24 rounded-2xl border-4 border-primary/40 text-center font-display text-5xl font-extrabold tracking-[0.35em] tabular-nums focus-visible:border-primary md:text-5xl"
          aria-label="Game PIN"
        />

        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4 h-14 rounded-2xl text-center text-lg font-bold"
          aria-label="Your name"
        />

        {error ? <p className="mt-4 text-sm font-bold text-destructive">{error}</p> : null}

        <Button
          type="submit"
          disabled={pin.length < 4}
          className="mt-6 h-14 w-full gap-2 rounded-2xl bg-gradient-action text-lg font-bold text-action-foreground hover:opacity-90"
        >
          Enter the Play Zone <ArrowRight className="size-5" />
        </Button>
      </form>
    </main>
  );
}
