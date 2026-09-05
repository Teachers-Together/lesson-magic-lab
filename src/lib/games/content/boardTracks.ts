// Speaking board prompts for BoardTrackGame.
// prompt = the speaking prompt on the square; answer = the target structure the
// prompt is meant to elicit; distractors[0] = optional square marker
// ("bonus" | "swap" | "challenge"); omit distractors for an ordinary square.
// 16 squares per board, roughly four marked squares, spread along the track.

import type { GameItem } from "@/lib/game-contract";

// ---------- A1: My day ----------
export const BOARD_MY_DAY: GameItem[] = [
  { id: "bmd-1", prompt: "What time do you usually get up? What is the first thing you do?", answer: "present simple for routines", cefr: "A1" },
  { id: "bmd-2", prompt: "Describe your breakfast on a normal day.", answer: "present simple + food vocabulary", cefr: "A1" },
  { id: "bmd-3", prompt: "How do you get to school or work? Describe the journey.", answer: "present simple + by bus / on foot", cefr: "A1" },
  { id: "bmd-4", prompt: "Say three things you do in the morning, in order.", answer: "sequencing with first, then, after that", distractors: ["challenge"], cefr: "A1" },
  { id: "bmd-5", prompt: "What do you do at lunchtime? Who do you eat with?", answer: "present simple, third person optional", cefr: "A1" },
  { id: "bmd-6", prompt: "Describe your afternoon. Is it busy or quiet?", answer: "present simple + adjectives", cefr: "A1" },
  { id: "bmd-7", prompt: "What time do you finish school or work? How do you feel then?", answer: "time expressions + feelings", cefr: "A1" },
  { id: "bmd-8", prompt: "What do you do in the evening at home?", answer: "present simple for routines", distractors: ["bonus"], cefr: "A1" },
  { id: "bmd-9", prompt: "What do you eat for dinner? Do you cook or does someone else cook?", answer: "present simple + food vocabulary", cefr: "A1" },
  { id: "bmd-10", prompt: "Describe one thing you do every day that you enjoy.", answer: "like / enjoy + -ing", cefr: "A1" },
  { id: "bmd-11", prompt: "Is your day the same at the weekend? Say two differences.", answer: "present simple contrast", cefr: "A1" },
  { id: "bmd-12", prompt: "What do you do before you go to bed?", answer: "present simple + before", distractors: ["swap"], cefr: "A1" },
  { id: "bmd-13", prompt: "What time do you go to sleep? Is it early or late for you?", answer: "time expressions", cefr: "A1" },
  { id: "bmd-14", prompt: "Say your whole morning in four sentences, from waking up to leaving home.", answer: "sequenced present simple", distractors: ["challenge"], cefr: "A1" },
  { id: "bmd-15", prompt: "What is your favourite time of day? Why?", answer: "favourite + because", cefr: "A1" },
  { id: "bmd-16", prompt: "Describe a perfect day for you, from morning to night.", answer: "present simple + would like", cefr: "A1" },
];

// ---------- A1: My home ----------
export const BOARD_MY_HOME: GameItem[] = [
  { id: "bmh-1", prompt: "Do you live in a house or an apartment? Describe the building.", answer: "there is / there are + home vocabulary", cefr: "A1" },
  { id: "bmh-2", prompt: "How many rooms are there in your home? Name them.", answer: "there are + numbers + rooms", cefr: "A1" },
  { id: "bmh-3", prompt: "Describe your bedroom. What furniture is in it?", answer: "there is / there are + furniture", cefr: "A1" },
  { id: "bmh-4", prompt: "Describe everything on the walls of one room.", answer: "prepositions of place: on, next to, above", distractors: ["challenge"], cefr: "A1" },
  { id: "bmh-5", prompt: "Where is the kitchen in your home? What is next to it?", answer: "prepositions of place", cefr: "A1" },
  { id: "bmh-6", prompt: "What can you see from your window?", answer: "I can see + places", cefr: "A1" },
  { id: "bmh-7", prompt: "Who do you live with? Say one thing about each person.", answer: "live with + simple descriptions", cefr: "A1" },
  { id: "bmh-8", prompt: "Which is your favourite room? Why do you like it?", answer: "favourite + because", distractors: ["bonus"], cefr: "A1" },
  { id: "bmh-9", prompt: "Where do you usually eat at home? Describe that place.", answer: "prepositions of place + present simple", cefr: "A1" },
  { id: "bmh-10", prompt: "Is your home big or small? Say two good things about its size.", answer: "adjectives + but / and", cefr: "A1" },
  { id: "bmh-11", prompt: "What is near your home — shops, a park, a school? Describe the area.", answer: "there is / there are + near", cefr: "A1" },
  { id: "bmh-12", prompt: "Where do you keep your clothes, your books and your shoes?", answer: "prepositions of place: in, on, under", distractors: ["swap"], cefr: "A1" },
  { id: "bmh-13", prompt: "Do you have a garden or a balcony? What is there, or what would you put there?", answer: "there is / there are", cefr: "A1" },
  { id: "bmh-14", prompt: "Describe your home from the front door to your bedroom, like a tour.", answer: "directions inside a home: go straight, on the left", distractors: ["challenge"], cefr: "A1" },
  { id: "bmh-15", prompt: "What do you do in each room? Match three rooms to three activities.", answer: "present simple + room vocabulary", cefr: "A1" },
  { id: "bmh-16", prompt: "Describe your dream home in three sentences.", answer: "would like + home vocabulary", cefr: "A1" },
];

// ---------- A1: Food I know ----------
export const BOARD_FOOD: GameItem[] = [
  { id: "bfd-1", prompt: "Name three foods you eat every week and say when you eat them.", answer: "present simple + food vocabulary", cefr: "A1" },
  { id: "bfd-2", prompt: "What is your favourite food? Describe how it tastes.", answer: "favourite + taste adjectives: sweet, salty, spicy", cefr: "A1" },
  { id: "bfd-3", prompt: "What did you eat yesterday? Say your three meals.", answer: "past simple of eat / have", cefr: "A1" },
  { id: "bfd-4", prompt: "Explain how to make a simple dish you know, step by step.", answer: "sequencing: first, then, finally", distractors: ["challenge"], cefr: "A1" },
  { id: "bfd-5", prompt: "What food do you not like? Why not?", answer: "don't like + because", cefr: "A1" },
  { id: "bfd-6", prompt: "What fruit and vegetables are in your kitchen right now?", answer: "there is / there are + some / any", cefr: "A1" },
  { id: "bfd-7", prompt: "What do you usually drink during the day?", answer: "present simple + drinks", cefr: "A1" },
  { id: "bfd-8", prompt: "Describe a meal from your country that visitors should try.", answer: "food vocabulary + should", distractors: ["bonus"], cefr: "A1" },
  { id: "bfd-9", prompt: "Do you like cooking? Say one thing you can cook well.", answer: "can + cooking verbs", cefr: "A1" },
  { id: "bfd-10", prompt: "What snacks do you eat between meals?", answer: "present simple + snack vocabulary", cefr: "A1" },
  { id: "bfd-11", prompt: "You are in a restaurant. Order a drink, a main dish and a dessert.", answer: "I'd like / Can I have", cefr: "A1" },
  { id: "bfd-12", prompt: "What do you eat when you are in a hurry?", answer: "present simple + food vocabulary", distractors: ["swap"], cefr: "A1" },
  { id: "bfd-13", prompt: "Is the food you eat healthy? Give two examples.", answer: "healthy / unhealthy + because", cefr: "A1" },
  { id: "bfd-14", prompt: "Describe a special meal — a birthday, a holiday — that you remember.", answer: "past simple + food vocabulary", distractors: ["challenge"], cefr: "A1" },
  { id: "bfd-15", prompt: "What breakfast foods do you know in English? Say four and describe one.", answer: "food vocabulary + adjectives", cefr: "A1" },
  { id: "bfd-16", prompt: "Plan a dinner for three friends. What will you cook and why?", answer: "going to / will + food vocabulary", cefr: "A1" },
];

// ---------- A2: Last weekend (past simple) ----------
export const BOARD_LAST_WEEKEND: GameItem[] = [
  { id: "blw-1", prompt: "What time did you get up on Saturday? Was that earlier or later than usual?", answer: "past simple + comparatives", cefr: "A2" },
  { id: "blw-2", prompt: "What did you eat last weekend? Describe your best meal.", answer: "past simple of eat / have / cook", cefr: "A2" },
  { id: "blw-3", prompt: "Did you go anywhere? Describe the place.", answer: "past simple of go + place descriptions", cefr: "A2" },
  { id: "blw-4", prompt: "Tell the story of your Saturday morning in four sentences.", answer: "sequenced past simple", distractors: ["challenge"], cefr: "A2" },
  { id: "blw-5", prompt: "Who did you see or talk to at the weekend? What did you do together?", answer: "past simple + people", cefr: "A2" },
  { id: "blw-6", prompt: "What did you watch or listen to? Did you enjoy it?", answer: "past simple + opinion adjectives", cefr: "A2" },
  { id: "blw-7", prompt: "What jobs did you do at home — cleaning, washing, shopping?", answer: "past simple of household verbs", cefr: "A2" },
  { id: "blw-8", prompt: "What was the best moment of your weekend? Describe it.", answer: "past simple + superlative", distractors: ["bonus"], cefr: "A2" },
  { id: "blw-9", prompt: "Did anything boring happen? Describe it.", answer: "past simple negative + boring things", cefr: "A2" },
  { id: "blw-10", prompt: "What did you buy at the weekend, if anything? Where did you buy it?", answer: "past simple of buy + shops", cefr: "A2" },
  { id: "blw-11", prompt: "What was the weather like? What did you do because of it?", answer: "past simple of be + weather", cefr: "A2" },
  { id: "blw-12", prompt: "Did you do any exercise or sport? Describe it, or say what you did instead.", answer: "past simple + sport vocabulary", distractors: ["swap"], cefr: "A2" },
  { id: "blw-13", prompt: "What time did you go to bed on Sunday? Were you tired?", answer: "past simple of go / be", cefr: "A2" },
  { id: "blw-14", prompt: "Compare this weekend with a normal weekend. Say two differences.", answer: "past simple + comparative adjectives", distractors: ["challenge"], cefr: "A2" },
  { id: "blw-15", prompt: "What did you NOT do that you wanted to do? Why not?", answer: "past simple negative + because", cefr: "A2" },
  { id: "blw-16", prompt: "Tell me about next weekend. What are your plans?", answer: "going to for plans", cefr: "A2" },
];

// ---------- A2: People I know (descriptions) ----------
export const BOARD_PEOPLE: GameItem[] = [
  { id: "bpk-1", prompt: "Describe your best friend: what do they look like and what are they like?", answer: "appearance + personality adjectives", cefr: "A2" },
  { id: "bpk-2", prompt: "Describe someone in your family who makes you laugh.", answer: "personality adjectives + present simple", cefr: "A2" },
  { id: "bpk-3", prompt: "Who is the oldest person you know well? Describe them.", answer: "appearance + age vocabulary", cefr: "A2" },
  { id: "bpk-4", prompt: "Describe a person you know without saying their name. Let the group guess.", answer: "appearance + personality + has got", distractors: ["challenge"], cefr: "A2" },
  { id: "bpk-5", prompt: "Who do you talk to when you have a problem? Why them?", answer: "personality adjectives + because", cefr: "A2" },
  { id: "bpk-6", prompt: "Describe a neighbour or someone who lives near you.", answer: "appearance + present simple habits", cefr: "A2" },
  { id: "bpk-7", prompt: "Who is the most hard-working person you know? What do they do?", answer: "personality adjectives + jobs", cefr: "A2" },
  { id: "bpk-8", prompt: "Describe a teacher or classmate you remember well.", answer: "past descriptions + personality", distractors: ["bonus"], cefr: "A2" },
  { id: "bpk-9", prompt: "What does your closest friend like doing in their free time?", answer: "likes + -ing, third person", cefr: "A2" },
  { id: "bpk-10", prompt: "Are you similar to anyone in your family? In what ways?", answer: "both of us / we both + adjectives", cefr: "A2" },
  { id: "bpk-11", prompt: "Describe someone you know who dresses very well.", answer: "clothes vocabulary + present simple", cefr: "A2" },
  { id: "bpk-12", prompt: "Who is the funniest person you know? Tell me about something funny they did.", answer: "personality + short past anecdote", distractors: ["swap"], cefr: "A2" },
  { id: "bpk-13", prompt: "Describe a child you know. How are they different from adults?", answer: "comparatives + personality", cefr: "A2" },
  { id: "bpk-14", prompt: "Compare two people you know: height, age and personality.", answer: "comparative adjectives", distractors: ["challenge"], cefr: "A2" },
  { id: "bpk-15", prompt: "Who do you admire? Give two reasons.", answer: "admire + because / so", cefr: "A2" },
  { id: "bpk-16", prompt: "Describe yourself in three sentences: one about looks, one about personality, one about habits.", answer: "self-description across three areas", cefr: "A2" },
];

// ---------- B1: A time something went wrong (narrative tenses) ----------
export const BOARD_WENT_WRONG: GameItem[] = [
  { id: "bww-1", prompt: "Tell me about a time you were very late for something. What happened?", answer: "past simple sequence + because", cefr: "B1" },
  { id: "bww-2", prompt: "Describe a time you lost something important. Did you find it?", answer: "past simple + past continuous", cefr: "B1" },
  { id: "bww-3", prompt: "Tell me about a meal or a recipe that went badly wrong.", answer: "narrative tenses + cooking vocabulary", cefr: "B1" },
  { id: "bww-4", prompt: "Set the scene first — where were you, what were you doing — then tell me what suddenly happened.", answer: "past continuous interrupted by past simple", distractors: ["challenge"], cefr: "B1" },
  { id: "bww-5", prompt: "Tell me about a time technology failed you at the worst moment.", answer: "past simple + technology vocabulary", cefr: "B1" },
  { id: "bww-6", prompt: "Describe a misunderstanding you had with someone. How did it end?", answer: "reported speech basics + narrative tenses", cefr: "B1" },
  { id: "bww-7", prompt: "Tell me about a time the weather ruined your plans.", answer: "past simple + weather vocabulary", cefr: "B1" },
  { id: "bww-8", prompt: "Describe a small accident you had — a fall, a cut, a spill. What happened next?", answer: "narrative tenses + body vocabulary", distractors: ["bonus"], cefr: "B1" },
  { id: "bww-9", prompt: "Tell me about a time you forgot something important.", answer: "past simple + had forgotten", cefr: "B1" },
  { id: "bww-10", prompt: "Describe a journey that went wrong — a delay, a wrong turn, a missed bus.", answer: "narrative tenses + travel vocabulary", cefr: "B1" },
  { id: "bww-11", prompt: "Tell me about a time you said the wrong thing. How did people react?", answer: "narrative tenses + feelings", cefr: "B1" },
  { id: "bww-12", prompt: "Describe a time something broke at home. How did you fix it, or who fixed it?", answer: "past simple + household vocabulary", distractors: ["swap"], cefr: "B1" },
  { id: "bww-13", prompt: "Tell me about a time you helped someone who had a problem.", answer: "past simple + offering help language", cefr: "B1" },
  { id: "bww-14", prompt: "Tell a complete story in six sentences: the situation, the problem and the ending.", answer: "full narrative arc with linking words", distractors: ["challenge"], cefr: "B1" },
  { id: "bww-15", prompt: "Tell me about a time you were embarrassed. How did you feel afterwards?", answer: "narrative tenses + emotion adjectives", cefr: "B1" },
  { id: "bww-16", prompt: "What did you learn from a mistake you once made?", answer: "past simple + should have", cefr: "B1" },
];

// ---------- B1: Plans and hopes ----------
export const BOARD_PLANS_HOPES: GameItem[] = [
  { id: "bph-1", prompt: "What are your plans for this weekend? Give me two or three details.", answer: "going to + present continuous for arrangements", cefr: "B1" },
  { id: "bph-2", prompt: "What skill would you like to learn? How would you start?", answer: "would like to + infinitive", cefr: "B1" },
  { id: "bph-3", prompt: "Where do you see yourself in five years? Describe your life then.", answer: "will / hope to for predictions", cefr: "B1" },
  { id: "bph-4", prompt: "Plan a perfect day off in detail, from morning to night, and tell me about it.", answer: "going to + sequencing", distractors: ["challenge"], cefr: "B1" },
  { id: "bph-5", prompt: "Is there a place in your own country you want to visit? Describe it.", answer: "want to + place descriptions", cefr: "B1" },
  { id: "bph-6", prompt: "What job would you love to do for one week? Why that job?", answer: "would love to + because", cefr: "B1" },
  { id: "bph-7", prompt: "What are you saving your energy or money for at the moment?", answer: "present continuous for current projects", cefr: "B1" },
  { id: "bph-8", prompt: "Tell me about something you plan to do this year that excites you.", answer: "going to / planning to", distractors: ["bonus"], cefr: "B1" },
  { id: "bph-9", prompt: "What habit would you like to start or stop? How will you do it?", answer: "would like to + plan of action", cefr: "B1" },
  { id: "bph-10", prompt: "If you could change one thing about your daily routine, what would it be?", answer: "second conditional basics", cefr: "B1" },
  { id: "bph-11", prompt: "What will English let you do that you cannot do now?", answer: "will be able to + infinitive", cefr: "B1" },
  { id: "bph-12", prompt: "Describe something you owned or did as a child that you hope to have or do again.", answer: "hope to + past references", distractors: ["swap"], cefr: "B1" },
  { id: "bph-13", prompt: "What are you worried about in the future, and how will you deal with it?", answer: "worried about + going to", cefr: "B1" },
  { id: "bph-14", prompt: "Imagine your ideal birthday next year. Who is there and what happens?", answer: "future forms + descriptive detail", distractors: ["challenge"], cefr: "B1" },
  { id: "bph-15", prompt: "What is one thing you have never done but really want to try?", answer: "present perfect + want to", cefr: "B1" },
  { id: "bph-16", prompt: "Describe your life ten years from now in three confident predictions.", answer: "will + will probably for predictions", cefr: "B1" },
];

// ---------- B2: Opinions and disagreement (hedging, softening) ----------
export const BOARD_OPINIONS: GameItem[] = [
  { id: "bod-1", prompt: "Some people say mornings are the best part of the day. Do you agree? Soften your answer.", answer: "hedging: I tend to think / to some extent", cefr: "B2" },
  { id: "bod-2", prompt: "Is it better to live in a city or in the countryside? Argue the side you do NOT believe.", answer: "concession: admittedly, having said that", cefr: "B2" },
  { id: "bod-3", prompt: "Should schools teach cooking to every student? Give a balanced view.", answer: "on the one hand / on the other hand", cefr: "B2" },
  { id: "bod-4", prompt: "Disagree with me politely: 'Everyone should learn to drive.'", answer: "softened disagreement: I see your point, but", distractors: ["challenge"], cefr: "B2" },
  { id: "bod-5", prompt: "Are people today too dependent on their phones? Avoid sounding extreme.", answer: "hedging: to a certain degree, arguably", cefr: "B2" },
  { id: "bod-6", prompt: "Is it rude to arrive exactly on time for dinner at someone's home? Discuss.", answer: "speculation + hedging: it depends, I'd say", cefr: "B2" },
  { id: "bod-7", prompt: "Which is a better way to learn a language: classes or living abroad? Weigh both.", answer: "comparing viewpoints + concession", cefr: "B2" },
  { id: "bod-8", prompt: "Respond politely to: 'Watching films is a waste of time compared to reading.'", answer: "softened disagreement + example", distractors: ["bonus"], cefr: "B2" },
  { id: "bod-9", prompt: "Should children have homework every day? Give a nuanced opinion.", answer: "nuance: up to a point, broadly speaking", cefr: "B2" },
  { id: "bod-10", prompt: "Is it ever acceptable to tell a lie? Explore the grey area.", answer: "speculation: I suppose, it could be argued", cefr: "B2" },
  { id: "bod-11", prompt: "Some people never watch the news. Is that sensible or irresponsible?", answer: "balanced opinion + hedging", cefr: "B2" },
  { id: "bod-12", prompt: "Disagree gently: 'Cooking at home is always better than eating out.'", answer: "softening: I'm not sure I'd go that far", distractors: ["swap"], cefr: "B2" },
  { id: "bod-13", prompt: "Do first impressions matter more than we admit? Give an example.", answer: "opinion + supporting anecdote", cefr: "B2" },
  { id: "bod-14", prompt: "Take a strong opinion you hold, then argue against your own view for two sentences.", answer: "concession and counter-argument", distractors: ["challenge"], cefr: "B2" },
  { id: "bod-15", prompt: "Is it better to plan everything or be spontaneous? Sit on the fence, then commit.", answer: "hedging then committing: on balance", cefr: "B2" },
  { id: "bod-16", prompt: "Give me an unpopular opinion you hold, defended politely for three sentences.", answer: "defending a position with softeners", cefr: "B2" },
];

// ---------- combined ----------
export const ALL_BOARD_TRACKS: GameItem[] = [
  ...BOARD_MY_DAY,
  ...BOARD_MY_HOME,
  ...BOARD_FOOD,
  ...BOARD_LAST_WEEKEND,
  ...BOARD_PEOPLE,
  ...BOARD_WENT_WRONG,
  ...BOARD_PLANS_HOPES,
  ...BOARD_OPINIONS,
];
