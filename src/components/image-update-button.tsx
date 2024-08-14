"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { imageUpdateFormSchema } from "@/validations/images";
import { updateImage } from "@/actions/images";
import { ImageForm } from "@/components/image-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Image } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";

type ImageUpdateButtonProps = {
  image: Image;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["image-update-button"] &
  Dictionary["image-form"] &
  Dictionary["dialog"];

export function ImageUpdateButton({
  dic: { "image-update-button": c, ...dic },
  image,
  ...props
}: ImageUpdateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof imageUpdateFormSchema>>({
    resolver: zodResolver(imageUpdateFormSchema),
    defaultValues: {
      ...image,
      src: {},
    },
  });
  console.log(form.formState.errors);
  async function onSubmit(data: z.infer<typeof imageUpdateFormSchema>) {
    setLoading(true);

    // Schedule the image and handle the promise
    toast.promise(
      updateImage({
        ...data,
        src: data?.["src"]?.["url"],
      }),
      {
        finally: () => setLoading(false),
        error: async (err) => {
          const msg = await t(err?.["message"], lang);
          return msg;
        },
        success: () => {
          router.refresh();
          form.reset();
          setOpen(false);

          return c?.["updated successfully."];
        },
      },
    );
  }

  return (
    <DialogResponsive
      dic={dic}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button disabled={loading} className="w-full md:w-fit">
                {loading && <Icons.spinner />}
                {c?.["submit"]}
              </Button>
            </form>
          </Form>
        </>
      }
      content={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <ImageForm.src dic={dic} form={form as any} loading={loading} />
              <ImageForm.prompt
                dic={dic}
                image={image}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["update image"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your image."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
