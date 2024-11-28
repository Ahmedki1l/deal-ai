"use client";

import { DialogResponsiveProps } from "@/components/dialog";
import { useSession } from "@/components/session-provider";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { t } from "@/lib/locale";
import { AI } from "@/lib/siri";
import { clientAction, cn } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashIcon } from "@radix-ui/react-icons";
import {
  BotMessageSquare,
  BotOff,
  Mic,
  MicOff,
  StopCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useConversation } from "voicegpt-assistant";
import { z } from "zod";
import { Icons } from "./icons";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  message: z
    .string({
      required_error: `message is required.`,
      invalid_type_error: `message must be string.`,
    })
    .min(1, `message is required.`),
});

type SiriProps = {} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Pick<DialogResponsiveProps, "dic"> &
  Dictionary["siri"];

export function Siri({ dic: { siri: c, ...dic }, ...props }: SiriProps) {
  const locale = useLocale();
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [gotKey, setGotKey] = useState(false);
  const [timer, setTimer] = useState(null);

  const { messages, updateMessages, clearMessages } =
    useConversation("siriMessages");
  const {
    listening,
    transcript,
    setTranscript,
    error,
    setError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    options: {
      lang: locale === "en" ? "en-US" : locale, // Custom recognition options, like language
      continuous: true, // Keep listening continuously
    },
  });
  const {
    speak,
    cancel,
    isSpeaking,
    loading: isLoadingToSpeak,
  } = useTextToSpeech();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const message = form.watch("message");

  useEffect(() => {
    // Clear any existing timer each time the user types or speaks
    clearTimeout(timer);

    // Check if there's a message and it's not just whitespace
    if (message && message.trim()) {
        const newTimer = setTimeout(() => {
            form.handleSubmit(onSubmit)();
        }, 3000); // Change the delay here if needed

        // Save the new timer
        setTimer(newTimer);
    }

    // Cleanup function to clear the timer when the effect re-runs or component unmounts
    return () => clearTimeout(timer);
}, [message, transcript]); // Include both message and transcript in the dependencies array


  useEffect(() => {
    if (transcript) {
      if (!gotKey) {
        if (transcript.toLowerCase().includes(c?.["hello"]?.toLowerCase()!))
          setGotKey(true);

        setTranscript(null);
        return;
      }

      form.setValue("message", form.getValues("message") + " " + transcript);
      setTranscript(null);
    }

    if (error) {
      const msg = t(error, { from: "en", to: locale });
      toast.error(msg);
      setError(null);
    }
  }, [transcript, error]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    cancel();
    await clientAction(
      async () =>
        await AI.callChatGPTWithFunctions({
          userMessage: data.message,
          existingMessages: messages,
          args: { user: user, locale },
        }),
      setLoading
    ).then((updatedMessages) => {
      if (!updatedMessages) return;

      const cnt = messages?.pop()?.["content"];
      if (!loading && !listening && !isLoadingToSpeak && !isSpeaking && cnt)
        speak(cnt);

      updateMessages(updatedMessages);
      form.setValue("message", "");
    });
  };

  if (!gotKey)
    return (
      <div className="fixed bottom-2 flex flex-col items-end gap-2 ltr:right-2 rtl:left-2">
        {listening ? (
          <div className="absolute right-2 top-2 flex items-center justify-center">
            <>
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-500" />
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 delay-100" />
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-300 delay-300" />
            </>
          </div>
        ) : null}

        <Tooltip text={`${c?.["say"]} ${c?.["hello"]}`}>
          <Button
            variant="outline"
            size="icon"
            className="float-end"
            onClick={() => {
              setGotKey(true);
              // clearMessages();
              cancel();
            }}
          >
            <BotOff className="size-4" />
          </Button>
        </Tooltip>
      </div>
    );

  return (
    <div className="fixed bottom-2 flex flex-col items-end gap-2 bg-background ltr:right-2 rtl:left-2">
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-96 space-y-2"
          >
            {loading ? (
              <div className={cn("my-4 flex items-center justify-start")}>
                <div
                  className={cn(
                    "w-fit rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
                  )}
                >
                  <div className="inline-flex gap-1">
                    <p className="m-0 size-1.5 animate-bounce rounded-full bg-muted-foreground p-0 transition-all delay-0"></p>
                    <p className="m-0 size-1.5 animate-bounce rounded-full bg-muted-foreground p-0 transition-all delay-75"></p>
                    <p className="m-0 size-1.5 animate-bounce rounded-full bg-muted-foreground p-0 transition-all delay-100"></p>
                  </div>
                </div>
              </div>
            ) : (
              messages
                ?.filter((e) => e?.["role"] !== "user")
                ?.slice(-1)
                ?.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "my-4 flex items-center",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "w-fit rounded-md px-2 py-1",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <p>{message?.["content"]}</p>
                      <div className="flex items-center justify-end">
                        <Tooltip text={isSpeaking ? "stop" : "read aloud"}>
                          <div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-4"
                              disabled={listening || isLoadingToSpeak}
                              onClick={() => {
                                if (isSpeaking) cancel();
                                else speak(message?.["content"]);
                              }}
                            >
                              {isLoadingToSpeak ? (
                                <DashIcon className="size-3 animate-spin rounded-full border border-primary" />
                              ) : isSpeaking ? (
                                <StopCircle className="size-3" />
                              ) : (
                                <Icons.speaker className="size-3" />
                              )}
                            </Button>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className={cn("my-4 flex flex-col items-end")}>
                  <FormLabel className="sr-only">{c?.["Message"]}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={loading || listening}
                      placeholder={c?.["Message AI..."]}
                      className={cn(
                        "max-h-40 rounded-xl bg-primary px-2 py-1 text-primary-foreground focus-visible:outline-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <div className="relative">
                {listening ? (
                  <div className="absolute right-2 top-2 flex items-center justify-center">
                    <>
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-500" />
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 delay-100" />
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-300 delay-300" />
                    </>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={!form.watch("message") || loading || listening}
                  className="relative float-end"
                >
                  <BotMessageSquare className="size-4" />
                  {c?.["send"]}
                </Button>
              </div>

              <Tooltip
                text={
                  listening ? c?.["Stop Listening"] : c?.["Start Listening"]
                }
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  onClick={() => {
                    if (listening) stopListening();
                    else {
                      cancel();
                      startListening();
                    }
                  }}
                >
                  {listening ? (
                    <MicOff className="size-4" />
                  ) : (
                    <Mic className="size-4" />
                  )}
                </Button>
              </Tooltip>
              {/* <Tooltip text={c?.["clear history"]}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={loading || listening}
                  onClick={clearMessages}
                >
                  <Trash className="size-4" />
                </Button>
              </Tooltip> */}
              <Tooltip text={`close the bot`}>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="float-end"
                  disabled={loading || listening}
                  onClick={() => {
                    setGotKey(false);
                    startListening();
                    cancel();
                  }}
                >
                  <BotOff className="size-4" />
                </Button>
              </Tooltip>
            </div>
          </form>
        </Form>
      </>
    </div>
  );
}
