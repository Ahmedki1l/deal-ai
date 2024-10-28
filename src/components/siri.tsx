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
import { t } from "@/lib/locale";
import { Dictionary } from "@/types/locale";
import { Bot } from "lucide-react";

const formSchema = z.object({
  message: z
    .string({
      required_error: `message is required.`,
      invalid_type_error: `message must be string.`,
    })
    .min(1, `message is required.`),
});

type SiriProps = {} &Omit<DialogResponsiveProps, "open" | "setOpen">&
Pick<DialogResponsiveProps, 'dic'>
&Dictionary['siri'];

export function Siri({dic: {siri: c, ...dic},  ...props }: SiriProps) {
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
    key: c?.['hello'],
    recognitionOptions: {
      lang: locale === 'en'?  "en-US" : locale, // Custom recognition options, like language
      continuous: true, // Keep listening continuously
    },
  });

  useEffect(() => {
    const trans = async (value:string) => await t(value, { from: "en", to: locale})
    if (transcript) {
      form.setValue("message", form.getValues("message") + " " + transcript);
      setTranscript(null);
    }

    if (error) {
      const msg = trans(error)
      toast.error(msg);
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
      dic={dic} open={open}
      setOpen={setOpen}
      title={c?.["Chat with OpenAI (Voice & Text)"]}
      disabled={loading || listening}
      confirmButton={<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            variant="secondary"
            className="w-full md:w-fit"
            disabled={loading || listening}
          >
            {loading && <Icons.spinner />}
            {c?.['send']}
          </Button>
        </form>
      </Form>}
      content={<>
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
              <p>{c?.['No Messages Yet']}</p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{c?.['Message']}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 w-full"
                      placeholder={c?.["Message AI..."]}
                      disabled={loading || listening}
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

          <div className="flex items-center gap-2 justify-start">

          <Button
              type="button"
              disabled={loading || listening}
              onClick={clearMessages}
            >
              {c?.["clear history"]}
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => setListening((prev) => !prev)}
            >
              {listening ? c?.["Stop Listening"] : c?.["Start Listening"]}
            </Button>
          </div>
          </form>
        </Form>
      </>}
      {...props}    >
      <div>
        <Tooltip text={c?.['hello']}>
          <Button variant='outline' size='icon' className="fixed bottom-2 rtl:left-2 ltr:right-2">
            <Bot />
          </Button>
        </Tooltip>
      </div>
    </DialogResponsive>
  );
}