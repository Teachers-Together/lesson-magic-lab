import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Context,
  type ReactNode,
} from "react";

export type PlayMode = "independent" | "control";
export type PerkId = "streak" | "insurance" | "second";

export const PERKS: { id: PerkId; name: string; cost: number; blurb: string; emoji: string }[] = [
  {
    id: "streak",
    name: "Streak Multiplier",
    cost: 50,
    blurb: "Permanently earn +$5 extra on every correct answer.",
    emoji: "🔥",
  },
  {
    id: "insurance",
    name: "Insurance",
    cost: 30,
    blurb: "Your next wrong answer costs you nothing.",
    emoji: "🛡️",
  },
  {
    id: "second",
    name: "Second Chance",
    cost: 100,
    blurb: "One wrong choice is removed on all upcoming questions.",
    emoji: "✂️",
  },
];

type Ctx = {
  mode: PlayMode;
  setMode: (m: PlayMode) => void;
  controlMode: boolean;
  roomCode: string;
  cashEnabled: boolean;
  setCashEnabled: (v: boolean) => void;
  cash: number;
  owned: PerkId[];
  insured: boolean;
  secondChance: boolean;
  buy: (id: PerkId) => boolean;
  awardCorrect: () => number;
  awardWrong: () => number;
  resetCash: () => void;
};

const fallback: Ctx = {
  mode: "independent",
  setMode: () => {},
  controlMode: false,
  roomCode: "------",
  cashEnabled: false,
  setCashEnabled: () => {},
  cash: 0,
  owned: [],
  insured: false,
  secondChance: false,
  buy: () => false,
  awardCorrect: () => 0,
  awardWrong: () => 0,
  resetCash: () => {},
};

const g = globalThis as unknown as { __eduPulsePlayModeCtx?: Context<Ctx | null> };
const PlayModeContext = (g.__eduPulsePlayModeCtx ??= createContext<Ctx | null>(null));

const makeRoomCode = () =>
  Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

/** Big numbered / lettered badge shown on interactive items in Teacher Screen-Control mode. */
export const labelFor = (index: number, style: "letter" | "number" = "number") =>
  style === "letter" ? String.fromCharCode(65 + index) : String(index + 1);

export function PlayModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PlayMode>("independent");
  const [roomCode] = useState(makeRoomCode);
  const [cashEnabled, setCashEnabled] = useState(false);
  const [cash, setCash] = useState(0);
  const [owned, setOwned] = useState<PerkId[]>([]);
  const [insured, setInsured] = useState(false);

  const buy = useCallback(
    (id: PerkId) => {
      const perk = PERKS.find((p) => p.id === id);
      if (!perk) return false;
      let ok = false;
      setCash((c) => {
        if (c < perk.cost) return c;
        ok = true;
        return c - perk.cost;
      });
      if (!ok) return false;
      if (id === "insurance") setInsured(true);
      setOwned((o) => (o.includes(id) ? o : [...o, id]));
      return true;
    },
    [],
  );

  const awardCorrect = useCallback(() => {
    const amount = 10 + (owned.includes("streak") ? 5 : 0);
    setCash((c) => c + amount);
    return amount;
  }, [owned]);

  const awardWrong = useCallback(() => {
    if (insured) {
      setInsured(false);
      setOwned((o) => o.filter((p) => p !== "insurance"));
      return 0;
    }
    setCash((c) => Math.max(0, c - 5));
    return -5;
  }, [insured]);

  const resetCash = useCallback(() => {
    setCash(0);
    setOwned([]);
    setInsured(false);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      mode,
      setMode,
      controlMode: mode === "control",
      roomCode,
      cashEnabled,
      setCashEnabled,
      cash,
      owned,
      insured,
      secondChance: owned.includes("second"),
      buy,
      awardCorrect,
      awardWrong,
      resetCash,
    }),
    [mode, roomCode, cashEnabled, cash, owned, insured, buy, awardCorrect, awardWrong, resetCash],
  );

  return <PlayModeContext.Provider value={value}>{children}</PlayModeContext.Provider>;
}

export function usePlayMode(): Ctx {
  return useContext(PlayModeContext) ?? fallback;
}
