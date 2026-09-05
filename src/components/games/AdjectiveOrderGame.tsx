import * as React from "react";
import { ListOrdered, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameChrome, NumberBadge } from "./GameChrome";
import type { GameItem } from "@/lib/game-contract";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* The rule                                                            */
/* ------------------------------------------------------------------ */

type Category = "opinion" | "size" | "age" | "shape" | "color" | "origin" | "material" | "purpose";

const ORDER: Category[] = [
  "opinion",
  "size",
  "age",
  "shape",
  "color",
  "origin",
  "material",
  "purpose",
];

const ORDER_EXAMPLES: Record<Category, string> = {
  opinion: "lovely, beautiful, strange, boring",
  size: "big, small, huge, tall, tiny",
  age: "old, new, young, ancient",
  shape: "round, square, flat, long",
  color: "red, blue, black, green",
  origin: "American, French, Italian, Chinese",
  material: "wooden, metal, silk, cotton, plastic",
  purpose: "sleeping, cooking, running, shopping",
};

const CATEGORY_TONE: Record<Category, string> = {
  opinion: "bg-primary/15 text-primary",
  size: "bg-action/15 text-action",
  age: "bg-success/15 text-success",
  shape: "bg-secondary text-secondary-foreground",
  color: "bg-destructive/15 text-destructive",
  origin: "bg-primary/10 text-primary",
  material: "bg-muted text-muted-foreground",
  purpose: "bg-action/10 text-action",
};

/* ------------------------------------------------------------------ */
/* Lexicon: 200+ common adjectives, American spelling                  */
/* ------------------------------------------------------------------ */

const WORDS: Record<Category, string[]> = {
  opinion: [
    "lovely",
    "beautiful",
    "pretty",
    "ugly",
    "strange",
    "odd",
    "boring",
    "interesting",
    "exciting",
    "dull",
    "nice",
    "horrible",
    "awful",
    "terrible",
    "wonderful",
    "amazing",
    "fantastic",
    "great",
    "good",
    "bad",
    "delicious",
    "tasty",
    "disgusting",
    "comfortable",
    "uncomfortable",
    "expensive",
    "cheap",
    "useful",
    "useless",
    "important",
    "silly",
    "stupid",
    "clever",
    "smart",
    "funny",
    "serious",
    "friendly",
    "unfriendly",
    "kind",
    "rude",
    "polite",
    "noisy",
    "quiet",
    "busy",
    "lazy",
    "brave",
    "scary",
    "frightening",
    "charming",
    "elegant",
    "gorgeous",
    "stunning",
    "cute",
    "adorable",
    "annoying",
    "difficult",
    "easy",
    "popular",
    "famous",
    "strong",
    "weak",
    "clean",
    "dirty",
    "fresh",
    "romantic",
    "relaxing",
    "impressive",
    "remarkable",
    "unusual",
    "ordinary",
  ],
  size: [
    "big",
    "small",
    "large",
    "little",
    "huge",
    "enormous",
    "giant",
    "gigantic",
    "massive",
    "tiny",
    "minute",
    "tall",
    "short",
    "long",
    "wide",
    "narrow",
    "thick",
    "thin",
    "fat",
    "slim",
    "deep",
    "shallow",
    "heavy",
    "light",
    "broad",
    "compact",
    "spacious",
    "roomy",
    "oversized",
    "petite",
  ],
  age: [
    "old",
    "new",
    "young",
    "ancient",
    "antique",
    "modern",
    "recent",
    "elderly",
    "middle-aged",
    "newborn",
    "brand-new",
    "historic",
    "prehistoric",
    "vintage",
    "contemporary",
    "aged",
    "teenage",
    "adult",
    "century-old",
    "fresh-baked",
  ],
  shape: [
    "round",
    "square",
    "rectangular",
    "triangular",
    "circular",
    "oval",
    "flat",
    "curved",
    "straight",
    "crooked",
    "bent",
    "pointed",
    "sharp",
    "blunt",
    "hollow",
    "solid",
    "chunky",
    "slender",
    "twisted",
    "spiral",
    "cylindrical",
    "boxy",
    "wavy",
    "zigzag",
    "domed",
  ],
  color: [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "silver",
    "golden",
    "beige",
    "turquoise",
    "violet",
    "crimson",
    "scarlet",
    "navy",
    "maroon",
    "cream",
    "ivory",
    "olive",
    "lime",
    "teal",
    "amber",
    "peach",
    "lavender",
    "dark",
    "pale",
    "bright",
    "colorful",
    "spotted",
    "striped",
    "checked",
  ],
  origin: [
    "american",
    "british",
    "english",
    "scottish",
    "irish",
    "french",
    "german",
    "italian",
    "spanish",
    "portuguese",
    "dutch",
    "belgian",
    "swiss",
    "greek",
    "turkish",
    "russian",
    "polish",
    "swedish",
    "norwegian",
    "danish",
    "chinese",
    "japanese",
    "korean",
    "vietnamese",
    "thai",
    "indian",
    "pakistani",
    "indonesian",
    "filipino",
    "australian",
    "canadian",
    "mexican",
    "brazilian",
    "argentinian",
    "colombian",
    "peruvian",
    "chilean",
    "egyptian",
    "moroccan",
    "nigerian",
    "kenyan",
    "ethiopian",
    "south-african",
    "arabic",
    "persian",
    "israeli",
    "lebanese",
    "european",
    "asian",
    "african",
    "tropical",
    "northern",
    "southern",
    "eastern",
    "western",
    "local",
    "imported",
  ],
  material: [
    "wooden",
    "metal",
    "metallic",
    "steel",
    "iron",
    "silver",
    "gold",
    "bronze",
    "copper",
    "plastic",
    "glass",
    "paper",
    "cardboard",
    "leather",
    "silk",
    "cotton",
    "woolen",
    "wool",
    "linen",
    "denim",
    "velvet",
    "nylon",
    "rubber",
    "stone",
    "marble",
    "granite",
    "concrete",
    "brick",
    "clay",
    "ceramic",
    "porcelain",
    "bamboo",
    "straw",
    "fur",
    "diamond",
    "crystal",
    "tin",
    "aluminum",
    "chocolate",
    "wax",
  ],
  purpose: [
    "sleeping",
    "cooking",
    "running",
    "shopping",
    "walking",
    "swimming",
    "reading",
    "writing",
    "dining",
    "living",
    "working",
    "training",
    "hiking",
    "riding",
    "racing",
    "camping",
    "fishing",
    "gardening",
    "cleaning",
    "washing",
    "drinking",
    "baking",
    "sewing",
    "climbing",
    "skiing",
    "surfing",
    "dancing",
    "painting",
    "hunting",
    "travel",
    "school",
    "office",
    "kitchen",
    "sports",
    "party",
    "wedding",
    "safety",
    "evening",
    "rain",
    "winter",
  ],
};

const LEXICON: Record<string, Category> = (() => {
  const map: Record<string, Category> = {};
  for (const cat of ORDER) for (const w of WORDS[cat]) map[w] = cat;
  return map;
})();

const DETERMINERS = new Set([
  "a",
  "an",
  "the",
  "some",
  "any",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "this",
  "that",
  "these",
  "those",
  "two",
  "three",
  "four",
  "five",
  "several",
  "many",
]);

const norm = (w: string) => w.toLowerCase().replace(/[.,!?;:"']/g, "");

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

type Adj = { id: string; text: string; category: Category | null };

type Parsed = {
  lead: string[];
  adjectives: Adj[];
  tail: string[];
  unknown: boolean;
};

function parseItem(item: GameItem): Parsed {
  const words = item.answer.trim().split(/\s+/).filter(Boolean);
  const lead: string[] = [];
  let i = 0;
  while (i < words.length && DETERMINERS.has(norm(words[i]!))) {
    lead.push(words[i]!);
    i++;
  }
  // Everything from i to the last word; the last word is the noun.
  const rest = words.slice(i);
  const tail = rest.length ? [rest[rest.length - 1]!] : [];
  const adjWords = rest.slice(0, Math.max(0, rest.length - 1));

  const hintCats = (item.hint ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is Category => (ORDER as string[]).includes(s));

  let unknown = false;
  const adjectives: Adj[] = adjWords.map((text, idx) => {
    const fromHint = hintCats[idx] ?? null;
    const fromLexicon = LEXICON[norm(text)] ?? null;
    const category = fromHint ?? fromLexicon;
    if (!category) unknown = true;
    return { id: `${idx}-${norm(text)}`, text, category };
  });

  return { lead, adjectives, tail, unknown };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function AdjectiveOrderGame(props: {
  items: GameItem[];
  teacherMode: boolean;
  onComplete: (r: { correct: number; total: number; missedIds: string[] }) => void;
  onEvent?: (e: { type: string; itemId?: string }) => void;
  lang?: string;
}) {
  const { items, teacherMode, onComplete, onEvent } = props;

  const [index, setIndex] = React.useState(0);
  const [slots, setSlots] = React.useState<(Adj | null)[]>([]);
  const [tray, setTray] = React.useState<Adj[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [solved, setSolved] = React.useState(false);
  const [attempted, setAttempted] = React.useState(false);
  const [showReference, setShowReference] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [missed, setMissed] = React.useState<string[]>([]);
  const [swaps, setSwaps] = React.useState<Record<string, number>>({});
  const [finished, setFinished] = React.useState(false);

  const item = items[index];
  const parsed = React.useMemo(
    () => (item ? parseItem(item) : { lead: [], adjectives: [], tail: [], unknown: false }),
    [item],
  );
  const unknownCategories = parsed.unknown;

  const emit = React.useCallback(
    (type: string) => {
      if (item) onEvent?.({ type, itemId: item.id });
      else onEvent?.({ type });
    },
    [item, onEvent],
  );

  const setupRound = React.useCallback((target: GameItem | undefined) => {
    if (!target) return;
    const p = parseItem(target);
    setFeedback(null);
    setSelected(null);
    setAttempted(false);
    if (p.unknown) {
      // Cannot teach the rule without categories — show it already ordered.
      setSlots(p.adjectives);
      setTray([]);
      setSolved(true);
    } else {
      setSlots(Array.from({ length: p.adjectives.length }, () => null));
      setTray(shuffle(p.adjectives));
      setSolved(false);
    }
  }, []);

  React.useEffect(() => {
    setupRound(items[index]);
  }, [index, items, setupRound]);

  /* -------------------------- placement -------------------------- */

  const placeIntoSlot = (adj: Adj, slotIndex: number) => {
    setFeedback(null);
    setSlots((prev) => {
      const next = [...prev];
      const displaced = next[slotIndex] ?? null;
      next[slotIndex] = adj;
      if (displaced) setTray((t) => [...t, displaced]);
      return next;
    });
    setTray((t) => t.filter((x) => x.id !== adj.id));
    setSelected(null);
    emit("place-adjective");
  };

  const clickTrayWord = (adj: Adj) => {
    if (solved) return;
    if (selected === adj.id) {
      setSelected(null);
      return;
    }
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty === -1) {
      setSelected(adj.id);
      return;
    }
    placeIntoSlot(adj, firstEmpty);
  };

  const clickSlot = (slotIndex: number) => {
    if (solved) return;
    const chosen = tray.find((t) => t.id === selected);
    if (chosen) {
      placeIntoSlot(chosen, slotIndex);
      return;
    }
    const current = slots[slotIndex];
    if (current) {
      setFeedback(null);
      setSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
      setTray((t) => [...t, current]);
    }
  };

  const undo = () => {
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i]) {
        clickSlot(i);
        return;
      }
    }
  };

  /* --------------------------- checking --------------------------- */

  const check = () => {
    if (!item || solved) return;
    const filled = slots.filter(Boolean) as Adj[];
    if (filled.length !== parsed.adjectives.length) {
      setFeedback("Some adjectives are still in the tray — place them all first.");
      return;
    }
    setAttempted(true);

    // Find the first pair that is out of category order.
    let problem: { a: Adj; b: Adj } | null = null;
    for (let i = 0; i < filled.length - 1 && !problem; i++) {
      for (let j = i + 1; j < filled.length; j++) {
        const ai = ORDER.indexOf(filled[i]!.category as Category);
        const aj = ORDER.indexOf(filled[j]!.category as Category);
        if (ai > aj) {
          problem = { a: filled[j]!, b: filled[i]! };
          break;
        }
      }
    }

    if (!problem) {
      setSolved(true);
      setFeedback(null);
      setCorrectCount((n) => (attempted ? n : n + 1));
      emit("correct");
      return;
    }

    const first = problem.a;
    const second = problem.b;
    const pairKey = `${first.category}/${second.category}`;
    setSwaps((s) => ({ ...s, [pairKey]: (s[pairKey] ?? 0) + 1 }));
    setFeedback(
      `${cap(first.category as string)} comes before ${second.category} — "${first.text}" goes before "${second.text}".`,
    );
    setMissed((m) => (m.includes(item.id) ? m : [...m, item.id]));
    emit("incorrect");
  };

  const advance = React.useCallback(() => {
    if (index + 1 >= items.length) setFinished(true);
    else setIndex((i) => i + 1);
  }, [index, items.length]);

  const completedRef = React.useRef(false);
  React.useEffect(() => {
    if (!finished || completedRef.current) return;
    completedRef.current = true;
    onComplete({ correct: correctCount, total: items.length, missedIds: missed });
  }, [finished, correctCount, items.length, missed, onComplete]);

  /* ------------------------- teacher keys ------------------------- */

  React.useEffect(() => {
    if (!teacherMode) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const n = Number(e.key) - 1;
      e.preventDefault();
      if (selected) {
        if (n < slots.length) clickSlot(n);
        return;
      }
      const token = tray[n];
      if (token) setSelected((cur) => (cur === token.id ? null : token.id));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!items.length) {
    return <p className="p-6 text-muted-foreground">No phrases to order yet.</p>;
  }

  const referenceStrip = showReference ? (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Adjective order
      </p>
      <ol className="grid gap-2 sm:grid-cols-2">
        {ORDER.map((cat, i) => (
          <li key={cat} className="flex items-center gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold">
              {i + 1}
            </span>
            <span className={cn("rounded-md px-2 py-0.5 text-sm font-bold", CATEGORY_TONE[cat])}>
              {cap(cat)}
            </span>
            <span className="truncate text-sm text-muted-foreground">{ORDER_EXAMPLES[cat]}</span>
          </li>
        ))}
      </ol>
    </div>
  ) : null;

  if (finished) {
    const drills = Object.entries(swaps).sort((a, b) => b[1] - a[1]);
    return (
      <GameChrome title="Adjective Order" teacherMode={teacherMode}>
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <h2 className="text-3xl font-bold">Set finished</h2>
          <p className="mt-3 text-xl text-muted-foreground">
            {correctCount} of {items.length} phrases ordered first time.
          </p>
          <div className="mt-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Drill next
            </p>
            {drills.length ? (
              <ul className="mt-2 space-y-1 text-lg">
                {drills.map(([pair, n]) => (
                  <li key={pair}>
                    {pair} — swapped {n} {n === 1 ? "time" : "times"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-lg">No category pairs were swapped. The rule has landed.</p>
            )}
          </div>
          <Button
            className="mt-8"
            size="lg"
            onClick={() => {
              setIndex(0);
              setCorrectCount(0);
              setMissed([]);
              setSwaps({});
              setFinished(false);
              completedRef.current = false;
              setupRound(items[0]);
            }}
          >
            <RotateCcw className="size-4" /> Run the set again
          </Button>
        </Card>
      </GameChrome>
    );
  }

  return (
    <GameChrome
      title="Adjective Order"
      {...(item?.targetStructure ? { targetStructure: item.targetStructure } : {})}
      teacherMode={teacherMode}
      onUndo={undo}
      onAdvance={advance}
      progress={{ done: index, total: items.length }}
    >
      <div className="touch-none select-none space-y-7">
        {item?.prompt ? (
          <p className="text-center text-lg text-muted-foreground">{item.prompt}</p>
        ) : null}

        {unknownCategories ? (
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Category unknown — showing this phrase already in order.
          </p>
        ) : null}

        {/* The phrase line: article, slots, noun */}
        <div className="flex flex-wrap items-end justify-center gap-3">
          {parsed.lead.map((w, i) => (
            <span key={`lead-${i}`} className="px-1 pb-3 text-2xl font-bold text-muted-foreground">
              {w}
            </span>
          ))}

          {slots.map((slot, i) => (
            <div key={`slot-${i}`} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => clickSlot(i)}
                className={cn(
                  "relative flex min-h-16 min-w-28 items-center justify-center gap-2 rounded-xl border-2 px-5 py-3 text-2xl font-bold transition-colors",
                  slot
                    ? solved
                      ? "border-success bg-success/10 text-foreground"
                      : "border-border bg-card text-card-foreground"
                    : "border-dashed border-border bg-muted text-muted-foreground",
                  selected && !slot && "border-primary",
                )}
              >
                {teacherMode && i < 9 ? <NumberBadge n={i + 1} className="size-7 text-sm" /> : null}
                {slot ? slot.text : <span className="opacity-40">•</span>}
              </button>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-bold transition-opacity",
                  slot?.category ? CATEGORY_TONE[slot.category] : "",
                  solved && slot?.category ? "opacity-100" : "opacity-0",
                )}
              >
                {slot?.category ? cap(slot.category) : "—"}
              </span>
            </div>
          ))}

          {parsed.tail.map((w, i) => (
            <span key={`tail-${i}`} className="px-1 pb-3 text-2xl font-bold">
              {w}
            </span>
          ))}
        </div>

        {/* Feedback that names the categories */}
        <div className="min-h-14 text-center">
          {solved ? (
            <p className="text-2xl font-bold text-success">
              Right order — read the labels under each word.
            </p>
          ) : feedback ? (
            <p className="mx-auto max-w-3xl rounded-xl bg-muted px-5 py-3 text-xl font-semibold text-foreground">
              {feedback}
            </p>
          ) : null}
        </div>

        {/* Tray */}
        {tray.length ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tray.map((adj, i) => (
              <button
                key={adj.id}
                type="button"
                onClick={() => clickTrayWord(adj)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 bg-card px-5 py-3 text-2xl font-bold text-card-foreground transition-transform hover:-translate-y-0.5",
                  selected === adj.id ? "border-primary ring-2 ring-ring" : "border-border",
                )}
              >
                {teacherMode && i < 9 ? <NumberBadge n={i + 1} className="size-7 text-sm" /> : null}
                {adj.text}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={check} disabled={solved}>
            Check order
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setShowReference((v) => !v)}>
            <ListOrdered className="size-4" />
            {showReference ? "Hide the order" : "Show the order"}
          </Button>
          <Button size="lg" variant="outline" onClick={undo} disabled={solved}>
            Undo
          </Button>
          <Button size="lg" variant={solved ? "default" : "ghost"} onClick={advance}>
            {index + 1 >= items.length ? "Finish" : "Next phrase"}
          </Button>
        </div>

        {referenceStrip}

        {item?.cefr ? (
          <div className="text-center">
            <Badge variant="secondary" className="text-base">
              {item.cefr}
            </Badge>
          </div>
        ) : null}
      </div>
    </GameChrome>
  );
}

export default AdjectiveOrderGame;
