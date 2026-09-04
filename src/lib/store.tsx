import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type GameType =
  | "quiz"
  | "matchup"
  | "wheel"
  | "flipcards"
  | "sorting"
  | "maze"
  | "openbox"
  | "groupsort";

export type QuizItem = { prompt: string; answer: string; distractors: string[] };
export type PairItem = { prompt: string; answer: string };
export type WheelItem = { prompt: string; answer: string };
export type FlipItem = { prompt: string; answer: string };

export type ContentItem = { id: string; prompt: string; answer: string; distractors: string[] };

export type Activity = {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  gameType: GameType;
  contentData: ContentItem[];
  adaptation: Adaptation;
  createdAt: string;
  plays: number;
  avgScore: number;
};

export type Adaptation = "standard" | "dyslexia" | "ell" | "simplified";

export const GAME_TEMPLATES: {
  type: GameType;
  name: string;
  blurb: string;
  emoji: string;
}[] = [
  { type: "quiz", name: "Next-Gen Quiz", blurb: "Timed multiple choice with live score", emoji: "⚡" },
  { type: "matchup", name: "Interactive Matchup", blurb: "Drag terms onto definitions", emoji: "🔗" },
  { type: "wheel", name: "Wheel of Wonder", blurb: "Flick-to-spin physics wheel", emoji: "🎡" },
  { type: "flipcards", name: "Kinetic Flip Cards", blurb: "3D flip + word hotspot clicker", emoji: "🃏" },
  { type: "sorting", name: "Fluid Sorting Bins", blurb: "Organic drag-and-drop sticky notes", emoji: "🧲" },
];

export const uid = () => Math.random().toString(36).slice(2, 10);

const seedContent = (rows: [string, string, string[]][]): ContentItem[] =>
  rows.map(([prompt, answer, distractors]) => ({ id: uid(), prompt, answer, distractors }));

const SEED: Activity[] = [
  {
    id: "seed-fractions",
    title: "3rd Grade Fractions Warm-Up",
    subject: "Mathematics",
    gradeLevel: "Grade 3",
    gameType: "quiz",
    adaptation: "standard",
    createdAt: "2026-08-28T09:12:00.000Z",
    plays: 128,
    avgScore: 82,
    contentData: seedContent([
      ["Which fraction is equal to one half?", "2/4", ["1/3", "3/5", "2/5"]],
      ["What is the top number of a fraction called?", "Numerator", ["Denominator", "Divisor", "Quotient"]],
      ["Which is larger: 3/4 or 1/4?", "3/4", ["1/4", "They are equal", "Cannot tell"]],
      ["1/3 + 1/3 equals what?", "2/3", ["1/6", "2/6", "1/3"]],
      ["A pizza cut into 8 equal slices: one slice is…", "1/8", ["8/1", "1/4", "2/8"]],
    ]),
  },
  {
    id: "seed-spanish",
    title: "Spanish Past Tense Matchup",
    subject: "World Languages",
    gradeLevel: "Grade 8",
    gameType: "matchup",
    adaptation: "ell",
    createdAt: "2026-08-30T14:40:00.000Z",
    plays: 74,
    avgScore: 91,
    contentData: seedContent([
      ["hablé", "I spoke", []],
      ["comiste", "you ate", []],
      ["vivió", "he/she lived", []],
      ["fuimos", "we went", []],
    ]),
  },
  {
    id: "seed-bio",
    title: "Cell Biology Spin Challenge",
    subject: "Science",
    gradeLevel: "Grade 10",
    gameType: "wheel",
    adaptation: "standard",
    createdAt: "2026-09-01T08:05:00.000Z",
    plays: 39,
    avgScore: 76,
    contentData: seedContent([
      ["Mitochondria", "Powerhouse of the cell", []],
      ["Ribosome", "Builds proteins", []],
      ["Nucleus", "Stores DNA", []],
      ["Chloroplast", "Performs photosynthesis", []],
      ["Cell membrane", "Controls what enters and exits", []],
      ["Vacuole", "Stores water and nutrients", []],
    ]),
  },
];

type Ctx = {
  activities: Activity[];
  addActivity: (a: Activity) => void;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  getActivity: (id: string) => Activity | undefined;
  recordPlay: (id: string, score: number) => void;
  soundOn: boolean;
  toggleSound: () => void;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "edupulse.activities.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(SEED);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setActivities(JSON.parse(raw) as Activity[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(activities));
    } catch {
      /* ignore */
    }
  }, [activities]);

  const addActivity = useCallback((a: Activity) => setActivities((p) => [a, ...p]), []);
  const updateActivity = useCallback(
    (id: string, patch: Partial<Activity>) =>
      setActivities((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    [],
  );
  const removeActivity = useCallback(
    (id: string) => setActivities((p) => p.filter((a) => a.id !== id)),
    [],
  );
  const recordPlay = useCallback(
    (id: string, score: number) =>
      setActivities((p) =>
        p.map((a) =>
          a.id === id
            ? {
                ...a,
                plays: a.plays + 1,
                avgScore: Math.round((a.avgScore * a.plays + score) / (a.plays + 1)),
              }
            : a,
        ),
      ),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      activities,
      addActivity,
      updateActivity,
      removeActivity,
      getActivity: (id) => activities.find((a) => a.id === id),
      recordPlay,
      soundOn,
      toggleSound: () => setSoundOn((s) => !s),
    }),
    [activities, addActivity, updateActivity, removeActivity, recordPlay, soundOn],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* ---------------- Mock AI generation ---------------- */

type Row = [string, string, string[]];
const BANKS = {
  fractions: [
    ["Which fraction is equivalent to 1/2?", "4/8", ["1/4", "2/6", "3/8"]],
    ["The bottom number of a fraction is the…", "Denominator", ["Numerator", "Remainder", "Factor"]],
    ["Which is greater, 2/3 or 1/6?", "2/3", ["1/6", "Equal", "Not enough info"]],
    ["1/4 + 2/4 =", "3/4", ["3/8", "2/8", "1/2"]],
    ["Half of 10 cookies is…", "5", ["2", "10", "20"]],
    ["A whole pie in fraction form is…", "4/4", ["1/4", "0/4", "3/4"]],
  ],
  spanish: [
    ["yo hablé", "I spoke", ["I speak", "I will speak", "I was speaking"]],
    ["tú comiste", "you ate", ["you eat", "you will eat", "you cook"]],
    ["ella escribió", "she wrote", ["she writes", "she reads", "she will write"]],
    ["nosotros fuimos", "we went", ["we go", "we are", "we will go"]],
    ["ellos vivieron", "they lived", ["they live", "they leave", "they will live"]],
    ["yo tuve", "I had", ["I have", "I hold", "I will have"]],
  ],
  photosynthesis: [
    ["What gas do plants absorb?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Helium"]],
    ["Where does photosynthesis happen?", "Chloroplast", ["Nucleus", "Ribosome", "Vacuole"]],
    ["What pigment captures light?", "Chlorophyll", ["Keratin", "Melanin", "Hemoglobin"]],
    ["What sugar is produced?", "Glucose", ["Lactose", "Sucrose", "Fructose"]],
    ["What gas is released?", "Oxygen", ["Methane", "Argon", "Carbon dioxide"]],
    ["What is the main energy source?", "Sunlight", ["Soil", "Wind", "Moonlight"]],
  ],
  default: [
    ["What is the main idea of the lesson?", "The central concept being taught", ["A minor detail", "An unrelated fact", "The page number"]],
    ["Which word best describes the key term?", "Essential", ["Optional", "Random", "Hidden"]],
    ["Which example fits the concept?", "A real-world application", ["A guess", "An error", "A typo"]],
    ["What should you do first?", "Identify the key vocabulary", ["Skip ahead", "Close the book", "Change subject"]],
    ["Why does this concept matter?", "It builds the next skill", ["It never matters", "It is decorative", "It is optional"]],
    ["Which is a supporting detail?", "An example that proves the idea", ["A contradiction", "An unrelated story", "A title"]],
  ],
} satisfies Record<string, Row[]>;

function pickBank(prompt: string, notes: string) {
  const t = (prompt + " " + notes).toLowerCase();
  if (t.includes("fraction") || t.includes("math")) return BANKS.fractions;
  if (t.includes("spanish") || t.includes("verb") || t.includes("language")) return BANKS.spanish;
  if (t.includes("photosynth") || t.includes("plant") || t.includes("cell") || t.includes("biolog"))
    return BANKS.photosynthesis;
  return BANKS.default;
}

export function generateContent(prompt: string, notes: string, count = 6): ContentItem[] {
  const bank = pickBank(prompt, notes);
  const extra = notes
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24)
    .slice(0, 2)
    .map<Row>((s) => [
      `From your notes: ${s.slice(0, 70)}…  — what is the key idea?`,
      s.split(" ").slice(0, 4).join(" "),
      ["An unrelated idea", "A minor detail", "None of these"],
    ]);
  return seedContent([...extra, ...bank].slice(0, count));
}

export function adaptContent(items: ContentItem[], mode: Adaptation): ContentItem[] {
  return items.map((it) => {
    switch (mode) {
      case "dyslexia":
        return { ...it, prompt: it.prompt.replace(/\s+/g, " ").trim() };
      case "ell":
        return {
          ...it,
          prompt: `${it.prompt}  (hint: ${it.answer.split(" ")[0]}…)`,
        };
      case "simplified":
        return {
          ...it,
          prompt: it.prompt.split(" ").slice(0, 9).join(" ").replace(/[,;:]$/, "") + "?",
          distractors: it.distractors.slice(0, 2),
        };
      default:
        return it;
    }
  });
}

export const ADAPTATIONS: { id: Adaptation; label: string; detail: string }[] = [
  { id: "standard", label: "Standard", detail: "Original AI output, grade-level aligned" },
  { id: "dyslexia", label: "Dyslexia-Friendly", detail: "Wider tracking, heavier weight, calmer contrast" },
  { id: "ell", label: "ELL / ESL Support", detail: "First-letter hints and simpler phrasing" },
  { id: "simplified", label: "Simplified Reading", detail: "Shorter stems, fewer answer choices" },
];
