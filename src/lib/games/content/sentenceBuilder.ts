// Sentence builder content bank — read by SentenceBuilderGame.
// answer is the target sentence (no final full stop — it would stick to the
// last token); the game splits it into tokens on spaces. Every sentence has
// exactly ONE valid ordering, 6–12 words, and is weighted towards the three
// mistakes the feedback engine names: aux-before-subject in questions,
// subject-before-aux in statements, and misplaced adverbs.
import type { GameItem } from "@/lib/game-contract";

export const SB_QUESTIONS: GameItem[] = [
  { id: "qu-1", prompt: "Put the words in order.", answer: "Do you know where the nearest pharmacy is", targetStructure: "question word order", hint: "Questions start with the helping verb.", cefr: "A1" },
  { id: "qu-2", prompt: "Put the words in order.", answer: "Does she speak English at work every day", targetStructure: "question word order", hint: "With 'she', the helping verb needs an -s.", cefr: "A1" },
  { id: "qu-3", prompt: "Put the words in order.", answer: "Did you watch the game on TV last night", targetStructure: "question word order", hint: "Past simple questions start with 'did'.", cefr: "A2" },
  { id: "qu-4", prompt: "Put the words in order.", answer: "Is he coming to the party with us tonight", targetStructure: "question word order", hint: "Yes/no questions begin with the verb 'be'.", cefr: "A1" },
  { id: "qu-5", prompt: "Put the words in order.", answer: "Are they playing soccer in the park now", targetStructure: "question word order", hint: "Swap 'they' and 'are' to make the question.", cefr: "A1" },
  { id: "qu-6", prompt: "Put the words in order.", answer: "Have you finished your homework for tomorrow yet", targetStructure: "question word order", hint: "Present perfect questions start with 'have'.", cefr: "A2" },
  { id: "qu-7", prompt: "Put the words in order.", answer: "Was she listening to music when you called", targetStructure: "question word order", hint: "Past continuous questions start with 'was' or 'were'.", cefr: "A2" },
  { id: "qu-8", prompt: "Put the words in order.", answer: "Did they enjoy the movie we saw together", targetStructure: "question word order", hint: "After 'did', the main verb goes back to its base form.", cefr: "A2" },
  { id: "qu-9", prompt: "Put the words in order.", answer: "Can you help me carry these boxes upstairs", targetStructure: "question word order", hint: "Modal questions start with the modal verb.", cefr: "A1" },
  { id: "qu-10", prompt: "Put the words in order.", answer: "Will it rain again tomorrow or on Saturday", targetStructure: "question word order", hint: "'Will' comes before the subject in a question.", cefr: "A2" },
  { id: "qu-11", prompt: "Put the words in order.", answer: "Were you sleeping when I knocked on the door", targetStructure: "question word order", hint: "Swap 'you' and 'were' to make the question.", cefr: "A2" },
  { id: "qu-12", prompt: "Put the words in order.", answer: "How often do you go to the gym", targetStructure: "question word order", hint: "After 'how often' you still need the helping verb.", cefr: "A2" },
];

export const SB_ADVERB_FREQUENCY: GameItem[] = [
  { id: "af-1", prompt: "Put the words in order.", answer: "She is always late for work on Mondays", targetStructure: "adverb of frequency position", hint: "With 'be', the adverb comes after it.", cefr: "A2" },
  { id: "af-2", prompt: "Put the words in order.", answer: "I usually drink coffee before I start work", targetStructure: "adverb of frequency position", hint: "With other verbs, the adverb comes before them.", cefr: "A2" },
  { id: "af-3", prompt: "Put the words in order.", answer: "They never eat meat because they are vegetarian", targetStructure: "adverb of frequency position", hint: "'Never' goes right before the main verb.", cefr: "A2" },
  { id: "af-4", prompt: "Put the words in order.", answer: "He often plays tennis with his brother on Saturdays", targetStructure: "adverb of frequency position", hint: "The adverb goes between the subject and the verb.", cefr: "A2" },
  { id: "af-5", prompt: "Put the words in order.", answer: "We are usually at home in the evening", targetStructure: "adverb of frequency position", hint: "With 'be', the adverb comes after it.", cefr: "A2" },
  { id: "af-6", prompt: "Put the words in order.", answer: "She never watches TV before she does her homework", targetStructure: "adverb of frequency position", hint: "'Never' goes right before the main verb.", cefr: "A2" },
  { id: "af-7", prompt: "Put the words in order.", answer: "I am always tired when I wake up early", targetStructure: "adverb of frequency position", hint: "With 'be', the adverb comes after it.", cefr: "A2" },
  { id: "af-8", prompt: "Put the words in order.", answer: "He usually takes the train to work in the morning", targetStructure: "adverb of frequency position", hint: "The adverb goes between the subject and the verb.", cefr: "A2" },
  { id: "af-9", prompt: "Put the words in order.", answer: "They are never late for their English class", targetStructure: "adverb of frequency position", hint: "With 'be', the adverb comes after it.", cefr: "A2" },
  { id: "af-10", prompt: "Put the words in order.", answer: "We often go swimming at the local pool", targetStructure: "adverb of frequency position", hint: "The adverb goes between the subject and the verb.", cefr: "A2" },
  { id: "af-11", prompt: "Put the words in order.", answer: "She always arrives before the other students in class", targetStructure: "adverb of frequency position", hint: "The adverb goes between the subject and the verb.", cefr: "A2" },
  { id: "af-12", prompt: "Put the words in order.", answer: "I never drink coffee after six in the evening", targetStructure: "adverb of frequency position", hint: "'Never' goes right before the main verb.", cefr: "A2" },
];

export const SB_PRESENT_PERFECT: GameItem[] = [
  { id: "pp-1", prompt: "Put the words in order.", answer: "I have already seen that movie three times", targetStructure: "present perfect adverb position", hint: "'Already' goes between 'have' and the past participle.", cefr: "A2" },
  { id: "pp-2", prompt: "Put the words in order.", answer: "Have you ever eaten sushi in a restaurant", targetStructure: "present perfect adverb position", hint: "'Ever' goes between the subject and the past participle.", cefr: "A2" },
  { id: "pp-3", prompt: "Put the words in order.", answer: "She has just left the office for the day", targetStructure: "present perfect adverb position", hint: "'Just' goes between 'has' and the past participle.", cefr: "A2" },
  { id: "pp-4", prompt: "Put the words in order.", answer: "They have never been to New York City", targetStructure: "present perfect adverb position", hint: "'Never' goes between 'have' and the past participle.", cefr: "A2" },
  { id: "pp-5", prompt: "Put the words in order.", answer: "We have not finished the project yet", targetStructure: "present perfect adverb position", hint: "'Yet' goes at the very end.", cefr: "A2" },
  { id: "pp-6", prompt: "Put the words in order.", answer: "He has already read that book twice this year", targetStructure: "present perfect adverb position", hint: "'Already' goes between 'has' and the past participle.", cefr: "B1" },
  { id: "pp-7", prompt: "Put the words in order.", answer: "Have you ever met anyone famous in real life", targetStructure: "present perfect adverb position", hint: "'Ever' goes between the subject and the past participle.", cefr: "B1" },
  { id: "pp-8", prompt: "Put the words in order.", answer: "I have just started a new job in the city", targetStructure: "present perfect adverb position", hint: "'Just' goes between 'have' and the past participle.", cefr: "A2" },
  { id: "pp-9", prompt: "Put the words in order.", answer: "She has never flown in a small plane before", targetStructure: "present perfect adverb position", hint: "'Never' goes between 'has' and the past participle.", cefr: "A2" },
  { id: "pp-10", prompt: "Put the words in order.", answer: "Has the new student arrived at school yet", targetStructure: "present perfect adverb position", hint: "'Yet' goes at the very end.", cefr: "A2" },
  { id: "pp-11", prompt: "Put the words in order.", answer: "We have already bought tickets for the concert", targetStructure: "present perfect adverb position", hint: "'Already' goes between 'have' and the past participle.", cefr: "B1" },
  { id: "pp-12", prompt: "Put the words in order.", answer: "He has just passed his driving test today", targetStructure: "present perfect adverb position", hint: "'Just' goes between 'has' and the past participle.", cefr: "B1" },
];

export const SB_ADJECTIVE_ORDER: GameItem[] = [
  { id: "ao-1", prompt: "Put the words in order.", answer: "She has a beautiful old Italian car", targetStructure: "adjective order", hint: "Opinion comes before age, and age before origin.", cefr: "B1" },
  { id: "ao-2", prompt: "Put the words in order.", answer: "He bought a lovely small wooden table", targetStructure: "adjective order", hint: "Opinion comes before size, and size before material.", cefr: "B1" },
  { id: "ao-3", prompt: "Put the words in order.", answer: "They live in a big old stone house", targetStructure: "adjective order", hint: "Size comes before age, and age before material.", cefr: "B1" },
  { id: "ao-4", prompt: "Put the words in order.", answer: "She wore a beautiful long red dress", targetStructure: "adjective order", hint: "Opinion comes before size, and size before colour.", cefr: "B1" },
  { id: "ao-5", prompt: "Put the words in order.", answer: "I found an interesting old French book", targetStructure: "adjective order", hint: "Opinion comes before age, and age before origin.", cefr: "B1" },
  { id: "ao-6", prompt: "Put the words in order.", answer: "He has a cute little brown dog", targetStructure: "adjective order", hint: "Opinion comes before size, and size before colour.", cefr: "B1" },
  { id: "ao-7", prompt: "Put the words in order.", answer: "We stayed in a small modern Japanese hotel", targetStructure: "adjective order", hint: "Size comes before age, and age before origin.", cefr: "B1" },
  { id: "ao-8", prompt: "Put the words in order.", answer: "She gave me a beautiful small silver ring", targetStructure: "adjective order", hint: "Opinion comes before size, and size before material.", cefr: "B1" },
  { id: "ao-9", prompt: "Put the words in order.", answer: "They bought a big new American car", targetStructure: "adjective order", hint: "Size comes before age, and age before origin.", cefr: "B1" },
  { id: "ao-10", prompt: "Put the words in order.", answer: "He carried a heavy black plastic bag", targetStructure: "adjective order", hint: "Size comes before colour, and colour before material.", cefr: "B1" },
  { id: "ao-11", prompt: "Put the words in order.", answer: "She has lovely long dark hair", targetStructure: "adjective order", hint: "Opinion comes before length, and length before colour.", cefr: "B1" },
  { id: "ao-12", prompt: "Put the words in order.", answer: "I need a comfortable old leather chair", targetStructure: "adjective order", hint: "Opinion comes before age, and age before material.", cefr: "B1" },
];

export const SB_PHRASAL_VERBS: GameItem[] = [
  { id: "pv-1", prompt: "Put the words in order.", answer: "Please pick it up before you leave the room", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "A2" },
  { id: "pv-2", prompt: "Put the words in order.", answer: "Can you turn it off when you finish", targetStructure: "separable phrasal verb with pronoun", hint: "'It' goes between 'turn' and 'off'.", cefr: "A2" },
  { id: "pv-3", prompt: "Put the words in order.", answer: "She put it on before she left the house", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "A2" },
  { id: "pv-4", prompt: "Put the words in order.", answer: "Please throw it away when you have finished", targetStructure: "separable phrasal verb with pronoun", hint: "'It' goes between 'throw' and 'away'.", cefr: "B1" },
  { id: "pv-5", prompt: "Put the words in order.", answer: "He looked it up in the dictionary online", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "B1" },
  { id: "pv-6", prompt: "Put the words in order.", answer: "Can you help me take it down carefully", targetStructure: "separable phrasal verb with pronoun", hint: "'It' goes between 'take' and 'down'.", cefr: "B1" },
  { id: "pv-7", prompt: "Put the words in order.", answer: "She turned it on but it did not work", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "A2" },
  { id: "pv-8", prompt: "Put the words in order.", answer: "Please write it down so you do not forget", targetStructure: "separable phrasal verb with pronoun", hint: "'It' goes between 'write' and 'down'.", cefr: "A2" },
  { id: "pv-9", prompt: "Put the words in order.", answer: "He took it off as soon as he arrived", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "B1" },
  { id: "pv-10", prompt: "Put the words in order.", answer: "Can you fill it in before Friday please", targetStructure: "separable phrasal verb with pronoun", hint: "'It' goes between 'fill' and 'in'.", cefr: "B1" },
  { id: "pv-11", prompt: "Put the words in order.", answer: "She gave it back to me this morning", targetStructure: "separable phrasal verb with pronoun", hint: "A pronoun goes between the verb and the particle.", cefr: "B1" },
  { id: "pv-12", prompt: "Put the words in order.", answer: "Please put them away when you are done", targetStructure: "separable phrasal verb with pronoun", hint: "'Them' goes between 'put' and 'away'.", cefr: "B1" },
];

export const SB_REPORTED_SPEECH: GameItem[] = [
  { id: "rs-1", prompt: "Put the words in order.", answer: "She said that she was tired and hungry", targetStructure: "reported speech backshift", hint: "After 'said', the tense moves one step back.", cefr: "B1" },
  { id: "rs-2", prompt: "Put the words in order.", answer: "He told me that he would call later", targetStructure: "reported speech backshift", hint: "'Will' becomes 'would' in reported speech.", cefr: "B1" },
  { id: "rs-3", prompt: "Put the words in order.", answer: "They said they had finished all their work", targetStructure: "reported speech backshift", hint: "Past simple becomes past perfect after 'said'.", cefr: "B1" },
  { id: "rs-4", prompt: "Put the words in order.", answer: "She told us that she could not come", targetStructure: "reported speech backshift", hint: "'Can' becomes 'could' in reported speech.", cefr: "B1" },
  { id: "rs-5", prompt: "Put the words in order.", answer: "He said that he had lost his keys", targetStructure: "reported speech backshift", hint: "Past simple becomes past perfect after 'said'.", cefr: "B1" },
  { id: "rs-6", prompt: "Put the words in order.", answer: "They told her that the train was late", targetStructure: "reported speech backshift", hint: "After 'told', the tense moves one step back.", cefr: "B1" },
  { id: "rs-7", prompt: "Put the words in order.", answer: "She said that she was living with her sister", targetStructure: "reported speech backshift", hint: "Present continuous becomes past continuous after 'said'.", cefr: "B1" },
  { id: "rs-8", prompt: "Put the words in order.", answer: "He told me that he had seen the movie", targetStructure: "reported speech backshift", hint: "Past simple becomes past perfect after 'told'.", cefr: "B1" },
  { id: "rs-9", prompt: "Put the words in order.", answer: "They said that they would help us move", targetStructure: "reported speech backshift", hint: "'Will' becomes 'would' in reported speech.", cefr: "B1" },
  { id: "rs-10", prompt: "Put the words in order.", answer: "She told him that she had bought a car", targetStructure: "reported speech backshift", hint: "Past simple becomes past perfect after 'told'.", cefr: "B2" },
  { id: "rs-11", prompt: "Put the words in order.", answer: "He said that he could not swim very well", targetStructure: "reported speech backshift", hint: "'Can' becomes 'could' in reported speech.", cefr: "B1" },
  { id: "rs-12", prompt: "Put the words in order.", answer: "They told us that the shop was closed", targetStructure: "reported speech backshift", hint: "After 'told', the tense moves one step back.", cefr: "B1" },
];

export const ALL_SENTENCE_BUILDER: GameItem[] = [
  ...SB_QUESTIONS,
  ...SB_ADVERB_FREQUENCY,
  ...SB_PRESENT_PERFECT,
  ...SB_ADJECTIVE_ORDER,
  ...SB_PHRASAL_VERBS,
  ...SB_REPORTED_SPEECH,
];
