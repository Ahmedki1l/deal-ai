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
import { postUpdateScheduleSchema } from "@/validations/posts";
import { updatePostFeature } from "@/actions/posts";
import { PostForm } from "@/components/post-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Post } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

export type PostUpdateScheduleButtonProps = {
  post: Post;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["post-update-schedule-button"] &
  Dictionary["post-form"] &
  Dictionary["dialog"];

export function PostUpdateScheduleButton({
  dic: { "post-update-schedule-button": c, ...dic },
  post,
  disabled,
  ...props
}: PostUpdateScheduleButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateScheduleSchema>>({
    resolver: zodResolver(postUpdateScheduleSchema),
    defaultValues: { ...post, postAt: post?.["postAt"] ?? undefined },
  });

  async function onSubmit(data: z.infer<typeof postUpdateScheduleSchema>) {
    setLoading(true);
    toast.promise(updatePostFeature(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["scheduled successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      disabled={loading}
      open={open}
      setOpen={setOpen}
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <PostForm.postAt dic={dic} form={form as any} loading={loading} />
            </form>
          </Form>
        </>
      }
      title={c?.["update schedule"]}
      description={
        c?.[
          "updating your post's scheule allows you to refine and enhance the details of your ongoing developments"
        ]
      }
      {...props}
    />
  );
}
