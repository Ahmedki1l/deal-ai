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
import { propertyDeleteSchema } from "@/validations/properties";
import { deleteProperty } from "@/actions/properties";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Property } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type PropertyDeleteButtonProps = {
  property: Pick<Property, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen" | "property"> &
  Dictionary["property-delete-button"] &
  Dictionary["dialog"];

export function PropertyDeleteButton({
  dic: { "property-delete-button": c, ...dic },
  property,
  ...props
}: PropertyDeleteButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyDeleteSchema>>({
    resolver: zodResolver(propertyDeleteSchema),
    defaultValues: {
      id: property?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof propertyDeleteSchema>) {
    setLoading(true);
    toast.promise(deleteProperty(data), {
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
          "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
