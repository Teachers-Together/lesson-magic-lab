/** Shared speech helpers for all portable games. Never implement per game. */

export function speak(text: string, opts?: { rate?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 1;
  window.speechSynthesis.speak(u);
}

export function cancel() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
