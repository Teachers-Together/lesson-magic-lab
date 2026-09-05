/*
  Minimal pairs bank — read by MinimalPairsGame.
  prompt = first word, answer = second word.
  targetStructure = the phoneme contrast (identical string per contrast — the
  end-of-round summary groups by it).
  cefr = level of the harder word in the pair.
  exampleSentence uses the FIRST word, so the tutor can put it in context
  after the drill.
*/
import type { GameItem } from "@/lib/game-contract";

export const VOWELS_I: GameItem[] = [
  { id: "vpi-1", prompt: "ship", answer: "sheep", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "The ship is big and white." },
  { id: "vpi-2", prompt: "bit", answer: "beat", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "Can I have a bit of cake?" },
  { id: "vpi-3", prompt: "live", answer: "leave", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "I live near the school." },
  { id: "vpi-4", prompt: "hit", answer: "heat", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "Do not hit the ball with your hand." },
  { id: "vpi-5", prompt: "sit", answer: "seat", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "Please sit on the chair." },
  { id: "vpi-6", prompt: "fill", answer: "feel", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "Fill the glass with water." },
  { id: "vpi-7", prompt: "slip", answer: "sleep", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "Be careful you do not slip on the ice." },
  { id: "vpi-8", prompt: "chip", answer: "cheap", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "I ate one potato chip." },
  { id: "vpi-9", prompt: "mill", answer: "meal", targetStructure: "/ɪ/ vs /i/", cefr: "A2", exampleSentence: "The old mill makes flour." },
  { id: "vpi-10", prompt: "it", answer: "eat", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "It is on the table." },
  { id: "vpi-11", prompt: "list", answer: "least", targetStructure: "/ɪ/ vs /i/", cefr: "A2", exampleSentence: "Write a list of ten words." },
  { id: "vpi-12", prompt: "will", answer: "wheel", targetStructure: "/ɪ/ vs /i/", cefr: "A1", exampleSentence: "I will come to your house tomorrow." },
];

export const VOWELS_A: GameItem[] = [
  { id: "vpa-1", prompt: "cat", answer: "cut", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "The cat is sleeping on the sofa." },
  { id: "vpa-2", prompt: "bag", answer: "bug", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "My bag is heavy today." },
  { id: "vpa-3", prompt: "ran", answer: "run", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "She ran to the bus stop." },
  { id: "vpa-4", prompt: "bat", answer: "but", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "He hit the ball with the bat." },
  { id: "vpa-5", prompt: "cap", answer: "cup", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "The boy is wearing a red cap." },
  { id: "vpa-6", prompt: "fan", answer: "fun", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "Turn on the fan, it is hot." },
  { id: "vpa-7", prompt: "hat", answer: "hut", targetStructure: "/æ/ vs /ʌ/", cefr: "A2", exampleSentence: "She put on her hat and went out." },
  { id: "vpa-8", prompt: "sang", answer: "sung", targetStructure: "/æ/ vs /ʌ/", cefr: "A2", exampleSentence: "We sang a song in class." },
  { id: "vpa-9", prompt: "track", answer: "truck", targetStructure: "/æ/ vs /ʌ/", cefr: "A2", exampleSentence: "They ran around the track." },
  { id: "vpa-10", prompt: "match", answer: "much", targetStructure: "/æ/ vs /ʌ/", cefr: "A1", exampleSentence: "We watched the soccer game." },
  { id: "vpa-11", prompt: "bad", answer: "bud", targetStructure: "/æ/ vs /ʌ/", cefr: "B1", exampleSentence: "The weather is very bad today." },
  { id: "vpa-12", prompt: "ankle", answer: "uncle", targetStructure: "/æ/ vs /ʌ/", cefr: "A2", exampleSentence: "I hurt my ankle playing soccer." },
];

export const VOWELS_O: GameItem[] = [
  { id: "vpo-1", prompt: "not", answer: "note", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A1", exampleSentence: "I am not tired." },
  { id: "vpo-2", prompt: "cost", answer: "coast", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A2", exampleSentence: "How much did the ticket cost?" },
  { id: "vpo-3", prompt: "cot", answer: "coat", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A2", exampleSentence: "The baby is asleep in the cot." },
  { id: "vpo-4", prompt: "rod", answer: "road", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A2", exampleSentence: "He caught a fish with his rod." },
  { id: "vpo-5", prompt: "sock", answer: "soak", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A2", exampleSentence: "One sock is under the bed." },
  { id: "vpo-6", prompt: "got", answer: "goat", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A1", exampleSentence: "I got a new pen for my birthday." },
  { id: "vpo-7", prompt: "hop", answer: "hope", targetStructure: "/ɑ/ vs /oʊ/", cefr: "B1", exampleSentence: "The rabbit can hop very fast." },
  { id: "vpo-8", prompt: "rob", answer: "robe", targetStructure: "/ɑ/ vs /oʊ/", cefr: "B1", exampleSentence: "They tried to rob the shop." },
  { id: "vpo-9", prompt: "cod", answer: "code", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A2", exampleSentence: "We had cod for dinner." },
  { id: "vpo-10", prompt: "on", answer: "own", targetStructure: "/ɑ/ vs /oʊ/", cefr: "A1", exampleSentence: "The book is on the desk." },
  { id: "vpo-11", prompt: "clock", answer: "cloak", targetStructure: "/ɑ/ vs /oʊ/", cefr: "B1", exampleSentence: "The clock on the wall is slow." },
  { id: "vpo-12", prompt: "mop", answer: "mope", targetStructure: "/ɑ/ vs /oʊ/", cefr: "B1", exampleSentence: "Use the mop to clean the floor." },
];

export const TH_T: GameItem[] = [
  { id: "tht-1", prompt: "thin", answer: "tin", targetStructure: "/θ/ vs /t/", cefr: "A1", exampleSentence: "The book is very thin." },
  { id: "tht-2", prompt: "three", answer: "tree", targetStructure: "/θ/ vs /t/", cefr: "A1", exampleSentence: "I have three brothers." },
  { id: "tht-3", prompt: "thank", answer: "tank", targetStructure: "/θ/ vs /t/", cefr: "A1", exampleSentence: "Thank you for your help." },
  { id: "tht-4", prompt: "thick", answer: "tick", targetStructure: "/θ/ vs /t/", cefr: "A2", exampleSentence: "The wall is very thick." },
  { id: "tht-5", prompt: "theme", answer: "team", targetStructure: "/θ/ vs /t/", cefr: "A2", exampleSentence: "The theme of the story is friendship." },
  { id: "tht-6", prompt: "thigh", answer: "tie", targetStructure: "/θ/ vs /t/", cefr: "A2", exampleSentence: "He hurt his thigh while running." },
  { id: "tht-7", prompt: "thorn", answer: "torn", targetStructure: "/θ/ vs /t/", cefr: "B1", exampleSentence: "A thorn from the rose cut my finger." },
  { id: "tht-8", prompt: "thread", answer: "tread", targetStructure: "/θ/ vs /t/", cefr: "B1", exampleSentence: "She put the thread through the needle." },
  { id: "tht-9", prompt: "bath", answer: "bat", targetStructure: "/θ/ vs /t/", cefr: "A1", exampleSentence: "I take a bath every evening." },
  { id: "tht-10", prompt: "path", answer: "part", targetStructure: "/θ/ vs /t/", cefr: "A2", exampleSentence: "A small path goes through the woods." },
  { id: "tht-11", prompt: "math", answer: "mat", targetStructure: "/θ/ vs /t/", cefr: "A1", exampleSentence: "We have math before lunch." },
  { id: "tht-12", prompt: "cloth", answer: "clot", targetStructure: "/θ/ vs /t/", cefr: "B1", exampleSentence: "Wipe the table with a cloth." },
];

export const TH_S: GameItem[] = [
  { id: "ths-1", prompt: "think", answer: "sink", targetStructure: "/θ/ vs /s/", cefr: "A1", exampleSentence: "I think the answer is right." },
  { id: "ths-2", prompt: "thick", answer: "sick", targetStructure: "/θ/ vs /s/", cefr: "A1", exampleSentence: "This soup is nice and thick." },
  { id: "ths-3", prompt: "thumb", answer: "sum", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "The baby is sucking his thumb." },
  { id: "ths-4", prompt: "thank", answer: "sank", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "Thank the teacher for the lesson." },
  { id: "ths-5", prompt: "theme", answer: "seem", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "The theme of the film is family." },
  { id: "ths-6", prompt: "thigh", answer: "sigh", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "The ball hit him on the thigh." },
  { id: "ths-7", prompt: "thing", answer: "sing", targetStructure: "/θ/ vs /s/", cefr: "A1", exampleSentence: "What is that thing on the table?" },
  { id: "ths-8", prompt: "path", answer: "pass", targetStructure: "/θ/ vs /s/", cefr: "A1", exampleSentence: "The path goes up the hill." },
  { id: "ths-9", prompt: "mouth", answer: "mouse", targetStructure: "/θ/ vs /s/", cefr: "A1", exampleSentence: "Open your mouth and say ah." },
  { id: "ths-10", prompt: "myth", answer: "miss", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "The old story is just a myth." },
  { id: "ths-11", prompt: "faith", answer: "face", targetStructure: "/θ/ vs /s/", cefr: "B1", exampleSentence: "I have faith in my team." },
  { id: "ths-12", prompt: "worth", answer: "worse", targetStructure: "/θ/ vs /s/", cefr: "A2", exampleSentence: "How much is this old coin worth?" },
];

export const TH_D: GameItem[] = [
  { id: "thd-1", prompt: "they", answer: "day", targetStructure: "/ð/ vs /d/", cefr: "A1", exampleSentence: "They are my friends." },
  { id: "thd-2", prompt: "breathe", answer: "breed", targetStructure: "/ð/ vs /d/", cefr: "A2", exampleSentence: "Open the window and breathe slowly." },
  { id: "thd-3", prompt: "though", answer: "dough", targetStructure: "/ð/ vs /d/", cefr: "A2", exampleSentence: "It was hard, though we finished." },
  { id: "thd-4", prompt: "then", answer: "den", targetStructure: "/ð/ vs /d/", cefr: "A1", exampleSentence: "We had dinner and then went home." },
  { id: "thd-5", prompt: "their", answer: "dare", targetStructure: "/ð/ vs /d/", cefr: "A2", exampleSentence: "The children left their bags here." },
];

export const L_R: GameItem[] = [
  { id: "lr-1", prompt: "light", answer: "right", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "Turn on the light, please." },
  { id: "lr-2", prompt: "collect", answer: "correct", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "Collect the books after class." },
  { id: "lr-3", prompt: "long", answer: "wrong", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "The film was very long." },
  { id: "lr-4", prompt: "fly", answer: "fry", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "Birds fly south in winter." },
  { id: "lr-5", prompt: "glass", answer: "grass", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "The glass is full of milk." },
  { id: "lr-6", prompt: "lock", answer: "rock", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "Lock the door when you leave." },
  { id: "lr-7", prompt: "lip", answer: "rip", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "She put cream on her lip." },
  { id: "lr-8", prompt: "led", answer: "red", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "He led the team onto the field." },
  { id: "lr-9", prompt: "late", answer: "rate", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "Do not be late for school." },
  { id: "lr-10", prompt: "load", answer: "road", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "Load the boxes onto the truck." },
  { id: "lr-11", prompt: "clown", answer: "crown", targetStructure: "/l/ vs /r/", cefr: "A2", exampleSentence: "The clown made the children laugh." },
  { id: "lr-12", prompt: "play", answer: "pray", targetStructure: "/l/ vs /r/", cefr: "A1", exampleSentence: "The children play in the park." },
];

export const B_V: GameItem[] = [
  { id: "bv-1", prompt: "berry", answer: "very", targetStructure: "/b/ vs /v/", cefr: "A1", exampleSentence: "This berry is sweet." },
  { id: "bv-2", prompt: "boat", answer: "vote", targetStructure: "/b/ vs /v/", cefr: "A2", exampleSentence: "The boat is on the river." },
  { id: "bv-3", prompt: "best", answer: "vest", targetStructure: "/b/ vs /v/", cefr: "A1", exampleSentence: "This is the best game." },
  { id: "bv-4", prompt: "bet", answer: "vet", targetStructure: "/b/ vs /v/", cefr: "A2", exampleSentence: "I bet it will rain later." },
  { id: "bv-5", prompt: "ban", answer: "van", targetStructure: "/b/ vs /v/", cefr: "A2", exampleSentence: "They ban phones in the movie theater." },
  { id: "bv-13", prompt: "base", answer: "vase", targetStructure: "/b/ vs /v/", cefr: "A2", exampleSentence: "The base of the lamp is heavy." },
];

export const FINAL_T_D: GameItem[] = [
  { id: "ftd-1", prompt: "bat", answer: "bad", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "The bat is next to the ball." },
  { id: "ftd-2", prompt: "sent", answer: "send", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "She sent me a message." },
  { id: "ftd-3", prompt: "hat", answer: "had", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "My hat is blue." },
  { id: "ftd-4", prompt: "sat", answer: "sad", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "He sat by the window." },
  { id: "ftd-5", prompt: "bet", answer: "bed", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "I bet you are tired after the game." },
  { id: "ftd-6", prompt: "but", answer: "bud", targetStructure: "final /t/ vs /d/", cefr: "B1", exampleSentence: "I am tired but happy." },
  { id: "ftd-7", prompt: "feet", answer: "feed", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "My feet are cold." },
  { id: "ftd-8", prompt: "seat", answer: "seed", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "This seat is free." },
  { id: "ftd-9", prompt: "wet", answer: "wed", targetStructure: "final /t/ vs /d/", cefr: "A2", exampleSentence: "The grass is wet this morning." },
  { id: "ftd-10", prompt: "wrote", answer: "road", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "She wrote a letter to her friend." },
  { id: "ftd-11", prompt: "heart", answer: "hard", targetStructure: "final /t/ vs /d/", cefr: "A1", exampleSentence: "Your heart beats fast when you run." },
  { id: "ftd-12", prompt: "mate", answer: "made", targetStructure: "final /t/ vs /d/", cefr: "A2", exampleSentence: "My mate lives next door." },
];

export const S_SH: GameItem[] = [
  { id: "ssh-1", prompt: "sea", answer: "she", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "The sea is cold today." },
  { id: "ssh-2", prompt: "sock", answer: "shock", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "This sock has a hole in it." },
  { id: "ssh-3", prompt: "sip", answer: "ship", targetStructure: "/s/ vs /ʃ/", cefr: "A2", exampleSentence: "Take a sip of water." },
  { id: "ssh-4", prompt: "sell", answer: "shell", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "They sell fruit in the market." },
  { id: "ssh-5", prompt: "seat", answer: "sheet", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "Is this seat free?" },
  { id: "ssh-6", prompt: "sue", answer: "shoe", targetStructure: "/s/ vs /ʃ/", cefr: "B1", exampleSentence: "They will sue the company." },
  { id: "ssh-7", prompt: "sign", answer: "shine", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "Sign your name at the bottom." },
  { id: "ssh-8", prompt: "sort", answer: "short", targetStructure: "/s/ vs /ʃ/", cefr: "A1", exampleSentence: "Sort the cards into two piles." },
  { id: "ssh-9", prompt: "mass", answer: "mash", targetStructure: "/s/ vs /ʃ/", cefr: "B1", exampleSentence: "A mass of people waited outside." },
  { id: "ssh-10", prompt: "mess", answer: "mesh", targetStructure: "/s/ vs /ʃ/", cefr: "A2", exampleSentence: "Your room is a mess." },
  { id: "ssh-11", prompt: "lease", answer: "leash", targetStructure: "/s/ vs /ʃ/", cefr: "B1", exampleSentence: "The lease on the apartment ends in June." },
  { id: "ssh-12", prompt: "same", answer: "shame", targetStructure: "/s/ vs /ʃ/", cefr: "A2", exampleSentence: "We are in the same class." },
];

export const ALL_MINIMAL_PAIRS: GameItem[] = [
  ...VOWELS_I,
  ...VOWELS_A,
  ...VOWELS_O,
  ...TH_T,
  ...TH_S,
  ...TH_D,
  ...L_R,
  ...B_V,
  ...FINAL_T_D,
  ...S_SH,
];
