"use client";

import { updatePostFeature } from "@/actions/posts";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { clientAction } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { postRestoreSchema } from "@/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type PostRestoreButtonProps = {
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

  async function onSubmit(data: z.infer<typeof postRestoreSchema>) {
    await clientAction(
      async () => await updatePostFeature({ ...data, deletedAt: null }),
      setLoading,
    );

    toast.success(c?.["restored successfully."]);
    setOpen(false);
    form.reset();
    router.refresh();
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
