"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { postUpdateContentSchema } from "@/validations/posts";
import { updatePostFeature } from "@/actions/posts";
import { PostForm } from "@/components/post-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Post } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type PostUpdateContentButtonProps = {
  post: Post;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["post-update-content-button"] &
  Dictionary["post-form"] &
  Dictionary["dialog"];

export function PostUpdateContentButton({
  dic: { "post-update-content-button": c, ...dic },
  post,
  ...props
}: PostUpdateContentButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateContentSchema>>({
    resolver: zodResolver(postUpdateContentSchema),
    defaultValues: { ...post, content: post?.["content"] ?? "" },
  });

  async function onSubmit(data: z.infer<typeof postUpdateContentSchema>) {
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
        return c?.["content updated successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
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
              <PostForm.content
                dic={dic}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["update content"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your post."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
