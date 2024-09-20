"use client";

import { updateProperty } from "@/actions/properties";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { clientAction } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { propertyBinSchema } from "@/validations/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type PropertyBinButtonProps = {
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

  async function onSubmit(data: z.infer<typeof propertyBinSchema>) {
    await clientAction(
      async () => await updateProperty({ ...data, deletedAt: new Date() }),
      setLoading,
    );

    toast.success(c?.["deleted successfully."]);
    setOpen(false);
    form.reset();
    router.refresh();
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
