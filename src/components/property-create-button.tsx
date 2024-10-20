"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { PropertyForm, PropertyFormProps } from "@/components/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { propertyCreateFormSchema } from "@/validations/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EmptyPlaceholder } from "./empty-placeholder";
import { useSession } from "./session-provider";
import { Tooltip } from "./tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export type PropertyCreateButtonProps = { project: Pick<Project, "id"> } & Omit<
  DialogResponsiveProps,
  "open" | "setOpen" | "property"
> &
  Dictionary["property-create-button"] &
  Dictionary["property-form"] &
  Dictionary["dialog"];

export function PropertyCreateButton({
  dic: { "property-create-button": c, ...dic },
  project,
  disabled,
  ...props
}: PropertyCreateButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyCreateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(propertyCreateFormSchema),
  });

  async function onSubmit(data: z.infer<typeof propertyCreateFormSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).post(`/api/properties`, {
        ...data,
      });

      toast.success(c?.["created successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
  }

  return (
    <DialogResponsive
      dic={dic}
      disabled={loading}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button disabled={loading} className="w-full md:w-fit">
                {!disabled && loading && <Icons.spinner />}
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
              <Card>
                <CardContent className="py-4">
                  <Accordion type="single" collapsible>
                    <ApartmentForm
                      dic={dic}
                      form={form as any}
                      loading={loading}
                      project={project}
                    />

                    <VillaForm
                      dic={dic}
                      form={form as any}
                      loading={loading}
                      project={project}
                    />
                  </Accordion>
                </CardContent>
              </Card>
            </form>
          </Form>
        </>
      }
      title={c?.["create property"]}
      description={
        c?.[
          "by detailing each property, including its features, layout, and amenities, you ensure that all relevant information is captured, enabling better organization and presentation to potential buyers or tenants."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}

export const ApartmentForm = ({
  dic,
  form,
  loading,
  project,
}: PropertyFormProps & { project: Pick<Project, "id"> }) => {
  const { remove, append } = useFieldArray({
    name: "properties",
    control: form?.["control"],
  });

  return (
    <AccordionItem value="APARTMENT">
      <div className="flex items-center gap-2">
        <AccordionTrigger>
          <p className="items-center justify-start">
            Apartments{" "}
            {form
              .watch("properties")
              ?.filter((e) => e?.["type"] === "APARTMENT")?.["length"] ? (
              <span className="text-sm text-muted-foreground">
                -{" "}
                {
                  form
                    .watch("properties")
                    ?.filter((e) => e?.["type"] === "APARTMENT")?.["length"]
                }{" "}
                unit(s)
              </span>
            ) : null}
          </p>
        </AccordionTrigger>
        <Tooltip text="new apartment">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={() =>
                // @ts-ignore
                append({ projectId: project?.["id"], type: "APARTMENT" })
              }
            >
              <Icons.add />
            </Button>
          </div>
        </Tooltip>
      </div>

      <AccordionContent>
        <Card>
          <CardContent>
            {form
              .watch("properties")
              ?.filter((e) => e?.["type"] === "APARTMENT")?.["length"] ? (
              <Accordion type="single" collapsible>
                {form.watch("properties")?.map((e, i) => {
                  if (e?.["type"] === "VILLA") return;

                  return (
                    <AccordionItem
                      key={i}
                      value={`unit-${i}`}
                      className="last:border-none"
                    >
                      <div className="flex items-center gap-2">
                        <AccordionTrigger>
                          {e?.["title"] ?? "untitled unit"}
                        </AccordionTrigger>

                        <Tooltip
                          text={`remove ${e?.["title"] ?? "untitled unit"}}`}
                        >
                          <div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={loading}
                              onClick={() => remove(i)}
                            >
                              <Icons.x />
                            </Button>
                          </div>
                        </Tooltip>
                      </div>
                      <AccordionContent className="grid grid-cols-3 gap-4">
                        <PropertyForm.title
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.units
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.price
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.space
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.finishing
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.floors
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.rooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.bathrooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />

                        <PropertyForm.livingrooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <EmptyPlaceholder className="border-none">
                <EmptyPlaceholder.Icon name="empty" />
                <EmptyPlaceholder.Title>no apartment</EmptyPlaceholder.Title>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    // @ts-ignore
                    append({ projectId: project?.["id"], type: "APARTMENT" })
                  }
                >
                  <Icons.add /> create new apartment
                </Button>
              </EmptyPlaceholder>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

export const VillaForm = ({
  dic,
  form,
  loading,
  project,
}: PropertyFormProps & { project: Pick<Project, "id"> }) => {
  const { remove, append } = useFieldArray({
    name: "properties",
    control: form?.["control"],
  });

  return (
    <AccordionItem value="VILLA" className="last:border-none">
      <div className="flex items-center gap-2">
        <AccordionTrigger>
          <p className="items-center justify-start">
            Villas{" "}
            {form.watch("properties")?.filter((e) => e?.["type"] === "VILLA")?.[
              "length"
            ] ? (
              <span className="text-sm text-muted-foreground">
                -{" "}
                {
                  form
                    .watch("properties")
                    ?.filter((e) => e?.["type"] === "VILLA")?.["length"]
                }{" "}
                unit(s)
              </span>
            ) : null}
          </p>
        </AccordionTrigger>
        <Tooltip text="new villa">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={() =>
                // @ts-ignore
                append({ projectId: project?.["id"], type: "VILLA" })
              }
            >
              <Icons.add />
            </Button>
          </div>
        </Tooltip>
      </div>

      <AccordionContent>
        <Card>
          <CardContent>
            {form.watch("properties")?.filter((e) => e?.["type"] === "VILLA")?.[
              "length"
            ] ? (
              <Accordion type="single" collapsible>
                {form.watch("properties")?.map((e, i) => {
                  if (e?.["type"] === "APARTMENT") return;

                  return (
                    <AccordionItem
                      key={i}
                      value={`unit-${i}`}
                      className="last:border-none"
                    >
                      <div className="flex items-center gap-2">
                        <AccordionTrigger>
                          {e?.["title"] ?? "untitled unit"}
                        </AccordionTrigger>

                        <Tooltip
                          text={`remove ${e?.["title"] ?? "untitled unit"}`}
                        >
                          <div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={loading}
                              onClick={() => remove(i)}
                            >
                              <Icons.x />
                            </Button>
                          </div>
                        </Tooltip>
                      </div>
                      <AccordionContent className="grid grid-cols-3 gap-4">
                        <PropertyForm.title
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.units
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.price
                        dic={dic}
                        index={i}
                        form={form as any}
                        loading={loading}
                      />
                        <PropertyForm.space
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.finishing
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.floors
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.rooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.bathrooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />

                        <PropertyForm.livingrooms
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.garden
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.pool
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                        <PropertyForm.view
                          dic={dic}
                          index={i}
                          form={form as any}
                          loading={loading}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <EmptyPlaceholder className="border-none">
                <EmptyPlaceholder.Icon name="empty" />
                <EmptyPlaceholder.Title>no villa</EmptyPlaceholder.Title>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    // @ts-ignore
                    append({ projectId: project?.["id"], type: "VILLA" })
                  }
                >
                  <Icons.add /> create new villa
                </Button>
              </EmptyPlaceholder>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};
