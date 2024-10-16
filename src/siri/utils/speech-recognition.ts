export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export const createSpeechRecognition = ({
  onResult,
  onError,
  options = {}, // Optional options
}: {
  onResult: (result: SpeechRecognitionResult) => void;
  onError: (error: any) => void;
  options?: Partial<Window["SpeechRecognition"]>; // Use Partial to allow flexibility
}) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

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

  // Handle any errors
  recognition.onerror = onError;

  return recognition;
};
