// Long-turn topic content bank — read by TalkForAMinuteGame.
// Mapping:
//   prompt          = topic card (the IELTS-style task)
//   answer          = same as prompt (required by contract, not used by the game)
//   exampleSentence = three or four bullet prompts joined with " | "
//   distractors     = up to four target words the student should try to use
//   hint            = up to three forbidden words, comma-separated
//   targetStructure = language focus for the topic
//   cefr            = level
//
// Three banks of twelve topics each: IELTS-style, Business, and Teens.
// No topic assumes travel abroad, a car, or a particular family shape.
import type { GameItem } from "@/lib/game-contract";

// ─────────────────────────────────────────────────────────────────────────────
// IELTS-style long-turn topics (B1–B2)
// ─────────────────────────────────────────────────────────────────────────────

export const IELTS_STYLE_LONG_TURN_TOPICS: GameItem[] = [
  {
    id: "lt-ielts-1",
    prompt: "Describe a place where you like to study or work.",
    answer: "Describe a place where you like to study or work.",
    exampleSentence:
      "where it is | what it looks like | why you go there | how you feel when you are there",
    distractors: ["quiet", "focus", "comfortable", "atmosphere"],
    hint: "good, nice, thing",
    targetStructure: "describing places and feelings",
    cefr: "B1",
  },
  {
    id: "lt-ielts-2",
    prompt: "Describe a person you enjoy working or studying with.",
    answer: "Describe a person you enjoy working or studying with.",
    exampleSentence:
      "who this person is | what they do | what you do together | why you enjoy being with them",
    distractors: ["reliable", "supportive", "colleague", "trust"],
    hint: "good, nice, thing",
    targetStructure: "describing people and relationships",
    cefr: "B1",
  },
  {
    id: "lt-ielts-3",
    prompt: "Describe an object you use every day.",
    answer: "Describe an object you use every day.",
    exampleSentence:
      "what it is | when you got it | what you use it for | why it is important to you",
    distractors: ["essential", "convenient", "device", "routine"],
    hint: "good, nice, thing",
    targetStructure: "describing objects and habits",
    cefr: "B1",
  },
  {
    id: "lt-ielts-4",
    prompt: "Describe an event you enjoyed recently.",
    answer: "Describe an event you enjoyed recently.",
    exampleSentence: "what the event was | where it happened | who was there | why you enjoyed it",
    distractors: ["memorable", "celebrate", "atmosphere", "guests"],
    hint: "good, nice, thing",
    targetStructure: "narrating past events",
    cefr: "B1",
  },
  {
    id: "lt-ielts-5",
    prompt: "Describe a skill you would like to learn in the future.",
    answer: "Describe a skill you would like to learn in the future.",
    exampleSentence:
      "what the skill is | why you want to learn it | how you would learn it | what you would do with it",
    distractors: ["challenging", "improve", "practice", "goal"],
    hint: "good, nice, thing",
    targetStructure: "future plans and intentions",
    cefr: "B1",
  },
  {
    id: "lt-ielts-6",
    prompt: "Describe a quiet place you like to spend time.",
    answer: "Describe a quiet place you like to spend time.",
    exampleSentence:
      "where it is | what you can see and hear | when you usually go there | why you like it",
    distractors: ["peaceful", "relax", "surroundings", "escape"],
    hint: "good, nice, thing",
    targetStructure: "sensory description and speculation",
    cefr: "B2",
  },
  {
    id: "lt-ielts-7",
    prompt: "Describe a teacher or mentor who has influenced you.",
    answer: "Describe a teacher or mentor who has influenced you.",
    exampleSentence:
      "who they are | how you met them | what they taught you | why they are important",
    distractors: ["guidance", "inspire", "patient", "advice"],
    hint: "good, nice, thing",
    targetStructure: "describing influence and character",
    cefr: "B2",
  },
  {
    id: "lt-ielts-8",
    prompt: "Describe a piece of technology that helps you at work or school.",
    answer: "Describe a piece of technology that helps you at work or school.",
    exampleSentence: "what it is | what it does | how long you have used it | why it is useful",
    distractors: ["efficient", "software", "organize", "save time"],
    hint: "good, nice, thing",
    targetStructure: "explaining how something works",
    cefr: "B2",
  },
  {
    id: "lt-ielts-9",
    prompt: "Describe a time when you helped someone solve a problem.",
    answer: "Describe a time when you helped someone solve a problem.",
    exampleSentence:
      "who the person was | what the problem was | what you did | how the person felt afterwards",
    distractors: ["solution", "support", "advice", "grateful"],
    hint: "good, nice, thing",
    targetStructure: "past-tense narrative",
    cefr: "B2",
  },
  {
    id: "lt-ielts-10",
    prompt: "Describe a goal you have for the next year.",
    answer: "Describe a goal you have for the next year.",
    exampleSentence:
      "what the goal is | why you chose it | what steps you will take | how you will know you have succeeded",
    distractors: ["achieve", "plan", "progress", "motivation"],
    hint: "good, nice, thing",
    targetStructure: "future plans and conditionals",
    cefr: "B2",
  },
  {
    id: "lt-ielts-11",
    prompt: "Describe a local event or festival in your area.",
    answer: "Describe a local event or festival in your area.",
    exampleSentence:
      "what the event is | when it takes place | who takes part | why it matters to your community",
    distractors: ["community", "tradition", "participate", "local"],
    hint: "good, nice, thing",
    targetStructure: "describing events and community",
    cefr: "B1",
  },
  {
    id: "lt-ielts-12",
    prompt: "Describe a book or article that has stayed with you.",
    answer: "Describe a book or article that has stayed with you.",
    exampleSentence:
      "what it is | when you read it | what it is about | why it made an impression on you",
    distractors: ["character", "plot", "message", "recommend"],
    hint: "good, nice, thing",
    targetStructure: "giving opinions about media",
    cefr: "B2",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Business long-turn topics (B1–B2)
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_LONG_TURN_TOPICS: GameItem[] = [
  {
    id: "lt-bus-1",
    prompt: "Describe your current role at work.",
    answer: "Describe your current role at work.",
    exampleSentence:
      "what your job title is | what your main responsibilities are | who you work with most | why the role suits you",
    distractors: ["responsibilities", "collaborate", "report", "contribute"],
    hint: "good, nice, thing",
    targetStructure: "describing roles and routines",
    cefr: "B1",
  },
  {
    id: "lt-bus-2",
    prompt: "Describe a project that did not go as planned.",
    answer: "Describe a project that did not go as planned.",
    exampleSentence:
      "what the project was | what went wrong | how you responded | what you learned from it",
    distractors: ["deadline", "unexpected", "adjust", "lesson"],
    hint: "good, nice, thing",
    targetStructure: "past-tense narrative and result clauses",
    cefr: "B1",
  },
  {
    id: "lt-bus-3",
    prompt: "Describe a tool or app you rely on at work.",
    answer: "Describe a tool or app you rely on at work.",
    exampleSentence:
      "what it is | what you use it for | how it helps your team | why you would not want to lose it",
    distractors: ["efficient", "organize", "track", "essential"],
    hint: "good, nice, thing",
    targetStructure: "explaining processes and benefits",
    cefr: "B1",
  },
  {
    id: "lt-bus-4",
    prompt: "Describe a decision you regret at work.",
    answer: "Describe a decision you regret at work.",
    exampleSentence:
      "what the decision was | why you made it | what happened as a result | what you would do differently",
    distractors: ["regret", "outcome", "reconsider", "mistake"],
    hint: "good, nice, thing",
    targetStructure: "hypothetical reflection",
    cefr: "B2",
  },
  {
    id: "lt-bus-5",
    prompt: "Describe a colleague you have learned a lot from.",
    answer: "Describe a colleague you have learned a lot from.",
    exampleSentence:
      "who the person is | what they do | what they taught you | how they helped your career",
    distractors: ["mentor", "advice", "guidance", "develop"],
    hint: "good, nice, thing",
    targetStructure: "describing people and influence",
    cefr: "B1",
  },
  {
    id: "lt-bus-6",
    prompt: "Describe a difficult conversation you had at work.",
    answer: "Describe a difficult conversation you had at work.",
    exampleSentence:
      "who it was with | what the topic was | how you prepared | what the result was",
    distractors: ["discuss", "resolve", "feedback", "approach"],
    hint: "good, nice, thing",
    targetStructure: "narrating a sensitive situation",
    cefr: "B2",
  },
  {
    id: "lt-bus-7",
    prompt: "Describe a time you had to meet a tight deadline.",
    answer: "Describe a time you had to meet a tight deadline.",
    exampleSentence:
      "what the task was | how much time you had | what you did to finish | how you felt afterwards",
    distractors: ["pressure", "prioritize", "complete", "schedule"],
    hint: "good, nice, thing",
    targetStructure: "past-tense narrative under pressure",
    cefr: "B1",
  },
  {
    id: "lt-bus-8",
    prompt: "Describe a meeting that was particularly useful.",
    answer: "Describe a meeting that was particularly useful.",
    exampleSentence:
      "what the meeting was about | who was there | what decisions were made | why it was valuable",
    distractors: ["agenda", "outcome", "decision", "productive"],
    hint: "good, nice, thing",
    targetStructure: "evaluating a discussion",
    cefr: "B1",
  },
  {
    id: "lt-bus-9",
    prompt: "Describe a customer or client you worked with.",
    answer: "Describe a customer or client you worked with.",
    exampleSentence: "who they were | what they needed | how you helped them | what the result was",
    distractors: ["client", "requirement", "solution", "satisfied"],
    hint: "good, nice, thing",
    targetStructure: "describing a service interaction",
    cefr: "B2",
  },
  {
    id: "lt-bus-10",
    prompt: "Describe a change that has affected your workplace.",
    answer: "Describe a change that has affected your workplace.",
    exampleSentence:
      "what the change was | when it happened | how people reacted | why it was necessary",
    distractors: ["adapt", "implement", "transition", "impact"],
    hint: "good, nice, thing",
    targetStructure: "present perfect and change vocabulary",
    cefr: "B2",
  },
  {
    id: "lt-bus-11",
    prompt: "Describe a report or presentation you are proud of.",
    answer: "Describe a report or presentation you are proud of.",
    exampleSentence:
      "what it was about | who it was for | how you prepared it | why it was successful",
    distractors: ["research", "data", "audience", "clear"],
    hint: "good, nice, thing",
    targetStructure: "describing preparation and results",
    cefr: "B1",
  },
  {
    id: "lt-bus-12",
    prompt: "Describe a goal your team is working toward.",
    answer: "Describe a goal your team is working toward.",
    exampleSentence:
      "what the goal is | why it matters | what steps you are taking | how you will measure success",
    distractors: ["objective", "strategy", "progress", "achieve"],
    hint: "good, nice, thing",
    targetStructure: "future plans and team collaboration",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Teens long-turn topics (A2–B1)
// ─────────────────────────────────────────────────────────────────────────────

export const TEENS_LONG_TURN_TOPICS: GameItem[] = [
  {
    id: "lt-teens-1",
    prompt: "Describe your favourite subject at school.",
    answer: "Describe your favourite subject at school.",
    exampleSentence:
      "what the subject is | what you do in class | why you like it | what you want to do with it",
    distractors: ["subject", "learn", "interesting", "future"],
    hint: "good, nice, thing",
    targetStructure: "giving reasons and preferences",
    cefr: "A2",
  },
  {
    id: "lt-teens-2",
    prompt: "Describe a friend you spend a lot of time with.",
    answer: "Describe a friend you spend a lot of time with.",
    exampleSentence: "who the person is | what you do together | why you get on well | how you met",
    distractors: ["friendly", "share", "hobby", "laugh"],
    hint: "good, nice, thing",
    targetStructure: "describing people and routines",
    cefr: "A2",
  },
  {
    id: "lt-teens-3",
    prompt: "Describe a hobby you enjoy in your free time.",
    answer: "Describe a hobby you enjoy in your free time.",
    exampleSentence: "what the hobby is | when you do it | what you need for it | why you like it",
    distractors: ["creative", "relax", "practise", "enjoy"],
    hint: "good, nice, thing",
    targetStructure: "describing free-time activities",
    cefr: "A2",
  },
  {
    id: "lt-teens-4",
    prompt: "Describe a game, film or show you like.",
    answer: "Describe a game, film or show you like.",
    exampleSentence:
      "what it is | what happens in it | who you watch or play with | why you like it",
    distractors: ["character", "exciting", "story", "recommend"],
    hint: "good, nice, thing",
    targetStructure: "giving opinions about entertainment",
    cefr: "A2",
  },
  {
    id: "lt-teens-5",
    prompt: "Describe a trip you went on recently.",
    answer: "Describe a trip you went on recently.",
    exampleSentence: "where you went | who you went with | what you did | what you liked most",
    distractors: ["journey", "visit", "activity", "remember"],
    hint: "good, nice, thing",
    targetStructure: "past-tense narrative",
    cefr: "A2",
  },
  {
    id: "lt-teens-6",
    prompt: "Describe your plans for next weekend.",
    answer: "Describe your plans for next weekend.",
    exampleSentence:
      "what you are going to do | who you are going with | where you will go | why you are looking forward to it",
    distractors: ["plan", "weekend", "look forward", "spend time"],
    hint: "good, nice, thing",
    targetStructure: "future intentions",
    cefr: "A2",
  },
  {
    id: "lt-teens-7",
    prompt: "Describe a place in your town where you like to go.",
    answer: "Describe a place in your town where you like to go.",
    exampleSentence: "where it is | what you can do there | who you go with | why you like it",
    distractors: ["local", "neighbourhood", "hang out", "favourite"],
    hint: "good, nice, thing",
    targetStructure: "describing a local place",
    cefr: "B1",
  },
  {
    id: "lt-teens-8",
    prompt: "Describe a time you helped someone at school.",
    answer: "Describe a time you helped someone at school.",
    exampleSentence: "who you helped | what the problem was | what you did | how the person felt",
    distractors: ["help", "problem", "kind", "thank"],
    hint: "good, nice, thing",
    targetStructure: "past-tense helping narrative",
    cefr: "B1",
  },
  {
    id: "lt-teens-9",
    prompt: "Describe a skill you are learning at the moment.",
    answer: "Describe a skill you are learning at the moment.",
    exampleSentence:
      "what the skill is | where you are learning it | why you started | how you practise",
    distractors: ["improve", "practise", "lesson", "progress"],
    hint: "good, nice, thing",
    targetStructure: "present continuous for current actions",
    cefr: "B1",
  },
  {
    id: "lt-teens-10",
    prompt: "Describe a club or team you belong to.",
    answer: "Describe a club or team you belong to.",
    exampleSentence: "what it is | when it meets | what you do there | why you joined",
    distractors: ["member", "meeting", "activity", "belong"],
    hint: "good, nice, thing",
    targetStructure: "describing groups and routines",
    cefr: "B1",
  },
  {
    id: "lt-teens-11",
    prompt: "Describe a piece of music or a song you like.",
    answer: "Describe a piece of music or a song you like.",
    exampleSentence:
      "what it is | who sings or plays it | when you listen to it | why it makes you feel happy or sad",
    distractors: ["singer", "rhythm", "lyrics", "mood"],
    hint: "good, nice, thing",
    targetStructure: "describing music and emotions",
    cefr: "B1",
  },
  {
    id: "lt-teens-12",
    prompt: "Describe your favourite way to relax after school.",
    answer: "Describe your favourite way to relax after school.",
    exampleSentence: "what you do | where you do it | who you do it with | why it helps you",
    distractors: ["relax", "tired", "unwind", "comfortable"],
    hint: "good, nice, thing",
    targetStructure: "describing routines and reasons",
    cefr: "B1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined bank
// ─────────────────────────────────────────────────────────────────────────────

export const LONG_TURN_TOPICS: GameItem[] = [
  ...IELTS_STYLE_LONG_TURN_TOPICS,
  ...BUSINESS_LONG_TURN_TOPICS,
  ...TEENS_LONG_TURN_TOPICS,
];
