import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameChrome } from "@/components/games/GameChrome";

export const Route = createFileRoute("/test-gamechrome")({
  component: TestPage,
});

function TestPage() {
  const [audioFires, setAudioFires] = useState(0);
  const [advances, setAdvances] = useState(0);
  const [undos, setUndos] = useState(0);

  return (
    <div className="h-screen">
      <GameChrome
        title="Demo Game"
        targetStructure="present simple"
        teacherMode={true}
        progress={{ done: 2, total: 5 }}
        onReplayAudio={() => setAudioFires((c) => c + 1)}
        onAdvance={() => setAdvances((c) => c + 1)}
        onUndo={() => setUndos((c) => c + 1)}
      >
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow">
          <p className="font-display text-xl font-bold">Press R to replay audio</p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-muted p-3">Audio fires: <strong>{audioFires}</strong></div>
            <div className="rounded-lg bg-muted p-3">Advances: <strong>{advances}</strong></div>
            <div className="rounded-lg bg-muted p-3">Undos: <strong>{undos}</strong></div>
          </div>
        </div>
      </GameChrome>
    </div>
  );
}
