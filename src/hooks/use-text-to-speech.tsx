import { openai } from "@/lib/siri";
import { useCallback, useState } from "react";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Function to speak the provided text
  const speak = useCallback(
    async (text: string) => {
      if (!text || loading || isSpeaking) return; // Prevent overlapping requests

      setLoading(true);

      try {
        // If there's already an audio playing, cancel it
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          URL.revokeObjectURL(audio.src);
        }

        // Request to generate speech audio from OpenAI
        const mp3 = await openai.audio.speech.create({
          model: "tts-1-hd",
          voice: "fable",
          input: text,
        });

        // Convert the audio data into a Blob and create an object URL
        const audioBuffer = Buffer.from(await mp3.arrayBuffer());
        const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create a new audio element
        const newAudio = new Audio(audioUrl);

        // Play the audio and handle state changes
        newAudio.play().then(() => {
          setLoading(false);
          setIsSpeaking(true); // Set isSpeaking when the audio starts
        });

        // Handle playback ending
        newAudio.onended = () => {
          setIsSpeaking(false);
          setLoading(false);
          URL.revokeObjectURL(audioUrl); // Clean up the URL
          setAudio(null); // Clear the audio element reference
        };

        // Handle playback errors
        newAudio.onerror = (err) => {
          console.error("Error playing audio:", err);
          setIsSpeaking(false);
          setLoading(false);
          URL.revokeObjectURL(audioUrl);
          setAudio(null); // Clear the audio element reference
        };

        // Save the audio element to control later
        setAudio(newAudio);
      } catch (error) {
        console.error("Error generating speech:", error);
        setIsSpeaking(false);
        setLoading(false);
      }
    },
    [loading, isSpeaking, audio]
  );

  // Function to cancel the speech
  const cancel = useCallback(() => {
    if (audio) {
      audio.pause(); // Stop the audio playback
      audio.currentTime = 0; // Reset the playback position
      setIsSpeaking(false);
      setLoading(false);

      // Clean up the URL
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }

      setAudio(null); // Clear the audio element reference
    }
  }, [audio]);

  return {
    isSpeaking,
    speak,
    cancel,
    loading,
  };
};
