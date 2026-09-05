// Dictation sentences for DictationGame.
// prompt = the sentence read aloud and typed; answer = the same sentence,
// identical (grading is word by word). targetStructure names what the
// sentence quietly practises. Difficulty lives in the SOUND: weak forms,
// linking, contractions, numbers and dates. Simple punctuation only.

import type { GameItem } from "@/lib/game-contract";

// ---------- A1: six to eight words ----------
export const DICTATION_A1: GameItem[] = [
  {
    id: "da1-1",
    prompt: "She gets up at seven every day.",
    answer: "She gets up at seven every day.",
    targetStructure: "weak form: at",
    cefr: "A1",
  },
  {
    id: "da1-2",
    prompt: "I'd like a cup of tea.",
    answer: "I'd like a cup of tea.",
    targetStructure: "contraction I'd + weak of",
    cefr: "A1",
  },
  {
    id: "da1-3",
    prompt: "There's a bank near the station.",
    answer: "There's a bank near the station.",
    targetStructure: "contraction There's",
    cefr: "A1",
  },
  {
    id: "da1-4",
    prompt: "He's got two brothers and a sister.",
    answer: "He's got two brothers and a sister.",
    targetStructure: "contraction He's + weak and",
    cefr: "A1",
  },
  {
    id: "da1-5",
    prompt: "We live in an old house.",
    answer: "We live in an old house.",
    targetStructure: "linking: an_old",
    cefr: "A1",
  },
  {
    id: "da1-6",
    prompt: "Can I have an apple, please?",
    answer: "Can I have an apple, please?",
    targetStructure: "linking: an_apple + weak can",
    cefr: "A1",
  },
  {
    id: "da1-7",
    prompt: "They don't like fish at all.",
    answer: "They don't like fish at all.",
    targetStructure: "linking: at_all",
    cefr: "A1",
  },
  {
    id: "da1-8",
    prompt: "My birthday is on May third.",
    answer: "My birthday is on May third.",
    targetStructure: "ordinal date",
    cefr: "A1",
  },
  {
    id: "da1-9",
    prompt: "It's half past eight right now.",
    answer: "It's half past eight right now.",
    targetStructure: "time expression + It's",
    cefr: "A1",
  },
  {
    id: "da1-10",
    prompt: "She works in a big office.",
    answer: "She works in a big office.",
    targetStructure: "linking: in_a, big_office",
    cefr: "A1",
  },
  {
    id: "da1-11",
    prompt: "We're going to the park.",
    answer: "We're going to the park.",
    targetStructure: "weak gonna form: going to",
    cefr: "A1",
  },
  {
    id: "da1-12",
    prompt: "Tom has a glass of milk.",
    answer: "Tom has a glass of milk.",
    targetStructure: "weak of",
    cefr: "A1",
  },
  {
    id: "da1-13",
    prompt: "I can't swim very well.",
    answer: "I can't swim very well.",
    targetStructure: "can't with flap t",
    cefr: "A1",
  },
  {
    id: "da1-14",
    prompt: "There are five people in my family.",
    answer: "There are five people in my family.",
    targetStructure: "weak are + linking: people_in",
    cefr: "A1",
  },
  {
    id: "da1-15",
    prompt: "What's your phone number?",
    answer: "What's your phone number?",
    targetStructure: "contraction What's",
    cefr: "A1",
  },
];

// ---------- A2: eight to twelve words ----------
export const DICTATION_A2: GameItem[] = [
  {
    id: "da2-1",
    prompt: "She's been waiting for the bus for twenty minutes.",
    answer: "She's been waiting for the bus for twenty minutes.",
    targetStructure: "weak for twice + number",
    cefr: "A2",
  },
  {
    id: "da2-2",
    prompt: "I bought it on sale for fifteen dollars.",
    answer: "I bought it on sale for fifteen dollars.",
    targetStructure: "linking: bought_it_on + price",
    cefr: "A2",
  },
  {
    id: "da2-3",
    prompt: "We're meeting Anna in front of the cinema.",
    answer: "We're meeting Anna in front of the cinema.",
    targetStructure: "weak of + linking: front_of",
    cefr: "A2",
  },
  {
    id: "da2-4",
    prompt: "He doesn't want to go out tonight.",
    answer: "He doesn't want to go out tonight.",
    targetStructure: "wanna form: want to + linking: go_out",
    cefr: "A2",
  },
  {
    id: "da2-5",
    prompt: "The train leaves at quarter to nine in the morning.",
    answer: "The train leaves at quarter to nine in the morning.",
    targetStructure: "time expression + weak to",
    cefr: "A2",
  },
  {
    id: "da2-6",
    prompt: "I've already seen that film three times.",
    answer: "I've already seen that film three times.",
    targetStructure: "contraction I've + already",
    cefr: "A2",
  },
  {
    id: "da2-7",
    prompt: "There was a lot of traffic on the way home.",
    answer: "There was a lot of traffic on the way home.",
    targetStructure: "lotta form: lot of",
    cefr: "A2",
  },
  {
    id: "da2-8",
    prompt: "She asked me to help her with her homework.",
    answer: "She asked me to help her with her homework.",
    targetStructure: "weak to + weak her twice",
    cefr: "A2",
  },
  {
    id: "da2-9",
    prompt: "We had eggs and toast for breakfast this morning.",
    answer: "We had eggs and toast for breakfast this morning.",
    targetStructure: "weak and + linking: eggs_and",
    cefr: "A2",
  },
  {
    id: "da2-10",
    prompt: "It costs two hundred and fifty dollars a month.",
    answer: "It costs two hundred and fifty dollars a month.",
    targetStructure: "large number + weak a",
    cefr: "A2",
  },
  {
    id: "da2-11",
    prompt: "Did you have a good time at the party?",
    answer: "Did you have a good time at the party?",
    targetStructure: "d'you form: did you",
    cefr: "A2",
  },
  {
    id: "da2-12",
    prompt: "I'll call you back as soon as I can.",
    answer: "I'll call you back as soon as I can.",
    targetStructure: "contraction I'll + weak as...as",
    cefr: "A2",
  },
  {
    id: "da2-13",
    prompt: "My flat is on the third floor at the top.",
    answer: "My flat is on the third floor at the top.",
    targetStructure: "ordinal + linking: flat_is_on",
    cefr: "A2",
  },
  {
    id: "da2-14",
    prompt: "He works from Monday to Friday, nine to five.",
    answer: "He works from Monday to Friday, nine to five.",
    targetStructure: "weak from/to + times",
    cefr: "A2",
  },
  {
    id: "da2-15",
    prompt: "She usually takes a shower and gets dressed in ten minutes.",
    answer: "She usually takes a shower and gets dressed in ten minutes.",
    targetStructure: "weak and + linking: dressed_in",
    cefr: "A2",
  },
];

// ---------- B1: twelve to eighteen words ----------
export const DICTATION_B1: GameItem[] = [
  {
    id: "db1-1",
    prompt: "She'd already left the office by the time I got there.",
    answer: "She'd already left the office by the time I got there.",
    targetStructure: "contraction she'd + past perfect",
    cefr: "B1",
  },
  {
    id: "db1-2",
    prompt: "I was going to tell you, but I completely forgot about it.",
    answer: "I was going to tell you, but I completely forgot about it.",
    targetStructure: "gonna form + linking: forgot_about_it",
    cefr: "B1",
  },
  {
    id: "db1-3",
    prompt: "We've been living in this neighbourhood for nearly ten years.",
    answer: "We've been living in this neighbourhood for nearly ten years.",
    targetStructure: "weak been/for + number",
    cefr: "B1",
  },
  {
    id: "db1-4",
    prompt: "You should have told me you weren't coming to dinner.",
    answer: "You should have told me you weren't coming to dinner.",
    targetStructure: "should've form: should have + weren't",
    cefr: "B1",
  },
  {
    id: "db1-5",
    prompt: "The meeting's been moved from Tuesday to Thursday at half past two.",
    answer: "The meeting's been moved from Tuesday to Thursday at half past two.",
    targetStructure: "contraction 's been + time",
    cefr: "B1",
  },
  {
    id: "db1-6",
    prompt: "He asked if I could give him a hand with the shopping.",
    answer: "He asked if I could give him a hand with the shopping.",
    targetStructure: "weak could/him + idiom",
    cefr: "B1",
  },
  {
    id: "db1-7",
    prompt: "There isn't any point in waiting, because the shop closes in five minutes.",
    answer: "There isn't any point in waiting, because the shop closes in five minutes.",
    targetStructure: "negative contraction + weak any",
    cefr: "B1",
  },
  {
    id: "db1-8",
    prompt: "It must have been about three in the morning when I heard the noise.",
    answer: "It must have been about three in the morning when I heard the noise.",
    targetStructure: "must've form: must have been",
    cefr: "B1",
  },
  {
    id: "db1-9",
    prompt: "We won't know the results until the end of next week.",
    answer: "We won't know the results until the end of next week.",
    targetStructure: "won't + linking: end_of",
    cefr: "B1",
  },
  {
    id: "db1-10",
    prompt: "I told them to wait for us outside, but they'd already gone in.",
    answer: "I told them to wait for us outside, but they'd already gone in.",
    targetStructure: "weak them/to + they'd",
    cefr: "B1",
  },
  {
    id: "db1-11",
    prompt: "She's going to look after her sister's children for a couple of days.",
    answer: "She's going to look after her sister's children for a couple of days.",
    targetStructure: "weak for/a + couple of",
    cefr: "B1",
  },
  {
    id: "db1-12",
    prompt: "If I'd known you were in hospital, I would have come to visit you.",
    answer: "If I'd known you were in hospital, I would have come to visit you.",
    targetStructure: "I'd + would've form: would have",
    cefr: "B1",
  },
  {
    id: "db1-13",
    prompt: "About a third of the students in my class come from other countries.",
    answer: "About a third of the students in my class come from other countries.",
    targetStructure: "fraction + linking: third_of",
    cefr: "B1",
  },
  {
    id: "db1-14",
    prompt: "He doesn't have to work on Saturdays any more, which is great.",
    answer: "He doesn't have to work on Saturdays any more, which is great.",
    targetStructure: "hafta form: have to",
    cefr: "B1",
  },
  {
    id: "db1-15",
    prompt: "What are you going to do about the leak in the bathroom?",
    answer: "What are you going to do about the leak in the bathroom?",
    targetStructure: "whaddaya form: what are you",
    cefr: "B1",
  },
];

// ---------- B2: up to twenty-five words with a subordinate clause ----------
export const DICTATION_B2: GameItem[] = [
  {
    id: "db2-1",
    prompt:
      "Although she'd studied the language for years, she still found it hard to understand native speakers.",
    answer:
      "Although she'd studied the language for years, she still found it hard to understand native speakers.",
    targetStructure: "subordinate clause + she'd + weak for",
    cefr: "B2",
  },
  {
    id: "db2-2",
    prompt: "If it hadn't been raining so hard, we would have walked instead of taking a taxi.",
    answer: "If it hadn't been raining so hard, we would have walked instead of taking a taxi.",
    targetStructure: "third conditional + would've form",
    cefr: "B2",
  },
  {
    id: "db2-3",
    prompt:
      "The report, which should have been finished last Friday, is still sitting on his desk.",
    answer:
      "The report, which should have been finished last Friday, is still sitting on his desk.",
    targetStructure: "relative clause + should've been",
    cefr: "B2",
  },
  {
    id: "db2-4",
    prompt: "I was just about to call you when the phone rang, which was a bit of a coincidence.",
    answer: "I was just about to call you when the phone rang, which was a bit of a coincidence.",
    targetStructure: "linking: just_about_to + bit_of_a",
    cefr: "B2",
  },
  {
    id: "db2-5",
    prompt:
      "By the time we got to the theatre, the play had already been going for twenty minutes.",
    answer:
      "By the time we got to the theatre, the play had already been going for twenty minutes.",
    targetStructure: "past perfect continuous + weak had",
    cefr: "B2",
  },
  {
    id: "db2-6",
    prompt: "He said he wouldn't have taken the job if he'd known what the hours were like.",
    answer: "He said he wouldn't have taken the job if he'd known what the hours were like.",
    targetStructure: "reported third conditional + weak he'd",
    cefr: "B2",
  },
  {
    id: "db2-7",
    prompt:
      "What I don't understand is why nobody bothered to tell us that the class had been cancelled.",
    answer:
      "What I don't understand is why nobody bothered to tell us that the class had been cancelled.",
    targetStructure: "cleft sentence + weak had been",
    cefr: "B2",
  },
  {
    id: "db2-8",
    prompt:
      "They're supposed to finish the project by the end of March, but nobody believes they will.",
    answer:
      "They're supposed to finish the project by the end of March, but nobody believes they will.",
    targetStructure: "supposta form: supposed to + date",
    cefr: "B2",
  },
  {
    id: "db2-9",
    prompt: "No sooner had she sat down to eat than someone knocked on the front door.",
    answer: "No sooner had she sat down to eat than someone knocked on the front door.",
    targetStructure: "inversion + weak had/than",
    cefr: "B2",
  },
  {
    id: "db2-10",
    prompt:
      "Considering that none of them had ever been abroad before, they managed surprisingly well.",
    answer:
      "Considering that none of them had ever been abroad before, they managed surprisingly well.",
    targetStructure: "participle opener + linking: none_of",
    cefr: "B2",
  },
  {
    id: "db2-11",
    prompt: "The tickets cost us ninety-five dollars each, which I thought was a complete rip-off.",
    answer: "The tickets cost us ninety-five dollars each, which I thought was a complete rip-off.",
    targetStructure: "price + weak us",
    cefr: "B2",
  },
  {
    id: "db2-12",
    prompt:
      "She must have been working on that presentation all night, because there were coffee cups everywhere.",
    answer:
      "She must have been working on that presentation all night, because there were coffee cups everywhere.",
    targetStructure: "must've been + deduction",
    cefr: "B2",
  },
  {
    id: "db2-13",
    prompt:
      "Hardly anyone I know writes letters any more, since email is so much faster and cheaper.",
    answer:
      "Hardly anyone I know writes letters any more, since email is so much faster and cheaper.",
    targetStructure: "subordinate clause + weak any",
    cefr: "B2",
  },
  {
    id: "db2-14",
    prompt:
      "We'd been driving for about an hour and a half when we realised we'd left the map at home.",
    answer:
      "We'd been driving for about an hour and a half when we realised we'd left the map at home.",
    targetStructure: "past perfect continuous + duration",
    cefr: "B2",
  },
  {
    id: "db2-15",
    prompt:
      "Even though the shop's only been open for a couple of months, it already has regular customers.",
    answer:
      "Even though the shop's only been open for a couple of months, it already has regular customers.",
    targetStructure: "concessive clause + shop's been",
    cefr: "B2",
  },
];

// ---------- WEAK_FORMS: drills of unstressed function words ----------
export const WEAK_FORMS: GameItem[] = [
  {
    id: "dwf-1",
    prompt: "I need a cup of coffee.",
    answer: "I need a cup of coffee.",
    targetStructure: "weak a + of",
    cefr: "A2",
  },
  {
    id: "dwf-2",
    prompt: "What are you doing at the weekend?",
    answer: "What are you doing at the weekend?",
    targetStructure: "weak are + at",
    cefr: "A2",
  },
  {
    id: "dwf-3",
    prompt: "She was as tired as I was.",
    answer: "She was as tired as I was.",
    targetStructure: "weak as...as + was",
    cefr: "A2",
  },
  {
    id: "dwf-4",
    prompt: "Can you pass me the salt, please?",
    answer: "Can you pass me the salt, please?",
    targetStructure: "weak can + the",
    cefr: "A1",
  },
  {
    id: "dwf-5",
    prompt: "He's from a small town in the north.",
    answer: "He's from a small town in the north.",
    targetStructure: "weak from + in",
    cefr: "A2",
  },
  {
    id: "dwf-6",
    prompt: "We must have taken a wrong turn.",
    answer: "We must have taken a wrong turn.",
    targetStructure: "must've form: must have",
    cefr: "B1",
  },
  {
    id: "dwf-7",
    prompt: "They were waiting for us for an hour.",
    answer: "They were waiting for us for an hour.",
    targetStructure: "weak were/for/us",
    cefr: "A2",
  },
  {
    id: "dwf-8",
    prompt: "I should have called her last night.",
    answer: "I should have called her last night.",
    targetStructure: "should've form + weak her",
    cefr: "B1",
  },
  {
    id: "dwf-9",
    prompt: "Do you want some bread and butter?",
    answer: "Do you want some bread and butter?",
    targetStructure: "weak some + and",
    cefr: "A1",
  },
  {
    id: "dwf-10",
    prompt: "There's a lot of noise in here.",
    answer: "There's a lot of noise in here.",
    targetStructure: "lotta form + linking: noise_in",
    cefr: "A2",
  },
  {
    id: "dwf-11",
    prompt: "He gave it to them this morning.",
    answer: "He gave it to them this morning.",
    targetStructure: "weak to/them + linking: gave_it",
    cefr: "A2",
  },
  {
    id: "dwf-12",
    prompt: "I'd rather stay at home than go out.",
    answer: "I'd rather stay at home than go out.",
    targetStructure: "weak than + linking: go_out",
    cefr: "B1",
  },
  {
    id: "dwf-13",
    prompt: "Has she been to the doctor yet?",
    answer: "Has she been to the doctor yet?",
    targetStructure: "weak has/been/to",
    cefr: "A2",
  },
  {
    id: "dwf-14",
    prompt: "You could have asked me for help.",
    answer: "You could have asked me for help.",
    targetStructure: "could've form + weak for",
    cefr: "B1",
  },
  {
    id: "dwf-15",
    prompt: "It's kind of late, so I'm going to bed.",
    answer: "It's kind of late, so I'm going to bed.",
    targetStructure: "kinda form: kind of",
    cefr: "A2",
  },
];

// ---------- NUMBERS_AND_DATES ----------
export const NUMBERS_AND_DATES: GameItem[] = [
  {
    id: "dnd-1",
    prompt: "The shop opens at nine thirty every morning.",
    answer: "The shop opens at nine thirty every morning.",
    targetStructure: "clock time",
    cefr: "A1",
  },
  {
    id: "dnd-2",
    prompt: "Her flight gets in at ten to six.",
    answer: "Her flight gets in at ten to six.",
    targetStructure: "to for minutes before the hour",
    cefr: "A2",
  },
  {
    id: "dnd-3",
    prompt: "My new phone number is oh seven seven hundred, four five nine eight.",
    answer: "My new phone number is oh seven seven hundred, four five nine eight.",
    targetStructure: "phone number with oh",
    cefr: "A2",
  },
  {
    id: "dnd-4",
    prompt: "The concert starts on the fifteenth of June.",
    answer: "The concert starts on the fifteenth of June.",
    targetStructure: "ordinal date + weak of",
    cefr: "A2",
  },
  {
    id: "dnd-5",
    prompt: "He was born on March the third, nineteen ninety-five.",
    answer: "He was born on March the third, nineteen ninety-five.",
    targetStructure: "date of birth + year",
    cefr: "A2",
  },
  {
    id: "dnd-6",
    prompt: "The tickets were sixty-five dollars each.",
    answer: "The tickets were sixty-five dollars each.",
    targetStructure: "price",
    cefr: "A2",
  },
  {
    id: "dnd-7",
    prompt: "There were more than three hundred people at the wedding.",
    answer: "There were more than three hundred people at the wedding.",
    targetStructure: "hundreds + weak than",
    cefr: "B1",
  },
  {
    id: "dnd-8",
    prompt: "The population of the town is about twenty-two thousand.",
    answer: "The population of the town is about twenty-two thousand.",
    targetStructure: "thousands",
    cefr: "B1",
  },
  {
    id: "dnd-9",
    prompt: "Our appointment is at quarter past two on Thursday.",
    answer: "Our appointment is at quarter past two on Thursday.",
    targetStructure: "quarter past + day",
    cefr: "A2",
  },
  {
    id: "dnd-10",
    prompt: "The recipe needs two and a half cups of flour.",
    answer: "The recipe needs two and a half cups of flour.",
    targetStructure: "fraction + weak and/of",
    cefr: "B1",
  },
];

// ---------- combined ----------
export const ALL_DICTATION: GameItem[] = [
  ...DICTATION_A1,
  ...DICTATION_A2,
  ...DICTATION_B1,
  ...DICTATION_B2,
  ...WEAK_FORMS,
  ...NUMBERS_AND_DATES,
];
