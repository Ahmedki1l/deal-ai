"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Image } from "@/components/image";
import { Tooltip } from "@/components/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { ApplyFrameProps, FRAMES } from "@/lib/constants";
import { PhotoEditor } from "@/lib/konva";
import { clientHttpRequest, cn, fileToBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { imageUpdateFormSchema } from "@/validations/images";
import { MutableRefObject, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type ImageFormProps = {
  loading: boolean;
  form: UseFormReturn<z.infer<typeof imageUpdateFormSchema>, any, undefined>;
} & Dictionary["image-form"];

export const ImageForm = {
  uploadFile: function Component({
    dic: { "image-form": c },
    loading,
    form,
    editor,
  }: ImageFormProps & { editor: MutableRefObject<PhotoEditor | null> }) {
    return (
      <FormItem>
        <FormLabel
          htmlFor="file"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <Tooltip text="new image">
            <div>
              <Button
                type="button"
                disabled={loading}
                variant="outline"
                size="icon"
              >
                <Icons.add />
              </Button>
            </div>
          </Tooltip>
          {/* {c?.["height"]?.["height"]} */}
        </FormLabel>

        <Input
          id="file"
          type="file"
          onChange={async (e) => {
            const file = e?.["target"]?.["files"]?.[0];
            if (file) {
              const base64 = (await fileToBase64(file))!?.toString();
              const { photoNode } = await editor?.["current"]!.addBase64({
                base64,
              });
              form.setValue("editor.photo", photoNode);
            }
          }}
          disabled={loading}
          className="hidden"
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
    const locale = useLocale();
    const { user } = useSession();
    const [promptLoading, setPromptLoading] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    async function regeneratePrompt() {
      await clientHttpRequest(async () => {
        const { data: r } = await axios({ locale, user }).post(
          `/api/images/prompts/regenerate`,
          { prompt: form.getValues("prompt") ?? "" },
        );
        console.log(r);
        form.setValue("prompt", r?.["prompt"]);
        toast.success(c?.["regenerate-image"]?.["enhanced successfully."]);
      }, setPromptLoading);
    }

    async function regenerateImage() {
      await clientHttpRequest(async () => {
        const { data: r } = await axios({ locale, user }).post(
          `/api/images/regenerate`,
          { prompt: form.getValues("prompt") ?? "" },
        );
        console.log(r);

        setOpen(false);
        const { photoNode } = await editor?.["current"]!.addPhoto({
          url: r?.["url"],
        });
        form.setValue("src", r?.["url"]);
        form.setValue("editor.photo", photoNode);
        toast.success(c?.["regenerate-image"]?.["generated successfully."]);
      }, setImageLoading);
    }

    return (
      <DialogResponsive
        dic={dic}
        open={open}
        setOpen={setOpen}
        disabled={promptLoading || imageLoading || loading}
        confirmButton={
          <Button
            type="button"
            onClick={regenerateImage}
            disabled={promptLoading || imageLoading || loading}
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
                          disabled={promptLoading || imageLoading || loading}
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
                      disabled={promptLoading || imageLoading || loading}
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
            <Button
              disabled={promptLoading || imageLoading || loading}
              type="button"
              variant="outline"
              size="icon"
            >
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
  }: ImageFormProps & {
    editor: MutableRefObject<PhotoEditor | null>;
  } & Pick<DialogResponsiveProps, "dic"> &
    Pick<ApplyFrameProps, "dic">) {
    const lang = useLocale();
    return (
      <FormField
        control={form.control}
        name="filledFrame"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel className="sr-only">{c?.["filledFrame"]}</FormLabel> */}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={loading}
                  type="button"
                  variant="outline"
                  size="icon"
                >
                  <Icons.add />
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="grid grid-cols-3 gap-4"
                  disabled={loading}
                  onValueChange={async (e) => {
                    form.resetField("editor.frame");
                    form.resetField("editor.textNodes");
                    const { frameNode, textNodes } = await editor?.[
                      "current"
                    ]!.addFrame({
                      n: Number(e),
                      data: {
                        title: "x project",
                        website: "www.domainname.com",
                        phone: "+123 546 8910",
                      },
                      editor: editor!?.["current"]!,
                      dic,
                      lang,
                    });
                    field.onChange(FRAMES?.[Number(e)]?.["filled"]);
                    form.setValue("editor.frame", frameNode);
                    form.setValue("editor.textNodes", textNodes);
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
  //   dic: { "image-form": c },
  //   loading,
  //   form,
  // }: ImageFormProps) {
  //   return (
  //     <FormField
  //       control={form.control}
  //       name={`editor.textNodes.${0}.text`}
  //       render={({ field }) => (
  //         <FormItem>
  //           {/* <FormLabel className="sr-only">{c?.["width"]?.['width']}</FormLabel> */}
  //           <FormControl>
  //             <Input type="text"

  //             defaultValue={txt?.text()}
  //             onChange={(e) => txt?.setText(e?.target?.value)}

  //             />
  //           </FormControl>
  //           <FormMessage />
  //         </FormItem>
  //       )}
  //     />
  //   );
  // },
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
  //       name="filledFrame"
  //       render={({ field }) => (
  //         <FormItem>
  //           {/* <FormLabel className="sr-only">{c?.["filledFrame"]}</FormLabel> */}

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
