// "use client";
// import { openai } from "@/lib/openai";
// import { useEffect, useState } from "react";

// // Define message types for handling conversation
// type SiriMessage =
//   | {
//       role: "system" | "user" | "assistant";
//       content: string;
//     }
//   | {
//       role: "function";
//       name: String;
//       content: string;
//     };

// // Load messages from local storage
// const loadMessagesFromLocalStorage = (): SiriMessage[] => {
//   if (typeof window !== "undefined") {
//     const savedMessages = localStorage.getItem("cachedMessages");
//     return savedMessages ? JSON.parse(savedMessages) : [];
//   }
//   return [];
// };

// // Save messages to local storage
// const saveMessagesToLocalStorage = (messages: SiriMessage[]) => {
//   localStorage.setItem("cachedMessages", JSON.stringify(messages));
// };

// // Main function to handle OpenAI requests with functions
// const callChatGPTWithFunctions = async (
//   userMessage: string,
//   existingMessages: SiriMessage[]
// ): Promise<SiriMessage[]> => {
//   // Step 1: Append the user's message to the existing conversation history
//   const messages: SiriMessage[] = [
//     ...existingMessages,
//     { role: "user", content: userMessage },
//   ];

//   // Step 2: Call OpenAI to generate a response based on the full conversation history
//   const chat = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content:
//           "Determine what the user needs to do. If the user is only questioning, answer simply. If the user wants to perform an action & its function is provided, do it. Otherwise, tell them that you as an AI can't do the specific action they want but guide them.",
//       },
//       ...messages,
//     ] as unknown as any,
//     functions: [
//       {
//         name: "helloWorld",
//         description: "Prints hello world with the string passed to it",
//         parameters: {
//           type: "object",
//           properties: {
//             appendString: {
//               type: "string",
//               description: "The string to append to the hello world message",
//             },
//           },
//           required: ["appendString"],
//         },
//       },
//       {
//         name: "getTimeOfDay",
//         description: "Gets the time of day",
//         parameters: {
//           type: "object",
//           properties: {},
//           required: [],
//         },
//       },
//     ],
//     function_call: "auto",
//   });

//   // Step 3: Determine whether ChatGPT wants to use a function
//   const wantsToUseFunction = chat.choices[0].finish_reason === "function_call";
//   let assistantMessage: SiriMessage = { role: "assistant", content: "" };

//   // Step 4: Handle function calls if necessary
//   if (wantsToUseFunction) {
//     const functionCall = chat.choices[0].message?.function_call;

//     if (functionCall?.name === "helloWorld") {
//       const args = JSON.parse(functionCall.arguments);
//       const content = helloWorld(args.appendString);
//       assistantMessage = {
//         role: "function",
//         name: functionCall?.["name"],
//         content: content,
//       };
//     } else if (functionCall?.name === "getTimeOfDay") {
//       const content = getTimeOfDay();
//       assistantMessage = {
//         role: "function",
//         name: functionCall?.["name"],
//         content: content,
//       };
//     }
//   } else {
//     assistantMessage = {
//       role: "assistant",
//       content: chat.choices[0].message?.content ?? "No response",
//     };
//   }

//   // Step 5: Append the assistant's response to the conversation history
//   const updatedMessages = [...messages, assistantMessage];
//   saveMessagesToLocalStorage(updatedMessages);

//   return updatedMessages;
// };

// // "Hello World" function
// const helloWorld = (appendString: string): string => {
//   return "Hello World! " + appendString;
// };

// // Get the current time of day
// const getTimeOfDay = (): string => {
//   const date = new Date();
//   let hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//   let timeOfDay = "AM";

//   if (hours > 12) {
//     hours = hours - 12;
//     timeOfDay = "PM";
//   }

//   return `${hours}:${minutes}:${seconds} ${timeOfDay}`;
// };

// // Main Next.js component for rendering the chat interface
// const Siri: React.FC = () => {
//   const [userMessage, setUserMessage] = useState<string>("");
//   const [conversation, setConversation] = useState<SiriMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Load cached messages when the component mounts
//   useEffect(() => {
//     const savedMessages = loadMessagesFromLocalStorage();
//     setConversation(savedMessages);
//   }, []);

//   // Function to handle user input and call OpenAI
//   const handleRequest = async () => {
//     if (!userMessage) return;
//     try {
//       setLoading(true);

//       // Call OpenAI with the user's input and the existing conversation history
//       const updatedMessages = await callChatGPTWithFunctions(
//         userMessage,
//         conversation
//       );

//       // Update the conversation history and clear the input
//       setConversation(updatedMessages);
//       setUserMessage("");
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h1>Chat with OpenAI</h1>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: "20px",
//           maxHeight: "400px",
//           overflowY: "scroll",
//           textAlign: "left",
//           marginBottom: "20px",
//         }}
//       >
//         {conversation.map((message, index) => (
//           <div key={index} style={{ margin: "10px 0" }}>
//             <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>{" "}
//             <span>{message.content}</span>
//           </div>
//         ))}
//       </div>

//       <textarea
//         value={userMessage}
//         onChange={(e) => setUserMessage(e.target.value)}
//         placeholder="Type your message..."
//         style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//         rows={3}
//       ></textarea>

//       <button
//         onClick={handleRequest}
//         disabled={loading}
//         style={{ padding: "10px", margin: "20px" }}
//       >
//         {loading ? "Processing..." : "Send"}
//       </button>
//     </div>
//   );
// };

// export default Siri;

"use client";

import { callChatGPTWithFunctions } from "@/actions/siri";
import {
  clearMessagesFromoLocalStorage,
  cn,
  loadMessagesFromLocalStorage,
  saveMessagesToLocalStorage,
} from "@/lib/utils";
import { z } from "@/lib/zod";
import { SiriMessage } from "@/types";
import { Dictionary } from "@/types/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z as Zod } from "zod";
import { DialogResponsive, DialogResponsiveProps } from "./dialog";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  message: z.string("message"),
});

type SiriProps = {} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["dialog"];
export function Siri({ dic, ...props }: SiriProps) {
  const [conversation, setConversation] = useState<SiriMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<Zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: undefined },
  });

  // Load cached messages when the component mounts
  useEffect(() => {
    const savedMessages: SiriMessage[] = loadMessagesFromLocalStorage();
    setConversation(savedMessages);
  }, []);

  // Function to handle voice recognition
  const handleVoiceRecognition = () => {
    if (typeof window === "undefined") return; // Ensure this code only runs in the browser

    // Safely access the SpeechRecognition API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      form.setValue("message", transcript); // Set the recognized speech as user input
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      toast.error(`Voice recognition error: ${event.error}`);
    };

    recognition.start();
  };

  async function onSubmit(data: Zod.infer<typeof formSchema>) {
    try {
      setLoading(true);

      // Call OpenAI with the user's input and the existing conversation history
      const updatedMessages = await callChatGPTWithFunctions(
        data?.["message"],
        conversation,
      );

      // Update the conversation history and clear the input
      saveMessagesToLocalStorage(updatedMessages);
      setConversation(updatedMessages);
      form.reset();
      // setOpen(false);
      // router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      title="Chat with OpenAI (Voice & Text)"
      description=""
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                variant="secondary"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                Send
              </Button>
            </form>
          </Form>
        </>
      }
      content={
        <>
          <div className="container h-60 w-full overflow-y-auto border py-4">
            {conversation?.["length"] ? (
              conversation.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "my-4 flex items-center",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <p
                    className={cn(
                      "w-fit rounded-md px-2 py-1",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <p>No Messages Yet</p>
              </div>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-20 w-full"
                        placeholder="Message AI..."
                        rows={3}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={() => {
                  clearMessagesFromoLocalStorage();
                  setConversation([]);
                }}
              >
                Clear History
              </Button>
              {/* <button
                  type="button"
                  onClick={handleVoiceRecognition}
                  disabled={loading}
                  style={{ padding: "10px", margin: "20px" }}
                >
                  {loading ? "Processing..." : "Speak"}
                </button> */}
            </form>
          </Form>
        </>
      }
      {...props}
    >
      <Button className="absolute bottom-2 right-2">Siri</Button>
    </DialogResponsive>
  );
}
