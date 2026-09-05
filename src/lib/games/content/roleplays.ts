/*
  Roleplay dialogue bank — read by RoleplayGame.
  prompt = one spoken line, answer = the speaker's name.
  exampleSentence = a different way to say the same line (tutor offers it when
  the student stalls).
  targetStructure = the function of the line; it is the ONLY cue at the lowest
  support level, so it must be enough to produce the line from.
  Items are in spoken order and alternate between exactly two speakers — the
  game builds its two columns from the order the names first appear.
  American English throughout; britishVariant marks words a tutor may want to
  contrast.
*/
import type { GameItem } from "@/lib/game-contract";

/* ---------- A1 ---------- */

export const BUYING_A_COFFEE: GameItem[] = [
  {
    id: "rp-coffee-1",
    prompt: "Hi! What can I get for you today?",
    answer: "Barista",
    targetStructure: "greet a customer and offer help",
    cefr: "A1",
    exampleSentence: "Hello! What would you like today?",
  },
  {
    id: "rp-coffee-2",
    prompt: "Hi, can I get a medium coffee, please?",
    answer: "Customer",
    targetStructure: "order a drink politely",
    cefr: "A1",
    exampleSentence: "I'd like a medium coffee, please.",
  },
  {
    id: "rp-coffee-3",
    prompt: "Sure. Hot or iced?",
    answer: "Barista",
    targetStructure: "ask a follow-up question about the order",
    cefr: "A1",
    exampleSentence: "Of course. Do you want it hot or iced?",
  },
  {
    id: "rp-coffee-4",
    prompt: "Hot, please. With a little milk.",
    answer: "Customer",
    targetStructure: "answer and add a detail to the order",
    cefr: "A1",
    exampleSentence: "Hot, and can you add some milk?",
  },
  {
    id: "rp-coffee-5",
    prompt: "Anything to eat with that? The muffins are fresh.",
    answer: "Barista",
    targetStructure: "offer something extra",
    cefr: "A1",
    exampleSentence: "Would you like some food too? We just made muffins.",
  },
  {
    id: "rp-coffee-6",
    prompt: "No thanks, just the coffee. How much is that?",
    answer: "Customer",
    targetStructure: "politely say no and ask the price",
    cefr: "A1",
    exampleSentence: "Just the coffee, thanks. What do I owe you?",
  },
  {
    id: "rp-coffee-7",
    prompt: "That's three fifty. For here or to go?",
    answer: "Barista",
    targetStructure: "state the price and ask a final question",
    cefr: "A1",
    exampleSentence: "Three dollars and fifty cents. Are you drinking it here?",
  },
  {
    id: "rp-coffee-8",
    prompt: "To go, please. Here you are.",
    answer: "Customer",
    targetStructure: "answer and hand over money",
    cefr: "A1",
    exampleSentence: "I'll take it with me. Here's the money.",
  },
  {
    id: "rp-coffee-9",
    prompt: "Thanks! Your coffee will be ready in a minute.",
    answer: "Barista",
    targetStructure: "thank the customer and close the exchange",
    cefr: "A1",
    exampleSentence: "Thank you! It'll just be a minute.",
  },
  {
    id: "rp-coffee-10",
    prompt: "Great, thank you. Have a good one!",
    answer: "Customer",
    targetStructure: "thank and say goodbye",
    cefr: "A1",
    exampleSentence: "Thanks a lot. Have a nice day!",
  },
];

export const ASKING_DIRECTIONS: GameItem[] = [
  {
    id: "rp-dir-1",
    prompt: "Excuse me, is there a pharmacy near here?",
    answer: "Visitor",
    targetStructure: "get a stranger's attention and ask for a place",
    cefr: "A1",
    exampleSentence: "Sorry to bother you — is there a pharmacy around here?",
  },
  {
    id: "rp-dir-2",
    prompt: "Yes, there's one on Main Street. Do you know where that is?",
    answer: "Local",
    targetStructure: "answer and check what the person knows",
    cefr: "A1",
    exampleSentence: "Sure, there's one on Main Street. Have you been there before?",
  },
  {
    id: "rp-dir-3",
    prompt: "No, I just got here today. How do I get there?",
    answer: "Visitor",
    targetStructure: "explain your situation and ask for directions",
    cefr: "A1",
    exampleSentence: "No, it's my first day here. Can you tell me the way?",
  },
  {
    id: "rp-dir-4",
    prompt: "Go straight down this road for two blocks, then turn left at the light.",
    answer: "Local",
    targetStructure: "give two-step directions",
    cefr: "A1",
    exampleSentence: "Walk straight for two blocks and turn left at the traffic light.",
  },
  {
    id: "rp-dir-5",
    prompt: "Straight for two blocks, then left. Is it far?",
    answer: "Visitor",
    targetStructure: "repeat the directions to check and ask about distance",
    cefr: "A1",
    exampleSentence: "Okay — straight, then left. Is it a long walk?",
  },
  {
    id: "rp-dir-6",
    prompt: "Not at all, about five minutes. It's next to the bank, a big white building.",
    answer: "Local",
    targetStructure: "reassure and describe a landmark",
    cefr: "A1",
    exampleSentence: "No, five minutes on foot. Look for the big white building beside the bank.",
  },
  {
    id: "rp-dir-7",
    prompt: "Perfect, thanks so much for your help!",
    answer: "Visitor",
    targetStructure: "thank the person warmly",
    cefr: "A1",
    exampleSentence: "That's great. Thank you very much!",
  },
  {
    id: "rp-dir-8",
    prompt: "You're welcome. Good luck!",
    answer: "Local",
    targetStructure: "respond to thanks and close",
    cefr: "A1",
    exampleSentence: "No problem. Take care!",
  },
];

export const INTRODUCING_YOURSELF: GameItem[] = [
  {
    id: "rp-intro-1",
    prompt: "Hi, I don't think we've met. I'm Sam, I just moved into apartment 4B.",
    answer: "Sam",
    targetStructure: "introduce yourself to a neighbor",
    cefr: "A1",
    exampleSentence: "Hello! I'm Sam — I'm the new neighbor in 4B.",
  },
  {
    id: "rp-intro-2",
    prompt:
      "Oh, welcome! I'm Maya. I've been here for two years. How do you like the building so far?",
    answer: "Maya",
    targetStructure: "welcome someone, introduce yourself, and ask a friendly question",
    cefr: "A1",
    exampleSentence: "Welcome! My name's Maya. Are you settling in okay?",
  },
  {
    id: "rp-intro-3",
    prompt: "It's nice, thanks. Everyone seems friendly. Where are you from, Maya?",
    answer: "Sam",
    targetStructure: "give a short answer and ask where someone is from",
    cefr: "A1",
    exampleSentence: "I like it a lot. And where are you from originally?",
  },
  {
    id: "rp-intro-4",
    prompt:
      "I'm from Denver, but I came here for work. I'm a nurse at the city hospital. What about you?",
    answer: "Maya",
    targetStructure: "answer and ask the same question back",
    cefr: "A1",
    exampleSentence:
      "I grew up in Denver and moved here for my job — I work at the hospital. How about you?",
  },
  {
    id: "rp-intro-5",
    prompt: "I'm a graphic designer. I work from home, so you'll see me around a lot.",
    answer: "Sam",
    targetStructure: "say what you do",
    cefr: "A1",
    exampleSentence: "I design websites and I work from home most days.",
  },
  {
    id: "rp-intro-6",
    prompt:
      "That's great — the Wi-Fi here is fast, you'll be fine. Hey, a few of us get coffee on Sunday mornings. You should come!",
    answer: "Maya",
    targetStructure: "respond and invite the person to something",
    cefr: "A1",
    exampleSentence: "Nice! Some neighbors meet for coffee on Sundays — want to join us?",
  },
  {
    id: "rp-intro-7",
    prompt: "I'd love that, thanks! It was really nice to meet you, Maya.",
    answer: "Sam",
    targetStructure: "accept an invitation and close politely",
    cefr: "A1",
    exampleSentence: "Sure, that sounds fun! Great meeting you.",
  },
  {
    id: "rp-intro-8",
    prompt: "You too, Sam. See you Sunday!",
    answer: "Maya",
    targetStructure: "return the goodbye and confirm plans",
    cefr: "A1",
    exampleSentence: "Nice meeting you too. See you on Sunday!",
  },
];

/* ---------- A2 ---------- */

export const ORDERING_IN_A_RESTAURANT: GameItem[] = [
  {
    id: "rp-rest-1",
    prompt: "Good evening! Are you ready to order, or do you need a few more minutes?",
    answer: "Server",
    targetStructure: "greet and ask if the customer is ready",
    cefr: "A2",
    exampleSentence: "Hi there! Do you know what you'd like, or should I come back?",
  },
  {
    id: "rp-rest-2",
    prompt: "I think we're ready. Could I have the grilled salmon, please?",
    answer: "Customer",
    targetStructure: "order a main dish politely",
    cefr: "A2",
    exampleSentence: "Yes, I'll take the grilled salmon, please.",
  },
  {
    id: "rp-rest-3",
    prompt: "Good choice. That comes with rice or a baked potato. Which would you like?",
    answer: "Server",
    targetStructure: "present two options",
    cefr: "A2",
    exampleSentence: "Nice pick. Rice or baked potato on the side?",
  },
  {
    id: "rp-rest-4",
    prompt: "Rice, please. And could I get a side salad instead of the soup?",
    answer: "Customer",
    targetStructure: "choose and ask to swap part of the meal",
    cefr: "A2",
    exampleSentence: "I'll go with the rice. Also, can I swap the soup for a salad?",
  },
  {
    id: "rp-rest-5",
    prompt: "Of course, that's no problem. Anything to drink?",
    answer: "Server",
    targetStructure: "agree and ask about drinks",
    cefr: "A2",
    exampleSentence: "Sure, we can do that. What would you like to drink?",
  },
  {
    id: "rp-rest-6",
    prompt: "Just water for me. Oh — how spicy is the chili sauce? I don't eat very hot food.",
    answer: "Customer",
    targetStructure: "order a drink and ask about the food",
    cefr: "A2",
    exampleSentence: "Water's fine. And is the chili sauce very spicy? I can't handle much heat.",
  },
  {
    id: "rp-rest-7",
    prompt: "It's pretty mild, but I can bring it on the side just in case.",
    answer: "Server",
    targetStructure: "reassure and offer a solution",
    cefr: "A2",
    exampleSentence: "It's not too hot, but I'll put it on the side for you.",
  },
  {
    id: "rp-rest-8",
    prompt: "That's perfect, thank you.",
    answer: "Customer",
    targetStructure: "accept and thank",
    cefr: "A2",
    exampleSentence: "Yes please, that would be great. Thanks!",
  },
  {
    id: "rp-rest-9",
    prompt:
      "You're welcome. I'll put this in right away — it should be out in about twenty minutes.",
    answer: "Server",
    targetStructure: "confirm the order and set expectations",
    cefr: "A2",
    exampleSentence: "No problem. Your food will be ready in about twenty minutes.",
  },
  {
    id: "rp-rest-10",
    prompt: "Sounds good. Oh, and could we get the check when you get a chance?",
    answer: "Customer",
    targetStructure: "ask for the check politely",
    cefr: "A2",
    britishVariant: "bill",
    exampleSentence: "Great. And can you bring us the check when you have a minute?",
  },
];

export const CHECKING_INTO_A_HOTEL: GameItem[] = [
  {
    id: "rp-hotel-1",
    prompt: "Good afternoon, welcome to the Lakeside Hotel. How can I help you?",
    answer: "Receptionist",
    targetStructure: "welcome a guest",
    cefr: "A2",
    exampleSentence: "Good afternoon! Welcome. What can I do for you?",
  },
  {
    id: "rp-hotel-2",
    prompt: "Hi, I have a reservation for two nights. The name is Alex Rivera.",
    answer: "Guest",
    targetStructure: "say you have a booking and give your name",
    cefr: "A2",
    exampleSentence: "Hello, I booked a room for two nights under Alex Rivera.",
  },
  {
    id: "rp-hotel-3",
    prompt:
      "Let me check... yes, here it is. A double room, checking out on Friday. Could I see your ID, please?",
    answer: "Receptionist",
    targetStructure: "confirm the booking and ask for ID",
    cefr: "A2",
    exampleSentence:
      "One moment... found it. Double room until Friday. May I see some identification?",
  },
  {
    id: "rp-hotel-4",
    prompt: "Sure, here you go. Is breakfast included in the rate?",
    answer: "Guest",
    targetStructure: "hand over ID and ask about breakfast",
    cefr: "A2",
    exampleSentence: "Of course, here it is. Does the price include breakfast?",
  },
  {
    id: "rp-hotel-5",
    prompt:
      "It is — breakfast is served in the lobby restaurant from six thirty to ten. Here's your key card; you're in room 412.",
    answer: "Receptionist",
    targetStructure: "answer and give practical details",
    cefr: "A2",
    exampleSentence:
      "Yes, breakfast runs from 6:30 to 10 in the lobby. Here's your key — room 412.",
  },
  {
    id: "rp-hotel-6",
    prompt: "Great. And where's the elevator?",
    answer: "Guest",
    targetStructure: "ask where something is",
    cefr: "A2",
    britishVariant: "lift",
    exampleSentence: "Perfect. How do I get to the elevator?",
  },
  {
    id: "rp-hotel-7",
    prompt:
      "Just behind you, to the left of the stairs. The gym is on the second floor if you need it, and Wi-Fi is free — the password is on your key sleeve.",
    answer: "Receptionist",
    targetStructure: "give directions inside the building and extra information",
    cefr: "A2",
    exampleSentence:
      "Right behind you, on the left. Gym's on floor two, and the Wi-Fi password is on the card holder.",
  },
  {
    id: "rp-hotel-8",
    prompt: "Wonderful, thanks for your help.",
    answer: "Guest",
    targetStructure: "thank and close",
    cefr: "A2",
    exampleSentence: "That's everything I need. Thanks so much.",
  },
  {
    id: "rp-hotel-9",
    prompt: "My pleasure. Enjoy your stay, Mr. Rivera!",
    answer: "Receptionist",
    targetStructure: "wish the guest a good stay",
    cefr: "A2",
    exampleSentence: "You're very welcome. Have a great stay!",
  },
];

export const AT_THE_DOCTOR: GameItem[] = [
  {
    id: "rp-doc-1",
    prompt: "Good morning, come on in. What seems to be the problem today?",
    answer: "Doctor",
    targetStructure: "open the consultation",
    cefr: "A2",
    exampleSentence: "Morning! So, what brings you in today?",
  },
  {
    id: "rp-doc-2",
    prompt: "I've had a bad cough for about a week, and now I have a sore throat too.",
    answer: "Patient",
    targetStructure: "describe symptoms and how long you've had them",
    cefr: "A2",
    exampleSentence: "I've been coughing for a week and my throat hurts as well.",
  },
  {
    id: "rp-doc-3",
    prompt: "I'm sorry to hear that. Do you have a fever, or any pain when you swallow?",
    answer: "Doctor",
    targetStructure: "ask follow-up questions about symptoms",
    cefr: "A2",
    exampleSentence: "That's no fun. Any fever? Does it hurt to swallow?",
  },
  {
    id: "rp-doc-4",
    prompt: "No fever, I checked this morning. But it really hurts when I swallow.",
    answer: "Patient",
    targetStructure: "answer both parts of the question",
    cefr: "A2",
    exampleSentence: "My temperature was normal, but swallowing is painful.",
  },
  {
    id: "rp-doc-5",
    prompt:
      "Okay, let me take a look. Open wide... yes, your throat is quite red. Have you been taking anything for it?",
    answer: "Doctor",
    targetStructure: "examine and ask about medicine already taken",
    cefr: "A2",
    exampleSentence:
      "Let me check your throat... it's pretty red. Have you taken any medicine yet?",
  },
  {
    id: "rp-doc-6",
    prompt: "Just cough drops and some tea with honey. Is it anything serious?",
    answer: "Patient",
    targetStructure: "answer and ask if the problem is serious",
    cefr: "A2",
    exampleSentence: "Only cough drops and hot tea. Should I be worried?",
  },
  {
    id: "rp-doc-7",
    prompt:
      "No, it looks like a common virus. I'm going to recommend rest, plenty of fluids, and this syrup twice a day.",
    answer: "Doctor",
    targetStructure: "give a diagnosis and simple treatment",
    cefr: "A2",
    exampleSentence:
      "Nothing serious — just a virus. Rest up, drink a lot, and take this syrup morning and night.",
  },
  {
    id: "rp-doc-8",
    prompt: "That's a relief. When should I come back if it doesn't get better?",
    answer: "Patient",
    targetStructure: "show relief and ask about a follow-up",
    cefr: "A2",
    exampleSentence: "Glad to hear it. If I'm not better, when should I come back?",
  },
  {
    id: "rp-doc-9",
    prompt:
      "If you're not feeling better in five days, or if you get a fever, make another appointment right away.",
    answer: "Doctor",
    targetStructure: "give clear instructions for a follow-up",
    cefr: "A2",
    exampleSentence:
      "Come back in five days if there's no improvement — sooner if you get a fever.",
  },
  {
    id: "rp-doc-10",
    prompt: "Got it. Thank you very much, Doctor.",
    answer: "Patient",
    targetStructure: "confirm understanding and thank",
    cefr: "A2",
    exampleSentence: "Understood. Thanks a lot, Doctor.",
  },
];

/* ---------- B1 ---------- */

export const RETURNING_A_FAULTY_ITEM: GameItem[] = [
  {
    id: "rp-return-1",
    prompt: "Hi there, how can I help you today?",
    answer: "Clerk",
    targetStructure: "open the conversation at the service desk",
    cefr: "B1",
    exampleSentence: "Hello! What can I do for you?",
  },
  {
    id: "rp-return-2",
    prompt:
      "Hi, I bought this wireless speaker here last week, but it stopped working after two days.",
    answer: "Customer",
    targetStructure: "explain why you are returning something",
    cefr: "B1",
    exampleSentence: "I got this speaker here last week and it died on me two days later.",
  },
  {
    id: "rp-return-3",
    prompt: "I'm sorry about that. What exactly happens when you turn it on?",
    answer: "Clerk",
    targetStructure: "apologize and ask for details about the fault",
    cefr: "B1",
    exampleSentence: "Sorry to hear that. What does it do when you switch it on?",
  },
  {
    id: "rp-return-4",
    prompt:
      "Nothing at all — no light, no sound. I tried charging it overnight and it's still completely dead.",
    answer: "Customer",
    targetStructure: "describe the fault and what you already tried",
    cefr: "B1",
    exampleSentence: "It's totally dead. I charged it all night and nothing — no lights, nothing.",
  },
  {
    id: "rp-return-5",
    prompt: "That definitely sounds like a defect. Do you have your receipt with you?",
    answer: "Clerk",
    targetStructure: "acknowledge the problem and ask for proof of purchase",
    cefr: "B1",
    exampleSentence: "Yeah, that sounds faulty. Did you bring the receipt?",
  },
  {
    id: "rp-return-6",
    prompt: "Yes, here it is. I'd prefer a refund rather than an exchange, if that's possible.",
    answer: "Customer",
    targetStructure: "show the receipt and state what you want",
    cefr: "B1",
    exampleSentence:
      "Here you go. If it's all the same to you, I'd like my money back instead of a new one.",
  },
  {
    id: "rp-return-7",
    prompt:
      "That's no problem at all — you're within the thirty-day return period, so I can refund it straight back to your card.",
    answer: "Clerk",
    targetStructure: "agree and explain the process",
    cefr: "B1",
    exampleSentence:
      "Sure — you're still within 30 days, so the money goes right back on your card.",
  },
  {
    id: "rp-return-8",
    prompt: "Perfect. How long does the refund usually take to show up?",
    answer: "Customer",
    targetStructure: "ask a practical follow-up question",
    cefr: "B1",
    exampleSentence: "Great. When should I see the money in my account?",
  },
  {
    id: "rp-return-9",
    prompt:
      "It normally takes three to five business days. Here's your return receipt — keep it until the money arrives.",
    answer: "Clerk",
    targetStructure: "give a timeframe and a receipt",
    cefr: "B1",
    exampleSentence: "Usually three to five working days. Hold on to this receipt until then.",
  },
  {
    id: "rp-return-10",
    prompt: "Will do. Thanks for making this so easy!",
    answer: "Customer",
    targetStructure: "thank and close positively",
    cefr: "B1",
    exampleSentence: "I will. Thanks — I really appreciate how smooth that was.",
  },
];

export const PHONE_CALL_TO_RESCHEDULE: GameItem[] = [
  {
    id: "rp-phone-1",
    prompt: "Good morning, Bright Smile Dental, this is Dana. How may I help you?",
    answer: "Receptionist",
    targetStructure: "answer a business phone call",
    cefr: "B1",
    exampleSentence: "Good morning, Bright Smile Dental, Dana speaking. How can I help?",
  },
  {
    id: "rp-phone-2",
    prompt:
      "Hi Dana, this is Chris Miller. I have an appointment with Dr. Lee on Thursday at three, but something's come up and I need to reschedule.",
    answer: "Chris",
    targetStructure: "identify yourself and explain why you are calling",
    cefr: "B1",
    exampleSentence:
      "Hi, it's Chris Miller. I'm booked with Dr. Lee Thursday at 3, but I can't make it anymore — can we move it?",
  },
  {
    id: "rp-phone-3",
    prompt:
      "Of course, Mr. Miller. Let me pull up your file... okay, I see it. Would you prefer another afternoon, or does a morning work better?",
    answer: "Receptionist",
    targetStructure: "agree to help and offer a choice",
    cefr: "B1",
    exampleSentence:
      "No problem, let me find your booking... got it. Do mornings or afternoons suit you better?",
  },
  {
    id: "rp-phone-4",
    prompt: "Afternoons are much easier for me. Do you have anything early next week?",
    answer: "Chris",
    targetStructure: "state your preference and ask for options",
    cefr: "B1",
    exampleSentence: "Afternoon works best. Any openings early next week?",
  },
  {
    id: "rp-phone-5",
    prompt: "Let's see... Dr. Lee has an opening on Monday at four thirty, or Tuesday at two.",
    answer: "Receptionist",
    targetStructure: "offer two concrete options",
    cefr: "B1",
    exampleSentence: "Looking now... Monday at 4:30 or Tuesday at 2:00 are both free.",
  },
  {
    id: "rp-phone-6",
    prompt:
      "Tuesday at two works perfectly. Could you confirm that the Thursday appointment is cancelled?",
    answer: "Chris",
    targetStructure: "choose an option and confirm the change",
    cefr: "B1",
    exampleSentence: "Tuesday at 2:00 is great. And can you make sure Thursday is cancelled?",
  },
  {
    id: "rp-phone-7",
    prompt:
      "Absolutely — Thursday is cancelled and you're booked for Tuesday the fourteenth at two p.m. You'll get a text reminder the day before.",
    answer: "Receptionist",
    targetStructure: "confirm the new booking and close the details",
    cefr: "B1",
    exampleSentence:
      "Done — Thursday's off, and you're down for Tuesday the 14th at 2. We'll text you a reminder.",
  },
  {
    id: "rp-phone-8",
    prompt: "Wonderful, thanks so much for your help, Dana.",
    answer: "Chris",
    targetStructure: "thank on the phone",
    cefr: "B1",
    exampleSentence: "That's great — thanks a lot, Dana.",
  },
  {
    id: "rp-phone-9",
    prompt: "You're welcome, Mr. Miller. See you Tuesday!",
    answer: "Receptionist",
    targetStructure: "close a business call warmly",
    cefr: "B1",
    exampleSentence: "My pleasure. See you on Tuesday!",
  },
];

export const JOB_INTERVIEW: GameItem[] = [
  {
    id: "rp-job-1",
    prompt:
      "Thanks for coming in today, Ms. Carter. To start, could you tell me a little about yourself?",
    answer: "Interviewer",
    targetStructure: "open an interview with a classic first question",
    cefr: "B1",
    exampleSentence: "Thanks for being here. Let's begin — tell me a bit about yourself.",
  },
  {
    id: "rp-job-2",
    prompt:
      "Of course. I've spent the last four years as an office administrator at a law firm, where I managed scheduling for a team of twelve and handled all client communication.",
    answer: "Candidate",
    targetStructure: "summarize your experience briefly",
    cefr: "B1",
    exampleSentence:
      "Sure — for the past four years I've been an office admin at a law firm, running schedules for twelve people and dealing with clients.",
  },
  {
    id: "rp-job-3",
    prompt: "Impressive. What would you say is your greatest strength?",
    answer: "Interviewer",
    targetStructure: "ask about strengths",
    cefr: "B1",
    exampleSentence: "That's solid experience. What's your biggest strength?",
  },
  {
    id: "rp-job-4",
    prompt:
      "I'd say staying organized under pressure. When our office manager was sick for a month, I kept everything running on my own and we didn't miss a single deadline.",
    answer: "Candidate",
    targetStructure: "name a strength and back it up with an example",
    cefr: "B1",
    exampleSentence:
      "Organization under pressure. I once covered the office manager's job for a month alone and nothing slipped.",
  },
  {
    id: "rp-job-5",
    prompt: "That's a great example. And why are you interested in this position in particular?",
    answer: "Interviewer",
    targetStructure: "ask why the candidate wants this job",
    cefr: "B1",
    exampleSentence: "Good to hear. So what draws you to this role?",
  },
  {
    id: "rp-job-6",
    prompt:
      "Honestly, I'm looking for a place where I can grow. Your company trains people internally, and I'd love to move into project coordination over time.",
    answer: "Candidate",
    targetStructure: "explain your motivation honestly",
    cefr: "B1",
    exampleSentence:
      "To be honest, I want somewhere I can develop — you promote from within, and I'd like to grow into project coordination.",
  },
  {
    id: "rp-job-7",
    prompt: "That's exactly the attitude we like here. Do you have any questions for me?",
    answer: "Interviewer",
    targetStructure: "invite the candidate's questions",
    cefr: "B1",
    exampleSentence: "We love hearing that. What questions do you have for us?",
  },
  {
    id: "rp-job-8",
    prompt:
      "Yes — what does a typical day look like for someone in this role, and when would you need the new person to start?",
    answer: "Candidate",
    targetStructure: "ask two good questions about the job",
    cefr: "B1",
    exampleSentence:
      "A couple, actually — what does a normal day look like here, and when would the role start?",
  },
  {
    id: "rp-job-9",
    prompt:
      "Mostly scheduling and supplier calls in the morning, reports in the afternoon. We'd want someone by the first of next month. We'll be in touch by Friday either way.",
    answer: "Interviewer",
    targetStructure: "answer and explain the next steps",
    cefr: "B1",
    exampleSentence:
      "Mornings are calls and schedules, afternoons are reports. Start date is the 1st, and you'll hear from us by Friday.",
  },
  {
    id: "rp-job-10",
    prompt: "Thank you so much for your time — I look forward to hearing from you.",
    answer: "Candidate",
    targetStructure: "close an interview politely",
    cefr: "B1",
    exampleSentence: "Thanks for the opportunity — I'll wait to hear from you on Friday.",
  },
];

/* ---------- B2 ---------- */

export const NEGOTIATING_A_DEADLINE: GameItem[] = [
  {
    id: "rp-dead-1",
    prompt: "Jordan, I need the Henderson report by Thursday morning. Can you make that happen?",
    answer: "Manager",
    targetStructure: "assign a task with a tight deadline",
    cefr: "B2",
    exampleSentence:
      "Jordan — the Henderson report has to be on my desk Thursday morning. Is that doable?",
  },
  {
    id: "rp-dead-2",
    prompt:
      "I want to be straight with you — Thursday is going to be tough. I'm still waiting on the sales figures, and without them the analysis section will be guesswork.",
    answer: "Jordan",
    targetStructure: "push back honestly and explain why",
    cefr: "B2",
    exampleSentence:
      "Honestly? Thursday's a stretch. The sales numbers haven't come in, and the analysis depends on them.",
  },
  {
    id: "rp-dead-3",
    prompt:
      "I hear you, but the client call is Thursday at noon and I can't move it. What would make this possible?",
    answer: "Manager",
    targetStructure: "acknowledge, hold your position, and open the negotiation",
    cefr: "B2",
    exampleSentence:
      "Fair enough — but the client call is fixed for Thursday at noon. What would you need to get it done?",
  },
  {
    id: "rp-dead-4",
    prompt:
      "Two things. If sales sends me their figures by tomorrow evening, and if I can hand the newsletter draft to Priya this week, I could have a solid version ready Wednesday night.",
    answer: "Jordan",
    targetStructure: "propose conditions and a counter-offer",
    cefr: "B2",
    exampleSentence:
      "Two things would do it: the sales numbers by tomorrow night, and someone else taking the newsletter. Then you'd have it Wednesday evening.",
  },
  {
    id: "rp-dead-5",
    prompt:
      "I can chase sales myself this afternoon, and yes, give the newsletter to Priya. But I need the executive summary by Thursday at the latest — the rest can follow on Friday if it has to.",
    answer: "Manager",
    targetStructure: "accept conditions and split the deliverable",
    cefr: "B2",
    exampleSentence:
      "Deal — I'll push sales today and Priya takes the newsletter. But the summary must be Thursday; the full report can slip to Friday.",
  },
  {
    id: "rp-dead-6",
    prompt:
      "That works. Just so we're clear: summary by Thursday morning, full report Friday, assuming the figures land tomorrow.",
    answer: "Jordan",
    targetStructure: "confirm the agreement precisely",
    cefr: "B2",
    exampleSentence:
      "Agreed. To confirm — summary Thursday a.m., full report Friday, as long as the numbers arrive tomorrow.",
  },
  {
    id: "rp-dead-7",
    prompt:
      "Exactly. And if the sales team drags their feet, flag it to me immediately rather than waiting.",
    answer: "Manager",
    targetStructure: "confirm and set an escalation rule",
    cefr: "B2",
    exampleSentence: "Right. And if sales goes quiet, tell me straight away — don't sit on it.",
  },
  {
    id: "rp-dead-8",
    prompt: "Will do. Thanks for being flexible on this.",
    answer: "Jordan",
    targetStructure: "close the negotiation appreciatively",
    cefr: "B2",
    exampleSentence: "Absolutely. I appreciate you working with me on the timing.",
  },
];

export const MAKING_A_COMPLAINT_POLITELY: GameItem[] = [
  {
    id: "rp-comp-1",
    prompt: "Good morning, how can I help you?",
    answer: "Manager",
    targetStructure: "greet a customer who looks unhappy",
    cefr: "B2",
    exampleSentence: "Morning! What can I do for you today?",
  },
  {
    id: "rp-comp-2",
    prompt:
      "Good morning. I don't want to make a fuss, but I'm afraid I have a complaint about my stay last night.",
    answer: "Guest",
    targetStructure: "introduce a complaint softly",
    cefr: "B2",
    exampleSentence:
      "Morning. I'm sorry to bring this up, but something about last night really wasn't right.",
  },
  {
    id: "rp-comp-3",
    prompt: "I'm sorry to hear that. Please, tell me what happened.",
    answer: "Manager",
    targetStructure: "invite the person to explain",
    cefr: "B2",
    exampleSentence: "Oh, I'm sorry. Go ahead — what happened?",
  },
  {
    id: "rp-comp-4",
    prompt:
      "Well, the room itself was fine, but there was constant noise from the elevator until two a.m., and I had an early meeting. I barely slept three hours.",
    answer: "Guest",
    targetStructure: "state the problem clearly with its impact",
    cefr: "B2",
    britishVariant: "lift",
    exampleSentence:
      "The room was lovely, but the elevator noise went on until 2 a.m. and I had an early start — I got maybe three hours of sleep.",
  },
  {
    id: "rp-comp-5",
    prompt:
      "That's completely unacceptable, and I apologize. We had guests in the hallway last night, but that's no excuse — we should have dealt with it. What would you like us to do?",
    answer: "Manager",
    targetStructure: "apologize sincerely without over-defending, and ask for a remedy",
    cefr: "B2",
    exampleSentence:
      "You're right, and I'm sorry — we should have stepped in. What would feel fair to you?",
  },
  {
    id: "rp-comp-6",
    prompt:
      "I appreciate that. Given how little sleep I got, I think a discount on last night would be reasonable — or perhaps an upgrade if I stay again.",
    answer: "Guest",
    targetStructure: "propose a fair remedy",
    cefr: "B2",
    exampleSentence:
      "Thanks for saying that. Something off last night's rate seems fair — or an upgrade on a future stay.",
  },
  {
    id: "rp-comp-7",
    prompt:
      "Let me do both, actually — I'll take thirty percent off last night right now, and I'll add a note for a free upgrade on your next visit.",
    answer: "Manager",
    targetStructure: "offer more than expected",
    cefr: "B2",
    exampleSentence:
      "Here's what I can do: 30% off last night, effective immediately, plus a free upgrade next time you're here.",
  },
  {
    id: "rp-comp-8",
    prompt: "That's more than fair — thank you for handling it so well.",
    answer: "Guest",
    targetStructure: "accept and acknowledge the good service",
    cefr: "B2",
    exampleSentence: "That's very generous. I appreciate how you've dealt with this.",
  },
  {
    id: "rp-comp-9",
    prompt:
      "Thank you for bringing it to me so reasonably. I'll make sure your next stay is a quiet one.",
    answer: "Manager",
    targetStructure: "close a complaint on good terms",
    cefr: "B2",
    exampleSentence:
      "And thank you for being so reasonable about it. Next visit will be a peaceful one, I promise.",
  },
];

export const DISAGREEMENT_BETWEEN_COLLEAGUES: GameItem[] = [
  {
    id: "rp-dis-1",
    prompt:
      "Casey, do you have a minute? I read your proposal, and I have to be honest — I don't think moving the launch to June is a good idea.",
    answer: "Riley",
    targetStructure: "disagree directly but politely",
    cefr: "B2",
    exampleSentence:
      "Got a sec, Casey? I went through your proposal and honestly, I don't think a June launch makes sense.",
  },
  {
    id: "rp-dis-2",
    prompt:
      "I figured you might say that. But the data is pretty clear — every May launch we've done has underperformed because of the trade show season.",
    answer: "Casey",
    targetStructure: "defend your position with evidence",
    cefr: "B2",
    exampleSentence:
      "Thought you might. But look at the numbers — May launches always flop for us because of trade show season.",
  },
  {
    id: "rp-dis-3",
    prompt:
      "I see where you're coming from, but you're leaving out the budget cycle. If we wait until June, we're competing with the new fiscal-year releases from every rival we have.",
    answer: "Riley",
    targetStructure: "acknowledge the other view, then counter it",
    cefr: "B2",
    exampleSentence:
      "Fair point, but you're missing the budget angle — in June we're up against everyone's new releases.",
  },
  {
    id: "rp-dis-4",
    prompt:
      "That's true, but a crowded June still beats an empty-room May. We burned forty thousand dollars last May on a launch nobody attended.",
    answer: "Casey",
    targetStructure: "concede a point but hold your ground",
    cefr: "B2",
    exampleSentence:
      "Sure, June's crowded — but it beats an empty room. Last May cost us forty grand for nothing.",
  },
  {
    id: "rp-dis-5",
    prompt:
      "Okay, what if we split the difference — a soft launch to existing customers in May, full public launch in June once the trade shows are over?",
    answer: "Riley",
    targetStructure: "propose a compromise",
    cefr: "B2",
    exampleSentence:
      "How about this — quiet launch to current customers in May, big public push in June after the shows?",
  },
  {
    id: "rp-dis-6",
    prompt:
      "Hmm, that's actually not bad. We get the early revenue without the empty room. I'd want the May part to stay small, though — no press, no ads.",
    answer: "Casey",
    targetStructure: "accept a compromise with conditions",
    cefr: "B2",
    exampleSentence:
      "That could work — early sales, no empty room. But May stays tiny: no press, no ad spend.",
  },
  {
    id: "rp-dis-7",
    prompt:
      "Agreed. Let's put both dates in the plan with those conditions and run it past Dana on Friday.",
    answer: "Riley",
    targetStructure: "confirm the compromise and next step",
    cefr: "B2",
    exampleSentence:
      "Deal. I'll write it up with both dates and your conditions, and we'll show Dana on Friday.",
  },
  {
    id: "rp-dis-8",
    prompt:
      "Sounds good. And hey — I like that we can argue about this stuff and still get somewhere.",
    answer: "Casey",
    targetStructure: "end a disagreement warmly",
    cefr: "B2",
    exampleSentence:
      "Perfect. You know what, I like that we can butt heads and still land somewhere sensible.",
  },
];

export const ALL_ROLEPLAYS: GameItem[] = [
  ...BUYING_A_COFFEE,
  ...ASKING_DIRECTIONS,
  ...INTRODUCING_YOURSELF,
  ...ORDERING_IN_A_RESTAURANT,
  ...CHECKING_INTO_A_HOTEL,
  ...AT_THE_DOCTOR,
  ...RETURNING_A_FAULTY_ITEM,
  ...PHONE_CALL_TO_RESCHEDULE,
  ...JOB_INTERVIEW,
  ...NEGOTIATING_A_DEADLINE,
  ...MAKING_A_COMPLAINT_POLITELY,
  ...DISAGREEMENT_BETWEEN_COLLEAGUES,
];
