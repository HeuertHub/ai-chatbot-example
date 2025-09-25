// src/lib/tts.ts
// Simplified TTS utility for multilingual chat with pre-selected voices.

export type TTSVoice = {
  key: string;
  voiceURI: string;
  name: string;
  lang: string;
  default: boolean;
};

const isClient = (): boolean =>
  typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";

let voicesCache: SpeechSynthesisVoice[] | null = null;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isClient()) return [];
  if (voicesCache && voicesCache.length) return voicesCache;

  const synth = window.speechSynthesis;

  const fetchVoices = () => {
    const v = synth.getVoices() || [];
    if (v.length) voicesCache = v;
    return v;
  };

  let current = fetchVoices();
  if (current.length) return current;

  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const done = () => resolve(voicesCache || []);
      const onChange = () => {
        current = fetchVoices();
        if (current.length) {
          synth.removeEventListener("voiceschanged", onChange);
          done();
        }
      };
      synth.addEventListener("voiceschanged", onChange);
      setTimeout(() => {
        current = fetchVoices();
        resolve(current);
      }, 1000);
    });
  }
  return voicesPromise;
}

/**
 * Returns voices filtered by language.
 * Examples:
 *   getVoicesByLang("en")     -> all English voices (en-US, en-GB, etc.)
 *   getVoicesByLang("pt-BR")  -> only Brazilian Portuguese voices
 */
export async function getVoicesByLang(lang: string): Promise<TTSVoice[]> {
  const voices = await loadVoices();
  const base = lang.split("-")[0].toLowerCase();
  return voices
    .filter((v) => {
      const vLang = v.lang.toLowerCase();
      return vLang === lang.toLowerCase() || vLang.startsWith(base + "-") || vLang === base;
    })
    .map((v) => ({
      key: `${v.name} (${v.lang})${v.default ? " • default" : ""}`,
      voiceURI: v.voiceURI,
      name: v.name,
      lang: v.lang,
      default: v.default || false,
    }));
}

/** Speak text with the given voiceURI. Cancels any ongoing speech. */
export async function speak(text: string, voiceURI: string, rate = 1): Promise<void> {
  if (!isClient() || !text) return;

  const synth = window.speechSynthesis;
  synth.cancel(); // always stop before speaking new text

  const voices = await loadVoices();
  const voice = voices.find((v) => v.voiceURI === voiceURI);

  const utter = new SpeechSynthesisUtterance(text);
  if (voice) utter.voice = voice;
  utter.rate = rate;

  synth.speak(utter);
}

/** Stop any current speech immediately. */
export function stop(): void {
  if (!isClient()) return;
  window.speechSynthesis.cancel();
}