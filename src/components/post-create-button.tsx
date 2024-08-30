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
      postAt: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof postCreateSchema>) {
    setLoading(true);

    // Schedule the post and handle the promise
    toast.promise(createPost(data, project, caseStudy), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);

        return c?.["created successfully."];
      },
    });
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
