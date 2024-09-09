"use client";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dictionary } from "@/types/locale";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Image as ImageType } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { Textarea } from "./ui/textarea";
import { convertBase64, isValidUrl } from "@/lib/utils";
import { Image } from "./image";
import { Icons } from "./icons";
import { toast } from "sonner";
import {
  applyAllFrames,
  generateImage,
  regenerateImagePrompt,
  watermarkImage,
} from "@/actions/images";
import { t } from "@/lib/locale";
import { Tooltip } from "./tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { postUpdateSchema } from "@/validations/posts";
import { db } from "@/db";
import { DialogResponsive } from "./dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FRAMES_URL } from "@/lib/constants";
import { fetchImage } from "@/lib/uploader";

export type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof postUpdateSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  src: ({ dic, loading, form }: ImageFormProps) => (
    <div>
      <FormField
        control={form?.["control"]}
        name="image.file"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center justify-center gap-2">
                <Input
                  type="file"
                  {...field}
                  value={undefined}
                  onChange={async (e) => {
                    form.resetField("image");

                    const file = e?.["target"]?.["files"]?.[0];

                    if (file) {
                      const base64 = (await convertBase64(file))?.toString();

                      field.onChange(file);
                      form.setValue("image.base64", base64 ?? "");
                    }
                  }}
                  disabled={loading}
                />
                {!!form.watch("image.base64") ? (
                  <>
                    <Image
                      src={form.getValues("image.base64")!}
                      alt=""
                      className="h-8 w-8"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const image = form.getValues("image");
                        form.resetField("image");
                        form.setValue("image", {
                          // @ts-ignore
                          prompt: image?.["prompt"] ?? undefined,
                          // @ts-ignore
                          src: image?.["src"] ?? undefined,
                        });
                      }}
                      disabled={loading}
                    >
                      <Icons.x />
                    </Button>
                  </>
                ) : null}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* {!!form.watch("image.base64") ? (
        <ImageForm.chooseFrame
          image={Buffer.from(
            form.watch("image.base64")?.split("data:image/png;base64,")?.pop()!,
            "base64",
          )}
          dic={dic}
          form={form}
          loading={loading}
        />
      ) : null} */}
    </div>
  ),
  prompt: function Component({
    dic: {
      "image-form": { prompt: c },
    },
    loading,
    form,
    setSrc,
  }: ImageFormProps & {
    setSrc: Dispatch<SetStateAction<string | null>>;
  }) {
    const lang = useLocale();
    const [generating, setGenerating] = useState(false);

    async function enhance() {
      setGenerating(true);
      toast.promise(
        regenerateImagePrompt({
          prompt: form.getValues("image.prompt") ?? "",
        }),
        {
          finally: () => setGenerating(false),
          error: async (err) => {
            const msg = await t(err?.["message"], lang);
            return msg;
          },
          success: (newPrompt: string) => {
            form.setValue("image.prompt", newPrompt);

            return c?.["enhanced successfully."];
          },
        },
      );
    }

    async function generate() {
      setGenerating(true);
      toast.promise(
        generateImage({
          prompt: form.getValues("image.prompt") ?? "",
        }),
        {
          finally: () => setGenerating(false),
          error: async (err) => {
            const msg = await t(err?.["message"], lang);
            return msg;
          },
          success: async (src: string) => {
            form.resetField("image.base64");
            form.resetField("image.file");

            form?.setValue("image.src", src);
            setSrc(src);
            return c?.["generated successfully."];
          },
        },
      );
    }
    return (
      <div className="mb-10 grid gap-4">
        <FormField
          control={form.control}
          name="image.prompt"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2 flex items-center justify-between gap-4">
                <FormLabel>{c?.["label"]}</FormLabel>
                <Tooltip text={c?.["enhance prompt"]}>
                  <Button
                    type="button"
                    size="icon"
                    onClick={enhance}
                    disabled={loading || generating}
                  >
                    <Icons.reload />
                  </Button>
                </Tooltip>
              </div>

              <FormControl>
                <Textarea
                  className="min-h-56 w-full"
                  disabled={loading || generating}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <FormLabel>{c?.["new image"]}</FormLabel>
            <Tooltip text={c?.["new image"]}>
              <Button
                type="button"
                size="icon"
                onClick={generate}
                disabled={loading || generating}
              >
                <Icons.reload />
              </Button>
            </Tooltip>
          </div>

          <Image
            src={form.watch("image.src")!}
            alt=""
            className="aspect-square h-full"
          />
        </div>
      </div>
    );
  },
  // watermark: function Component({
  //   dic: {
  //     "image-form": { prompt: c },
  //   },
  //   loading,
  //   form,
  // }: ImageFormProps) {
  //   const lang = useLocale();
  //   const [generating, setGenerating] = useState(false);

  //   async function addWatermark() {
  //     setGenerating(true);
  //     toast.promise(watermarkImage(form?.getValues("image.src") ?? ""), {
  //       finally: () => setGenerating(false),
  //       error: async (err) => {
  //         const msg = await t(err?.["message"], lang);
  //         return msg;
  //       },
  //       success: async (url) => {
  //         form?.resetField("image.base64");
  //         form?.resetField("image.file");

  //         form?.setValue("image.src", url);

  //         return url;
  //       },
  //     });
  //   }
  //   return (
  //     <div className="grid gap-2">
  //       <div className="flex items-center justify-end">
  //         <Tooltip text="add watermark">
  //           <Button
  //             type="button"
  //             size="icon"
  //             onClick={addWatermark}
  //             disabled={loading || generating}
  //           >
  //             <Icons.imageReload />
  //           </Button>
  //         </Tooltip>
  //       </div>
  //     </div>
  //   );
  // },
  chooseFrame: function Component({
    dic: {
      "image-form": { frame: c },
    },
    loading,
    form,
    framedImages,
  }: ImageFormProps & { framedImages: string[] | null }) {
    if (!framedImages)
      return (
        <p className="py-5 text-center text-sm text-muted-foreground">
          {c?.["applying frames..."]}
        </p>
      );

    if (!framedImages?.["length"])
      return (
        <p className="py-5 text-center text-sm text-muted-foreground">
          {c?.["no frames to be applied..."]}
        </p>
      );

    return (
      <FormField
        control={form.control}
        name="frame"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">{c?.["frame"]}</FormLabel>

            <ToggleGroup
              type="single"
              variant="outline"
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
              className="grid h-auto grid-cols-3 gap-2"
            >
              {framedImages?.map((fi, i) => (
                <ToggleGroupItem
                  key={i}
                  value={JSON.stringify(fi)}
                  className="h-fit w-fit"
                >
                  <Image
                    src={`data:image/png;base64,${fi}`}
                    alt=""
                    className="h-40 rounded-none border-none"
                  />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
};
