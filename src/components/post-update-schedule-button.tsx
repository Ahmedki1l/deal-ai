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
import { postUpdateScheduleSchema } from "@/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

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
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateScheduleSchema>>({
    resolver: zodResolver(postUpdateScheduleSchema),
    defaultValues: { ...post, postAt: post?.["postAt"] ?? undefined },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof postUpdateScheduleSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(`/api/posts/${id}`, {
        ...data,
      });
      toast.success(c?.["scheduled successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
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
