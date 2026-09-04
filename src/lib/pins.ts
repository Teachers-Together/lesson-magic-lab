const KEY = "edupulse.pins.v1";

export type PinMap = Record<string, string>; // pin -> activityId

function read(): PinMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as PinMap;
  } catch {
    return {};
  }
}

function write(map: PinMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function allPins(): PinMap {
  return read();
}

export function pinForActivity(activityId: string): string | null {
  const map = read();
  const found = Object.entries(map).find(([, id]) => id === activityId);
  return found ? found[0] : null;
}

export function generatePin(activityId: string, digits: 4 | 6 = 4): string {
  const map = read();
  let pin = "";
  do {
    pin = Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join("");
  } while (map[pin]);
  // one live pin per activity
  for (const [p, id] of Object.entries(map)) if (id === activityId) delete map[p];
  map[pin] = activityId;
  write(map);
  return pin;
}

export function resolvePin(pin: string): string | null {
  return read()[pin.trim()] ?? null;
}

export function joinUrlFor(pin: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://edupulse.ai";
  return `${origin}/join?pin=${pin}`;
}
