import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizGame } from "@/components/games/QuizGame";
import { MatchupGame } from "@/components/games/MatchupGame";
import { WheelGame } from "@/components/games/WheelGame";
import { FlipCardsGame } from "@/components/games/FlipCardsGame";
import { SortingGame } from "@/components/games/SortingGame";
import { MazeGame } from "@/components/games/MazeGame";
import { OpenBoxGame } from "@/components/games/OpenBoxGame";
import { GroupSortGame } from "@/components/games/GroupSortGame";
import { WhackAMoleGame } from "@/components/games/WhackAMoleGame";
import { AnagramGame } from "@/components/games/AnagramGame";
import { ClozeGame } from "@/components/games/ClozeGame";
import { GameshowQuizGame } from "@/components/games/GameshowQuizGame";
import { CardDeckGame } from "@/components/games/CardDeckGame";
import { TeamShowdownGame } from "@/components/games/TeamShowdownGame";
import { DualModeBar } from "@/components/DualModeBar";
import { UpgradeShop } from "@/components/UpgradeShop";
import { PlayModeProvider } from "@/lib/playmode";
import { GAME_TEMPLATES, useStore } from "@/lib/store";

export const Route = createFileRoute("/play/$activityId")({
  head: () => ({
    meta: [
      { title: "Play — EduPulse AI" },
      { name: "description", content: "A distraction-free, full-screen interactive learning game." },
      { property: "og:title", content: "Play — EduPulse AI" },
      { property: "og:description", content: "Play an AI-generated interactive learning game." },
    ],
  }),
  component: PlayZone,
});

function PlayZone() {
  const { activityId } = useParams({ from: "/play/$activityId" });
  const { getActivity, soundOn, toggleSound } = useStore();
  const activity = getActivity(activityId);

  if (!activity) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Activity not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been deleted.</p>
          <Button asChild className="mt-5">
            <Link to="/activities">Back to activities</Link>
          </Button>
        </div>
      </div>
    );
  }

  const adaptClass = activity.adaptation === "dyslexia" ? "dyslexia-mode" : "";
  const tpl = GAME_TEMPLATES.find((t) => t.type === activity.gameType)!;
  const supportsCash = activity.gameType === "quiz" || activity.gameType === "cloze";

  return (
    <PlayModeProvider>
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-8">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-base font-bold">{activity.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {activity.gradeLevel} · {tpl.name}
          </p>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex capitalize">
          {activity.adaptation === "standard" ? "Standard" : activity.adaptation}
        </Badge>
        <Button variant="ghost" size="icon" onClick={toggleSound} aria-label="Toggle sound">
          {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </Button>
        <Button asChild variant="ghost" size="icon" aria-label="Exit game">
          <Link to="/play">
            <X className="size-5" />
          </Link>
        </Button>
      </header>

      <DualModeBar showCashToggle={supportsCash} />



      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        {activity.gameType === "quiz" ? (
          <QuizGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "matchup" ? (
          <MatchupGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "wheel" ? (
          <WheelGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "flipcards" ? (
          <FlipCardsGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "maze" ? (
          <MazeGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "openbox" ? (
          <OpenBoxGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "groupsort" ? (
          <GroupSortGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "whack" ? (
          <WhackAMoleGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "anagram" ? (
          <AnagramGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "cloze" ? (
          <ClozeGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "gameshow" ? (
          <GameshowQuizGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "carddeck" ? (
          <CardDeckGame activity={activity} adaptClass={adaptClass} />
        ) : activity.gameType === "showdown" ? (
          <TeamShowdownGame activity={activity} adaptClass={adaptClass} />
        ) : (
          <SortingGame activity={activity} adaptClass={adaptClass} />
        )}
      </main>
      <UpgradeShop />
      </div>
    </PlayModeProvider>
  );
}
