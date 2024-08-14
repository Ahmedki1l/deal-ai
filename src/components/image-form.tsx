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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { postUpdateSchema } from "@/validations/posts";

export type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof postUpdateSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  src: ({ dic: { "image-form": c }, loading, form }: ImageFormProps) => (
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
                <Image
                  src={form.getValues("image.base64")!}
                  alt=""
                  className="h-8 w-8"
                />
              ) : null}
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
  }: ImageFormProps) {
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

            return c?.["prompt"]?.["enhanced successfully."];
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
          success: (src: string) => {
            form.resetField("image.base64");
            form.resetField("image.file");

            form?.setValue("image.src", src);

            return c?.["prompt"]?.["generated successfully."];
          },
        },
      );
    }
    return (
      <div className="grid gap-2">
        <Tabs defaultValue="enhance">
          <TabsList>
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="generate">Generate Image </TabsTrigger>
          </TabsList>

          <TabsContent value="enhance">
            <div className="flex items-center justify-end">
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
            </div>

            <FormField
              control={form.control}
              name="image.prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{c?.["prompt"]?.["label"]}</FormLabel>

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
          </TabsContent>
          <TabsContent value="generate">
            <div className="flex items-center justify-end">
              <Tooltip text={c?.["prompt"]?.["new image"]}>
                <Button
                  type="button"
                  size="icon"
                  onClick={generate}
                  disabled={loading || generating}
                >
                  <Icons.imageReload />
                </Button>
              </Tooltip>
            </div>

            <Image
              src={form.watch("image.src")!}
              alt=""
              className="aspect-square max-h-40"
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};
