"use client";

import { DialogResponsiveProps } from "@/components/dialog";
import { useSession } from "@/components/session-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { t } from "@/lib/locale";
import { AI } from "@/lib/siri";
import { clientAction, cn } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { BotMessageSquare, BotOff, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useConversation } from "voicegpt-assistant";
import { z } from "zod";
import { Icons } from "./icons";
import { Tooltip } from "./tooltip";
import { Form } from "./ui/form";

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
    key: c?.["hello"],
    recognitionOptions: {
      lang: locale === "en" ? "en-US" : locale, // Custom recognition options, like language
      continuous: true, // Keep listening continuously
    },
  });
  const {
    isSpeaking,
    speak,
    cancel,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
  } = useTextToSpeech({ locale });

  useEffect(() => {
    const trans = async (value: string) =>
      await t(value, { from: "en", to: locale });

    if (transcript) {
      form.setValue("message", form.getValues("message") + " " + transcript);
      setTranscript(null);
    }

    if (error) {
      const msg = trans(error);
      toast.error(msg);
      setError(null);
    }
  }, [transcript, error]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setListening(false);
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
      speak(updatedMessages?.pop()!?.["content"]);
      form.setValue("message", "");
    });
  };

  if (!open)
    return (
      <div className="fixed bottom-2 flex flex-col items-end gap-2 ltr:right-0 rtl:left-2">
        <Tooltip text={`${c?.["say"]} ${c?.["hello"]}`}>
          <Button
            variant="outline"
            size="icon"
            className="float-end"
            onClick={() => {
              setOpen(true);
              setListening(true);
            }}
            disabled={isSpeaking}
          >
            <BotOff />
          </Button>
        </Tooltip>
      </div>
    );

  return (
    <div className="fixed bottom-2 flex flex-col items-end gap-2 ltr:right-0 rtl:left-2">
      {/* <div className="flex flex-col items-end">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={cn(
              "my-2 flex max-w-96 items-center",
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
        ))}
      </div> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-end gap-2"
        >
          {listening ? (
            <>
              <div>
                <div className="relative inline-flex min-h-8 w-full max-w-96 gap-1 rounded-full border border-primary px-6 py-2 text-muted-foreground">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    disabled={loading || isSpeaking}
                    onClick={() => {
                      setOpen(false);
                      setListening(false);
                    }}
                    className="absolute left-0 top-0 size-2 rounded-full"
                  >
                    <Icons.x className="size-1" />
                  </Button>

                  <div className="relative">
                    {form?.getValues("message")}{" "}
                    {listening ? (
                      <div className="inline-flex">
                        <p className="animate-bounce delay-0">.</p>
                        <p className="animate-bounce delay-75">.</p>
                        <p className="animate-bounce delay-100">.</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <Tooltip text={c?.["send"]}>
                <Button
                  type="submit"
                  disabled={!form.getValues("message") || loading || isSpeaking}
                  variant="outline"
                  size="icon"
                  className="relative float-end"
                >
                  <BotMessageSquare />
                </Button>
              </Tooltip>
            </>
          ) : isSpeaking ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading || isSpeaking}
              onClick={() => setListening(true)}
              className="relative"
            >
              <div className="absolute right-2 top-2 flex items-center justify-center">
                <>
                  <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-500" />
                  <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 delay-100" />
                  <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-300 delay-300" />
                </>
              </div>

              <div
                onClick={() => {
                  if (loading) return;

                  cancel();
                }}
                className={cn(
                  buttonVariants({ variant: "destructive", size: "icon" }),
                  "absolute left-0 top-0 size-2 rounded-full"
                )}
              >
                <Icons.x className="size-1" />
              </div>
              <Mic />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading || isSpeaking}
              onClick={() => setListening(true)}
            >
              {loading ? <Icons.spinner /> : <BotMessageSquare />}
            </Button>
          )}
        </form>
      </Form>
    </div>
    // <DialogResponsive
    //   dic={dic}
    //   open={open}
    //   setOpen={setOpen}
    //   title={c?.["Chat with OpenAI (Voice & Text)"]}
    //   disabled={loading || listening}
    //   confirmButton={
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)}>
    //         <Button
    //           variant="secondary"
    //           className="w-full md:w-fit"
    //           disabled={loading || listening}
    //         >
    //           {loading && <Icons.spinner />}
    //           {c?.["send"]}
    //         </Button>
    //       </form>
    //     </Form>
    //   }
    //   content={
    //     <>
    //       <div className="container h-60 w-full overflow-y-auto border py-4">
    //         {messages?.length ? (
    // messages?.map((message, index) => (
    //   <div
    //     key={index}
    //     className={cn(
    //       "my-4 flex items-center",
    //       message.role === "user" ? "justify-end" : "justify-start"
    //     )}
    //   >
    //     <p
    //       className={cn(
    //         "w-fit rounded-md px-2 py-1",
    //         message.role === "user"
    //           ? "bg-primary text-primary-foreground"
    //           : "bg-secondary text-secondary-foreground"
    //       )}
    //     >
    //       {message.content}
    //     </p>
    //   </div>
    // ))
    //         ) : (
    //           <div className="flex h-full flex-1 items-center justify-center">
    //             <p>{c?.["No Messages Yet"]}</p>
    //           </div>
    //         )}
    //       </div>

    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    //       <FormField
    //         control={form.control}
    //         name="message"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>{c?.["Message"]}</FormLabel>
    //             <FormControl>
    //               <Textarea
    //                 className="min-h-20 w-full"
    //                 placeholder={c?.["Message AI..."]}
    //                 disabled={loading || listening}
    //                 {...field}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <div className="flex items-center justify-start gap-2">
    //         <Button
    //           type="button"
    //           disabled={loading || listening}
    //           onClick={clearMessages}
    //         >
    //           {c?.["clear history"]}
    //         </Button>

    //         <Button
    //           type="button"
    //           disabled={loading}
    //           onClick={() => setListening((prev) => !prev)}
    //         >
    //           {listening ? c?.["Stop Listening"] : c?.["Start Listening"]}
    //         </Button>
    //       </div>
    //     </form>
    //   </Form>
    // </>
    //   }
    //   {...props}
    // >
    //   <div>
    //     <Tooltip text={`say ${c?.["hello"]}`}>
    //       <Button
    //         variant="outline"
    //         size="icon"
    //         className="fixed bottom-2 ltr:right-2 rtl:left-2"
    //       >
    //         <Bot />
    //       </Button>
    //     </Tooltip>
    //   </div>
    // </DialogResponsive>
  );
}
