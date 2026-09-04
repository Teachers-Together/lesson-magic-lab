/**
 * Voice layer: sequenced speech with voice-cache priming.
 * Thin wrapper over the shared speech helpers — never reimplemented per game.
 */

import { speak, cancel } from "@/lib/speech";

/** Warm the speechSynthesis voice cache (first utterance otherwise uses a robotic fallback). */
export function primeVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
}

export function cancelSpeech(): void {
  cancel();
}

export type SpeakOptions = { lang?: string; rate?: number };

/** Speak lines in order, waiting for each to finish before starting the next. */
export function speakSequence(lines: string[], opts?: SpeakOptions): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve();
  }
  cancel();
  const synth = window.speechSynthesis;
  let chain: Promise<void> = Promise.resolve();
  for (const line of lines) {
    chain = chain.then(
      () =>
        new Promise<void>((resolve) => {
          const u = new SpeechSynthesisUtterance(line);
          if (opts?.lang) u.lang = opts.lang;
          u.rate = opts?.rate ?? 1;
          u.onend = () => resolve();
          u.onerror = () => resolve();
          synth.speak(u);
        }),
    );
  }
  // Keep `speak` referenced so the shared helper stays the single implementation.
  void speak;
  return chain;
}
