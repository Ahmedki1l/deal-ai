"use client";

import { updateImage } from "@/actions/images";
import { DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Image } from "@/components/image";
import { ImageForm, ImageFormProps } from "@/components/image-form";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks/use-locale";
import { PhotoEditor } from "@/lib/konva";
import { clientAction, cn } from "@/lib/utils";
import { ShortContents } from "@/types";
import { Dictionary } from "@/types/locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaseStudy, Image as ImageType, Post, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type ImageEditorProps = {
  image: ImageType & {
    post: Post & {
      caseStudy: CaseStudy & { project: Project };
    };
  };
  disabled?: boolean;
  contents: ShortContents;
} & Dictionary["image-editor"] &
  Pick<ImageFormProps, "dic"> &
  Pick<DialogResponsiveProps, "dic">;

export function ImageEditor({
  dic: { "image-editor": c, ...dic },
  image: { post, ...image },
  contents,
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
      src: image?.["src"],
      prompt: image?.["prompt"],
      dimensios: { width: "600", height: "600" },
    },
  });

  useEffect(() => {
    if (containerRef?.["current"]) {
      editor.current = new PhotoEditor({
        containerId: containerRef?.["current"]?.["id"]!,
      });

      const init = async () => {
        editor.current?.addContents({ contents });
        const { photoNode } = await editor?.["current"]!.addPhoto({
          url: image?.["src"],
        });
        form.setValue("editor.photo", photoNode);
      };

      const handleResize = () => {
        editor.current?.setEditorSize({
          width: containerRef?.["current"]?.["offsetWidth"] ?? 0,
          height: containerRef?.["current"]?.["offsetHeight"] ?? 0,
        });
      };

      window.addEventListener("resize", handleResize);

      init();
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  async function onSubmit(data: z.infer<typeof imageUpdateFormSchema>) {
    await clientAction(
      async () =>
        await updateImage({
          id: data?.["id"],
          prompt: data?.["prompt"],
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

        <div className="relative flex flex-1 flex-col">
          <div className="container absolute left-2 top-2 z-50 max-h-96 max-w-xs space-y-4 overflow-auto">
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

            <Card className="space-y-1">
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
                  form.watch("editor.textNodes")?.map((txt, i) => {
                    return (
                      <Input
                        key={txt?.id()}
                        type="text"
                        disabled={loading}
                        defaultValue={txt?.text()}
                        onChange={(e) => txt?.setText(e?.target?.value)}
                      />
                    );
                  })}
              </CardContent>
            </Card>
          </div>

          <div
            id="photo-editor-container"
            ref={containerRef}
            className={cn(
              "relative flex w-full flex-1 items-center justify-center bg-muted",
            )}
          />
        </div>

        <div>
          <Image src={form.watch("src")} alt="" />
        </div>
      </form>
    </Form>
  );
}
