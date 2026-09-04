import * as React from "react";
import { Volume2, Square } from "lucide-react";
import { speakSequence, cancelSpeech, primeVoices } from "@/lib/voice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AudioButtonProps = {
  text: string | string[];
  lang?: string;
  rate?: number;
  label?: string;
};

export function AudioButton({ text, lang, rate, label }: AudioButtonProps) {
  const [playing, setPlaying] = React.useState(false);
  const lines = React.useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text],
  );

  React.useEffect(() => {
    primeVoices();
    return () => cancelSpeech();
  }, []);

  const handleClick = React.useCallback(() => {
    if (playing) {
      cancelSpeech();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // Always speakSequence — it waits for the voice/clip cache, bare speak does not.
    const opts: { lang?: string; rate?: number } = {};
    if (lang !== undefined) opts.lang = lang;
    if (rate !== undefined) opts.rate = rate;
    Promise.resolve(speakSequence(lines, opts)).finally(() => setPlaying(false));
  }, [playing, lines, lang, rate]);

  return (
    <Button
      type="button"
      size="icon"
      variant={playing ? "destructive" : "secondary"}
      onClick={handleClick}
      aria-label={label ?? (playing ? "Stop audio" : "Play audio")}
      className={cn("size-12 shrink-0 rounded-full shadow", playing && "ring-4 ring-rose-500/30")}
    >
      {playing ? <Square className="size-5" /> : <Volume2 className="size-6" />}
    </Button>
  );
}

export function SlowAudioButton(props: Omit<AudioButtonProps, "rate" | "label">) {
  return (
    <span className="relative inline-flex">
      <AudioButton {...props} rate={0.6} label={props.text ? `Play slowly: ${Array.isArray(props.text) ? props.text[0] : props.text}` : "Play slowly"} />
      <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
        0.6x
      </span>
    </span>
  );
}
