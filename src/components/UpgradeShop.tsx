import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PERKS, usePlayMode } from "@/lib/playmode";
import { cn } from "@/lib/utils";

export function UpgradeShop() {
  const { cashEnabled, cash, owned, buy, insured } = usePlayMode();
  const [open, setOpen] = useState(false);
  if (!cashEnabled) return null;

  return (
    <div className="pointer-events-auto fixed right-4 bottom-4 z-40 flex items-center gap-2">
      <span className="animate-pop rounded-full bg-success px-4 py-2 font-display text-lg font-extrabold text-success-foreground shadow-lift tabular-nums">
        ${cash}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="gap-2 rounded-full bg-gradient-action font-bold text-action-foreground shadow-lift">
            <ShoppingBag className="size-4" /> Upgrade Shop
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">The Upgrade Shop</SheetTitle>
            <SheetDescription>
              Spend your Edu-Cash on passive perks. Balance:{" "}
              <span className="font-bold text-success">${cash}</span>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-3 px-4 pb-6">
            {PERKS.map((p) => {
              const has = owned.includes(p.id);
              const active = p.id === "insurance" ? insured : has;
              const afford = cash >= p.cost;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-2xl border-2 p-4 transition-all",
                    active ? "border-success bg-success/10" : "border-border bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-extrabold">
                        {p.emoji} {p.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={active || !afford}
                      onClick={() => buy(p.id)}
                      className={cn("shrink-0 font-bold", !active && "bg-gradient-action text-action-foreground")}
                    >
                      {active ? "Active" : `$${p.cost}`}
                    </Button>
                  </div>
                </div>
              );
            })}
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Correct answer: +$10 (+$5 with Streak Multiplier) · Wrong answer: −$5
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
