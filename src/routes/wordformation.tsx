import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import WordFormationGame from "@/components/games/WordFormationGame";
import type { GameItem } from "@/lib/game-contract";

const ITEMS: GameItem[] = [
  {
    id: "wf-1",
    prompt: "Her _______ to help everyone was obvious.",
    answer: "willingness",
    distractors: ["willness"],
    audioText: "WILLING",
    hint: "adjective → noun with -ness",
    targetStructure: "-ness nouns",
    cefr: "B1",
  },
  {
    id: "wf-2",
    prompt: "He made a quick _______ to leave early.",
    answer: "decision",
    distractors: ["decide"],
    audioText: "DECIDE",
    hint: "verb → noun with -sion",
    targetStructure: "verb → noun",
    cefr: "B1",
  },
  {
    id: "wf-3",
    prompt: "The weather was extremely _______ yesterday.",
    answer: "unpleasant",
    distractors: ["displeasant"],
    audioText: "PLEASANT",
    hint: "adjective → negative with un-",
    targetStructure: "negative prefixes",
    cefr: "B2",
  },
  {
    id: "wf-4",
    prompt: "She showed great _______ in her work.",
    answer: "carefulness",
    distractors: ["careful"],
    audioText: "CAREFUL",
    hint: "adjective → noun with -ness",
    targetStructure: "-ness nouns",
    cefr: "B1",
  },
  {
    id: "wf-5",
    prompt: "I _______ my keys somewhere in the house.",
    answer: "misplaced",
    distractors: ["unplaced"],
    audioText: "PLACE",
    hint: "verb → negative with mis-",
    targetStructure: "negative prefixes",
    cefr: "B2",
  },
  {
    id: "wf-6",
    prompt: "The _______ of the project surprised us.",
    answer: "success",
    distractors: ["successful"],
    audioText: "SUCCEED",
    hint: "verb → noun",
    targetStructure: "verb → noun",
    cefr: "B1",
  },
  {
    id: "wf-7",
    prompt: "He was _______ of the danger ahead.",
    answer: "unaware",
    distractors: ["disaware"],
    audioText: "AWARE",
    hint: "adjective → negative with un-",
    targetStructure: "negative prefixes",
    cefr: "B2",
  },
  {
    id: "wf-8",
    prompt: "The room was full of _______.",
    answer: "happiness",
    distractors: ["happy"],
    audioText: "HAPPY",
    hint: "adjective → noun with -ness",
    targetStructure: "-ness nouns",
    cefr: "A2",
  },
  {
    id: "wf-9",
    prompt: "You need to _______ your application by Friday.",
    answer: "submit",
    distractors: ["submission"],
    audioText: "SUBMISSION",
    hint: "noun → verb (remove suffix)",
    targetStructure: "verb → noun",
    cefr: "B2",
  },
  {
    id: "wf-10",
    prompt: "The _______ of the building took years.",
    answer: "construction",
    distractors: ["construct"],
    audioText: "CONSTRUCT",
    hint: "verb → noun with -tion",
    targetStructure: "verb → noun",
    cefr: "B1",
  },
];

export const Route = createFileRoute("/wordformation")({
  head: () => ({
    meta: [
      { title: "Word Formation — EduPulse AI" },
      { name: "description", content: "Test the Word Formation game component." },
      { property: "og:title", content: "Word Formation — EduPulse AI" },
      { property: "og:description", content: "Test the Word Formation game component." },
    ],
  }),
  component: WordFormationTest,
});

function WordFormationTest() {
  return (
    <div className="h-screen">
      <WordFormationGame
        items={ITEMS}
        teacherMode={false}
        onComplete={(r) => {
          toast.success(`Score: ${r.correct}/${r.total}`);
          // eslint-disable-next-line no-console
          console.log("complete", r);
        }}
        onEvent={(e) => {
          // eslint-disable-next-line no-console
          console.log("event", e);
        }}
      />
    </div>
  );
}
