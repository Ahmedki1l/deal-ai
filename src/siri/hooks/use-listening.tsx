// import { createSpeechRecognition } from "@/siri";
// import { useEffect, useRef, useState } from "react";

// type useListeningProps = {
//   key?: string;
// };
// export const useListening = ({ key }: useListeningProps) => {
//   const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

//   const [isConversationable, setIsConversationable] = useState(
//     key ? false : true
//   );
//   const [isListening, setIsListening] = useState(false);

//   const [transcript, setTranscript] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (key && !isConversationable) startPassiveListening();
//     if (isListening && isConversationable) startListening();

//     return () => {
//       recognitionRef.current?.stop();
//     };
//   }, [key, isConversationable, isListening]);

//   // Passive listening to detect "Hi Siri"
//   const startPassiveListening = () => {
//     recognitionRef.current = createSpeechRecognition(
//       ({ transcript }) => {
//         if (!key) return;
//         if (!transcript.toLowerCase().includes(key?.toLowerCase())) {
//           setError(
//             `Please start your command with 'Hi Siri'. You said: ${transcript}`
//           );
//           return;
//         }

//         setIsConversationable(true);
//       },
//       (error) => {
//         setError(`Speech recognition error: ${error.message}`);
//         console.error("Speech recognition error:", error);
//       }
//     );
//     recognitionRef?.current?.start();
//   };

//   // Actively listen to capture commands
//   const startListening = () => {
//     if (recognitionRef.current) recognitionRef.current.stop();

//     recognitionRef.current = createSpeechRecognition(
//       ({ transcript }) => {
//         setTranscript(transcript); // Capture and set the transcript
//         setIsListening(true);
//       },
//       (error) => {
//         setError(`Speech recognition error: ${error.message}`);
//         setIsListening(false);
//         console.error("Speech recognition error:", error);
//       }
//     );
//     recognitionRef.current.start();
//   };

//   // Stop listening
//   const stopListening = () => {
//     if (recognitionRef.current) recognitionRef.current.stop();
//     setIsListening(false);
//   };

//   return {
//     isConversationable,
//     setIsConversationable,

//     isListening,
//     setIsListening,

//     transcript,
//     setTranscript,

//     error,
//     setError,
//   };
// };

import { createSpeechRecognition } from "@/siri";
import { useEffect, useRef, useState } from "react";

type UseSpeechRecognitionOptions = {
  key?: string; // Optional key to trigger recognition (e.g., "Hi Siri")
  recognitionOptions?: Window["SpeechRecognition"]; // Custom options for the recognition
};

export const useSpeechRecognition = ({
  key,
  recognitionOptions,
}: UseSpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false); // Indicates active recording state
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  useEffect(() => {
    if (!open && key) {
      startPassiveListening();
    }
    if (open && listening) startListening(); // If no key, directly start listening

    return () => {
      recognitionRef.current?.stop();
    };
  }, [listening, open]);

  // Passive listening to detect the key phrase
  const startPassiveListening = () => {
    recognitionRef.current = createSpeechRecognition({
      onResult: ({ transcript }) => {
        if (key && transcript.toLowerCase().includes(key.toLowerCase())) {
          setOpen(true); // Trigger opening based on key phrase
        } else {
          setError(
            `Please start your command with '${key}'. You said: ${transcript}`,
          );
        }
      },
      onError: (error) => {
        setError(`Speech recognition error: ${error.message}`);
        console.error("Speech recognition error:", error);
      },
      options: recognitionOptions, // Custom options passed into speech recognition
    });
    recognitionRef.current?.start();
  };

  // Actively listen to capture speech input
  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();

    recognitionRef.current = createSpeechRecognition({
      onResult: ({ transcript }) => {
        setTranscript(transcript); // Capture the transcript
        setIsRecording(false); // Set recording state to false when done
      },
      onError: (error) => {
        setError(`Speech recognition error: ${error.message}`);
        console.error("Speech recognition error:", error);
        setIsRecording(false); // Stop recording on error
      },
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
    startListening, // Start the active listening process
    stopListening, // Stop listening
    startPassiveListening, // Start listening passively for the key phrase
  };
};
