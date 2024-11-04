import {
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  Window,
} from "@/types/siri";
import { useEffect, useRef, useState } from "react";

const requestMicrophoneAccess = (): Promise<boolean> => {
  return new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        alert("Microphone access is required for voice recognition.");
        resolve(false);
      });
  });
};

const checkMicrophonePermission = async (): Promise<boolean> => {
  if (navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({
        // @ts-ignore
        name: "microphone",
      });
      if (permissionStatus.state === "granted") return true;
      else if (permissionStatus.state === "denied") {
        alert(
          "Microphone access has been denied. Please enable it in your browser settings."
        );
        return false;
      } else {
        return requestMicrophoneAccess();
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      return false;
    }
  } else {
    return requestMicrophoneAccess();
  }
};

const handleErrorMessages = (err: any) => {
  switch (err?.["error"]) {
    case "not-allowed":
      return "Microphone access is blocked. Please allow microphone access in your browser settings.";

    case "aborted":
      return "Microphone access is aborted.";

    case "no-speech":
      break;
    case "network":
      return "Network error detected. Please check your internet connection.";
  }
};

// const createSpeechRecognition = ({
//   onResult,
//   options,
//   states,
// }: {
//   onResult: (result: { transcript: string; confidence: number }) => void;
//   options?: Window["SpeechRecognition"];
//   states?: any;
// }) => {
//   const SpeechRecognition =
//     (window as unknown as Window)?.SpeechRecognition ||
//     (window as unknown as Window)?.webkitSpeechRecognition;

//   if (!SpeechRecognition)
//     throw new Error("Speech Recognition is not supported in this browser.");

//   const recognition = new SpeechRecognition();

//   Object.keys(options || {}).forEach((key) => {
//     if (key in recognition) {
//       recognition[key] = options[key as keyof Window["SpeechRecognition"]];
//     }
//   });

//   recognition.onstart = () => {
//     console.log("onstart: ");
//     states?.setListening(true);
//   };

//   recognition.onend = () => {
//     console.log("onend: listening = ", states?.listening);
//     if (states?.listening) {
//       console.log("onend: start again");
//       recognition.start();
//     }
//   };

//   recognition.onresult = (event: SpeechRecognitionEvent) => {
//     const lastResultIndex = event.results.length - 1;
//     const transcript = event.results[lastResultIndex][0].transcript;
//     const confidence = event.results[lastResultIndex][0].confidence;
//     console.log("onresult: ", transcript);
//     onResult({ transcript, confidence });
//   };

//   recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//     console.error("onerror: ", event);
//     const msg = handleErrorMessages(event);
//     if (msg) states?.setError(msg);

//     if (states?.listening && event.error !== "aborted") {
//       console.log("onerror: start again");
//       recognition.start();
//     }
//   };

//   // recognition.onnomatch = () => {
//   //   console.log("onnomatch: ");
//   // };
//   // recognition.onaudiostart = () => {
//   //   console.log("onaudiostart: ");
//   // };
//   // recognition.onaudioend = () => {
//   //   console.log("onaudioend: ");
//   // };

//   // recognition.onsoundstart = () => {
//   //   console.log("onsoundstart: ");
//   // };
//   // recognition.onsoundend = () => {
//   //   console.log("onsoundend: ");
//   // };

//   // recognition.onspeechstart = () => {
//   //   console.log("onspeechstart: ");
//   // };
//   // recognition.onspeechend = () => {
//   //   console.log("onspeechend: ");
//   // };
//   return recognition;
// };

// export const useSpeechRecognition = ({
//   options,
// }: {
//   options?: Window["SpeechRecognition"];
// }) => {
//   const [permission, setPermission] = useState(false);
//   const [listening, setListening] = useState(false);

//   const [transcript, setTranscript] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

//   useEffect(() => {
//     if (!permission) {
//       initPermission();
//       return;
//     }

//     if (listening) {
//       startListening();
//     } else {
//       stopListening();
//     }
//   }, [permission, listening]);

//   const initPermission = async () => {
//     const hasPermission = await checkMicrophonePermission();
//     setPermission(hasPermission);
//   };

//   const startListening = () => {
//     if (recognitionRef.current) recognitionRef.current.stop();
//     recognitionRef.current = createSpeechRecognition({
//       onResult: ({ transcript }) => {
//         setTranscript(transcript);
//       },
//       options,
//       states: { listening, setListening, setError },
//     });

//     recognitionRef.current.start();
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//   };

//   return {
//     listening,
//     transcript,
//     error,
//     startListening: () => setListening(true),
//     stopListening: () => setListening(false),
//   };
// };

export const useSpeechRecognition = ({
  options,
}: {
  options?: Window["SpeechRecognition"];
}) => {
  const [permission, setPermission] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);
  const listeningRef = useRef(listening); // Ref to track listening state

  useEffect(() => {
    if (!permission) {
      initPermission();
      return;
    }

    startListening();
  }, [permission]);

  useEffect(() => {
    listeningRef["current"] = listening;
  }, [listening]);

  const initPermission = async () => {
    const hasPermission = await checkMicrophonePermission();
    setPermission(hasPermission);
  };

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();

    const SpeechRecognition =
      (window as unknown as Window)?.SpeechRecognition ||
      (window as unknown as Window)?.webkitSpeechRecognition;

    if (!SpeechRecognition)
      throw new Error("Speech Recognition is not supported in this browser.");

    const recognition = new SpeechRecognition();

    Object.keys(options || {}).forEach((key) => {
      if (key in recognition) {
        recognition[key] = options[key as keyof Window["SpeechRecognition"]];
      }
    });

    recognition.onstart = () => {
      console.log("onstart:");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("onend: listening:", listeningRef.current);
      if (listeningRef.current) {
        console.log("onend: start again");
        recognition.start();
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript;
      console.log("onresult:", transcript);
      setTranscript(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("onerror:", event);
      const msg = handleErrorMessages(event);
      if (msg) setError(msg);

      // if (listeningRef.current && event.error !== "aborted") {
      //   console.log("onerror: start again");
      //   recognition.start();
      // }
    };

    recognitionRef.current = recognition;
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop();
  };

  return {
    listening,
    transcript,
    setTranscript,

    error,
    setError,

    startListening,
    stopListening,
  };
};
