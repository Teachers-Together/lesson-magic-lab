import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, BookOpen, Shuffle, RefreshCw, Trophy } from "lucide-react";
import { GameChrome, NumberBadge } from "./GameChrome";
import { AudioButton } from "./AudioButton";
import type { GameItem } from "@/lib/game-contract";

/**
 * BingoGame — speaking bingo for one-to-one screen-share classes.
 *
 * The student has the card; the teacher calls words (by voice or the
 * built-in audio buttons) and clicks cells the student asks to mark.
 * In Definition mode the voice reads the exampleSentence with the target
 * word blanked, so the student must RECALL the word, not just spot it.
 * A fresh random card is dealt every round from the same pool.
 *
 * Data: cell text = item.answer; spoken word = item.audioText ?? item.answer;
 * definition cue = item.exampleSentence with the answer blanked out.
 */

type Mode = "listen" | "definition";
type Size = 3 | 4;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Blank the target word inside the example sentence. */
function blankOut(sentence: string, word: string): string {
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const blanked = sentence.replace(re, "____");
  return blanked === sentence ? `____ — ${sentence}` : blanked;
}

export function BingoGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
  lang?: string;
}) {
  const { items, teacherMode, onComplete, onEvent, lang } = props;
  const maxSize: Size = items.length >= 16 ? 4 : 3;
  const [size, setSize] = React.useState<Size>(items.length >= 9 ? maxSize : 3);
  const [mode, setMode] = React.useState<Mode>("listen");
  const [round, setRound] = React.useState(0);
  const [card, setCard] = React.useState<GameItem[]>([]);
  const [called, setCalled] = React.useState<string[]>([]);
  const [marked, setMarked] = React.useState<string[]>([]);
  const [bingo, setBingo] = React.useState(false);

  const deal = React.useCallback(
    (s: Size) => {
      const need = s * s;
      const pool = shuffle(items);
      const picked: GameItem[] = [];
      while (picked.length < need && pool.length > 0) {
        picked.push(...pool.splice(0, Math.min(need - picked.length, pool.length)));
      }
      setCard(picked.slice(0, need));
      setCalled([]);
      setMarked([]);
      setBingo(false);
    },
    [items]
  );

  React.useEffect(() => {
    deal(size);
  }, [deal, size, round]);

  const callWord = (item: GameItem) => {
    if (bingo) return;
    if (!called.includes(item.id)) {
      setCalled((c) => [...c, item.id]);
      onEvent?.({ type: "call", itemId: item.id });
    }
  };

  const toggleMark = (item: GameItem) => {
    if (bingo || !called.includes(item.id)) return;
    setMarked((m) =>
      m.includes(item.id) ? m.filter((id) => id !== item.id) : [...m, item.id]
    );
    onEvent?.({ type: "mark", itemId: item.id });
  };

  const sayBingo = () => {
    if (bingo) return;
    setBingo(true);
  };

  const completedRef = React.useRef(false);
  React.useEffect(() => {
    if (!bingo || completedRef.current) return;
    completedRef.current = true;
    onComplete({ correct: marked.length, total: card.length, missedIds: [] });
  }, [bingo, marked.length, card.length, onComplete]);

  const redeal = () => {
    setRound((r) => r + 1);
    onEvent?.({ type: "redeal" });
  };

  const calledItems = called
    .map((id) => card.find((c) => c.id === id))
    .filter((i): i is GameItem => Boolean(i));

  return (
    <GameChrome
      title={mode === "definition" ? "Bingo — Definition Round" : "Bingo"}
      {...(() => {
        const ts = items.find((i) => i.targetStructure)?.targetStructure;
        return ts ? { targetStructure: ts } : {};
      })()}
      teacherMode={teacherMode}
      progress={{ done: marked.length, total: card.length }}
      onAdvance={redeal}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.length >= 16 && (
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              {([3, 4] as Size[]).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={size === s ? "default" : "ghost"}
                  onClick={() => setSize(s)}
                >
                  {s}×{s}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <Button
              size="sm"
              variant={mode === "listen" ? "default" : "ghost"}
              onClick={() => setMode("listen")}
            >
              <Volume2 className="mr-1 h-4 w-4" /> Hear the word
            </Button>
            <Button
              size="sm"
              variant={mode === "definition" ? "default" : "ghost"}
              onClick={() => setMode("definition")}
            >
              <BookOpen className="mr-1 h-4 w-4" /> Definition round
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={redeal}>
            <Shuffle className="mr-1 h-4 w-4" /> New card
          </Button>
          <Button
            size="lg"
            onClick={sayBingo}
            disabled={bingo}
            className="bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <Trophy className="mr-2 h-5 w-5" /> Student said BINGO!
          </Button>
        </div>

        {mode === "definition" && (
          <Badge variant="secondary" className="text-sm">
            Recall mode: the voice reads a sentence with the word missing — the
            student finds the word on the card.
          </Badge>
        )}

        <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row">
          {/* Card */}
          <div
            className="grid flex-1 gap-2"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {card.map((item, idx) => {
              const isCalled = called.includes(item.id);
              const isMarked = marked.includes(item.id);
              return (
                <Card
                  key={item.id + round}
                  onClick={() => toggleMark(item)}
                  className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border-2 p-2 text-center transition ${
                    isMarked
                      ? "border-emerald-500 bg-emerald-500/15"
                      : isCalled
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                  }`}
                >
                  {teacherMode && (
                    <div className="absolute left-1.5 top-1.5">
                      <NumberBadge n={idx + 1} />
                    </div>
                  )}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.answer}
                      className="max-h-2/3 max-w-full rounded object-contain"
                    />
                  ) : null}
                  <span className="text-lg font-semibold leading-tight md:text-xl">
                    {item.answer}
                  </span>
                  {isMarked && (
                    <span className="text-xs font-bold uppercase text-emerald-500">
                      marked
                    </span>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Called words panel */}
          <Card className="w-full p-4 md:w-72">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Called ({called.length})
            </p>
            {calledItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Press a word's speaker to call it — or just read it aloud
                yourself.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {calledItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1"
                  >
                    <span className="font-medium">{item.answer}</span>
                    <AudioButton
                      text={
                        mode === "definition" && item.exampleSentence
                          ? blankOut(item.exampleSentence, item.answer)
                          : item.audioText ?? item.answer
                      }
                      label="Replay"
                      {...(lang ? { lang } : {})}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Call board: all pool words with audio, for the teacher to call from */}
        <Card className="w-full max-w-4xl p-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {teacherMode ? "Call a word" : "Word pool"}
          </p>
          <div className="flex flex-wrap gap-2">
            {card.map((item) => {
              const isCalled = called.includes(item.id);
              return (
                <div
                  key={"call-" + item.id}
                  className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                    isCalled ? "border-border opacity-40" : "border-primary/40"
                  }`}
                >
                  {teacherMode && !isCalled ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-1 font-medium"
                      onClick={() => callWord(item)}
                    >
                      {item.answer}
                    </Button>
                  ) : (
                    <span className="px-1 text-sm font-medium">{item.answer}</span>
                  )}
                  <AudioButton
                    text={
                      mode === "definition" && item.exampleSentence
                        ? blankOut(item.exampleSentence, item.answer)
                        : item.audioText ?? item.answer
                    }
                    label={mode === "definition" ? "Read definition" : "Say word"}
                    {...(lang ? { lang } : {})}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {bingo && (
          <Card className="w-full max-w-2xl border-emerald-500 bg-emerald-500/10 p-6 text-center">
            <p className="text-3xl font-extrabold text-emerald-500">BINGO!</p>
            <p className="mt-1 text-muted-foreground">
              {marked.length} of {card.length} squares marked.
            </p>
            <Button className="mt-4" onClick={redeal}>
              <RefreshCw className="mr-2 h-4 w-4" /> Deal a fresh card
            </Button>
          </Card>
        )}
      </div>
    </GameChrome>
  );
}

export default BingoGame;
