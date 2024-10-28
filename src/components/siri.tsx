"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { useSession } from "@/components/session-provider";
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
import { useLocale } from "@/hooks/use-locale";
import { AI } from "@/lib/siri";
import { clientAction, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useConversation, useSpeechRecognition } from "voicegpt-assistant";
import { z } from "zod";
import { Tooltip } from "./tooltip";

const formSchema = z.object({
  message: z
    .string({
      required_error: `message is required.`,
      invalid_type_error: `message must be string.`,
    })
    .min(1, `message is required.`),
});

type SiriProps = Omit<DialogResponsiveProps, "open" | "setOpen">;
export function Siri({ ...props }: SiriProps) {
  const locale = useLocale();
  const { user } = useSession();
  const [loading, setLoading] = useState(false);

  const { messages, updateMessages, clearMessages } =
    useConversation("siriMessages");
  const {
    listening,
    setListening,
    open,
    setOpen,
    transcript,
    setTranscript,
    error,
    setError,
  } = useSpeechRecognition({
    key: "Hey Siri",
    recognitionOptions: {
      lang: "en-US", // Custom recognition options, like language
      continuous: true, // Keep listening continuously
    },
  });

  useEffect(() => {
    if (transcript) {
      form.setValue("message", form.getValues("message") + " " + transcript);
      setTranscript(null);
    }

    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [transcript, error]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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

      updateMessages(updatedMessages);
      form.setValue("message", "");
    });
  };

  return (
    <DialogResponsive
      open={open}
      setOpen={setOpen}
      title="Chat with OpenAI (Voice & Text)"
      confirmButton={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button
              variant="secondary"
              className="w-full md:w-fit"
              disabled={loading || listening}
            >
              {loading && <Icons.spinner />}
              Send
            </Button>
          </form>
        </Form>
      }
      content={
        <>
          <div className="container h-60 w-full overflow-y-auto border py-4">
            {messages?.length ? (
              messages?.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "my-4 flex items-center",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <p
                    className={cn(
                      "w-fit rounded-md px-2 py-1",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
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
                        disabled={loading || listening}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                disabled={loading || listening}
                onClick={clearMessages}
              >
                Clear History
              </Button>

              <Button
                type="button"
                disabled={loading}
                onClick={() => setListening((prev) => !prev)}
              >
                {listening ? "Stop Listening" : "Start Listening"}
              </Button>
            </form>
          </Form>
        </>
      }
      {...props}
    >
      <div>
        <Tooltip text="Hey Siri">
          <Button className="fixed bottom-2 right-2">Siri</Button>
        </Tooltip>
      </div>
    </DialogResponsive>
  );
}