export type GameItem = {
  id: string;
  prompt: string;
  answer: string;
  distractors?: string[];
  imageUrl?: string;
  exampleSentence?: string;
};
