"use client";

import { updateImage } from "@/actions/images";
import { DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { ImageForm, ImageFormProps } from "@/components/image-form";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { PhotoEditor } from "@/lib/konva";
import { clientAction, cn } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaseStudy, Image as ImageType, Post, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Image } from "./image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type ImageEditorProps = {
  image: ImageType & {
    post: Post & {
      caseStudy: CaseStudy & { project: Project };
    };
  };
  disabled?: boolean;
} & Dictionary["image-editor"] &
  Pick<ImageFormProps, "dic"> &
  Pick<DialogResponsiveProps, "dic">;

export function ImageEditor({
  dic: { "image-editor": c, ...dic },
  image: { post, ...image },
  disabled,
}: ImageEditorProps) {
  const lang = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const containerRef = useRef<null>(null);
  const editor = useRef<PhotoEditor | null>(null);

  const form = useForm<z.infer<typeof imageUpdateFormSchema>>({
    // mode: "onSubmit",
    resolver: zodResolver(imageUpdateFormSchema),
    defaultValues: {
      id: image?.["id"],
      prompt: image?.["prompt"],
      dimensios: { width: "600", height: "600" },
    },
  });

  useEffect(() => {
    if (containerRef?.current) {
      editor.current = new PhotoEditor({
        containerId: containerRef?.["current"]?.["id"],
        width: 600,
        height: 600,
      });

      const { photoNode } = editor.current?.addPhoto({
        url: image?.["src"],
      });
      form.setValue("editor.photo", photoNode);

      // const handleResize = () => {
      //   const container = containerRef.current;
      //   editor.current?.setEditorSize({
      //     width: container?.["offsetWidth"] ?? 0,
      //     height: container?.["offsetHeight"] ?? 0,
      //   });
      // };

      // window.addEventListener("resize", handleResize);
      // handleResize();

      // return () => {
      //   window.removeEventListener("resize", handleResize);
      // };
    }
  }, []);

  async function onSubmit(data: z.infer<typeof imageUpdateFormSchema>) {
    await clientAction(
      async () =>
        await updateImage({
          ...data,
          src: editor?.["current"]?.getResult()!,
        }),
      setLoading,
    );

    toast.success("done");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col space-y-4"
      >
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <h2>dimensions</h2>
              <div className="flex max-w-40 items-start gap-2">
                <ImageForm.width dic={dic} form={form} loading={true} />
                <Icons.x className="mt-3" />
                <ImageForm.height dic={dic} form={form} loading={true} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip text="download it locally">
              <div>
                <Button disabled={loading} type="button" size="sm">
                  download
                </Button>
              </div>
            </Tooltip>

            <Tooltip text="post will be with no image">
              <div>
                <Button
                  disabled={loading}
                  type="button"
                  size="sm"
                  onClick={() => {
                    form.reset();
                    editor?.current?.reset();
                  }}
                >
                  clear
                </Button>
              </div>
            </Tooltip>

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

        <div className="grid grid-cols-[300px,1fr]">
          <div className="container space-y-4">
            <Card className="space-y-1">
              <CardHeader className="flex flex-row items-center justify-between p-0 px-2">
                <CardTitle>Photo</CardTitle>

                <ImageForm.regenerateImage
                  dic={dic}
                  form={form}
                  loading={loading}
                  editor={editor}
                />
              </CardHeader>

              <CardContent className="p-2 pt-0">
                <ImageForm.uploadFile
                  dic={dic}
                  form={form}
                  loading={loading}
                  editor={editor}
                />
              </CardContent>
            </Card>

            <Card className="space-y-1">
              <CardHeader className="flex flex-row items-center justify-between p-0 px-2">
                <CardTitle>Choose Frame</CardTitle>

                <ImageForm.frame
                  dic={dic}
                  form={form}
                  loading={loading}
                  editor={editor}
                />
              </CardHeader>

              <CardContent className="p-2 pt-0">
                {form.watch("filledFrame") && (
                  <CardContent className="p-2 pt-0">
                    <Image
                      src={form.watch("filledFrame")!}
                      alt=""
                      className="aspect-square"
                    />
                  </CardContent>
                )}
              </CardContent>
            </Card>

            {/* <Card className="space-y-1">
              <CardHeader className="flex flex-row items-center justify-between p-0 px-2">
                <CardTitle>Edit Text</CardTitle>

                <Tooltip text="new text">
                  <div>
                    <Button
                      disabled={loading}
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const { textNode } = editor?.["current"]?.addText({})!;
                        form.setValue("editor.textNodes", [
                          ...form.getValues("editor.textNodes"),
                          textNode,
                        ]);
                      }}
                    >
                      <Icons.add />
                    </Button>
                  </div>
                </Tooltip>
              </CardHeader>

              <CardContent className="p-2 pt-0">
                {form.watch("editor.textNodes") &&
                  form.getValues("editor.textNodes")?.map((txt, i) => (
                    <div key={i}>
                      <Input
                        defaultValue={txt?.text()}
                        onChange={(e) => txt?.setText(e?.target?.value)}
                      />
                    </div>
                  ))}
              </CardContent>
            </Card> */}
          </div>

          <div className="flex items-center justify-center bg-muted/50">
            <div
              id="photo-editor-container"
              ref={containerRef}
              className={cn("h-[604px] w-[604px] border-2 bg-muted")}
            />
          </div>
          {/* 

            // <div
            //   id="photo-editor-container"
            //   ref={containerRef}
            //   className={cn("relative w-full flex-1 border-2 bg-muted")}
            // /> */}
        </div>
      </form>
    </Form>
  );
}
