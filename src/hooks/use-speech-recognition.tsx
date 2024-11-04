import { SpeechRecognitionEvent, Window } from "@/types/siri";
import { useEffect, useRef, useState } from "react";

// Utility function to check microphone permission
const checkMicrophonePermission = async () => {
  if (navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({
        // @ts-ignore
        name: "microphone",
      });

      if (permissionStatus.state === "granted") {
        return true; // Permission is granted
      } else if (permissionStatus.state === "denied") {
        alert(
          "Microphone access has been denied. Please enable it in your browser settings."
        );
        return false; // Permission denied
      } else {
        // Permission state is 'prompt'
        return requestMicrophoneAccess();
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      return false;
    }
  } else {
    // Permissions API not supported, fallback to requesting access
    return requestMicrophoneAccess();
  }
};

const requestMicrophoneAccess = () => {
  return new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        resolve(true); // Permission granted
      })
      .catch(() => {
        alert("Microphone access is required for voice recognition.");
        resolve(false); // Permission denied
      });
  });
};

export const createSpeechRecognition = ({
  onResult,
  onError,
  options = {}, // Optional options
}: {
  onResult: (result: { transcript: string; confidence: number }) => void;
  onError: (error: any) => void;
  options?: Partial<Window["SpeechRecognition"]>; // Use Partial to allow flexibility
}) => {
  const SpeechRecognition =
    (window as unknown as Window)?.SpeechRecognition ||
    (window as unknown as Window)?.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("Speech Recognition is not supported in this browser.");
  }

  const recognition = new SpeechRecognition();

  // Loop over provided options and apply them to the recognition object
  Object.keys(options).forEach((key) => {
    if (key in recognition) {
      // @ts-ignore - We use `any` because types are dynamically determined
      recognition[key] = options[key as keyof Window["SpeechRecognition"]];
    }
  });

  // Handle the result event
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript;
    const confidence = event.results[lastResultIndex][0].confidence;

    onResult({ transcript, confidence });
  };

  recognition.onsoundstart = () => {
    console.log("Speech started");
  };

  recognition.onspeechend = () => {
    console.log("Speech ended");
  };

  // onaudioend
  // onaudiostart
  // onend
  // onerror
  // onnomatch
  // onresult
  // onsoundend
  // onsoundstart
  // onspeechend
  // onspeechstart
  // onstart

  recognition.onerror = onError;

  return recognition;
};

export const useSpeechRecognition = ({
  key,
  recognitionOptions,
}: {
  key?: string; // Optional key to trigger recognition (e.g., "Hi Siri")
  recognitionOptions?: Window["SpeechRecognition"]; // Custom options for the recognition
}) => {
  const [listening, setListening] = useState(false);
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false); // Indicates active recording state
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  useEffect(() => {
    if (!open && key) initPassiveListening();
    if (open && listening) initActiveListening(); // If no key, directly start listening

    return () => {
      recognitionRef.current?.stop();
    };
  }, [listening, open]);

  // Initialize passive listening to detect the key phrase
  const initPassiveListening = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (hasPermission) {
      startPassiveListening();
    }
  };

  // Passive listening to detect the key phrase
  const startPassiveListening = () => {
    recognitionRef.current = createSpeechRecognition({
      onResult: ({ transcript }) => {
        if (key && transcript.toLowerCase().includes(key.toLowerCase())) {
          setOpen(true); // Trigger opening based on key phrase
          setListening(true); // Trigger opening based on key phrase
        }
      },
      onError: handleRecognitionError,
      options: recognitionOptions, // Custom options passed into speech recognition
    });
    recognitionRef.current?.start();
  };

  // Initialize active listening
  const initActiveListening = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (hasPermission) startListening();
  };

  // Actively listen to capture speech input
  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();

    recognitionRef.current = createSpeechRecognition({
      onResult: ({ transcript }) => {
        setTranscript(transcript); // Capture the transcript
        setIsRecording(false); // Set recording state to false when done
      },
      onError: handleRecognitionError,
      options: recognitionOptions,
    });
    recognitionRef.current.start();
    setIsRecording(true); // Indicate that recording has started
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setIsRecording(false); // Stop recording
  };

  // Handle recognition errors
  const handleRecognitionError = (error: any) => {
    console.error("Speech recognition error:", error);

    if (error?.["error"] === "not-allowed") {
      setError(
        "Microphone access is blocked. Please allow microphone access in your browser settings."
      );
    } else if (error?.["error"] === "aborted") {
      setError("Microphone access is aborted.");
    } else if (error?.["error"] === "no-speech") {
      setError("You have not said anything.");
    } else if (error?.["error"] === "network") {
      setError(
        "Network error detected. Please check your internet connection."
      );
    }
  };

  return {
    listening, // Listening state
    setListening, // Method to manually set listening state
    open, // Whether the assistant has been triggered
    setOpen,

    transcript, // The captured transcript
    setTranscript,
    error, // Any errors encountered
    setError,
    isRecording, // Whether recording is active
    startListening: initActiveListening, // Start the active listening process
    stopListening, // Stop listening
    startPassiveListening: initPassiveListening, // Start listening passively for the key phrase
  };
};
