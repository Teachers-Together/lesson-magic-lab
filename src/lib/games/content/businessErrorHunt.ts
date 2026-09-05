// Business Error Hunt content bank — read by ErrorHuntGame.
// Mapping:
//   prompt          = sentence with exactly one error (or no error)
//   answer          = corrected sentence (identical to prompt = no error)
//   targetStructure = error type: article, tense, word order, preposition,
//                     agreement, plural, register, or "no error"
//   cefr            = level
//
// 40 workplace sentences (scheduling, follow-ups, invoices, handovers,
// feedback), B1–B2. Fixes change as few words as possible. At least eight
// dependent-preposition errors are included.
import type { GameItem } from "@/lib/game-contract";

// ─────────────────────────────────────────────────────────────────────────────
// article
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_ARTICLE: GameItem[] = [
  {
    id: "beh-art-1",
    prompt: "I sent you a email yesterday.",
    answer: "I sent you an email yesterday.",
    targetStructure: "article",
    cefr: "B1",
  },
  {
    id: "beh-art-2",
    prompt: "Can you give me a advice about the schedule?",
    answer: "Can you give me some advice about the schedule?",
    targetStructure: "article",
    cefr: "B1",
  },
  {
    id: "beh-art-3",
    prompt: "The team made a good progress on the project.",
    answer: "The team made good progress on the project.",
    targetStructure: "article",
    cefr: "B1",
  },
  {
    id: "beh-art-4",
    prompt: "I have a urgent question about the invoice.",
    answer: "I have an urgent question about the invoice.",
    targetStructure: "article",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// tense
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_TENSE: GameItem[] = [
  {
    id: "beh-tense-1",
    prompt: "I have send the report this morning.",
    answer: "I sent the report this morning.",
    targetStructure: "tense",
    cefr: "B1",
  },
  {
    id: "beh-tense-2",
    prompt: "We will discussed the budget in tomorrow's meeting.",
    answer: "We will discuss the budget in tomorrow's meeting.",
    targetStructure: "tense",
    cefr: "B1",
  },
  {
    id: "beh-tense-3",
    prompt: "She didn't replied to my follow-up yet.",
    answer: "She didn't reply to my follow-up yet.",
    targetStructure: "tense",
    cefr: "B1",
  },
  {
    id: "beh-tense-4",
    prompt: "I am work on the handover document right now.",
    answer: "I am working on the handover document right now.",
    targetStructure: "tense",
    cefr: "B1",
  },
  {
    id: "beh-tense-5",
    prompt: "He said he will send the invoice today.",
    answer: "He said he would send the invoice today.",
    targetStructure: "tense",
    cefr: "B2",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// word order
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_WORD_ORDER: GameItem[] = [
  {
    id: "beh-word-1",
    prompt: "Could you me send the updated schedule?",
    answer: "Could you send me the updated schedule?",
    targetStructure: "word order",
    cefr: "B1",
  },
  {
    id: "beh-word-2",
    prompt: "Please the feedback send by noon.",
    answer: "Please send the feedback by noon.",
    targetStructure: "word order",
    cefr: "B1",
  },
  {
    id: "beh-word-3",
    prompt: "I would like to know when will the invoice be paid.",
    answer: "I would like to know when the invoice will be paid.",
    targetStructure: "word order",
    cefr: "B2",
  },
  {
    id: "beh-word-4",
    prompt: "Can you tell me where is the conference room?",
    answer: "Can you tell me where the conference room is?",
    targetStructure: "word order",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// preposition (dependent prepositions)
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_PREPOSITION: GameItem[] = [
  {
    id: "beh-prep-1",
    prompt: "Who is responsible of the invoice?",
    answer: "Who is responsible for the invoice?",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-2",
    prompt: "I would like to discuss about the handover.",
    answer: "I would like to discuss the handover.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-3",
    prompt: "We depend of your feedback to move forward.",
    answer: "We depend on your feedback to move forward.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-4",
    prompt: "She is interested for the new schedule.",
    answer: "She is interested in the new schedule.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-5",
    prompt: "I arrived to the office at nine.",
    answer: "I arrived at the office at nine.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-6",
    prompt: "Please listen the customer's request carefully.",
    answer: "Please listen to the customer's request carefully.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-7",
    prompt: "We are waiting the invoice since Monday.",
    answer: "We are waiting for the invoice since Monday.",
    targetStructure: "preposition",
    cefr: "B1",
  },
  {
    id: "beh-prep-8",
    prompt: "He apologized about the delay in the meeting.",
    answer: "He apologized for the delay in the meeting.",
    targetStructure: "preposition",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// agreement
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_AGREEMENT: GameItem[] = [
  {
    id: "beh-agr-1",
    prompt: "The team are meeting at noon.",
    answer: "The team is meeting at noon.",
    targetStructure: "agreement",
    cefr: "B2",
  },
  {
    id: "beh-agr-2",
    prompt: "There is two follow-up tasks left.",
    answer: "There are two follow-up tasks left.",
    targetStructure: "agreement",
    cefr: "B1",
  },
  {
    id: "beh-agr-3",
    prompt: "Each invoice need a manager's approval.",
    answer: "Each invoice needs a manager's approval.",
    targetStructure: "agreement",
    cefr: "B2",
  },
  {
    id: "beh-agr-4",
    prompt: "The information on the handover are clear.",
    answer: "The information on the handover is clear.",
    targetStructure: "agreement",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// plural
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_PLURAL: GameItem[] = [
  {
    id: "beh-plural-1",
    prompt: "I have two meeting tomorrow.",
    answer: "I have two meetings tomorrow.",
    targetStructure: "plural",
    cefr: "B1",
  },
  {
    id: "beh-plural-2",
    prompt: "The feedbacks from the client were positive.",
    answer: "The feedback from the client was positive.",
    targetStructure: "plural",
    cefr: "B1",
  },
  {
    id: "beh-plural-3",
    prompt: "Please check the attached documentations.",
    answer: "Please check the attached documentation.",
    targetStructure: "plural",
    cefr: "B2",
  },
  {
    id: "beh-plural-4",
    prompt: "The office has new equipments for the team.",
    answer: "The office has new equipment for the team.",
    targetStructure: "plural",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// register
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_REGISTER: GameItem[] = [
  {
    id: "beh-reg-1",
    prompt: "Hey, can you send me the invoice?",
    answer: "Hello, can you send me the invoice?",
    targetStructure: "register",
    cefr: "B1",
  },
  {
    id: "beh-reg-2",
    prompt: "Can you review the report by Friday?",
    answer: "Could you review the report by Friday?",
    targetStructure: "register",
    cefr: "B1",
  },
  {
    id: "beh-reg-3",
    prompt: "I need the feedback ASAP.",
    answer: "I need the feedback soon.",
    targetStructure: "register",
    cefr: "B1",
  },
  {
    id: "beh-reg-4",
    prompt: "Let me know if you got any questions.",
    answer: "Let me know if you have any questions.",
    targetStructure: "register",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// no error
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT_NO_ERROR: GameItem[] = [
  {
    id: "beh-ok-1",
    prompt: "The invoice has been paid in full.",
    answer: "The invoice has been paid in full.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-2",
    prompt: "I will send the handover notes by the end of the day.",
    answer: "I will send the handover notes by the end of the day.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-3",
    prompt: "Please let me know if the schedule works for you.",
    answer: "Please let me know if the schedule works for you.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-4",
    prompt: "Thank you for your feedback on the draft.",
    answer: "Thank you for your feedback on the draft.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-5",
    prompt: "The meeting will take place in the conference room at two p.m.",
    answer: "The meeting will take place in the conference room at two p.m.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-6",
    prompt: "I have attached the updated report for your review.",
    answer: "I have attached the updated report for your review.",
    targetStructure: "no error",
    cefr: "B1",
  },
  {
    id: "beh-ok-7",
    prompt: "We look forward to hearing from you.",
    answer: "We look forward to hearing from you.",
    targetStructure: "no error",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined bank
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_ERROR_HUNT: GameItem[] = [
  ...BUSINESS_ERROR_HUNT_ARTICLE,
  ...BUSINESS_ERROR_HUNT_TENSE,
  ...BUSINESS_ERROR_HUNT_WORD_ORDER,
  ...BUSINESS_ERROR_HUNT_PREPOSITION,
  ...BUSINESS_ERROR_HUNT_AGREEMENT,
  ...BUSINESS_ERROR_HUNT_PLURAL,
  ...BUSINESS_ERROR_HUNT_REGISTER,
  ...BUSINESS_ERROR_HUNT_NO_ERROR,
];
