"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { PostForm } from "@/components/post-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { postCreateSchema } from "@/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Platform, Project, StudyCase } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type PostCreateButtonProps = {
  caseStudy: StudyCase;
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
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postCreateSchema>>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: { caseStudyId: caseStudy?.["id"] },
  });

  async function onSubmit(data: z.infer<typeof postCreateSchema>) {
    await clientHttpRequest(async () => {
      const response = await axios({ locale, user }).post(`/api/posts/generate-content-ideas`, {
        ...data,
        project,
        caseStudy,
      });

      if (response.data.success) {
        const contentIdeas = response.data.data;

        // 2. Prepare and Execute Concurrent POST Requests for Posts
        const postPromises: any[] = [];

        for (const platform in contentIdeas) {
          if (contentIdeas.hasOwnProperty(platform)) {
            const ideas = contentIdeas[platform];

            ideas.forEach((idea: any) => {
              const postData = {
                ...data,
                project,
                caseStudy,
                idea,
                platform,
              };

              postPromises.push(
                axios({ locale, user }).post(`/api/posts`, postData)
              );
            });
          }
        }

        const responses = await Promise.all(postPromises);

        // Handle individual post creation responses
        responses.forEach((postResponse, index) => {
          if (postResponse.data.success) {
            console.log(`Post ${index + 1} created successfully:`, postResponse.data.data);
          } else {
            console.error(`Failed to create Post ${index + 1}:`, postResponse.data.error);
          }
        });

        contentIdeas.map( async (idea: any) => {
          await axios({ locale, user }).post(`/api/posts`, {
            ...data,
            project,
            caseStudy,
            idea,
          });
        })
        console.log('Content Ideas Generated:', response.data.data);
      } else {
        console.error('Failed to generate content ideas:', response.data.error);
      }

      

      toast.success(c?.["created successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
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
                {!disabled && loading && <Icons.spinner />}
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
