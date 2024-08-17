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
import { propertyRestoreSchema } from "@/validations/properties";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Property } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { updateProperty } from "@/actions/properties";

type PropertyRestoreButtonProps = {
  property: Pick<Property, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen" | "property"> &
  Dictionary["property-restore-button"] &
  Dictionary["dialog"];

export function PropertyRestoreButton({
  dic: { "property-restore-button": c, ...dic },
  property,
  ...props
}: PropertyRestoreButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyRestoreSchema>>({
    resolver: zodResolver(propertyRestoreSchema),
    defaultValues: {
      id: property?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof propertyRestoreSchema>) {
    setLoading(true);
    // @ts-ignore
    toast.promise(updateProperty({ ...data, deletedAt: null }), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["restored successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                variant="secondary"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["restore"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["restore property"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your property."
        ]
      }
      {...props}
    />
  );
}
