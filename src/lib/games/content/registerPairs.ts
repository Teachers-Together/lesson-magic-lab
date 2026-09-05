// Register-pair content bank — read by RegisterSwitchGame.
// Mapping:
//   prompt          = casual / direct version
//   answer          = formal / polite version
//   targetStructure = function (make a request, decline or push back, etc.)
//   hint            = the register move that transforms the sentence
//   exampleSentence = an alternative version for the same register
//   cefr            = level
//
// 40 items total, B1–B2, American workplace English (deadlines, meetings,
// invoices, feedback, scheduling). Ten of the forty are THREE-RUNG ladders:
// each ladder shares one prompt across Direct / Polite / Very formal items.
import type { GameItem } from "@/lib/game-contract";

// ─────────────────────────────────────────────────────────────────────────────
// make a request
// ─────────────────────────────────────────────────────────────────────────────

export const REGISTER_MAKE_REQUEST: GameItem[] = [
  // Ladder: extend a deadline
  {
    id: "rp-mr-1a",
    prompt: "I need more time on this report.",
    answer: "I need more time on this report.",
    targetStructure: "make a request",
    hint: "state the need plainly",
    exampleSentence: "Can you give me more time on this report?",
    cefr: "B1",
  },
  {
    id: "rp-mr-1b",
    prompt: "I need more time on this report.",
    answer: "Could I have an extra day to finish the report?",
    targetStructure: "make a request",
    hint: "use a modal question",
    exampleSentence: "Would it be possible to extend the deadline by one day?",
    cefr: "B1",
  },
  {
    id: "rp-mr-1c",
    prompt: "I need more time on this report.",
    answer:
      "I would be grateful if the deadline for this report could be extended by twenty-four hours.",
    targetStructure: "make a request",
    hint: "add grateful + passive",
    exampleSentence:
      "I would appreciate it if the report deadline could be extended by twenty-four hours.",
    cefr: "B2",
  },

  // Ladder: reschedule a meeting
  {
    id: "rp-mr-2a",
    prompt: "Move our meeting to Thursday.",
    answer: "Move our meeting to Thursday.",
    targetStructure: "make a request",
    hint: "imperative form",
    exampleSentence: "Let's move our meeting to Thursday.",
    cefr: "B1",
  },
  {
    id: "rp-mr-2b",
    prompt: "Move our meeting to Thursday.",
    answer: "Would it be possible to move our meeting to Thursday?",
    targetStructure: "make a request",
    hint: "use a conditional question",
    exampleSentence: "Could we reschedule our meeting for Thursday?",
    cefr: "B1",
  },
  {
    id: "rp-mr-2c",
    prompt: "Move our meeting to Thursday.",
    answer:
      "I am writing to inquire whether we might reschedule our meeting for Thursday at two p.m.",
    targetStructure: "make a request",
    hint: "use inquire + might",
    exampleSentence:
      "I would like to ask whether it would be convenient to reschedule our meeting for Thursday at two p.m.",
    cefr: "B2",
  },

  // Ladder: review a document
  {
    id: "rp-mr-3a",
    prompt: "Check this proposal before I send it.",
    answer: "Check this proposal before I send it.",
    targetStructure: "make a request",
    hint: "direct imperative",
    exampleSentence: "Please check this proposal before I send it.",
    cefr: "B1",
  },
  {
    id: "rp-mr-3b",
    prompt: "Check this proposal before I send it.",
    answer: "Could you take a look at this proposal before I send it?",
    targetStructure: "make a request",
    hint: "use could you + softener",
    exampleSentence: "Would you mind reviewing this proposal before I send it?",
    cefr: "B1",
  },
  {
    id: "rp-mr-3c",
    prompt: "Check this proposal before I send it.",
    answer: "I would appreciate it if you could review the attached proposal prior to submission.",
    targetStructure: "make a request",
    hint: "add appreciate + prior to",
    exampleSentence: "I would be grateful if you could review the proposal before it is submitted.",
    cefr: "B2",
  },

  // Single: invoice status
  {
    id: "rp-mr-4",
    prompt: "Send me the invoice status.",
    answer: "Could you let me know the status of the invoice?",
    targetStructure: "make a request",
    hint: "replace the imperative with a question",
    exampleSentence: "I was wondering whether you could update me on the invoice.",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// decline or push back
// ─────────────────────────────────────────────────────────────────────────────

export const REGISTER_DECLINE_OR_PUSH_BACK: GameItem[] = [
  // Ladder: extra workload
  {
    id: "rp-db-1a",
    prompt: "I can't take on another project right now.",
    answer: "I can't take on another project right now.",
    targetStructure: "decline or push back",
    hint: "direct refusal",
    exampleSentence: "I'm too busy to take on another project right now.",
    cefr: "B1",
  },
  {
    id: "rp-db-1b",
    prompt: "I can't take on another project right now.",
    answer: "I'm afraid I don't have the capacity to take on another project right now.",
    targetStructure: "decline or push back",
    hint: "add afraid + capacity",
    exampleSentence: "I don't think I can take on another project at the moment.",
    cefr: "B1",
  },
  {
    id: "rp-db-1c",
    prompt: "I can't take on another project right now.",
    answer:
      "Unfortunately, due to my current workload, I am not in a position to assume responsibility for an additional project at this time.",
    targetStructure: "decline or push back",
    hint: "add due to + not in a position",
    exampleSentence: "Regrettably, my current commitments prevent me from taking on further work.",
    cefr: "B2",
  },

  // Ladder: unrealistic deadline
  {
    id: "rp-db-2a",
    prompt: "This deadline isn't realistic.",
    answer: "This deadline isn't realistic.",
    targetStructure: "decline or push back",
    hint: "direct negative",
    exampleSentence: "We can't meet this deadline.",
    cefr: "B1",
  },
  {
    id: "rp-db-2b",
    prompt: "This deadline isn't realistic.",
    answer: "I'm not sure this deadline is realistic given the scope.",
    targetStructure: "decline or push back",
    hint: "use tentative language + given",
    exampleSentence: "I have some doubts about whether this deadline is realistic.",
    cefr: "B1",
  },
  {
    id: "rp-db-2c",
    prompt: "This deadline isn't realistic.",
    answer:
      "I would like to respectfully suggest that the proposed deadline may not be feasible in light of the project scope.",
    targetStructure: "decline or push back",
    hint: "add respectfully + feasible",
    exampleSentence: "I would respectfully question whether the proposed deadline is achievable.",
    cefr: "B2",
  },

  // Ladder: meeting invite
  {
    id: "rp-db-3a",
    prompt: "I don't need to be in this meeting.",
    answer: "I don't need to be in this meeting.",
    targetStructure: "decline or push back",
    hint: "direct negative need",
    exampleSentence: "This meeting isn't relevant to me.",
    cefr: "B1",
  },
  {
    id: "rp-db-3b",
    prompt: "I don't need to be in this meeting.",
    answer: "I don't think I need to attend this meeting.",
    targetStructure: "decline or push back",
    hint: "use a negative belief",
    exampleSentence: "I'm not sure my attendance at this meeting is necessary.",
    cefr: "B1",
  },
  {
    id: "rp-db-3c",
    prompt: "I don't need to be in this meeting.",
    answer: "With respect, I do not believe my attendance is required at this meeting.",
    targetStructure: "decline or push back",
    hint: "add with respect + believe",
    exampleSentence: "I respectfully question whether my presence is needed at this meeting.",
    cefr: "B2",
  },

  // Single: cover a shift
  {
    id: "rp-db-4",
    prompt: "I can't cover your shift tomorrow.",
    answer: "I'm afraid I won't be able to cover your shift tomorrow.",
    targetStructure: "decline or push back",
    hint: "add apology + won't be able to",
    exampleSentence: "Unfortunately, I have a conflict and cannot cover your shift.",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// apologize and recover
// ─────────────────────────────────────────────────────────────────────────────

export const REGISTER_APOLOGIZE_AND_RECOVER: GameItem[] = [
  // Ladder: missed deadline
  {
    id: "rp-ar-1a",
    prompt: "Sorry I missed the deadline.",
    answer: "Sorry I missed the deadline.",
    targetStructure: "apologize and recover",
    hint: "simple apology",
    exampleSentence: "I'm sorry I didn't finish on time.",
    cefr: "B1",
  },
  {
    id: "rp-ar-1b",
    prompt: "Sorry I missed the deadline.",
    answer: "I'm sorry I didn't meet the deadline. I'll send it by noon.",
    targetStructure: "apologize and recover",
    hint: "add correction + timeline",
    exampleSentence: "I apologize for missing the deadline and will send the file by noon.",
    cefr: "B1",
  },
  {
    id: "rp-ar-1c",
    prompt: "Sorry I missed the deadline.",
    answer:
      "Please accept my sincere apologies for missing the deadline. I can assure you the report will be delivered by noon tomorrow.",
    targetStructure: "apologize and recover",
    hint: "use apology noun + assure",
    exampleSentence:
      "I sincerely apologize for the delay and can confirm delivery by noon tomorrow.",
    cefr: "B2",
  },

  // Ladder: mistake in a report
  {
    id: "rp-ar-2a",
    prompt: "I made a mistake in the numbers.",
    answer: "I made a mistake in the numbers.",
    targetStructure: "apologize and recover",
    hint: "direct admission",
    exampleSentence: "I got the numbers wrong.",
    cefr: "B1",
  },
  {
    id: "rp-ar-2b",
    prompt: "I made a mistake in the numbers.",
    answer: "I'm sorry, there was an error in the report. I've corrected it.",
    targetStructure: "apologize and recover",
    hint: "use passive error + correction",
    exampleSentence: "I apologize for the error in the report; it has now been corrected.",
    cefr: "B1",
  },
  {
    id: "rp-ar-2c",
    prompt: "I made a mistake in the numbers.",
    answer:
      "I must apologize for the error in the report. A revised version is attached for your review.",
    targetStructure: "apologize and recover",
    hint: "use must apologize + revised",
    exampleSentence: "Please accept my apologies for the error; the revised report is attached.",
    cefr: "B2",
  },

  // Singles
  {
    id: "rp-ar-3",
    prompt: "Sorry I'm late.",
    answer: "I'm sorry I arrived late. I got held up by another call.",
    targetStructure: "apologize and recover",
    hint: "add explanation + held up",
    exampleSentence: "Please accept my apologies for arriving late; I was delayed by another call.",
    cefr: "B1",
  },
  {
    id: "rp-ar-4",
    prompt: "I forgot to attach the file.",
    answer: "I'm sorry — I forgot to attach the file. It's included now.",
    targetStructure: "apologize and recover",
    hint: "dash + correction",
    exampleSentence: "My apologies; the attachment was missing from my previous message.",
    cefr: "B1",
  },
  {
    id: "rp-ar-5",
    prompt: "I double-booked the meeting.",
    answer: "I'm sorry for the scheduling conflict. Let me find a time that works for everyone.",
    targetStructure: "apologize and recover",
    hint: "add conflict + solution",
    exampleSentence: "I apologize for the overlap; I'll send out a new invite shortly.",
    cefr: "B1",
  },
  {
    id: "rp-ar-6",
    prompt: "I didn't get back to you sooner.",
    answer: "I apologize for the delayed response. I needed to confirm a few details first.",
    targetStructure: "apologize and recover",
    hint: "use delayed response + reason",
    exampleSentence: "I'm sorry for not replying sooner; I wanted to verify the details.",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// disagree in a meeting
// ─────────────────────────────────────────────────────────────────────────────

export const REGISTER_DISAGREE_IN_A_MEETING: GameItem[] = [
  // Ladder: proposed timeline
  {
    id: "rp-dm-1a",
    prompt: "This timeline won't work.",
    answer: "This timeline won't work.",
    targetStructure: "disagree in a meeting",
    hint: "direct negative",
    exampleSentence: "We can't meet this timeline.",
    cefr: "B1",
  },
  {
    id: "rp-dm-1b",
    prompt: "This timeline won't work.",
    answer: "I'm not sure this timeline is going to work.",
    targetStructure: "disagree in a meeting",
    hint: "use tentative not sure",
    exampleSentence: "I have some concerns about whether this timeline is realistic.",
    cefr: "B1",
  },
  {
    id: "rp-dm-1c",
    prompt: "This timeline won't work.",
    answer:
      "I am not convinced that the proposed timeline is feasible, and I would welcome the opportunity to discuss alternatives.",
    targetStructure: "disagree in a meeting",
    hint: "add not convinced + feasible",
    exampleSentence: "I would respectfully question whether the proposed timeline is achievable.",
    cefr: "B2",
  },

  // Ladder: budget cut
  {
    id: "rp-dm-2a",
    prompt: "Cutting the budget is a bad idea.",
    answer: "Cutting the budget is a bad idea.",
    targetStructure: "disagree in a meeting",
    hint: "direct judgment",
    exampleSentence: "We shouldn't cut the budget.",
    cefr: "B1",
  },
  {
    id: "rp-dm-2b",
    prompt: "Cutting the budget is a bad idea.",
    answer: "I'm not sure cutting the budget is the best approach.",
    targetStructure: "disagree in a meeting",
    hint: "use not sure + best approach",
    exampleSentence: "I don't think cutting the budget is the right move.",
    cefr: "B1",
  },
  {
    id: "rp-dm-2c",
    prompt: "Cutting the budget is a bad idea.",
    answer:
      "I would respectfully disagree with the proposal to reduce the budget, as it may compromise the quality of the deliverables.",
    targetStructure: "disagree in a meeting",
    hint: "add respectfully + compromise",
    exampleSentence: "I have reservations about the budget reduction and its impact on quality.",
    cefr: "B2",
  },

  // Singles
  {
    id: "rp-dm-3",
    prompt: "We shouldn't change this policy.",
    answer: "I don't think we should change this policy.",
    targetStructure: "disagree in a meeting",
    hint: "use a negative belief",
    exampleSentence:
      "I would argue against changing this policy, as the current approach has proven effective.",
    cefr: "B1",
  },
  {
    id: "rp-dm-4",
    prompt: "Hiring this person is a mistake.",
    answer: "I'm not sure hiring this candidate is the right move for the team.",
    targetStructure: "disagree in a meeting",
    hint: "soften with not sure + right move",
    exampleSentence: "I have reservations about whether this candidate is the best fit.",
    cefr: "B1",
  },
  {
    id: "rp-dm-5",
    prompt: "This strategy won't reach our customers.",
    answer: "I'm not convinced this strategy will reach our customers.",
    targetStructure: "disagree in a meeting",
    hint: "use not convinced",
    exampleSentence: "I have doubts about whether this strategy will reach our customers.",
    cefr: "B1",
  },
  {
    id: "rp-dm-6",
    prompt: "We should build this feature first.",
    answer: "I'm not sure this feature should be our first priority.",
    targetStructure: "disagree in a meeting",
    hint: "use not sure + priority",
    exampleSentence: "I would question whether this feature should take priority over the others.",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined bank
// ─────────────────────────────────────────────────────────────────────────────

export const REGISTER_PAIRS: GameItem[] = [
  ...REGISTER_MAKE_REQUEST,
  ...REGISTER_DECLINE_OR_PUSH_BACK,
  ...REGISTER_APOLOGIZE_AND_RECOVER,
  ...REGISTER_DISAGREE_IN_A_MEETING,
];
