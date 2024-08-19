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
import { postRestoreSchema } from "@/validations/posts";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Post } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { updatePostFeature } from "@/actions/posts";

type PostRestoreButtonProps = {
  post: Pick<Post, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["post-restore-button"] &
  Dictionary["dialog"];

export function PostRestoreButton({
  dic: { "post-restore-button": c, ...dic },
  post,
  ...props
}: PostRestoreButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postRestoreSchema>>({
    resolver: zodResolver(postRestoreSchema),
    defaultValues: {
      id: post?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof postRestoreSchema>) {
    setLoading(true);
    // @ts-ignore
    toast.promise(updatePostFeature({ ...data, deletedAt: null }), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["restored successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                variant="secondary"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["restore"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["restore post"]}
      description={
        c?.[
          "restoring this post will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off."
        ]
      }
      {...props}
    />
  );
}
