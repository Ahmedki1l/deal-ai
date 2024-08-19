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
import { propertyBinSchema } from "@/validations/properties";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Property } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { updateProperty } from "@/actions/properties";

type PropertyBinButtonProps = {
  property: Pick<Property, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen" | "property"> &
  Dictionary["property-bin-button"] &
  Dictionary["dialog"];

export function PropertyBinButton({
  dic: { "property-bin-button": c, ...dic },
  property,
  disabled,
  ...props
}: PropertyBinButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyBinSchema>>({
    resolver: zodResolver(propertyBinSchema),
    defaultValues: {
      id: property?.["id"],
      deletedAt: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof propertyBinSchema>) {
    setLoading(true);
    toast.promise(updateProperty({ ...data, deletedAt: new Date() }), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["deleted successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      disabled={loading}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                variant="destructive"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["delete"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["delete property"]}
      description={
        c?.[
          "once deleted, the property will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened."
        ]
      }
      {...props}
    />
  );
}
