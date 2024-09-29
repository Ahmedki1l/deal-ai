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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocale } from "@/hooks/use-locale";
import { ApplyFrameProps } from "@/lib/constants";
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
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

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
  Pick<DialogResponsiveProps, "dic"> &
  Pick<ApplyFrameProps, "dic">;

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
        contents,
        containerId: containerRef?.["current"]?.["id"]!,
        width: containerRef?.["current"]?.["offsetWidth"]!,
        height: containerRef?.["current"]?.["offsetHeight"]!,
      });

      const init = async () => {
        form.setValue("editor.cropRect", editor?.["current"]!.cropRect!);

        const { photoNode } = await editor?.["current"]!.addPhoto({
          url: image?.["src"],
        });
        form.setValue("editor.photo", photoNode);
      };

      const handleResize = () => {
        editor.current?.setEditorSize({
          width: containerRef?.["current"]?.["offsetWidth"]!,
          height: containerRef?.["current"]?.["offsetHeight"]!,
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

    toast.success("saved");
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
              <ToggleGroup type="single" defaultValue="1:1">
                <ToggleGroupItem
                  value="1:1"
                  onClick={() => {
                    editor?.["current"]?.adjustCropRect({
                      ratio: 1 / 1,
                    });
                  }}
                >
                  1:1
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="3:4"
                  onClick={() => {
                    editor?.["current"]?.adjustCropRect({
                      ratio: 3 / 4,
                    });
                  }}
                >
                  3:4
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="9:16"
                  onClick={() => {
                    editor?.["current"]?.adjustCropRect({
                      ratio: 9 / 16,
                    });
                  }}
                >
                  9:16
                </ToggleGroupItem>
              </ToggleGroup>
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
          <div className="container absolute left-2 top-2 z-50 max-h-[100%] max-w-xs space-y-4 overflow-auto">
            <Card className="space-y-1">
              <CardHeader className="flex flex-row items-center justify-between p-0 px-2">
                <CardTitle>Layers</CardTitle>
              </CardHeader>

              <CardContent className="p-2 pt-0">
                <ToggleGroup type="single" className="flex-col">
                  {form.watch("editor.cropRect") ? (
                    <>
                      {[form.getValues("editor.cropRect")].map((node, i) => (
                        <ToggleGroupItem
                          value={`rect-${i + 1}`}
                          onClick={() => editor?.["current"]!.dragNode(node)}
                        >
                          Image Size
                        </ToggleGroupItem>
                      ))}
                      <Separator className="my-2" />
                    </>
                  ) : null}

                  {form.watch("editor.photo") ? (
                    <>
                      {[form.getValues("editor.photo")].map((node, i) => (
                        <ToggleGroupItem
                          value={`photo-${i + 1}`}
                          onClick={() => editor?.["current"]!.dragNode(node)}
                        >
                          <Image src={form.getValues("src")} alt="" />
                        </ToggleGroupItem>
                      ))}

                      <Separator className="my-2" />
                    </>
                  ) : null}
                  {form.watch("editor.frame") ? (
                    <>
                      {[form.getValues("editor.frame")].map((node, i) => (
                        <ToggleGroupItem
                          value={`frame-${i + 1}`}
                          onClick={() => editor?.["current"]!.dragNode(node)}
                        >
                          <Image src={form.getValues("filledFrame")!} alt="" />
                        </ToggleGroupItem>
                      ))}
                      <Separator className="my-2" />
                    </>
                  ) : null}

                  {form.watch("editor.textNodes")
                    ? [...form.getValues("editor.textNodes")].map((node, i) => (
                        <ToggleGroupItem
                          value={`text-${i + 1}`}
                          onClick={() => editor?.["current"]!.dragNode(node)}
                        >
                          {node?.text()}
                        </ToggleGroupItem>
                      ))
                    : null}
                </ToggleGroup>
              </CardContent>
            </Card>

            <Card className="space-y-1">
              <CardHeader className="flex flex-row items-center justify-between p-0 px-2">
                <CardTitle>Photo</CardTitle>

                <div className="flex items-center gap-2">
                  <ImageForm.regenerateImage
                    dic={dic}
                    form={form}
                    loading={loading}
                    editor={editor}
                  />
                  <ImageForm.uploadFile
                    dic={dic}
                    form={form}
                    loading={loading}
                    editor={editor}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-2 pt-0">
                {form.watch("editor.photo") ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.photo")!?.width()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.photo")!
                            ?.width(
                              Number(Number(e?.target?.value)?.toFixed(0)),
                            )
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.photo")!?.height()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.photo")!
                            ?.height(
                              Number(Number(e?.target?.value)?.toFixed(0)),
                            )
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>X</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.photo")!?.x()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.photo")!
                            ?.x(Number(Number(e?.target?.value)?.toFixed(0)))
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>Y</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.photo")!?.y()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.photo")!
                            ?.y(Number(Number(e?.target?.value)?.toFixed(0)))
                        }
                        className="m-0 p-0"
                      />
                    </div>
                  </div>
                ) : null}
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

                {!!form.watch("editor.frame") ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.frame")!?.width()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.frame")!
                            ?.width(
                              Number(Number(e?.target?.value)?.toFixed(0)),
                            )
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.frame")!?.height()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.frame")!
                            ?.height(
                              Number(Number(e?.target?.value)?.toFixed(0)),
                            )
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>X</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.frame")!?.x()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.frame")!
                            ?.x(Number(Number(e?.target?.value)?.toFixed(0)))
                        }
                        className="m-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>Y</Label>
                      <Input
                        type="number"
                        disabled={loading}
                        defaultValue={Number(
                          Number(
                            form.watch("editor.frame")!?.y()! ?? 0,
                          )?.toFixed(0),
                        )}
                        onChange={(e) =>
                          form
                            .watch("editor.frame")!
                            ?.y(Number(Number(e?.target?.value)?.toFixed(0)))
                        }
                        className="m-0 p-0"
                      />
                    </div>
                  </div>
                ) : null}
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
                        const { textNode } = editor?.["current"]?.addText({
                          lang,
                        })!;
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

              <CardContent className="space-y-2 p-2 pt-0">
                {form.watch("editor.textNodes") &&
                  form.watch("editor.textNodes")?.map((txt, i) => {
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          type="text"
                          disabled={loading}
                          defaultValue={txt?.text()}
                          onChange={(e) => txt?.setText(e?.target?.value)}
                        />

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Icons.edit />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <Label>Color</Label>
                                <Input
                                  type="color"
                                  disabled={loading}
                                  // @ts-ignore
                                  defaultValue={txt?.fill()!}
                                  onChange={(e) => txt?.fill(e?.target?.value)}
                                  className="m-0 p-0"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <Label>Font Size</Label>

                                <Input
                                  type="number"
                                  disabled={loading}
                                  defaultValue={Number(
                                    Number(txt?.fontSize()! ?? 0)?.toFixed(0),
                                  )}
                                  onChange={(e) =>
                                    txt?.fontSize(
                                      Number(
                                        Number(e?.target?.value)?.toFixed(0),
                                      ),
                                    )
                                  }
                                  className="m-0 p-0"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <Label>Width</Label>
                                <Input
                                  type="number"
                                  disabled={loading}
                                  defaultValue={Number(
                                    Number(txt?.width()! ?? 0)?.toFixed(0),
                                  )}
                                  onChange={(e) =>
                                    txt?.width(
                                      Number(
                                        Number(e?.target?.value)?.toFixed(0),
                                      ),
                                    )
                                  }
                                  className="m-0 p-0"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <Label>Height</Label>
                                <Input
                                  type="number"
                                  disabled={loading}
                                  defaultValue={Number(
                                    Number(txt?.height()! ?? 0)?.toFixed(0),
                                  )}
                                  onChange={(e) =>
                                    txt?.height(
                                      Number(
                                        Number(e?.target?.value)?.toFixed(0),
                                      ),
                                    )
                                  }
                                  className="m-0 p-0"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <Label>X</Label>
                                <Input
                                  type="number"
                                  disabled={loading}
                                  defaultValue={Number(
                                    Number(txt?.x()! ?? 0)?.toFixed(0),
                                  )}
                                  onChange={(e) =>
                                    txt?.x(
                                      Number(
                                        Number(e?.target?.value)?.toFixed(0),
                                      ),
                                    )
                                  }
                                  className="m-0 p-0"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <Label>Y</Label>
                                <Input
                                  type="number"
                                  disabled={loading}
                                  defaultValue={Number(
                                    Number(txt?.y()! ?? 0)?.toFixed(0),
                                  )}
                                  onChange={(e) =>
                                    txt?.y(
                                      Number(
                                        Number(e?.target?.value)?.toFixed(0),
                                      ),
                                    )
                                  }
                                  className="m-0 p-0"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>

          <div
            id="photo-editor-container"
            ref={containerRef}
            className={cn(
              "bg-grid relative flex flex-1 items-center justify-center",
            )}
          />
        </div>
      </form>
    </Form>
  );
}
