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
import { postDeleteSchema } from "@/validations/posts";
import { deletePost } from "@/actions/posts";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Post } from "@prisma/client";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";

type PostDeleteButtonProps = {
  post: Pick<Post, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["post-delete-button"] &
  Dictionary["dialog"];

export function PostDeleteButton({
  dic: { "post-delete-button": c, ...dic },
  post,
  ...props
}: PostDeleteButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postDeleteSchema>>({
    resolver: zodResolver(postDeleteSchema),
    defaultValues: {
      id: post?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof postDeleteSchema>) {
    setLoading(true);
    toast.promise(deletePost(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["deleted successfully."];
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
              <Button
                variant="destructive"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["delete"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["delete post"]}
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
