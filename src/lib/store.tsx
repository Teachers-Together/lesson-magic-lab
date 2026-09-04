import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Context,
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
  | "groupsort"
  | "whack"
  | "anagram"
  | "cloze"
  | "gameshow"
  | "carddeck"
  | "showdown";

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
  { type: "maze", name: "Arcade Maze Chase", blurb: "Dodge obstacles, grab the right answer", emoji: "👾" },
  { type: "openbox", name: "Open the Box", blurb: "Tap mystery boxes for speaking prompts", emoji: "🎁" },
  { type: "groupsort", name: "ESL Group Sort", blurb: "Drag words into labelled category bins", emoji: "🗂️" },
  { type: "whack", name: "Whack-a-Mole", blurb: "Whack only the words that fit the rule", emoji: "🔨" },
  { type: "anagram", name: "Anagram / Unjumble", blurb: "Drag letters or words into order", emoji: "🔤" },
  { type: "cloze", name: "Advanced Cloze", blurb: "Drag words into blanks in the passage", emoji: "✍️" },
  { type: "gameshow", name: "Gameshow Quiz", blurb: "High-drama quiz with 3 lifelines", emoji: "🎬" },
  { type: "carddeck", name: "Random Card Deck", blurb: "Deal speaking & roleplay prompt cards", emoji: "🂡" },
  { type: "showdown", name: "Team Showdown", blurb: "Team vs team tiles with chance cards", emoji: "🏆" },
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
  {
    id: "seed-present-continuous",
    title: "Present Continuous — Missing Parts",
    subject: "ESL / ELL",
    gradeLevel: "Grade 4",
    gameType: "maze",
    adaptation: "ell",
    createdAt: "2026-09-02T10:20:00.000Z",
    plays: 56,
    avgScore: 88,
    contentData: seedContent([
      ["She ______ to school every day.", "goes", ["go", "going", "gone"]],
      ["Look! The baby ______ right now.", "is sleeping", ["sleep", "sleeps", "slept"]],
      ["They ______ football in the park at the moment.", "are playing", ["play", "plays", "played"]],
      ["I ______ my homework right now.", "am doing", ["do", "does", "did"]],
      ["He ______ TV every evening.", "watches", ["watch", "watching", "is watch"]],
    ]),
  },
  {
    id: "seed-countable",
    title: "Countable vs. Uncountable Nouns",
    subject: "ESL / ELL",
    gradeLevel: "Grade 5",
    gameType: "groupsort",
    adaptation: "standard",
    createdAt: "2026-09-02T13:05:00.000Z",
    plays: 61,
    avgScore: 84,
    contentData: seedContent([
      ["apple", "Countable", []],
      ["chair", "Countable", []],
      ["book", "Countable", []],
      ["coin", "Countable", []],
      ["water", "Uncountable", []],
      ["rice", "Uncountable", []],
      ["money", "Uncountable", []],
      ["advice", "Uncountable", []],
    ]),
  },
  {
    id: "seed-icebreakers",
    title: "Speaking Warm-Up Boxes",
    subject: "ESL / ELL",
    gradeLevel: "Grade 6",
    gameType: "openbox",
    adaptation: "standard",
    createdAt: "2026-09-03T07:45:00.000Z",
    plays: 22,
    avgScore: 95,
    contentData: seedContent([
      ["Tell us about your favorite holiday using the past tense.", "Past simple practice", []],
      ["Describe what your family is doing right now.", "Present continuous", []],
      ["What is something you have never eaten? Why?", "Present perfect", []],
      ["Describe your bedroom using prepositions of place.", "Prepositions", []],
      ["If you had one free day, what would you do?", "Second conditional", []],
      ["Compare your city to another city you know.", "Comparatives", []],
      ["Talk about a food you love — is it countable or uncountable?", "Nouns", []],
      ["What are you going to do this weekend?", "Future plans", []],
      ["Tell us about a person who inspires you.", "Descriptive adjectives", []],
    ]),
  },
  {
    id: "seed-irregular-whack",
    title: "Whack the Irregular Past-Tense Verbs",
    subject: "ESL / ELL",
    gradeLevel: "Grade 5",
    gameType: "whack",
    adaptation: "standard",
    createdAt: "2026-09-03T09:10:00.000Z",
    plays: 18,
    avgScore: 79,
    contentData: seedContent([
      ["went", "Irregular Past-Tense Verbs", []],
      ["saw", "Irregular Past-Tense Verbs", []],
      ["bought", "Irregular Past-Tense Verbs", []],
      ["ate", "Irregular Past-Tense Verbs", []],
      ["took", "Irregular Past-Tense Verbs", []],
      ["walked", "Distractor", []],
      ["run", "Distractor", []],
      ["cat", "Distractor", []],
      ["played", "Distractor", []],
      ["happy", "Distractor", []],
    ]),
  },
  {
    id: "seed-unjumble",
    title: "Unjumble: Everyday Sentences",
    subject: "ESL / ELL",
    gradeLevel: "Grade 4",
    gameType: "anagram",
    adaptation: "standard",
    createdAt: "2026-09-03T10:15:00.000Z",
    plays: 31,
    avgScore: 86,
    contentData: seedContent([
      ["Unscramble the sentence: pizza / likes / she / eating", "she likes eating pizza", []],
      ["Unscramble the word: S-H-O-O-C-L", "school", []],
      ["Unscramble the sentence: to / going / I / am / market / the", "I am going to the market", []],
      ["Unscramble the word: E-A-T-C-H-R-E", "teacher", []],
      ["Unscramble the sentence: never / has / he / London / visited", "he has never visited London", []],
    ]),
  },
  {
    id: "seed-cloze-prepositions",
    title: "Cloze: Prepositions & Tense Markers",
    subject: "ESL / ELL",
    gradeLevel: "Grade 6",
    gameType: "cloze",
    adaptation: "standard",
    createdAt: "2026-09-03T11:30:00.000Z",
    plays: 44,
    avgScore: 81,
    contentData: seedContent([
      ["She arrived ____ the airport just before midnight.", "at", ["on", "into"]],
      ["We have lived here ____ 2019.", "since", ["for", "during"]],
      ["The keys are ____ the kitchen table.", "on", ["in", "at"]],
      ["He ____ finished his homework before dinner.", "had", ["has", "have"]],
      ["They are waiting ____ the bus right now.", "for", ["to", "at"]],
    ]),
  },
  {
    id: "seed-gameshow",
    title: "Gameshow: Grammar Showdown",
    subject: "ESL / ELL",
    gradeLevel: "Grade 7",
    gameType: "gameshow",
    adaptation: "standard",
    createdAt: "2026-09-03T12:05:00.000Z",
    plays: 27,
    avgScore: 88,
    contentData: seedContent([
      ["Choose the correct form: I ____ to Paris last year.", "went", ["go", "have gone", "am going"]],
      ["Which sentence is correct?", "She doesn't like coffee.", ["She don't like coffee.", "She not like coffee.", "She isn't like coffee."]],
      ["Pick the comparative: This test is ____ than the last one.", "easier", ["easyer", "more easy", "most easy"]],
      ["Complete: If it rains, we ____ stay home.", "will", ["would", "did", "are"]],
      ["Choose the preposition: I'm interested ____ music.", "in", ["on", "at", "for"]],
    ]),
  },
  {
    id: "seed-roleplay-deck",
    title: "Roleplay Card Deck",
    subject: "ESL / ELL",
    gradeLevel: "Grade 8",
    gameType: "carddeck",
    adaptation: "standard",
    createdAt: "2026-09-03T13:20:00.000Z",
    plays: 15,
    avgScore: 93,
    contentData: seedContent([
      ["Roleplay: You are ordering food at a busy cafe, but they got your order wrong.", "Complaining politely", []],
      ["Roleplay: You are checking into a hotel and your room is not ready.", "Making requests", []],
      ["Roleplay: A friend invites you out, but you are busy. Decline kindly.", "Refusing invitations", []],
      ["Roleplay: You lost your bag at the airport. Explain it to staff.", "Describing objects", []],
      ["Roleplay: You are at a job interview. Describe your best qualities.", "Self-description", []],
      ["Roleplay: Ask a stranger for directions to the train station.", "Directions", []],
      ["Roleplay: Return a broken item to a shop and ask for a refund.", "Negotiating", []],
      ["Roleplay: Introduce your family to a new classmate.", "Introductions", []],
    ]),
  },
  {
    id: "seed-team-showdown",
    title: "Team Showdown: ESL Grammar Duel",
    subject: "ESL / ELL",
    gradeLevel: "Grade 6",
    gameType: "showdown",
    adaptation: "standard",
    createdAt: "2026-09-04T09:00:00.000Z",
    plays: 8,
    avgScore: 90,
    contentData: seedContent([
      ["Past tense of 'buy'?", "bought", []],
      ["Make it a question: She is from Spain.", "Is she from Spain?", []],
      ["Preposition: We arrived ___ the station.", "at", []],
      ["Plural of 'child'?", "children", []],
      ["Correct: He don't like tea.", "He doesn't like tea.", []],
      ["Comparative of 'good'?", "better", []],
      ["Fill in: I have lived here ___ 2019.", "since", []],
      ["Past continuous: They ___ (play) football at 6pm.", "were playing", []],
      ["Opposite of 'expensive'?", "cheap", []],
      ["Article: I saw ___ elephant at the zoo.", "an", []],
      ["Past tense of 'teach'?", "taught", []],
      ["Correct order: always / she / is / late.", "She is always late.", []],
      ["Modal: You ___ wear a helmet. (obligation)", "must", []],
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

const g = globalThis as unknown as { __eduPulseStoreCtx?: Context<Ctx | null> };
const StoreContext = (g.__eduPulseStoreCtx ??= createContext<Ctx | null>(null));
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
  presentContinuous: [
    ["Look! She ______ a letter right now.", "is writing", ["write", "writes", "wrote"]],
    ["They ______ football at the moment.", "are playing", ["play", "plays", "played"]],
    ["I ______ to music right now.", "am listening", ["listen", "listens", "listened"]],
    ["He ______ to school every day.", "goes", ["go", "going", "gone"]],
    ["We ______ dinner in the kitchen now.", "are cooking", ["cook", "cooks", "cooked"]],
    ["The cat ______ on the sofa at the moment.", "is sleeping", ["sleep", "sleeps", "slept"]],
  ],
  prepositions: [
    ["The dog is ______ the box (inside it).", "in", ["on", "under", "between"]],
    ["The book is ______ the table (top surface).", "on", ["in", "behind", "under"]],
    ["The ball is ______ the chair (below).", "under", ["on", "in", "next to"]],
    ["The lamp is ______ the sofa and the shelf.", "between", ["under", "in", "on"]],
    ["The picture is ______ the wall.", "on", ["in", "under", "between"]],
    ["The girl is standing ______ her friend.", "next to", ["in", "under", "on"]],
  ],
  phonics: [
    ["Is 'go' an open or closed syllable?", "Open", ["Closed", "Silent e", "Vowel team"]],
    ["Is 'cat' an open or closed syllable?", "Closed", ["Open", "Silent e", "Diphthong"]],
    ["Build the CVC word: /m/ /a/ /p/", "map", ["mop", "mip", "pam"]],
    ["Build the CVC word: /s/ /u/ /n/", "sun", ["san", "nus", "son"]],
    ["Which word has a closed syllable?", "hop", ["he", "go", "we"]],
    ["Which word has an open syllable?", "me", ["mat", "cup", "pin"]],
  ],
  nouns: [
    ["apple", "Countable", ["Uncountable", "Neither", "Both"]],
    ["water", "Uncountable", ["Countable", "Neither", "Both"]],
    ["chair", "Countable", ["Uncountable", "Neither", "Both"]],
    ["rice", "Uncountable", ["Countable", "Neither", "Both"]],
    ["money", "Uncountable", ["Countable", "Neither", "Both"]],
    ["book", "Countable", ["Uncountable", "Neither", "Both"]],
  ],
} satisfies Record<string, Row[]>;

function pickBank(prompt: string, notes: string) {
  const t = (prompt + " " + notes).toLowerCase();
  if (t.includes("present continuous") || t.includes("missing part") || t.includes("grammar"))
    return BANKS.presentContinuous;
  if (t.includes("preposition")) return BANKS.prepositions;
  if (t.includes("syllable") || t.includes("cvc") || t.includes("phonic") || t.includes("spelling"))
    return BANKS.phonics;
  if (t.includes("countable") || t.includes("uncountable") || t.includes("noun")) return BANKS.nouns;
  if (t.includes("fraction") || t.includes("math")) return BANKS.fractions;
  if (t.includes("spanish")) return BANKS.spanish;
  if (t.includes("esl") || t.includes("english as a second") || t.includes("ell"))
    return BANKS.presentContinuous;
  if (t.includes("verb") || t.includes("language")) return BANKS.spanish;
  if (t.includes("photosynth") || t.includes("plant") || t.includes("cell") || t.includes("biolog"))
    return BANKS.photosynthesis;
  return BANKS.default;
}

export const ESL_ARCHETYPES: {
  label: string;
  prompt: string;
  gameType: GameType;
  subject: string;
  grade: string;
  emoji: string;
}[] = [
  {
    label: "Present Continuous (missing parts)",
    prompt: "Present continuous — complete the sentence with the missing part",
    gameType: "maze",
    subject: "ESL / ELL",
    grade: "Grade 4",
    emoji: "⏳",
  },
  {
    label: "Prepositions of Place",
    prompt: "Prepositions of place — the dog is ___ the box",
    gameType: "flipcards",
    subject: "ESL / ELL",
    grade: "Grade 3",
    emoji: "📦",
  },
  {
    label: "Open & Closed Syllables / CVC",
    prompt: "Open and closed syllables plus CVC word building practice",
    gameType: "quiz",
    subject: "ESL / ELL",
    grade: "Grade 2",
    emoji: "🔤",
  },
  {
    label: "Countable vs. Uncountable Nouns",
    prompt: "Countable vs uncountable nouns categorisation",
    gameType: "groupsort",
    subject: "ESL / ELL",
    grade: "Grade 5",
    emoji: "🗂️",
  },
  {
    label: "Speaking Warm-Up Boxes",
    prompt: "ESL conversation starters and speaking warm-up prompts",
    gameType: "openbox",
    subject: "ESL / ELL",
    grade: "Grade 6",
    emoji: "🎁",
  },
];

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
