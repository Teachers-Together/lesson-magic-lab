// Content bank for ErrorHuntGame — sentences with exactly one learner error.
// Read by: src/components/games/ErrorHuntGame.tsx
// prompt = sentence with ONE error; answer = same sentence corrected (byte-identical = no-error item).
// targetStructure is restricted to: article, tense, word order, preposition, agreement, plural.
import type { GameItem } from "@/lib/game-contract";

// article — a/an by sound, the with superlatives, zero article with uncountables and general plurals
export const ARTICLE_ERRORS: GameItem[] = [
  { id: "art-1", prompt: "She waited for a hour at the bus stop.", answer: "She waited for an hour at the bus stop.", targetStructure: "article", hint: "Use \"an\" before a vowel SOUND — the h in hour is silent.", cefr: "A2" },
  { id: "art-2", prompt: "He goes to an university in Boston.", answer: "He goes to a university in Boston.", targetStructure: "article", hint: "\"University\" starts with a /j/ sound, like \"you\", so it takes \"a\".", cefr: "A2" },
  { id: "art-3", prompt: "It was an honest mistake.", answer: "It was an honest mistake.", targetStructure: "article", hint: "No error — the h in honest is silent, so \"an\" is correct.", cefr: "A2" },
  { id: "art-4", prompt: "Mount Whitney is a highest mountain in California.", answer: "Mount Whitney is the highest mountain in California.", targetStructure: "article", hint: "Superlatives always take \"the\": the highest, the best, the first.", cefr: "A2" },
  { id: "art-5", prompt: "She is the tallest girl in her class.", answer: "She is the tallest girl in her class.", targetStructure: "article", hint: "No error — superlatives take \"the\".", cefr: "A2" },
  { id: "art-6", prompt: "I need a information about the course.", answer: "I need information about the course.", targetStructure: "article", hint: "\"Information\" is uncountable, so it never takes \"a\".", cefr: "A2" },
  { id: "art-7", prompt: "He gave me some useful advice.", answer: "He gave me some useful advice.", targetStructure: "article", hint: "No error — \"advice\" is uncountable and takes no article.", cefr: "B1" },
  { id: "art-8", prompt: "The dogs are loyal animals.", answer: "Dogs are loyal animals.", targetStructure: "article", hint: "General plurals take no article: \"Dogs are loyal\", not \"The dogs are loyal\".", cefr: "A2" },
  { id: "art-9", prompt: "Life is short, so enjoy it.", answer: "Life is short, so enjoy it.", targetStructure: "article", hint: "No error — abstract uncountables like \"life\" take no article when general.", cefr: "B1" },
  { id: "art-10", prompt: "We had a great time at the party.", answer: "We had a great time at the party.", targetStructure: "article", hint: "No error — \"have a great time\" is a fixed expression with \"a\".", cefr: "A2" },
  { id: "art-11", prompt: "She plays the piano very well.", answer: "She plays the piano very well.", targetStructure: "article", hint: "No error — musical instruments take \"the\" in American English.", cefr: "A2" },
  { id: "art-12", prompt: "He bought an used car last week.", answer: "He bought a used car last week.", targetStructure: "article", hint: "\"Used\" starts with a /j/ sound, like \"you\", so it takes \"a\".", cefr: "A2" },
  { id: "art-13", prompt: "The money doesn't grow on trees.", answer: "Money doesn't grow on trees.", targetStructure: "article", hint: "General uncountables take no article: \"Money doesn't grow on trees\".", cefr: "B1" },
  { id: "art-14", prompt: "This is a best pizza in town.", answer: "This is the best pizza in town.", targetStructure: "article", hint: "Superlatives always take \"the\".", cefr: "A2" },
  { id: "art-15", prompt: "She wants to be a engineer when she grows up.", answer: "She wants to be an engineer when she grows up.", targetStructure: "article", hint: "Use \"an\" before a vowel sound: an engineer.", cefr: "A2" },
  { id: "art-16", prompt: "The happiness is more important than money.", answer: "Happiness is more important than money.", targetStructure: "article", hint: "Abstract nouns used generally take no article.", cefr: "B1" },
  { id: "art-17", prompt: "He is the only person I trust with this.", answer: "He is the only person I trust with this.", targetStructure: "article", hint: "No error — \"the only\" is correct.", cefr: "B1" },
  { id: "art-18", prompt: "I saw an European film last night.", answer: "I saw a European film last night.", targetStructure: "article", hint: "\"European\" starts with a /j/ sound, so it takes \"a\".", cefr: "B1" },
  { id: "art-19", prompt: "The children go to school by bus.", answer: "Children go to school by bus.", targetStructure: "article", hint: "Talking about children in general needs no article.", cefr: "B1" },
  { id: "art-20", prompt: "We had a lunch together on Friday.", answer: "We had lunch together on Friday.", targetStructure: "article", hint: "Meals take no article: have lunch, have dinner.", cefr: "A2" },
];

// tense
export const TENSE_ERRORS: GameItem[] = [
  { id: "ten-1", prompt: "I go to the gym three times last week.", answer: "I went to the gym three times last week.", targetStructure: "tense", hint: "\"Last week\" is finished time, so use the past simple.", cefr: "A2" },
  { id: "ten-2", prompt: "She has lived here since 2019.", answer: "She has lived here since 2019.", targetStructure: "tense", hint: "No error — \"since 2019\" connects past to present, so present perfect.", cefr: "B1" },
  { id: "ten-3", prompt: "He is working here since March.", answer: "He has worked here since March.", targetStructure: "tense", hint: "\"Since March\" needs the present perfect, not the present continuous.", cefr: "B1" },
  { id: "ten-4", prompt: "When I arrived, they already left.", answer: "When I arrived, they had already left.", targetStructure: "tense", hint: "The earlier of two past actions takes the past perfect: had left.", cefr: "B2" },
  { id: "ten-5", prompt: "Look! It rains again.", answer: "Look! It is raining again.", targetStructure: "tense", hint: "\"Look!\" signals right now, so use the present continuous.", cefr: "A2" },
  { id: "ten-6", prompt: "I am knowing the answer to your question.", answer: "I know the answer to your question.", targetStructure: "tense", hint: "\"Know\" is a state verb — state verbs don't take the continuous.", cefr: "B1" },
  { id: "ten-7", prompt: "We watched a great movie last night.", answer: "We watched a great movie last night.", targetStructure: "tense", hint: "No error — finished time, past simple.", cefr: "A2" },
  { id: "ten-8", prompt: "By next June, I will finish my degree.", answer: "By next June, I will have finished my degree.", targetStructure: "tense", hint: "\"By next June\" looks at completion before a future point: will have finished.", cefr: "B2" },
  { id: "ten-9", prompt: "She didn't went to the meeting.", answer: "She didn't go to the meeting.", targetStructure: "tense", hint: "After \"didn't\", use the base form: didn't go.", cefr: "A2" },
  { id: "ten-10", prompt: "I have seen him yesterday at the store.", answer: "I saw him yesterday at the store.", targetStructure: "tense", hint: "\"Yesterday\" is finished time — the present perfect can't sit next to it.", cefr: "B1" },
  { id: "ten-11", prompt: "They are married for ten years.", answer: "They have been married for ten years.", targetStructure: "tense", hint: "\"For ten years\" up to now needs the present perfect.", cefr: "B1" },
  { id: "ten-12", prompt: "While I was driving home, my phone rang.", answer: "While I was driving home, my phone rang.", targetStructure: "tense", hint: "No error — continuous for the longer background action, simple for the interruption.", cefr: "B1" },
  { id: "ten-13", prompt: "He plays soccer every Saturday.", answer: "He plays soccer every Saturday.", targetStructure: "tense", hint: "No error — habits take the present simple.", cefr: "A2" },
  { id: "ten-14", prompt: "I will call you as soon as I will arrive.", answer: "I will call you as soon as I arrive.", targetStructure: "tense", hint: "After \"as soon as\", use the present simple for the future, not \"will\".", cefr: "B1" },
  { id: "ten-15", prompt: "She has written three reports so far today.", answer: "She has written three reports so far today.", targetStructure: "tense", hint: "No error — \"so far today\" is unfinished time, present perfect.", cefr: "B2" },
  { id: "ten-16", prompt: "We was watching TV when the power went out.", answer: "We were watching TV when the power went out.", targetStructure: "tense", hint: "\"We\" takes \"were\" in the past continuous.", cefr: "A2" },
  { id: "ten-17", prompt: "He used to smoke, but he quit two years ago.", answer: "He used to smoke, but he quit two years ago.", targetStructure: "tense", hint: "No error — \"used to\" for a past habit, past simple for the finished event.", cefr: "B1" },
  { id: "ten-18", prompt: "The train leaves at six tomorrow morning.", answer: "The train leaves at six tomorrow morning.", targetStructure: "tense", hint: "No error — timetabled events take the present simple.", cefr: "A2" },
  { id: "ten-19", prompt: "I didn't finished my homework yet.", answer: "I haven't finished my homework yet.", targetStructure: "tense", hint: "\"Yet\" points to now, so use the present perfect: haven't finished.", cefr: "B1" },
  { id: "ten-20", prompt: "She was studying when I had called her.", answer: "She was studying when I called her.", targetStructure: "tense", hint: "The short interrupting action takes the past simple: when I called.", cefr: "B2" },
];

// word order
export const WORD_ORDER_ERRORS: GameItem[] = [
  { id: "wo-1", prompt: "She speaks very well English.", answer: "She speaks English very well.", targetStructure: "word order", hint: "The verb keeps its object close: speaks English, then the adverb.", cefr: "A2" },
  { id: "wo-2", prompt: "I don't know where is the station.", answer: "I don't know where the station is.", targetStructure: "word order", hint: "In an indirect question, use statement order: where the station is.", cefr: "B1" },
  { id: "wo-3", prompt: "He always is late for class.", answer: "He is always late for class.", targetStructure: "word order", hint: "Adverbs like \"always\" go after the verb \"be\".", cefr: "A2" },
  { id: "wo-4", prompt: "Never I have seen such a big dog.", answer: "I have never seen such a big dog.", targetStructure: "word order", hint: "The adverb sits between the auxiliary and the main verb: have never seen.", cefr: "B1" },
  { id: "wo-5", prompt: "Can you tell me where the restroom is?", answer: "Can you tell me where the restroom is?", targetStructure: "word order", hint: "No error — indirect questions use statement word order.", cefr: "B1" },
  { id: "wo-6", prompt: "Yesterday we went to the beach.", answer: "Yesterday we went to the beach.", targetStructure: "word order", hint: "No error — a time phrase can open a sentence.", cefr: "A2" },
  { id: "wo-7", prompt: "She gave to me the keys.", answer: "She gave me the keys.", targetStructure: "word order", hint: "With \"give\", the person comes first without \"to\": gave me the keys.", cefr: "B1" },
  { id: "wo-8", prompt: "I like very much this song.", answer: "I like this song very much.", targetStructure: "word order", hint: "Don't split the verb from its object: like this song very much.", cefr: "A2" },
  { id: "wo-9", prompt: "He drove carefully his new car home.", answer: "He drove his new car home carefully.", targetStructure: "word order", hint: "The adverb follows the object: drove his new car home carefully.", cefr: "B1" },
  { id: "wo-10", prompt: "Do you know what time does the store close?", answer: "Do you know what time the store closes?", targetStructure: "word order", hint: "After \"Do you know\", the question becomes a statement: the store closes.", cefr: "B1" },
  { id: "wo-11", prompt: "They have enough money to buy the tickets.", answer: "They have enough money to buy the tickets.", targetStructure: "word order", hint: "No error — \"enough\" comes before a noun.", cefr: "B1" },
  { id: "wo-12", prompt: "She isn't enough old to drive.", answer: "She isn't old enough to drive.", targetStructure: "word order", hint: "\"Enough\" comes after an adjective: old enough.", cefr: "B1" },
  { id: "wo-13", prompt: "Always he arrives before eight.", answer: "He always arrives before eight.", targetStructure: "word order", hint: "Frequency adverbs go before the main verb, after the subject.", cefr: "A2" },
  { id: "wo-14", prompt: "I asked him where did he live.", answer: "I asked him where he lived.", targetStructure: "word order", hint: "Reported questions drop the question order: where he lived.", cefr: "B2" },
  { id: "wo-15", prompt: "We discussed about the plan for hours.", answer: "We discussed the plan for hours.", targetStructure: "word order", hint: "\"Discuss\" takes no preposition — discuss the plan.", cefr: "B2" },
  { id: "wo-16", prompt: "She explained me the rules of the game.", answer: "She explained the rules of the game to me.", targetStructure: "word order", hint: "\"Explain\" can't be followed directly by a person: explain something to me.", cefr: "B2" },
  { id: "wo-17", prompt: "He finished quickly his dinner.", answer: "He finished his dinner quickly.", targetStructure: "word order", hint: "Keep the verb and object together: finished his dinner quickly.", cefr: "A2" },
  { id: "wo-18", prompt: "Hardly I had sat down when the phone rang.", answer: "Hardly had I sat down when the phone rang.", targetStructure: "word order", hint: "Starting with \"hardly\" inverts subject and auxiliary: Hardly had I sat down.", cefr: "B2" },
  { id: "wo-19", prompt: "She probably will come to the meeting.", answer: "She will probably come to the meeting.", targetStructure: "word order", hint: "\"Probably\" goes after \"will\": will probably come.", cefr: "B1" },
  { id: "wo-20", prompt: "I wonder where did I put my keys.", answer: "I wonder where I put my keys.", targetStructure: "word order", hint: "\"I wonder\" starts an indirect question — use statement order.", cefr: "B2" },
];

// preposition
export const PREPOSITION_ERRORS: GameItem[] = [
  { id: "pre-1", prompt: "She is married with a doctor.", answer: "She is married to a doctor.", targetStructure: "preposition", hint: "\"Married to\", never \"married with\".", cefr: "A2" },
  { id: "pre-2", prompt: "It depends of the weather.", answer: "It depends on the weather.", targetStructure: "preposition", hint: "\"Depend on\", not \"depend of\".", cefr: "A2" },
  { id: "pre-3", prompt: "We arrived at the airport on time.", answer: "We arrived at the airport on time.", targetStructure: "preposition", hint: "No error — \"arrive at\" a place.", cefr: "A2" },
  { id: "pre-4", prompt: "I have been waiting since two hours.", answer: "I have been waiting for two hours.", targetStructure: "preposition", hint: "\"For\" + a length of time; \"since\" + a point in time.", cefr: "B1" },
  { id: "pre-5", prompt: "He is good in math.", answer: "He is good at math.", targetStructure: "preposition", hint: "\"Good at\" a subject or skill.", cefr: "A2" },
  { id: "pre-6", prompt: "She listened carefully to the teacher.", answer: "She listened carefully to the teacher.", targetStructure: "preposition", hint: "No error — \"listen to\".", cefr: "A2" },
  { id: "pre-7", prompt: "They arrived to the office late.", answer: "They arrived at the office late.", targetStructure: "preposition", hint: "\"Arrive at\" a place, never \"arrive to\".", cefr: "B1" },
  { id: "pre-8", prompt: "I am interested on learning Spanish.", answer: "I am interested in learning Spanish.", targetStructure: "preposition", hint: "\"Interested in\".", cefr: "A2" },
  { id: "pre-9", prompt: "He apologized for being late.", answer: "He apologized for being late.", targetStructure: "preposition", hint: "No error — \"apologize for\".", cefr: "B1" },
  { id: "pre-10", prompt: "She congratulated me for my new job.", answer: "She congratulated me on my new job.", targetStructure: "preposition", hint: "\"Congratulate someone on\" something.", cefr: "B2" },
  { id: "pre-11", prompt: "We talked about the problem for an hour.", answer: "We talked about the problem for an hour.", targetStructure: "preposition", hint: "No error — \"talk about\".", cefr: "B1" },
  { id: "pre-12", prompt: "He is afraid from spiders.", answer: "He is afraid of spiders.", targetStructure: "preposition", hint: "\"Afraid of\", not \"afraid from\".", cefr: "A2" },
  { id: "pre-13", prompt: "I will meet you on Monday at noon.", answer: "I will meet you on Monday at noon.", targetStructure: "preposition", hint: "No error — \"on\" for days, \"at\" for times.", cefr: "A2" },
  { id: "pre-14", prompt: "She insisted to pay for dinner.", answer: "She insisted on paying for dinner.", targetStructure: "preposition", hint: "\"Insist on\" + -ing.", cefr: "B2" },
  { id: "pre-15", prompt: "He succeeded in passing the exam.", answer: "He succeeded in passing the exam.", targetStructure: "preposition", hint: "No error — \"succeed in\" + -ing.", cefr: "B2" },
  { id: "pre-16", prompt: "They accused him from stealing the money.", answer: "They accused him of stealing the money.", targetStructure: "preposition", hint: "\"Accuse someone of\" something.", cefr: "B2" },
  { id: "pre-17", prompt: "I am looking forward to see you.", answer: "I am looking forward to seeing you.", targetStructure: "preposition", hint: "Here \"to\" is a preposition, so the verb takes -ing: to seeing you.", cefr: "B2" },
  { id: "pre-18", prompt: "The bus stopped in front the school.", answer: "The bus stopped in front of the school.", targetStructure: "preposition", hint: "\"In front of\" needs the \"of\".", cefr: "A2" },
  { id: "pre-19", prompt: "She has been sick since Monday.", answer: "She has been sick since Monday.", targetStructure: "preposition", hint: "No error — \"since\" + a point in time.", cefr: "B1" },
  { id: "pre-20", prompt: "He prefers tea than coffee.", answer: "He prefers tea to coffee.", targetStructure: "preposition", hint: "\"Prefer A to B\", not \"than\".", cefr: "B1" },
];

// agreement
export const AGREEMENT_ERRORS: GameItem[] = [
  { id: "agr-1", prompt: "She don't like spicy food.", answer: "She doesn't like spicy food.", targetStructure: "agreement", hint: "Third person singular takes \"doesn't\".", cefr: "A2" },
  { id: "agr-2", prompt: "The news are surprising.", answer: "The news is surprising.", targetStructure: "agreement", hint: "\"News\" looks plural but is singular.", cefr: "B1" },
  { id: "agr-3", prompt: "Everyone is here now.", answer: "Everyone is here now.", targetStructure: "agreement", hint: "No error — \"everyone\" takes a singular verb.", cefr: "A2" },
  { id: "agr-4", prompt: "Each of the students have a locker.", answer: "Each of the students has a locker.", targetStructure: "agreement", hint: "\"Each\" is singular: each has.", cefr: "B1" },
  { id: "agr-5", prompt: "My family are coming to visit this summer.", answer: "My family is coming to visit this summer.", targetStructure: "agreement", hint: "In American English, collective nouns like \"family\" are singular.", cefr: "B1" },
  { id: "agr-6", prompt: "There is three eggs in the fridge.", answer: "There are three eggs in the fridge.", targetStructure: "agreement", hint: "The verb agrees with the real subject after \"there\": three eggs are.", cefr: "A2" },
  { id: "agr-7", prompt: "Neither of the answers is correct.", answer: "Neither of the answers is correct.", targetStructure: "agreement", hint: "No error — \"neither\" takes a singular verb.", cefr: "B2" },
  { id: "agr-8", prompt: "Mathematics are difficult for many students.", answer: "Mathematics is difficult for many students.", targetStructure: "agreement", hint: "Subjects ending in -ics are singular: mathematics is.", cefr: "B1" },
  { id: "agr-9", prompt: "He work at a bank downtown.", answer: "He works at a bank downtown.", targetStructure: "agreement", hint: "Third person singular present takes -s: he works.", cefr: "A2" },
  { id: "agr-10", prompt: "The police have arrested a suspect.", answer: "The police have arrested a suspect.", targetStructure: "agreement", hint: "No error — \"police\" is always plural.", cefr: "B2" },
  { id: "agr-11", prompt: "One of my friends live in Chicago.", answer: "One of my friends lives in Chicago.", targetStructure: "agreement", hint: "The subject is \"one\", not \"friends\": one lives.", cefr: "B1" },
  { id: "agr-12", prompt: "Both of my parents are teachers.", answer: "Both of my parents are teachers.", targetStructure: "agreement", hint: "No error — \"both\" is plural.", cefr: "B1" },
  { id: "agr-13", prompt: "Fifty dollars are too much for a T-shirt.", answer: "Fifty dollars is too much for a T-shirt.", targetStructure: "agreement", hint: "Amounts of money count as one thing: fifty dollars is.", cefr: "B2" },
  { id: "agr-14", prompt: "She have two brothers and a sister.", answer: "She has two brothers and a sister.", targetStructure: "agreement", hint: "Third person singular: she has.", cefr: "A2" },
  { id: "agr-15", prompt: "The number of accidents have fallen this year.", answer: "The number of accidents has fallen this year.", targetStructure: "agreement", hint: "\"The number\" is singular, so \"has\".", cefr: "B2" },
  { id: "agr-16", prompt: "Neither the students nor the teacher was ready.", answer: "Neither the students nor the teacher was ready.", targetStructure: "agreement", hint: "No error — the verb agrees with the nearer subject, \"the teacher\".", cefr: "B2" },
  { id: "agr-17", prompt: "Does she plays the guitar?", answer: "Does she play the guitar?", targetStructure: "agreement", hint: "\"Does\" already carries the -s, so the main verb stays in the base form.", cefr: "A2" },
  { id: "agr-18", prompt: "My luggage are still at the airport.", answer: "My luggage is still at the airport.", targetStructure: "agreement", hint: "\"Luggage\" is uncountable and singular.", cefr: "B1" },
  { id: "agr-19", prompt: "There was a lot of people at the concert.", answer: "There were a lot of people at the concert.", targetStructure: "agreement", hint: "\"People\" is plural: there were.", cefr: "B1" },
  { id: "agr-20", prompt: "Each student has their own desk.", answer: "Each student has their own desk.", targetStructure: "agreement", hint: "No error — singular \"their\" is standard in modern American English.", cefr: "B2" },
];

// plural
export const PLURAL_ERRORS: GameItem[] = [
  { id: "plu-1", prompt: "She gave me many good advices.", answer: "She gave me a lot of good advice.", targetStructure: "plural", hint: "\"Advice\" is uncountable — it has no plural form.", cefr: "A2" },
  { id: "plu-2", prompt: "I need some informations about the flight.", answer: "I need some information about the flight.", targetStructure: "plural", hint: "\"Information\" is uncountable.", cefr: "A2" },
  { id: "plu-3", prompt: "The children are playing in the yard.", answer: "The children are playing in the yard.", targetStructure: "plural", hint: "No error — \"children\" is the correct irregular plural.", cefr: "A2" },
  { id: "plu-4", prompt: "We saw three deers in the forest.", answer: "We saw three deer in the forest.", targetStructure: "plural", hint: "\"Deer\" has the same singular and plural form.", cefr: "A2" },
  { id: "plu-5", prompt: "He bought new furnitures for his apartment.", answer: "He bought new furniture for his apartment.", targetStructure: "plural", hint: "\"Furniture\" is uncountable.", cefr: "B1" },
  { id: "plu-6", prompt: "There were two woman at the front desk.", answer: "There were two women at the front desk.", targetStructure: "plural", hint: "The plural of \"woman\" is \"women\".", cefr: "A2" },
  { id: "plu-7", prompt: "The scissors are on the table.", answer: "The scissors are on the table.", targetStructure: "plural", hint: "No error — \"scissors\" is always plural.", cefr: "B1" },
  { id: "plu-8", prompt: "I have a lot of homeworks tonight.", answer: "I have a lot of homework tonight.", targetStructure: "plural", hint: "\"Homework\" is uncountable.", cefr: "A2" },
  { id: "plu-9", prompt: "She has two brother-in-laws.", answer: "She has two brothers-in-law.", targetStructure: "plural", hint: "In compound nouns, the main word takes the plural: brothers-in-law.", cefr: "B2" },
  { id: "plu-10", prompt: "All the luggages were lost on the flight.", answer: "All the luggage was lost on the flight.", targetStructure: "plural", hint: "\"Luggage\" is uncountable and singular.", cefr: "B1" },
  { id: "plu-11", prompt: "The sheep are grazing in the field.", answer: "The sheep are grazing in the field.", targetStructure: "plural", hint: "No error — \"sheep\" is both singular and plural.", cefr: "A2" },
  { id: "plu-12", prompt: "How many luggages can I check in?", answer: "How many bags can I check in?", targetStructure: "plural", hint: "\"Luggage\" is uncountable — count the bags instead.", cefr: "A2" },
  { id: "plu-13", prompt: "He caught three fishs on Saturday.", answer: "He caught three fish on Saturday.", targetStructure: "plural", hint: "The plural of \"fish\" is usually \"fish\".", cefr: "A2" },
  { id: "plu-14", prompt: "The company made big progresses this year.", answer: "The company made big progress this year.", targetStructure: "plural", hint: "\"Progress\" is uncountable.", cefr: "B2" },
  { id: "plu-15", prompt: "Her clothes are always very stylish.", answer: "Her clothes are always very stylish.", targetStructure: "plural", hint: "No error — \"clothes\" is plural with no singular form.", cefr: "B1" },
  { id: "plu-16", prompt: "We need more equipments for the lab.", answer: "We need more equipment for the lab.", targetStructure: "plural", hint: "\"Equipment\" is uncountable.", cefr: "B1" },
  { id: "plu-17", prompt: "The police found several evidences at the scene.", answer: "The police found several pieces of evidence at the scene.", targetStructure: "plural", hint: "\"Evidence\" is uncountable — count pieces of it.", cefr: "B2" },
  { id: "plu-18", prompt: "My foots hurt after the long walk.", answer: "My feet hurt after the long walk.", targetStructure: "plural", hint: "The plural of \"foot\" is \"feet\".", cefr: "A2" },
  { id: "plu-19", prompt: "They gave us useful feedbacks on our essays.", answer: "They gave us useful feedback on our essays.", targetStructure: "plural", hint: "\"Feedback\" is uncountable.", cefr: "B2" },
  { id: "plu-20", prompt: "Two of the students were absent yesterday.", answer: "Two of the students were absent yesterday.", targetStructure: "plural", hint: "No error.", cefr: "A2" },
];

export const ALL_ERROR_HUNT: GameItem[] = [
  ...ARTICLE_ERRORS,
  ...TENSE_ERRORS,
  ...WORD_ORDER_ERRORS,
  ...PREPOSITION_ERRORS,
  ...AGREEMENT_ERRORS,
  ...PLURAL_ERRORS,
];
