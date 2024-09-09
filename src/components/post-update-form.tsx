"use client";

import { useEffect, useState } from "react";
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
import { cn, isValidUrl } from "@/lib/utils";
import { Image } from "@/components/image";
import { DialogResponsive } from "@/components/dialog";
import { ImageForm } from "@/components/image-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostRestoreButton } from "@/components/post-restore-button";
import { PostBinButton } from "@/components/post-bin-button";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { DrawerClose } from "@/components/ui/drawer";
import {
  applyAllFrames,
  uploadIntoSpace,
  watermarkImage,
} from "@/actions/images";
import { fetchImage } from "@/lib/uploader";

export type PostUpdateFormProps = {
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
  const [trigger, setTrigger] = useState<boolean>(loading ?? false);
  const [open, setOpen] = useState<boolean>(false);
  const [openFrame, setOpenFrame] = useState<boolean>(false);
  const [framedImages, setFramedImages] = useState<string[] | null>(null);
  const [src, setSrc] = useState<string | null>(
    post?.["image"]?.["src"] ?? null,
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!src) {
          setFramedImages([]);
          return;
        }

        const result = await applyAllFrames(src);
        setFramedImages(result);
      } catch (error) {
        setFramedImages([]);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [src]);

  function onSubmit(data: z.infer<typeof postUpdateSchema>) {
    setLoading(true);
    toast.promise(updatePost(JSON.stringify(data)), {
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
                  disabled={trigger || post?.["deletedAt"] ? false : disabled}
                  dic={dic}
                  asChild
                  post={post}
                >
                  <Button
                    disabled={trigger || post?.["deletedAt"] ? false : disabled}
                    variant="secondary"
                    size="sm"
                  >
                    {c?.["restore"]}
                  </Button>
                </PostRestoreButton>
              ) : (
                <PostBinButton
                  disabled={loading || trigger || disabled}
                  dic={dic}
                  asChild
                  post={post}
                >
                  <Button
                    disabled={loading || trigger || disabled}
                    size="sm"
                    variant="destructive"
                  >
                    {c?.["delete"]}
                  </Button>
                </PostBinButton>
              )}
              <Button
                disabled={loading || trigger}
                type="button"
                onClick={() => form.reset()}
                variant="outline"
                size="sm"
              >
                {c?.["discard"]}
              </Button>
              <Button
                disabled={loading || trigger}
                type="submit"
                size="sm"
                className="w-full"
              >
                {!disabled && loading && <Icons.spinner />}
                {c?.["save changes"]}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div
              className={cn(
                "relative h-full min-h-60 flex-col overflow-hidden rounded text-primary-foreground dark:border-r lg:flex",
                // form.watch("image") && `bg-[src(${form.getValues("image")})]`,
              )}
            >
              {/* <div className="absolute inset-0" /> */}
              {isValidUrl(form.watch("image.src") ?? "") ? (
                <Image
                  src={
                    form.watch("frame")
                      ? `data:image/png;base64,${JSON.parse(form.watch("frame")!)}`
                      : (form.watch("framedImageURL") ??
                        form.getValues("image.src")!)
                  }
                  alt=""
                />
              ) : null}
              <div className="absolute right-4 top-4 z-50 flex items-center gap-2 text-lg font-medium">
                <DialogResponsive
                  dic={dic}
                  disabled={loading || trigger}
                  confirmButton={
                    <>
                      <Button
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={loading || trigger}
                        className="w-full md:w-fit"
                      >
                        {!disabled && loading && <Icons.spinner />}
                        {c?.["submit"]}
                      </Button>
                    </>
                  }
                  content={
                    <>
                      <Tabs defaultValue="generate">
                        <TabsList>
                          <TabsTrigger value="choose">
                            {c?.["choose file"]}
                          </TabsTrigger>
                          <TabsTrigger value="generate">
                            {c?.["generate using AI"]}
                          </TabsTrigger>
                          {/* <TabsTrigger value="frame">apply frame</TabsTrigger> */}
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
                            setSrc={setSrc}
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
                  <Button
                    disabled={loading || trigger}
                    size="icon"
                    variant="secondary"
                  >
                    <Icons.edit />
                  </Button>
                </DialogResponsive>

                <DialogResponsive
                  dic={dic}
                  disabled={loading || trigger}
                  confirmButton={
                    <>
                      <Button
                        type="button"
                        onClick={() => setOpenFrame(false)}
                        disabled={loading || trigger}
                        className="w-full md:w-fit"
                      >
                        {!disabled && loading && <Icons.spinner />}
                        {c?.["submit"]}
                      </Button>
                    </>
                  }
                  content={
                    <>
                      <ImageForm.chooseFrame
                        dic={dic}
                        form={form}
                        loading={loading}
                        framedImages={framedImages}
                      />
                    </>
                  }
                  title={c?.["apply frame"]}
                  description={
                    c?.[
                      "updating an image allows you to refine and enhance the details of your ongoing developments"
                    ]
                  }
                  open={openFrame}
                  setOpen={setOpenFrame}
                >
                  <Button
                    disabled={loading || trigger}
                    size="icon"
                    variant="secondary"
                  >
                    <Icons.imageReload />
                  </Button>
                </DialogResponsive>
                {form.watch("framedImageURL") || form.watch("frame") ? (
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => {
                      form.setValue("framedImageURL", null);
                      form.setValue("frame", undefined);
                    }}
                    disabled={loading || trigger}
                  >
                    <Icons.x />
                  </Button>
                ) : null}
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
                disabled={(trigger ?? post?.["deletedAt"]) ? false : disabled}
                dic={dic}
                asChild
                post={post}
              >
                <Button
                  size="sm"
                  disabled={(trigger ?? post?.["deletedAt"]) ? false : disabled}
                  variant="secondary"
                >
                  {c?.["restore"]}
                </Button>
              </PostRestoreButton>
            ) : (
              <PostBinButton
                disabled={loading || trigger || disabled}
                dic={dic}
                asChild
                post={post}
              >
                <Button
                  size="sm"
                  disabled={loading || trigger || disabled}
                  variant="destructive"
                >
                  {c?.["delete"]}
                </Button>
              </PostBinButton>
            )}

            <Button
              type="button"
              onClick={() => form.reset()}
              variant="outline"
              size="sm"
            >
              {c?.["discard"]}
            </Button>

            <Button
              disabled={loading || trigger || disabled}
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
