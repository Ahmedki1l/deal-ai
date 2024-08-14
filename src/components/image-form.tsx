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
import { useState } from "react";
import { Button } from "./ui/button";
import { Image as ImageType } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { Textarea } from "./ui/textarea";
import { convertBase64 } from "@/lib/utils";
import { Image } from "./image";
import { Icons } from "./icons";
import { toast } from "sonner";
import { generateImage, regenerateImagePrompt } from "@/actions/images";
import { t } from "@/lib/locale";
import { Tooltip } from "./tooltip";

type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof imageUpdateFormSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  src: ({ dic: { "image-form": c }, loading, form }: ImageFormProps) => (
    <FormField
      control={form?.["control"]}
      name="src.file"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center justify-center gap-2">
              <Input
                type="file"
                {...field}
                value={undefined}
                onChange={async (e) => {
                  const file = e?.["target"]?.["files"]?.[0];
                  if (file) {
                    const base64 = (await convertBase64(file))?.toString();

                    field.onChange(file);
                    form.setValue("src.base64", base64 ?? "");
                    form.resetField("src.url");
                  }
                }}
              />
              {/* @ts-ignore */}
              {form.watch("src")?.["base64"] || form.watch("src")?.["url"] ? (
                <Image
                  src={
                    form.getValues("src")?.["base64"] ??
                    form.getValues("src")?.["url"]
                  }
                  alt=""
                  className="h-8 w-8"
                />
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  form.resetField("src.file");
                  form.resetField("src.base64");
                }}
              >
                <Icons.x />
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  prompt: function Component({
    dic: { "image-form": c },
    loading,
    form,
    image,
  }: ImageFormProps & { image: ImageType | null }) {
    const lang = useLocale();
    const [generating, setGenerating] = useState(false);

    function enhance() {
      setGenerating(true);
      toast.promise(
        regenerateImagePrompt({
          prompt: image?.["prompt"] ?? "",
        }),
        {
          finally: () => setGenerating(false),
          error: async (err) => {
            const msg = await t(err?.["message"], lang);
            return msg;
          },
          success: (newPrompt: string) => {
            form.setValue("prompt", newPrompt);

            return c?.["prompt"]?.["enhanced successfully."];
          },
        },
      );
    }

    function generate() {
      setGenerating(true);
      toast.promise(
        generateImage({
          // @ts-ignore
          prompt: image?.["prompt"] ?? "",
        }),
        {
          finally: () => setGenerating(false),
          error: async (err) => {
            const msg = await t(err?.["message"], lang);
            return msg;
          },
          success: (url: string) => {
            form?.setValue("src.url", url);
            form.resetField("src.base64");
            form.resetField("src.file");

            return c?.["prompt"]?.["generated successfully."];
          },
        },
      );
    }
    return (
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2 flex items-center justify-between gap-2">
                <FormLabel>{c?.["prompt"]?.["label"]}</FormLabel>

                <div className="flex items-center gap-2">
                  <Tooltip text={c?.["prompt"]?.["enhance prompt"]}>
                    <Button
                      type="button"
                      size="icon"
                      onClick={enhance}
                      disabled={loading || generating}
                    >
                      <Icons.reload />
                    </Button>
                  </Tooltip>

                  <Tooltip text={c?.["prompt"]?.["new image"]}>
                    <Button
                      type="button"
                      size="icon"
                      onClick={generate}
                      disabled={loading || generating}
                    >
                      <Icons.image />
                    </Button>
                  </Tooltip>
                </div>
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
      </div>
    );
  },
};
