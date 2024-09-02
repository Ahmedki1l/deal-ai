"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { postCreateSchema } from "@/validations/posts";
import { createPost } from "@/actions/posts";
import { PostForm } from "@/components/post-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { CaseStudy, Platform } from "@prisma/client";
import { Project } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";

export type PostCreateButtonProps = {
  caseStudy: CaseStudy;
  project: Project & { platforms: Platform[] };
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["post-create-button"] &
  Dictionary["post-form"] &
  Dictionary["dialog"];

export function PostCreateButton({
  dic: { "post-create-button": c, ...dic },
  caseStudy,
  project,
  disabled,
  ...props
}: PostCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postCreateSchema>>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      caseStudyId: caseStudy?.["id"],
      title: "x",
      content: "x",
      platform: "FACEBOOK",
    },
  });

  async function onSubmit(data: z.infer<typeof postCreateSchema>) {
    const toastId = toast.loading(c?.["initializing posts..."]);

    try {
      setLoading(true);

      // Create a POST request with the data
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          caseStudy,
          ...data,
        } satisfies z.infer<typeof postCreateSchema> & {
          project: Project & { platforms: Platform[] };
          caseStudy: CaseStudy;
        }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const { id } = await response.json().catch((err) => {
        setLoading(false);
        throw err;
      });

      // Start the EventSource after getting the id from the POST request
      const eventSource = new EventSource(`/api/posts?id=${id}`);

      eventSource.addEventListener("status", (event) => {
        toast.loading(event.data?.replaceAll('"', ""), {
          id: toastId,
        });
      });

      eventSource.addEventListener("completed", (event) => {
        toast.dismiss(toastId);
        eventSource.close();
        toast.success(event.data?.replaceAll('"', ""));

        router.refresh();
        setOpen(false);
        form.reset();
        setLoading(false);
      });

      eventSource.addEventListener("error", (event) => {
        console.error("Error occurred:", event);
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });

      eventSource.addEventListener("close", () => {
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);

      toast.error(err?.message);
    }
  }

  return (
    <DialogResponsive
      dic={dic}
      disabled={loading}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button disabled={loading} className="w-full md:w-fit">
                {loading && <Icons.spinner />}
                {c?.["submit"]}
              </Button>
            </form>
          </Form>
        </>
      }
      content={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {/* <PostForm.description
                dic={dic}
                form={form as any}
                loading={loading}
              /> */}
              <PostForm.noOfWeeks
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <PostForm.campaignType
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <PostForm.contentLength
                dic={dic}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["create posts"]}
      description={
        c?.[
          "streamline your marketing efforts by generating and scheduling posts across all your platforms using AI, and automatically publishes it at optimal times, maximizing reach and engagement."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
