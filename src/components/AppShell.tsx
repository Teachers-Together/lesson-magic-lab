import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, LibraryBig, Gamepad2, Menu, Volume2, VolumeX } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "AI Creator Hub", icon: Sparkles },
  { to: "/activities", label: "My Activities", icon: LibraryBig },
  { to: "/play", label: "Student Play Zone", icon: Gamepad2 },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-2xl bg-gradient-action text-lg font-black text-sidebar-primary-foreground">
        E
      </span>
      <span className="font-display text-lg leading-tight font-extrabold tracking-tight text-sidebar-foreground">
        EduPulse<span className="text-sidebar-primary"> AI</span>
      </span>
    </Link>
  );
}

function SoundToggle() {
  const { soundOn, toggleSound } = useStore();
  return (
    <button
      onClick={toggleSound}
      className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border/60 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60"
    >
      {soundOn ? <Volume2 className="size-4.5" /> : <VolumeX className="size-4.5" />}
      Sound effects {soundOn ? "on" : "off"}
    </button>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-68 shrink-0 flex-col justify-between bg-sidebar p-5 lg:flex">
        <div className="space-y-8">
          <Brand />
          <NavList />
        </div>
        <div className="space-y-3">
          <SoundToggle />
          <div className="rounded-2xl bg-sidebar-accent/70 p-4">
            <p className="text-xs font-semibold text-sidebar-primary">AI credits</p>
            <p className="mt-1 text-2xl font-bold text-sidebar-foreground">248</p>
            <p className="text-xs text-sidebar-foreground/60">generations left this month</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-3.5 backdrop-blur-xl sm:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-0 bg-sidebar p-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="space-y-8">
                <Brand />
                <NavList onNavigate={() => setOpen(false)} />
                <SoundToggle />
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1">
            <h1 className="font-display truncate text-xl font-extrabold tracking-tight sm:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
