// Spot-the-difference content bank — read by SpotDifferenceGame.
// prompt = emoji for the object; answer = its cell in the STUDENT scene as
// "col,row" on a 4x3 zero-based grid ("0,0" to "3,2"); distractors[0] = its
// cell in the TEACHER scene — omitted entirely when the object is in the same
// place in both scenes. Differences are positional, never existential.
import type { GameItem } from "@/lib/game-contract";

export const SPOT_BEDROOM: GameItem[] = [
  { id: "sd-bed-1", prompt: "🛏️", answer: "0,2", targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-2", prompt: "🧸", answer: "0,1", distractors: ["1,2"], targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-3", prompt: "📚", answer: "1,0", targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-4", prompt: "🪑", answer: "2,2", distractors: ["2,1"], targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-5", prompt: "🖼️", answer: "1,1", distractors: ["2,0"], targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-6", prompt: "⚽", answer: "3,2", distractors: ["1,1"], targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-7", prompt: "🎒", answer: "2,0", distractors: ["2,2"], targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-8", prompt: "💡", answer: "3,0", targetStructure: "prepositions", cefr: "A1" },
  { id: "sd-bed-9", prompt: "🐱", answer: "3,1", targetStructure: "prepositions", cefr: "A1" },
];

export const SPOT_CLASSROOM: GameItem[] = [
  { id: "sd-cls-1", prompt: "🖥️", answer: "0,0", targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-2", prompt: "📖", answer: "1,2", distractors: ["0,2"], targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-3", prompt: "🪑", answer: "2,2", targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-4", prompt: "🎒", answer: "3,2", distractors: ["1,2"], targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-5", prompt: "🍎", answer: "2,1", targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-6", prompt: "✏️", answer: "1,0", distractors: ["2,0"], targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-7", prompt: "🌍", answer: "3,0", distractors: ["3,1"], targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-8", prompt: "🕰️", answer: "0,1", targetStructure: "there is / there are", cefr: "A1" },
  { id: "sd-cls-9", prompt: "🪴", answer: "1,1", targetStructure: "there is / there are", cefr: "A1" },
];

export const SPOT_KITCHEN: GameItem[] = [
  { id: "sd-kit-1", prompt: "🫖", answer: "0,0", targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-2", prompt: "🍳", answer: "1,0", distractors: ["2,2"], targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-3", prompt: "🔪", answer: "2,0", distractors: ["1,1"], targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-4", prompt: "🧀", answer: "3,0", targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-5", prompt: "🍞", answer: "0,1", distractors: ["3,1"], targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-6", prompt: "🐱", answer: "1,2", distractors: ["0,2"], targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-7", prompt: "🥛", answer: "2,1", targetStructure: "prepositions", cefr: "A2" },
  { id: "sd-kit-8", prompt: "🪴", answer: "3,2", distractors: ["1,0"], targetStructure: "prepositions", cefr: "A2" },
];

export const SPOT_PARK: GameItem[] = [
  { id: "sd-prk-1", prompt: "🌳", answer: "0,0", targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-2", prompt: "🐕", answer: "1,1", distractors: ["2,0"], targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-3", prompt: "🚲", answer: "2,2", distractors: ["0,1"], targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-4", prompt: "🛝", answer: "3,0", targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-5", prompt: "🌷", answer: "1,0", targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-6", prompt: "🐦", answer: "3,2", targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-7", prompt: "⚽", answer: "2,1", distractors: ["1,2"], targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-8", prompt: "🧺", answer: "0,2", targetStructure: "there is / there are", cefr: "A2" },
  { id: "sd-prk-9", prompt: "🦆", answer: "3,1", distractors: ["2,1"], targetStructure: "there is / there are", cefr: "A2" },
];

export const SPOT_STREET_MARKET: GameItem[] = [
  { id: "sd-mkt-1", prompt: "🍎", answer: "0,0", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-2", prompt: "🥕", answer: "1,1", distractors: ["2,1"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-3", prompt: "🧀", answer: "2,0", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-4", prompt: "🐟", answer: "3,1", distractors: ["1,2"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-5", prompt: "🌻", answer: "0,2", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-6", prompt: "🍞", answer: "2,2", distractors: ["3,0"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-7", prompt: "🧢", answer: "1,0", distractors: ["0,1"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-mkt-8", prompt: "🐔", answer: "3,2", distractors: ["1,0"], targetStructure: "comparatives", cefr: "B1" },
];

export const SPOT_OFFICE: GameItem[] = [
  { id: "sd-off-1", prompt: "💻", answer: "0,1", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-2", prompt: "📞", answer: "1,0", distractors: ["2,0"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-3", prompt: "📁", answer: "2,2", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-4", prompt: "☕", answer: "3,0", distractors: ["1,1"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-5", prompt: "🖨️", answer: "3,2", distractors: ["0,2"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-6", prompt: "🪴", answer: "0,0", targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-7", prompt: "📅", answer: "1,2", distractors: ["3,1"], targetStructure: "comparatives", cefr: "B1" },
  { id: "sd-off-8", prompt: "🖊️", answer: "2,1", targetStructure: "comparatives", cefr: "B1" },
];

export const ALL_SPOT_DIFFERENCE: GameItem[] = [
  ...SPOT_BEDROOM,
  ...SPOT_CLASSROOM,
  ...SPOT_KITCHEN,
  ...SPOT_PARK,
  ...SPOT_STREET_MARKET,
  ...SPOT_OFFICE,
];
