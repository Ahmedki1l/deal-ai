"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  propertyCreateFormSchema,
  propertyCreateSchema,
} from "@/validations/properties";
import { createProperty } from "@/actions/properties";
import { PropertyForm } from "@/components/property-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Project } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { propertyTypes } from "@/db/enums";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type PropertyCreateButtonProps = { project: Pick<Project, "id"> } & Omit<
  DialogResponsiveProps,
  "open" | "setOpen" | "property"
> &
  Dictionary["property-create-button"] &
  Dictionary["property-form"] &
  Dictionary["dialog"];

export function PropertyCreateButton({
  dic: { "property-create-button": c, ...dic },
  project,
  ...props
}: PropertyCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof propertyCreateFormSchema>>({
    resolver: zodResolver(propertyCreateFormSchema),
  });

  const { fields, remove, append } = useFieldArray({
    name: "types",
    control: form?.["control"],
  });

  async function onSubmit(data: z.infer<typeof propertyCreateFormSchema>) {
    setLoading(true);
    toast.promise(createProperty(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["created successfully."];
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
              <div className="flex items-center justify-between gap-2">
                <Label>{c?.["type of assets"]}</Label>
                <Button
                  type="button"
                  size="icon"
                  onClick={() =>
                    // @ts-ignore
                    append({
                      properties: [],
                    })
                  }
                  disabled={
                    fields?.["length"] === propertyTypes?.["length"]
                    // ||
                    // (limit ? fields?.["length"] == 4 : false)
                  }
                >
                  <Icons.add />
                </Button>
              </div>

              {fields?.map((field, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-full">
                        <PropertyForm.type
                          dic={dic}
                          typeIndex={i}
                          remove={remove}
                          form={form as any}
                          loading={loading}
                        />
                      </div>

                      {form.watch(`types.${i}.value`) && (
                        <Button
                          type="button"
                          size="icon"
                          onClick={() =>
                            form.setValue(`types.${i}.properties`, [
                              // @ts-ignore
                              ...form.getValues(`types.${i}.properties`),
                              // @ts-ignore
                              { projectId: project?.["id"] },
                            ])
                          }
                        >
                          <Icons.add />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {form.watch(`types.${i}.properties`)?.["length"] ? (
                    <CardContent className="space-y-4">
                      {form.getValues(`types.${i}.properties`)?.map((_, j) => (
                        <Card key={j} className="border-green-500">
                          <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle>
                                {c?.["unit"]} {j + 1}
                              </CardTitle>

                              <Button
                                type="button"
                                size="icon"
                                onClick={() =>
                                  form.setValue(
                                    `types.${i}.properties`,
                                    form
                                      .getValues(`types.${i}.properties`)
                                      ?.filter((_, k) => k != j) ?? [],
                                  )
                                }
                              >
                                <Icons.x />
                              </Button>
                            </div>
                          </CardHeader>

                          <CardContent className="grid grid-cols-3 gap-2">
                            <PropertyForm.title
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.units
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.space
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.finishing
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.floors
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.rooms
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            <PropertyForm.bathrooms
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />

                            <PropertyForm.receptions
                              dic={dic}
                              typeIndex={i}
                              propertyIndex={j}
                              form={form as any}
                              loading={loading}
                            />
                            {form.watch(`types.${i}.value`) === "VILLA" ? (
                              <>
                                <PropertyForm.garden
                                  dic={dic}
                                  typeIndex={i}
                                  propertyIndex={j}
                                  form={form as any}
                                  loading={loading}
                                />
                                <PropertyForm.pool
                                  dic={dic}
                                  typeIndex={i}
                                  propertyIndex={j}
                                  form={form as any}
                                  loading={loading}
                                />
                                <PropertyForm.view
                                  dic={dic}
                                  typeIndex={i}
                                  propertyIndex={j}
                                  form={form as any}
                                  loading={loading}
                                />
                              </>
                            ) : null}
                          </CardContent>
                          {/* <CardFooter>
                            <Button
                              type='button'
                              size="icon"
                              onClick={() => {
                                // @ts-ignore
                                field["properties"] =
                                  field?.properties?.filter((_, i) => i != j) ??
                                  [];
                              }}
                            >
                              <Icons.x />
                            </Button>
                          </CardFooter> */}
                        </Card>
                      ))}
                    </CardContent>
                  ) : null}
                </Card>
              ))}
            </form>
          </Form>
        </>
      }
      title={c?.["create property"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your property."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
