import { Locale } from "@/types/locale";
import { useEffect, useState } from "react";

export const useTextToSpeech = ({ locale }: { locale: Locale }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      // Set default voice based on the current locale
      const defaultVoice =
        availableVoices.find((voice) => voice.lang.startsWith(locale)) ||
        availableVoices.find((voice) => voice.lang.startsWith("en")); // Fallback to English if locale is not available
      if (defaultVoice) setSelectedVoice(defaultVoice);
    };

    populateVoices();
    if (synth.onvoiceschanged !== undefined)
      synth.onvoiceschanged = populateVoices;
  }, [locale]);

  const getLanguageFromText = (text: string) => {
    // Basic language detection logic based on text characters (adjust for your use case)
    const arabicRegex = /[\u0600-\u06FF]/; // Arabic characters
    if (arabicRegex.test(text)) return "ar";
    return "en"; // Default to English
  };

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) {
      console.error("Speech synthesis is already in progress.");
      return;
    }

    if (text.trim() === "") {
      console.error("Text is empty. Please provide valid text to speak.");
      return;
    }

    // Set voice based on detected language
    const detectedLanguage = getLanguageFromText(text);
    const voiceForLanguage = voices.find((voice) =>
      voice.lang.startsWith(detectedLanguage)
    );
    if (voiceForLanguage) setSelectedVoice(voiceForLanguage);

    const speech = new SpeechSynthesisUtterance(text);
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = (event) =>
      console.error("Error in speech synthesis: ", event);

    // Apply selected voice, rate, and pitch settings
    if (selectedVoice) speech.voice = selectedVoice;
    speech.rate = rate;
    speech.pitch = pitch;

    window.speechSynthesis.speak(speech);
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    speak,
    cancel,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
  };
};
