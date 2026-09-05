export type GameItem = {
  id: string;
  prompt: string;
  answer: string;
  distractors?: string[];
  imageUrl?: string;
  /** What text-to-speech reads aloud. */
  audioText?: string;
  exampleSentence?: string;
  /** Teacher-revealed only, never auto-shown. */
  hint?: string;
  cefr?: "pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1";
  /** e.g. "present continuous", or a phoneme contrast like "/ɪ/ vs /iː/". */
  targetStructure?: string;
  l1Gloss?: string;
  /** British equivalent where a dialogue turns on an American word. */
  britishVariant?: string;
};
