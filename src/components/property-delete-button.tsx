"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { propertyDeleteSchema } from "@/validations/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type PropertyDeleteButtonProps = {
  property: Pick<Property, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen" | "property"> &
  Dictionary["property-delete-button"] &
  Dictionary["dialog"];

export function PropertyDeleteButton({
  dic: { "property-delete-button": c, ...dic },
  property,
  ...props
}: PropertyDeleteButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyDeleteSchema>>({
    resolver: zodResolver(propertyDeleteSchema),
    defaultValues: {
      id: property?.["id"],
    },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof propertyDeleteSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).delete(`/api/properties/${id}`);

      toast.success(c?.["deleted successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
  }

  return (
    <DialogResponsive
      type="alert"
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
