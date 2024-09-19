"use client";

import { updatePost } from "@/actions/posts";
import { DialogResponsive } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Image } from "@/components/image";
import { frames as FilledFrames, ImageForm } from "@/components/image-form";
import { PostBinButton } from "@/components/post-bin-button";
import { PostForm } from "@/components/post-form";
import { PostRestoreButton } from "@/components/post-restore-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/hooks/use-locale";
import { PhotoEditor } from "@/lib/konva";
import { t } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { postUpdateSchema } from "@/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaseStudy, Image as ImageType, Post, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import frame0 from "../../public/frames/frame-00.png";
import frame2 from "../../public/frames/frame-02.png";
import frame3 from "../../public/frames/frame-03.png";
import frame4 from "../../public/frames/frame-04.png";
import frame5 from "../../public/frames/frame-05.png";
import frame6 from "../../public/frames/frame-06.png";
import frame7 from "../../public/frames/frame-07.png";
import frame8 from "../../public/frames/frame-08.png";
import frame9 from "../../public/frames/frame-09.png";
import frame10 from "../../public/frames/frame-10.png";
import frame11 from "../../public/frames/frame-11.png";
import frame12 from "../../public/frames/frame-12.png";
import frame13 from "../../public/frames/frame-13.png";
import frame14 from "../../public/frames/frame-14.png";
import frame15 from "../../public/frames/frame-15.png";
import frame16 from "../../public/frames/frame-16.png";
import { Tooltip } from "./tooltip";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const frames = [
  frame0,
  // frame1,
  frame2,
  frame3,
  frame4,
  frame5,
  frame6,
  frame7,
  frame8,
  frame9,
  frame10,
  frame11,
  frame12,
  frame13,
  frame14,
  frame15,
  frame16,
];

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
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [trigger, setTrigger] = useState<boolean>(loading ?? false);

  const [editable, setEditable] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openFrame, setOpenFrame] = useState<boolean>(false);

  const [src, setSrc] = useState<string | null>(
    post?.["framedImageURL"] ?? post?.["image"]?.["src"] ?? null,
  );
  const [frame, setFrame] = useState<string | null>(null);

  const containerRef = useRef<null>(null);
  const editorRef = useRef<PhotoEditor | null>(null);

  const form = useForm<z.infer<typeof postUpdateSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      ...post,
      image: {
        ...post?.["image"],
        src: post?.["image"]?.["src"],
        prompt: post?.["image"]?.["prompt"],

        file: undefined,
        base64: undefined,
      },
      frame: undefined,
      confirm: !!post?.["confirmedAt"],
    },
  });

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = new PhotoEditor(containerRef?.["current"]?.["id"]);

      if (src) {
        if (src?.includes("data:image/png;base64,"))
          editorRef?.current?.addBase64(src);
        else editorRef?.current?.addPhoto(src);
      }

      if (frame) {
        editorRef?.current?.addFrame(Number(frame), {
          title: post?.["caseStudy"]?.["project"]?.["title"],
          phone: "+20123 456 7890",
          website: "www.x.com",
        });
      }
    }
  }, [src, frame]);

  function onSubmit(data: z.infer<typeof postUpdateSchema>) {
    setLoading(true);
    toast.promise(
      updatePost(
        JSON.stringify({
          ...data,
          frame:
            data?.["frame"] || data?.["image"]?.["base64"]
              ? editorRef?.["current"]?.getResult()
              : undefined,
          image: { ...data?.["image"], file: undefined, base64: undefined },
        } satisfies z.infer<typeof postUpdateSchema>),
      ),
      {
        finally: () => setLoading(false),
        error: async (err) => {
          const msg = await t(err?.["message"], lang);
          return msg;
        },
        success: () => {
          router.refresh();
          return c?.["updated successfully."];
        },
      },
    );

    // console.log({
    //   ...data?.["image"],
    //   frame: data?.["frame"] ? editorRef?.["current"]?.getResult() : null,
    // });
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
                    {c?.["restore post"]}
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
                    {c?.["delete post"]}
                  </Button>
                </PostBinButton>
              )}

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

          <div className="grid gap-4 lg:grid-cols-[616px,1fr]">
            <div>
              <div
                className={cn(
                  "relative h-full min-h-60 flex-col overflow-hidden rounded text-primary-foreground dark:border-r lg:flex",
                  // form.watch("image") && `bg-[src(${form.getValues("image")})]`,
                )}
              >
                {/* <div className="absolute inset-0" /> */}

                <div
                  id="photo-editor-container"
                  ref={containerRef}
                  className={cn(
                    "h-[616px] w-[616px]",
                    editable && "border-4 border-green-600 p-1",
                  )}
                />
                <div className="absolute right-4 top-4 z-50 flex items-center gap-4 text-lg font-medium">
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
                        <Tabs defaultValue="choose">
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
                              setSrc={setSrc}
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
                    <div>
                      <Tooltip text="update photo">
                        <Button
                          type="button"
                          disabled={loading || trigger}
                          size="icon"
                          variant="secondary"
                        >
                          <Icons.edit />
                        </Button>
                      </Tooltip>
                    </div>
                  </DialogResponsive>

                  <div className="flex items-center gap-1">
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
                          {frame ? (
                            <Tabs defaultValue="choosen frame">
                              <TabsList>
                                <TabsTrigger value="choosen frame">
                                  choosen frame
                                </TabsTrigger>
                                <TabsTrigger value="choose frame">
                                  choose another frame
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="choosen frame">
                                <Image
                                  src={FilledFrames?.[Number(frame)]?.["src"]}
                                  alt=""
                                  className={cn("aspect-square")}
                                />
                              </TabsContent>
                              <TabsContent value="choose frame">
                                <ImageForm.frame
                                  dic={dic}
                                  form={form}
                                  loading={loading}
                                  setFrame={setFrame}
                                />
                              </TabsContent>
                            </Tabs>
                          ) : (
                            <ImageForm.frame
                              dic={dic}
                              form={form}
                              loading={loading}
                              setFrame={setFrame}
                            />
                          )}
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
                      <div>
                        <Tooltip text="add frame">
                          <Button
                            type="button"
                            disabled={loading || trigger}
                            size="icon"
                            variant="secondary"
                          >
                            <Icons.imageReload />
                          </Button>
                        </Tooltip>
                      </div>
                    </DialogResponsive>

                    {form.watch("framedImageURL") || form.watch("frame") ? (
                      <Tooltip text="clear frame">
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => {
                            form.setValue("framedImageURL", null);
                            form.setValue("frame", undefined);

                            setFrame(null);
                          }}
                          disabled={loading || trigger}
                        >
                          <Icons.x />
                        </Button>
                      </Tooltip>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <Tooltip text={editable ? "stop editing" : "start editing"}>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const ed = editorRef?.current?.toggleEditorMode();
                          setEditable(ed ?? !editable);
                        }}
                        disabled={loading}
                      >
                        <Icons.image />
                      </Button>
                    </Tooltip>

                    <Tooltip text="new text">
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          editorRef?.current?.addText({});
                        }}
                        disabled={loading}
                      >
                        <Icons.write />
                      </Button>
                    </Tooltip>
                  </div>
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
                  {c?.["restore post"]}
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
                  {c?.["delete post"]}
                </Button>
              </PostBinButton>
            )}

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
