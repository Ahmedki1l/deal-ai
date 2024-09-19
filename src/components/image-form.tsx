"use client";

import { generateImage, regenerateImagePrompt } from "@/actions/images";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocale } from "@/hooks/use-locale";
import { FRAMES_URL } from "@/lib/constants";
import { t } from "@/lib/locale";
import { convertBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { postUpdateSchema } from "@/validations/posts";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import frame0 from "../../public/frames/filled/frame-00.png";
import frame2 from "../../public/frames/filled/frame-02.png";
import frame3 from "../../public/frames/filled/frame-03.png";
import frame4 from "../../public/frames/filled/frame-04.png";
import frame5 from "../../public/frames/filled/frame-05.png";
import frame6 from "../../public/frames/filled/frame-06.png";
import frame7 from "../../public/frames/filled/frame-07.png";
import frame8 from "../../public/frames/filled/frame-08.png";
import frame9 from "../../public/frames/filled/frame-09.png";
import frame10 from "../../public/frames/filled/frame-10.png";
import frame11 from "../../public/frames/filled/frame-11.png";
import frame12 from "../../public/frames/filled/frame-12.png";
import frame13 from "../../public/frames/filled/frame-13.png";
import frame14 from "../../public/frames/filled/frame-14.png";
import frame15 from "../../public/frames/filled/frame-15.png";
import frame16 from "../../public/frames/filled/frame-16.png";
import { Icons } from "./icons";
import { Image } from "./image";
import { Tooltip } from "./tooltip";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

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

export type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof postUpdateSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  src: ({
    dic,
    loading,
    form,
    setSrc,
  }: ImageFormProps & { setSrc: Dispatch<SetStateAction<string | null>> }) => (
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
                    const base64 = (await convertBase64(file))!?.toString();

                    field.onChange(file);
                    form.setValue("image.base64", base64);
                    setSrc(base64);
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
                    onClick={() => form.resetField("image")}
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
  ),
  prompt: function Component({
    dic: {
      "image-form": { prompt: c },
    },
    loading,
    form,
    setSrc,
  }: ImageFormProps & { setSrc: Dispatch<SetStateAction<string | null>> }) {
    const lang = useLocale();
    const [generatingPrompt, setGeneratingPrompt] = useState(false);
    const [generating, setGenerating] = useState(false);

    async function enhance() {
      setGeneratingPrompt(true);
      toast.promise(
        regenerateImagePrompt({
          prompt: form.getValues("image.prompt") ?? "",
        }),
        {
          finally: () => setGeneratingPrompt(false),
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
            form.setValue("image.base64", null);
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
                    disabled={loading || generating || generatingPrompt}
                  >
                    {generatingPrompt ? <Icons.spinner /> : <Icons.reload />}
                  </Button>
                </Tooltip>
              </div>

              <FormControl>
                <Textarea
                  className="min-h-56 w-full"
                  disabled={loading || generating || generatingPrompt}
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
                disabled={loading || generating || generatingPrompt}
              >
                {generating ? <Icons.spinner /> : <Icons.reload />}
              </Button>
            </Tooltip>
          </div>

          <Image
            src={form.watch("image.src")!}
            alt=""
            className="aspect-auto h-60"
          />
        </div>
      </div>
    );
  },
  frame: function Component({
    dic: {
      "image-form": { frame: c },
    },
    loading,
    form,
    setFrame,
  }: ImageFormProps & { setFrame: Dispatch<SetStateAction<string | null>> }) {
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
              onValueChange={(e) => {
                field.onChange(e);
                setFrame(e);
              }}
              defaultValue={field?.["value"]}
              disabled={loading}
              className="grid grid-cols-3 gap-4"
            >
              {FRAMES_URL?.map((fi, i) => (
                <ToggleGroupItem
                  key={i}
                  value={i?.toString()}
                  className="h-fit w-fit"
                >
                  <Image
                    src={frames?.[i]?.src}
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
