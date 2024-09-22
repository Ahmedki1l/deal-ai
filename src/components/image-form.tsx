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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FRAMES } from "@/lib/constants";
import { PhotoEditor } from "@/lib/konva";
import { clientAction, fileToBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { MutableRefObject, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { DialogResponsive, DialogResponsiveProps } from "./dialog";
import { Icons } from "./icons";
import { Image } from "./image";
import { Tooltip } from "./tooltip";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof imageUpdateFormSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  width: function Component({
    dic: { "image-form": c },
    loading,
    form,
  }: ImageFormProps) {
    return (
      <FormField
        control={form.control}
        name="dimensios.width"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel className="sr-only">{c?.["width"]?.['width']}</FormLabel> */}
            <FormControl>
              <Input type="text" {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  height: function Component({
    dic: { "image-form": c },
    loading,
    form,
  }: ImageFormProps) {
    return (
      <FormField
        control={form.control}
        name="dimensios.height"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel className="sr-only">{c?.["height"]?.['height']}</FormLabel> */}
            <FormControl>
              <Input type="text" {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  uploadFile: function Component({
    dic: { "image-form": c },
    loading,
    form,
    editor,
  }: ImageFormProps & { editor: MutableRefObject<PhotoEditor | null> }) {
    return (
      <FormItem>
        {/* <FormLabel className="sr-only">{c?.["height"]?.['height']}</FormLabel> */}

        <Input
          type="file"
          onChange={async (e) => {
            const file = e?.["target"]?.["files"]?.[0];
            if (file) {
              const base64 = (await fileToBase64(file))!?.toString();
              editor?.["current"]?.addBase64({ base64 });
            }
          }}
          disabled={loading}
        />
      </FormItem>
    );
  },
  regenerateImage: function Component({
    dic: { "image-form": c, ...dic },
    loading,
    form,
    editor,
  }: ImageFormProps & { editor: MutableRefObject<PhotoEditor | null> } & Pick<
      DialogResponsiveProps,
      "dic"
    >) {
    const [promptLoading, setPromptLoading] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    async function regeneratePrompt() {
      setPromptLoading(true);
      const r = await clientAction(
        async () =>
          await regenerateImagePrompt({
            prompt: form.getValues("prompt") ?? "",
          }),
        setPromptLoading,
      );
      if (r === undefined) return;

      form.setValue("prompt", r);
      toast.success(c?.["regenerate-image"]?.["enhanced successfully."]);
    }
    async function regenerateImage() {
      setImageLoading(true);
      const r = await clientAction(
        async () =>
          await generateImage({
            prompt: form.getValues("prompt") ?? "",
          }),
        setImageLoading,
      );
      if (r === undefined) return;

      setOpen(false);
      form.setValue("src", r);
      editor?.["current"]?.addPhoto({ url: r });
      toast.success(c?.["regenerate-image"]?.["generated successfully."]);
    }

    return (
      <DialogResponsive
        dic={dic}
        open={open}
        setOpen={setOpen}
        disabled={promptLoading || imageLoading}
        confirmButton={
          <Button
            type="button"
            onClick={regenerateImage}
            disabled={promptLoading || imageLoading}
          >
            {imageLoading && <Icons.spinner />}
            generate Image using AI
          </Button>
        }
        content={
          <>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between pb-2">
                    <FormLabel>{c?.["regenerate-image"]?.["prompt"]}</FormLabel>

                    <Tooltip text={c?.["regenerate-image"]?.["enhance prompt"]}>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={regeneratePrompt}
                          disabled={promptLoading || imageLoading}
                        >
                          {promptLoading ? <Icons.spinner /> : <Icons.reload />}
                        </Button>
                      </div>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Textarea
                      className="min-h-40"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        }
      >
        <div>
          <Tooltip text={c?.["regenerate-image"]?.["generate image"]}>
            <Button type="button" variant="outline" size="icon">
              <Icons.reload />
            </Button>
          </Tooltip>
        </div>
      </DialogResponsive>
    );
  },
  frame: function Component({
    dic: { "image-form": c, ...dic },
    loading,
    form,
    editor,
  }: ImageFormProps & { editor: MutableRefObject<PhotoEditor | null> } & Pick<
      DialogResponsiveProps,
      "dic"
    >) {
    return (
      <FormField
        control={form.control}
        name="frame"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel className="sr-only">{c?.["frame"]}</FormLabel> */}

            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="icon">
                  <Icons.add />
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="grid grid-cols-3 gap-4"
                  disabled={loading}
                  onValueChange={(e) => {
                    editor?.["current"]?.addFrame({
                      url: FRAMES?.[Number(e)]?.["src"],
                      data: {
                        title: "x project",
                        website: "www.x.com",
                        phone: "0102 218 4878",
                      },
                    });
                    console.log(editor?.["current"]?.getTextNodes());
                    field.onChange(FRAMES?.[Number(e)]?.["filled"]);
                    form.setValue(
                      "texts",
                      editor?.["current"]?.getTextNodes() ?? [],
                    );
                  }}
                >
                  {FRAMES?.map((f, i) => (
                    <ToggleGroupItem
                      key={i}
                      value={i?.toString()}
                      className="h-fit w-fit"
                    >
                      <Image
                        src={f?.["src"]}
                        alt=""
                        className="h-20 rounded-none border-none"
                      />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  // text: function Component({
  //   dic: { "image-form": c, ...dic },
  //   loading,
  //   form,
  //   editor,
  // }: ImageFormProps & { editor: MutableRefObject<PhotoEditor | null> } & Pick<
  //     DialogResponsiveProps,
  //     "dic"
  //   >) {
  //   return (
  //     <FormField
  //       control={form.control}
  //       name="frame"
  //       render={({ field }) => (
  //         <FormItem>
  //           {/* <FormLabel className="sr-only">{c?.["frame"]}</FormLabel> */}

  //           <Popover>
  //             <PopoverTrigger asChild>
  //               <Button type="button" variant="outline" size="icon">
  //                 <Icons.add />
  //               </Button>
  //             </PopoverTrigger>

  //             <PopoverContent align="end">
  //               <ToggleGroup
  //                 type="single"
  //                 variant="outline"
  //                 className="grid grid-cols-3 gap-4"
  //                 disabled={loading}
  //                 onValueChange={(e) => {
  //                   field.onChange(FRAMES?.[Number(e)]?.["filled"]);

  //                   editor?.["current"]?.addFrame({
  //                     url: FRAMES?.[Number(e)]?.["src"],
  //                     data: {
  //                       title: "x project",
  //                       website: "www.x.com",
  //                       phone: "0102 218 4878",
  //                     },
  //                   });
  //                 }}
  //               >
  //                 {FRAMES?.map((f, i) => (
  //                   <ToggleGroupItem
  //                     key={i}
  //                     value={i?.toString()}
  //                     className="h-fit w-fit"
  //                   >
  //                     <Image
  //                       src={f?.["src"]}
  //                       alt=""
  //                       className="h-20 rounded-none border-none"
  //                     />
  //                   </ToggleGroupItem>
  //                 ))}
  //               </ToggleGroup>
  //             </PopoverContent>
  //           </Popover>

  //           <FormMessage />
  //         </FormItem>
  //       )}
  //     />
  //   );
  // },
};
