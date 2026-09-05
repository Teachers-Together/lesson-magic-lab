// Meeting-phrases content bank — read by GroupSortGame.
// Mapping:
//   prompt = the spoken phrase
//   answer = the bin / function it belongs to
//   cefr   = level
//
// 66 phrases total, B1–B2, American business English, grouped into
// meeting moves, negotiation moves, and small-talk openings/closings.
import type { GameItem } from "@/lib/game-contract";

// ─────────────────────────────────────────────────────────────────────────────
// Meeting moves — 24 phrases across four bins
// ─────────────────────────────────────────────────────────────────────────────

export const MEETING_MOVES: GameItem[] = [
  // Interrupting politely
  {
    id: "mp-mm-int-1",
    prompt: "Sorry to jump in, but I want to make sure I understand.",
    answer: "Interrupting politely",
    cefr: "B1",
  },
  {
    id: "mp-mm-int-2",
    prompt: "Could I add one quick thing?",
    answer: "Interrupting politely",
    cefr: "B1",
  },
  {
    id: "mp-mm-int-3",
    prompt: "I don't mean to interrupt, but I'd like to clarify.",
    answer: "Interrupting politely",
    cefr: "B2",
  },
  {
    id: "mp-mm-int-4",
    prompt: "Before we move on, can I ask a question?",
    answer: "Interrupting politely",
    cefr: "B1",
  },
  {
    id: "mp-mm-int-5",
    prompt: "May I jump in for a moment?",
    answer: "Interrupting politely",
    cefr: "B1",
  },
  {
    id: "mp-mm-int-6",
    prompt: "Real quick — I want to circle back to that point.",
    answer: "Interrupting politely",
    cefr: "B2",
  },

  // Agreeing
  {
    id: "mp-mm-agr-1",
    prompt: "I agree with that.",
    answer: "Agreeing",
    cefr: "B1",
  },
  {
    id: "mp-mm-agr-2",
    prompt: "That makes sense to me.",
    answer: "Agreeing",
    cefr: "B1",
  },
  {
    id: "mp-mm-agr-3",
    prompt: "I'm on board with this approach.",
    answer: "Agreeing",
    cefr: "B2",
  },
  {
    id: "mp-mm-agr-4",
    prompt: "I think we're aligned on this.",
    answer: "Agreeing",
    cefr: "B2",
  },
  {
    id: "mp-mm-agr-5",
    prompt: "Exactly — that's what I was thinking.",
    answer: "Agreeing",
    cefr: "B1",
  },
  {
    id: "mp-mm-agr-6",
    prompt: "That sounds like a solid plan.",
    answer: "Agreeing",
    cefr: "B1",
  },

  // Disagreeing softly
  {
    id: "mp-mm-dis-1",
    prompt: "I see it a little differently.",
    answer: "Disagreeing softly",
    cefr: "B1",
  },
  {
    id: "mp-mm-dis-2",
    prompt: "I'm not sure I fully agree with that.",
    answer: "Disagreeing softly",
    cefr: "B2",
  },
  {
    id: "mp-mm-dis-3",
    prompt: "I have a slightly different take.",
    answer: "Disagreeing softly",
    cefr: "B2",
  },
  {
    id: "mp-mm-dis-4",
    prompt: "That may be true, but I worry about the timeline.",
    answer: "Disagreeing softly",
    cefr: "B2",
  },
  {
    id: "mp-mm-dis-5",
    prompt: "I see your point, but I'd push back on one thing.",
    answer: "Disagreeing softly",
    cefr: "B2",
  },
  {
    id: "mp-mm-dis-6",
    prompt: "I want to offer a different perspective.",
    answer: "Disagreeing softly",
    cefr: "B1",
  },

  // Asking for clarification
  {
    id: "mp-mm-cla-1",
    prompt: "Could you say a bit more about that?",
    answer: "Asking for clarification",
    cefr: "B1",
  },
  {
    id: "mp-mm-cla-2",
    prompt: "What do you mean by that?",
    answer: "Asking for clarification",
    cefr: "B1",
  },
  {
    id: "mp-mm-cla-3",
    prompt: "Can you clarify what you mean?",
    answer: "Asking for clarification",
    cefr: "B1",
  },
  {
    id: "mp-mm-cla-4",
    prompt: "I'm not sure I follow — can you explain?",
    answer: "Asking for clarification",
    cefr: "B1",
  },
  {
    id: "mp-mm-cla-5",
    prompt: "Help me understand the thinking behind that.",
    answer: "Asking for clarification",
    cefr: "B2",
  },
  {
    id: "mp-mm-cla-6",
    prompt: "When you say that, do you mean the deadline or the budget?",
    answer: "Asking for clarification",
    cefr: "B2",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Negotiation moves — 24 phrases across four bins
// ─────────────────────────────────────────────────────────────────────────────

export const NEGOTIATION_MOVES: GameItem[] = [
  // Making an offer
  {
    id: "mp-nm-off-1",
    prompt: "We can deliver by Friday if that works for you.",
    answer: "Making an offer",
    cefr: "B1",
  },
  {
    id: "mp-nm-off-2",
    prompt: "We're prepared to include the training at no extra cost.",
    answer: "Making an offer",
    cefr: "B2",
  },
  {
    id: "mp-nm-off-3",
    prompt: "I can offer a ten percent discount on the first order.",
    answer: "Making an offer",
    cefr: "B1",
  },
  {
    id: "mp-nm-off-4",
    prompt: "We'd be happy to extend the payment terms to forty-five days.",
    answer: "Making an offer",
    cefr: "B2",
  },
  {
    id: "mp-nm-off-5",
    prompt: "I can throw in free support for the first three months.",
    answer: "Making an offer",
    cefr: "B2",
  },
  {
    id: "mp-nm-off-6",
    prompt: "We can start with a pilot program if that lowers the risk.",
    answer: "Making an offer",
    cefr: "B2",
  },

  // Conditional concession
  {
    id: "mp-nm-con-1",
    prompt: "If you can increase the order size, then we can lower the unit price.",
    answer: "Conditional concession",
    cefr: "B2",
  },
  {
    id: "mp-nm-con-2",
    prompt: "If you sign by the end of the month, we'll include free shipping.",
    answer: "Conditional concession",
    cefr: "B1",
  },
  {
    id: "mp-nm-con-3",
    prompt: "If you commit to a one-year contract, we'll waive the setup fee.",
    answer: "Conditional concession",
    cefr: "B2",
  },
  {
    id: "mp-nm-con-4",
    prompt: "If you handle the logistics, we'll cover the marketing costs.",
    answer: "Conditional concession",
    cefr: "B2",
  },
  {
    id: "mp-nm-con-5",
    prompt: "If you pay upfront, we can offer an additional discount.",
    answer: "Conditional concession",
    cefr: "B1",
  },
  {
    id: "mp-nm-con-6",
    prompt: "If you agree to the timeline, we can add two extra features.",
    answer: "Conditional concession",
    cefr: "B2",
  },

  // Holding your position
  {
    id: "mp-nm-hold-1",
    prompt: "I'm afraid we can't go lower than that.",
    answer: "Holding your position",
    cefr: "B1",
  },
  {
    id: "mp-nm-hold-2",
    prompt: "That figure is below our minimum.",
    answer: "Holding your position",
    cefr: "B1",
  },
  {
    id: "mp-nm-hold-3",
    prompt: "We need to stick to our standard terms on this.",
    answer: "Holding your position",
    cefr: "B2",
  },
  {
    id: "mp-nm-hold-4",
    prompt: "I don't have the authority to agree to that.",
    answer: "Holding your position",
    cefr: "B2",
  },
  {
    id: "mp-nm-hold-5",
    prompt: "That's not something we're able to offer right now.",
    answer: "Holding your position",
    cefr: "B1",
  },
  {
    id: "mp-nm-hold-6",
    prompt: "We'd need to keep the deposit at thirty percent.",
    answer: "Holding your position",
    cefr: "B2",
  },

  // Closing
  {
    id: "mp-nm-clo-1",
    prompt: "So are we ready to move forward?",
    answer: "Closing",
    cefr: "B1",
  },
  {
    id: "mp-nm-clo-2",
    prompt: "It sounds like we have a deal.",
    answer: "Closing",
    cefr: "B1",
  },
  {
    id: "mp-nm-clo-3",
    prompt: "Shall we finalize the details in writing?",
    answer: "Closing",
    cefr: "B2",
  },
  {
    id: "mp-nm-clo-4",
    prompt: "I'll send the contract over this afternoon.",
    answer: "Closing",
    cefr: "B1",
  },
  {
    id: "mp-nm-clo-5",
    prompt: "Let's lock this in and start next week.",
    answer: "Closing",
    cefr: "B2",
  },
  {
    id: "mp-nm-clo-6",
    prompt: "Great — I'll prepare the agreement for signature.",
    answer: "Closing",
    cefr: "B2",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small talk — 18 phrases across three bins
// ─────────────────────────────────────────────────────────────────────────────

export const SMALL_TALK: GameItem[] = [
  // Opening
  {
    id: "mp-st-open-1",
    prompt: "How was your weekend?",
    answer: "Opening",
    cefr: "B1",
  },
  {
    id: "mp-st-open-2",
    prompt: "Did you travel far to get here?",
    answer: "Opening",
    cefr: "B1",
  },
  {
    id: "mp-st-open-3",
    prompt: "How's your week going so far?",
    answer: "Opening",
    cefr: "B1",
  },
  {
    id: "mp-st-open-4",
    prompt: "Is this your first time at this conference?",
    answer: "Opening",
    cefr: "B1",
  },
  {
    id: "mp-st-open-5",
    prompt: "How do you know the host?",
    answer: "Opening",
    cefr: "B1",
  },
  {
    id: "mp-st-open-6",
    prompt: "Did you catch the game last night?",
    answer: "Opening",
    cefr: "B1",
  },

  // Keeping it going
  {
    id: "mp-st-keep-1",
    prompt: "That sounds interesting — tell me more.",
    answer: "Keeping it going",
    cefr: "B1",
  },
  {
    id: "mp-st-keep-2",
    prompt: "How did you get into that line of work?",
    answer: "Keeping it going",
    cefr: "B1",
  },
  {
    id: "mp-st-keep-3",
    prompt: "What do you like most about your role?",
    answer: "Keeping it going",
    cefr: "B2",
  },
  {
    id: "mp-st-keep-4",
    prompt: "Have you been to this venue before?",
    answer: "Keeping it going",
    cefr: "B1",
  },
  {
    id: "mp-st-keep-5",
    prompt: "How long have you been with the company?",
    answer: "Keeping it going",
    cefr: "B1",
  },
  {
    id: "mp-st-keep-6",
    prompt: "What brought you to this event?",
    answer: "Keeping it going",
    cefr: "B1",
  },

  // Ending gracefully
  {
    id: "mp-st-end-1",
    prompt: "It was great talking to you.",
    answer: "Ending gracefully",
    cefr: "B1",
  },
  {
    id: "mp-st-end-2",
    prompt: "I should let you mingle with the others.",
    answer: "Ending gracefully",
    cefr: "B2",
  },
  {
    id: "mp-st-end-3",
    prompt: "I'll let you get back to the conversation.",
    answer: "Ending gracefully",
    cefr: "B1",
  },
  {
    id: "mp-st-end-4",
    prompt: "Let's grab coffee sometime.",
    answer: "Ending gracefully",
    cefr: "B1",
  },
  {
    id: "mp-st-end-5",
    prompt: "I hope our paths cross again soon.",
    answer: "Ending gracefully",
    cefr: "B2",
  },
  {
    id: "mp-st-end-6",
    prompt: "Enjoy the rest of the event.",
    answer: "Ending gracefully",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined bank
// ─────────────────────────────────────────────────────────────────────────────

export const MEETING_PHRASES: GameItem[] = [
  ...MEETING_MOVES,
  ...NEGOTIATION_MOVES,
  ...SMALL_TALK,
];
