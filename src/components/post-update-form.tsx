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
import { postUpdateSchema } from "@/validations/posts";
import { updatePost } from "@/actions/posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { PostForm } from "@/components/post-form";
import { Image as ImageType, Post } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { Image } from "./image";
import { DialogResponsive } from "./dialog";
import { DialogClose } from "./ui/dialog";
import { DrawerClose } from "./ui/drawer";
import { ImageForm } from "./image-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PostRestoreButton } from "./post-restore-button";
import { PostBinButton } from "./post-bin-button";

type PostUpdateFormProps = {
  post: Post & { image: ImageType | null };
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
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      ...post,
      image: {
        ...post?.["image"],
        src: post?.["image"]?.["src"],
        prompt: post?.["image"]?.["prompt"],
      },
      confirm: !!post?.["confirmedAt"],
    },
  });

  function onSubmit(data: z.infer<typeof postUpdateSchema>) {
    setLoading(true);
    console.log(data?.["confirm"]);
    toast.promise(updatePost(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        return c?.["updated successfully."];
      },
    });
  }

  function isValidUrl(src: string) {
    try {
      new URL(src);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BackButton dic={dic} type="button" variant="ghost" size="sm" />
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
                    {c?.["restore"]}
                  </Button>
                </PostRestoreButton>
              ) : (
                <PostBinButton
                  disabled={disabled}
                  dic={dic}
                  asChild
                  post={post}
                >
                  <Button disabled={disabled} size="sm" variant="destructive">
                    {c?.["delete"]}
                  </Button>
                </PostBinButton>
              )}
              <Button
                disabled={loading}
                type="button"
                onClick={() => form.reset()}
                variant="outline"
                size="sm"
              >
                {c?.["discard"]}
              </Button>
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

          <div className="grid gap-4 lg:grid-cols-[0.7fr,1fr]">
            <div
              className={cn(
                "relative h-full min-h-60 flex-col overflow-hidden rounded text-primary-foreground dark:border-r lg:flex",
                // form.watch("image") && `bg-[src(${form.getValues("image")})]`,
              )}
            >
              <div className="absolute inset-0 bg-primary/30" />
              {isValidUrl(form.getValues("image.src") ?? "") ? (
                <Image src={form.getValues("image.src")!} alt="" />
              ) : null}
              <div className="absolute right-4 top-4 z-50 flex items-center text-lg font-medium">
                <DialogResponsive
                  dic={dic}
                  disabled={loading}
                  confirmButton={
                    <>
                      <DialogClose
                        disabled={loading}
                        asChild
                        className="hidden md:flex"
                      >
                        <Button disabled={loading} className="w-full md:w-fit">
                          {!disabled && loading && <Icons.spinner />}
                          {c?.["submit"]}
                        </Button>
                      </DialogClose>

                      <DrawerClose
                        disabled={loading}
                        asChild
                        className="md:hidden"
                      >
                        <Button disabled={loading} className="w-full md:w-fit">
                          {!disabled && loading && <Icons.spinner />}
                          {c?.["submit"]}
                        </Button>
                      </DrawerClose>
                    </>
                  }
                  content={
                    <>
                      <Tabs defaultValue="choose">
                        <TabsList>
                          <TabsTrigger value="choose">
                            {c?.["choose file"]}
                          </TabsTrigger>
                          <TabsTrigger value="generate">
                            {c?.["generate using AI"]}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="choose">
                          <ImageForm.src
                            dic={dic}
                            form={form}
                            loading={loading}
                          />
                        </TabsContent>
                        <TabsContent value="generate">
                          <ImageForm.prompt
                            dic={dic}
                            form={form}
                            loading={loading}
                          />
                        </TabsContent>
                      </Tabs>
                    </>
                  }
                  title={c?.["update image"]}
                  description={
                    c?.[
                      "updating an image allows you to refine and enhance the details of your ongoing developments"
                    ]
                  }
                  open={open}
                  setOpen={setOpen}
                >
                  <Button disabled={loading} size="icon" variant="secondary">
                    <Icons.edit />
                  </Button>
                </DialogResponsive>
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
                  {c?.["restore"]}
                </Button>
              </PostRestoreButton>
            ) : (
              <PostBinButton disabled={disabled} dic={dic} asChild post={post}>
                <Button size="sm" disabled={disabled} variant="destructive">
                  {c?.["delete"]}
                </Button>
              </PostBinButton>
            )}

            <Button
              disabled={loading}
              type="button"
              onClick={() => form.reset()}
              variant="outline"
              size="sm"
            >
              {c?.["discard"]}
            </Button>

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
      </form>
    </Form>
  );
}
