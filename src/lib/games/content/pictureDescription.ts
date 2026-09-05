// Picture description content bank — read by PictureDescriptionGame.
// items[0] = THE PICTURE: prompt = scene name, imageUrl = "" (tutor points it
// at a library image), targetStructure = the activity focus. Every later item
// = ONE CHECKLIST ROW the tutor ticks live; prompt/answer/targetStructure are
// the same shorthand label, exampleSentence = a scene-specific model sentence
// the tutor can read aloud if the student stalls. Rows run easiest → hardest;
// B1+ scenes always include at least one speculation row.
import type { GameItem } from "@/lib/game-contract";

export const PIC_FAMILY_MEAL: GameItem[] = [
  { id: "pd-fam-0", prompt: "A family meal", answer: "A family meal", imageUrl: "", targetStructure: "describing people, food and actions at a family dinner", cefr: "A2" },
  { id: "pd-fam-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There are five people sitting around the table.", cefr: "A2" },
  { id: "pd-fam-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "The mother is serving soup from a big pot.", cefr: "A2" },
  { id: "pd-fam-3", prompt: "food vocabulary", answer: "food vocabulary", targetStructure: "food vocabulary", exampleSentence: "I can see a roast chicken, some potatoes and a bowl of salad.", cefr: "A2" },
  { id: "pd-fam-4", prompt: "prepositions of place", answer: "prepositions of place", targetStructure: "prepositions of place", exampleSentence: "The youngest child is sitting between her father and her grandmother.", cefr: "A2" },
  { id: "pd-fam-5", prompt: "clothes and appearance", answer: "clothes and appearance", targetStructure: "clothes and appearance", exampleSentence: "The grandfather is wearing a grey jumper and glasses.", cefr: "A2" },
  { id: "pd-fam-6", prompt: "feelings with look / seem", answer: "feelings with look / seem", targetStructure: "feelings with look / seem", exampleSentence: "Everyone looks happy because they are laughing and smiling.", cefr: "A2" },
  { id: "pd-fam-7", prompt: "in the background / foreground", answer: "in the background / foreground", targetStructure: "in the background / foreground", exampleSentence: "In the background, there is a dog waiting for food under the table.", cefr: "A2" },
];

export const PIC_BUSY_STREET: GameItem[] = [
  { id: "pd-str-0", prompt: "A busy street", answer: "A busy street", imageUrl: "", targetStructure: "describing movement and city life on a crowded shopping street", cefr: "A2" },
  { id: "pd-str-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There are lots of shoppers on the pavement and a red bus in the road.", cefr: "A2" },
  { id: "pd-str-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "A man is crossing the road and carrying two heavy bags.", cefr: "A2" },
  { id: "pd-str-3", prompt: "transport vocabulary", answer: "transport vocabulary", targetStructure: "transport vocabulary", exampleSentence: "I can see a bus, a taxi, and a cyclist waiting at the traffic lights.", cefr: "A2" },
  { id: "pd-str-4", prompt: "prepositions of place", answer: "prepositions of place", targetStructure: "prepositions of place", exampleSentence: "A café is on the corner, next to a small bookshop.", cefr: "A2" },
  { id: "pd-str-5", prompt: "quantifiers", answer: "quantifiers", targetStructure: "quantifiers", exampleSentence: "A few people are queuing outside the bakery, but there aren't many cars.", cefr: "A2" },
  { id: "pd-str-6", prompt: "weather and atmosphere", answer: "weather and atmosphere", targetStructure: "weather and atmosphere", exampleSentence: "It looks like a grey day because some people are carrying umbrellas.", cefr: "A2" },
  { id: "pd-str-7", prompt: "comparing two people or things", answer: "comparing two people or things", targetStructure: "comparatives", exampleSentence: "The woman in the red coat is walking faster than the man beside her.", cefr: "A2" },
];

export const PIC_PARK_SUMMER: GameItem[] = [
  { id: "pd-park-0", prompt: "A park in summer", answer: "A park in summer", imageUrl: "", targetStructure: "describing leisure activities and nature in a sunny park", cefr: "A2" },
  { id: "pd-park-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There is a lake in the middle of the park with ducks on it.", cefr: "A2" },
  { id: "pd-park-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "Some children are flying a kite on the grass.", cefr: "A2" },
  { id: "pd-park-3", prompt: "nature vocabulary", answer: "nature vocabulary", targetStructure: "nature vocabulary", exampleSentence: "There are tall trees, colourful flowers and a path beside the lake.", cefr: "A2" },
  { id: "pd-park-4", prompt: "prepositions of place", answer: "prepositions of place", targetStructure: "prepositions of place", exampleSentence: "A family is having a picnic under a big oak tree.", cefr: "A2" },
  { id: "pd-park-5", prompt: "weather expressions", answer: "weather expressions", targetStructure: "weather expressions", exampleSentence: "It's a lovely sunny day and there aren't any clouds in the sky.", cefr: "A2" },
  { id: "pd-park-6", prompt: "present continuous vs present simple", answer: "present continuous vs present simple", targetStructure: "present continuous vs present simple", exampleSentence: "The man on the bench reads the paper every day, but today he is feeding the ducks.", cefr: "A2" },
  { id: "pd-park-7", prompt: "in the foreground / on the left / on the right", answer: "in the foreground / on the left / on the right", targetStructure: "position language", exampleSentence: "On the right, an ice-cream van is parked near the gate.", cefr: "A2" },
];

export const PIC_MARKET: GameItem[] = [
  { id: "pd-mkt-0", prompt: "A market", answer: "A market", imageUrl: "", targetStructure: "describing an open-air market, buying and selling, and atmosphere", cefr: "B1" },
  { id: "pd-mkt-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There are stalls selling fruit, cheese and fresh bread.", cefr: "B1" },
  { id: "pd-mkt-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "A stallholder is weighing some tomatoes for a customer.", cefr: "B1" },
  { id: "pd-mkt-3", prompt: "containers and quantities", answer: "containers and quantities", targetStructure: "containers and quantities", exampleSentence: "There's a bunch of bananas, a jar of honey and a loaf of bread on one stall.", cefr: "B1" },
  { id: "pd-mkt-4", prompt: "prepositions of place", answer: "prepositions of place", targetStructure: "prepositions of place", exampleSentence: "A woman with a shopping trolley is standing in front of the flower stall.", cefr: "B1" },
  { id: "pd-mkt-5", prompt: "adjectives for atmosphere", answer: "adjectives for atmosphere", targetStructure: "adjectives for atmosphere", exampleSentence: "The market looks lively and crowded, with colourful striped awnings.", cefr: "B1" },
  { id: "pd-mkt-6", prompt: "it looks like / it might be (speculation)", answer: "it looks like / it might be (speculation)", targetStructure: "speculation", exampleSentence: "It might be early morning, because the traders are still arranging their produce.", cefr: "B1" },
  { id: "pd-mkt-7", prompt: "past simple for what just happened", answer: "past simple for what just happened", targetStructure: "past simple", exampleSentence: "It looks as if someone has just dropped an orange, because there's one rolling on the ground.", cefr: "B1" },
];

export const PIC_OFFICE: GameItem[] = [
  { id: "pd-off-0", prompt: "An office", answer: "An office", imageUrl: "", targetStructure: "describing work, roles and relationships in an open-plan office", cefr: "B1" },
  { id: "pd-off-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There are six desks with computers, and a whiteboard on the wall.", cefr: "B1" },
  { id: "pd-off-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "Two colleagues are having a meeting next to the photocopier.", cefr: "B1" },
  { id: "pd-off-3", prompt: "work vocabulary", answer: "work vocabulary", targetStructure: "work vocabulary", exampleSentence: "One woman is typing a report while her colleague is on the phone.", cefr: "B1" },
  { id: "pd-off-4", prompt: "prepositions of place", answer: "prepositions of place", targetStructure: "prepositions of place", exampleSentence: "A pile of folders is on the desk behind the man with the headset.", cefr: "B1" },
  { id: "pd-off-5", prompt: "obligation: have to / must", answer: "obligation: have to / must", targetStructure: "obligation", exampleSentence: "The workers have to finish the project today, so nobody looks relaxed.", cefr: "B1" },
  { id: "pd-off-6", prompt: "speculation: perhaps / I suppose / maybe", answer: "speculation: perhaps / I suppose / maybe", targetStructure: "speculation", exampleSentence: "Perhaps the man in the suit is the manager, because he's giving instructions to the others.", cefr: "B1" },
  { id: "pd-off-7", prompt: "look as if + clause", answer: "look as if + clause", targetStructure: "look as if", exampleSentence: "The woman at the printer looks as if she's been waiting a long time.", cefr: "B1" },
];

export const PIC_TRAIN_STATION: GameItem[] = [
  { id: "pd-tra-0", prompt: "A train station", answer: "A train station", imageUrl: "", targetStructure: "describing travel, movement and time pressure on a busy platform", cefr: "B1" },
  { id: "pd-tra-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There's a departures board above the platform and a train on the left.", cefr: "B1" },
  { id: "pd-tra-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "A guard is blowing his whistle and passengers are hurrying to get on.", cefr: "B1" },
  { id: "pd-tra-3", prompt: "travel vocabulary", answer: "travel vocabulary", targetStructure: "travel vocabulary", exampleSentence: "I can see suitcases, a ticket machine and a rucksack on the bench.", cefr: "B1" },
  { id: "pd-tra-4", prompt: "time expressions", answer: "time expressions", targetStructure: "time expressions", exampleSentence: "The clock says it's nearly half past eight, so it's probably the morning rush hour.", cefr: "B1" },
  { id: "pd-tra-5", prompt: "future arrangements (present continuous)", answer: "future arrangements (present continuous)", targetStructure: "future arrangements", exampleSentence: "The couple by the barrier are meeting someone — they're looking at every new arrival.", cefr: "B1" },
  { id: "pd-tra-6", prompt: "speculation: might / could / must be", answer: "speculation: might / could / must be", targetStructure: "speculation", exampleSentence: "The man running with a suitcase must be late for his train.", cefr: "B1" },
  { id: "pd-tra-7", prompt: "looks as if / seems to", answer: "looks as if / seems to", targetStructure: "look as if", exampleSentence: "It looks as if the train is about to leave, because the doors are closing.", cefr: "B1" },
];

export const PIC_PROTEST: GameItem[] = [
  { id: "pd-pro-0", prompt: "A protest or public gathering", answer: "A protest or public gathering", imageUrl: "", targetStructure: "describing a demonstration, crowd behaviour and public mood", cefr: "B2" },
  { id: "pd-pro-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There are hundreds of demonstrators carrying banners outside the town hall.", cefr: "B2" },
  { id: "pd-pro-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "The crowd is marching down the main street, chanting slogans.", cefr: "B2" },
  { id: "pd-pro-3", prompt: "protest vocabulary", answer: "protest vocabulary", targetStructure: "protest vocabulary", exampleSentence: "Some people are holding placards, and one woman is speaking through a megaphone.", cefr: "B2" },
  { id: "pd-pro-4", prompt: "passives", answer: "passives", targetStructure: "passives", exampleSentence: "The road has been closed and traffic is being redirected by the police.", cefr: "B2" },
  { id: "pd-pro-5", prompt: "speculation: it might be / I imagine", answer: "speculation: it might be / I imagine", targetStructure: "speculation", exampleSentence: "It might be a demonstration about the environment, judging by the slogans on the banners.", cefr: "B2" },
  { id: "pd-pro-6", prompt: "looks as if / as though", answer: "looks as if / as though", targetStructure: "look as if", exampleSentence: "It looks as though the march has been going on for hours, because some people look exhausted.", cefr: "B2" },
  { id: "pd-pro-7", prompt: "hedged opinion: I'd say / it seems to me", answer: "hedged opinion: I'd say / it seems to me", targetStructure: "hedged opinion", exampleSentence: "It seems to me the atmosphere is peaceful rather than angry, since families are there too.", cefr: "B2" },
];

export const PIC_CONSTRUCTION: GameItem[] = [
  { id: "pd-con-0", prompt: "A construction site", answer: "A construction site", imageUrl: "", targetStructure: "describing machinery, jobs and safety on a building site", cefr: "B2" },
  { id: "pd-con-1", prompt: "there is / there are", answer: "there is / there are", targetStructure: "there is / there are", exampleSentence: "There's a huge crane in the centre and scaffolding all around the building.", cefr: "B2" },
  { id: "pd-con-2", prompt: "present continuous", answer: "present continuous", targetStructure: "present continuous", exampleSentence: "A worker in a yellow helmet is guiding a steel beam into place.", cefr: "B2" },
  { id: "pd-con-3", prompt: "site vocabulary", answer: "site vocabulary", targetStructure: "site vocabulary", exampleSentence: "I can see a digger, a cement mixer and piles of bricks by the fence.", cefr: "B2" },
  { id: "pd-con-4", prompt: "present perfect continuous", answer: "present perfect continuous", targetStructure: "present perfect continuous", exampleSentence: "They've been working on this building for months, and it's still not finished.", cefr: "B2" },
  { id: "pd-con-5", prompt: "safety obligation: must / have to", answer: "safety obligation: must / have to", targetStructure: "obligation", exampleSentence: "Everyone on the site has to wear a hard hat and a high-visibility jacket.", cefr: "B2" },
  { id: "pd-con-6", prompt: "speculation: must / can't be", answer: "speculation: must / can't be", targetStructure: "speculation", exampleSentence: "It must be early in the project, because only the first few floors have been built.", cefr: "B2" },
  { id: "pd-con-7", prompt: "looks as if / appears to", answer: "looks as if / appears to", targetStructure: "look as if", exampleSentence: "The man with the plans appears to be the site manager, as the others are listening to him.", cefr: "B2" },
];

export const ALL_PICTURE_DESCRIPTION: GameItem[] = [
  ...PIC_FAMILY_MEAL,
  ...PIC_BUSY_STREET,
  ...PIC_PARK_SUMMER,
  ...PIC_MARKET,
  ...PIC_OFFICE,
  ...PIC_TRAIN_STATION,
  ...PIC_PROTEST,
  ...PIC_CONSTRUCTION,
];
