"use client";

import { callChatGPTWithFunctions } from "@/actions/siri";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  clearMessagesFromoLocalStorage,
  clientAction,
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
    // Call OpenAI with the user's input and the existing conversation history
    await clientAction(
      async () =>
        await callChatGPTWithFunctions(data?.["message"], conversation),
      setLoading,
    ).then((updatedMessages) => {
      if (!updatedMessages) return;

      // Update the conversation history and clear the input
      saveMessagesToLocalStorage(updatedMessages);
      setConversation(updatedMessages);
      form.setValue("message", "");
    });
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
