"use client";

import { updatePost } from "@/actions/posts";
import { Icons } from "@/components/icons";
import { PostBinButton } from "@/components/post-bin-button";
import { PostForm } from "@/components/post-form";
import { PostRestoreButton } from "@/components/post-restore-button";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientAction, cn } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { postUpdateSchema } from "@/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaseStudy, Image as ImageType, Post, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type PostUpdateFormProps = {
  post: Post & {
    image: ImageType | null;
    caseStudy: CaseStudy & { project: Project };
  };
  disabled?: boolean;
} & Dictionary["post-update-form"] &
  Dictionary["image-form"] &
  Dictionary["post-form"] &
  Dictionary["dialog"] &
  Dictionary["post-bin-button"] &
  Dictionary["post-restore-button"] &
  Dictionary["back-button"];

export function PostUpdateForm({
  dic: { "post-update-form": c, ...dic },
  post,
  disabled,
}: PostUpdateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      ...post,
      confirm: !!post?.["confirmedAt"],
    },
  });

  async function onSubmit(data: z.infer<typeof postUpdateSchema>) {
    await clientAction(async () => await updatePost(data), setLoading);

    toast.success(c?.["updated successfully."]);
    setOpen(false);
    form.reset();
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* <BackButton dic={dic} type="button" variant="ghost" size="sm" /> */}
              <h1 className="text-md font-semibold">{c?.["post details"]}</h1>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {post?.["deletedAt"] ? (
                <PostRestoreButton
                  disabled={post?.["deletedAt"] ? false : disabled}
                  dic={dic}
                  asChild
                  post={post}
                >
                  <Button
                    disabled={post?.["deletedAt"] ? false : disabled}
                    variant="secondary"
                    size="sm"
                  >
                    {c?.["restore post"]}
                  </Button>
                </PostRestoreButton>
              ) : (
                <PostBinButton
                  disabled={loading || disabled}
                  dic={dic}
                  asChild
                  post={post}
                >
                  <Button
                    disabled={loading || disabled}
                    size="sm"
                    variant="destructive"
                  >
                    {c?.["delete post"]}
                  </Button>
                </PostBinButton>
              )}

              <Button
                disabled={loading}
                type="submit"
                size="sm"
                className="w-full"
              >
                {!disabled && loading && <Icons.spinner />}
                {c?.["save changes"]}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[616px,1fr]">
            <div>
              <div
                className={cn(
                  "relative h-full min-h-60 flex-col overflow-hidden rounded text-primary-foreground dark:border-r lg:flex",
                  // form.watch("image") && `bg-[src(${form.getValues("image")})]`,
                )}
              >
                {/* <div className="absolute inset-0" /> */}

                {/* <Image /> */}
                <div className="absolute right-4 top-4 z-50 flex items-center gap-4 text-lg font-medium">
                  <Tooltip text={"edit image"}>
                    <Button type="button" size="icon" disabled={loading}>
                      <Icons.edit />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{c?.["post information"]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <PostForm.title
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <div>
                  <Label>{c?.["project name"]}</Label>
                  <Input
                    value={post?.["caseStudy"]?.["project"]?.["title"]}
                    disabled={true}
                  />
                </div>
                <PostForm.content
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <PostForm.contentLength
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                  <PostForm.campaignType
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                </div>
                <div className="grid items-center gap-4 md:grid-cols-[1fr,1fr]">
                  <PostForm.postAt
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                  <PostForm.noOfWeeks
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                </div>

                <PostForm.confirmedAt
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            {post?.["deletedAt"] ? (
              <PostRestoreButton
                disabled={post?.["deletedAt"] ? false : disabled}
                dic={dic}
                asChild
                post={post}
              >
                <Button
                  size="sm"
                  disabled={post?.["deletedAt"] ? false : disabled}
                  variant="secondary"
                >
                  {c?.["restore post"]}
                </Button>
              </PostRestoreButton>
            ) : (
              <PostBinButton
                disabled={loading || disabled}
                dic={dic}
                asChild
                post={post}
              >
                <Button
                  size="sm"
                  disabled={loading || disabled}
                  variant="destructive"
                >
                  {c?.["delete post"]}
                </Button>
              </PostBinButton>
            )}

            <Button
              disabled={loading || disabled}
              type="submit"
              size="sm"
              className="w-full"
            >
              {!disabled && loading && <Icons.spinner />}
              {c?.["save changes"]}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
