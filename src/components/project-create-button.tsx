"use client";

import { createProject } from "@/actions/projects";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { ProjectForm } from "@/components/project-form";
import { PropertyForm } from "@/components/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { propertyTypes } from "@/db/enums";
import { useLocale } from "@/hooks/use-locale";
import { clientAction, fileToBase64 } from "@/lib/utils";
import { User } from "@/types/db";
import { Dictionary } from "@/types/locale";
import { projectCreateFormSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type ProjectCreateButtonProps = { user: User } & Omit<
  DialogResponsiveProps,
  "open" | "setOpen"
> &
  Dictionary["project-create-button"] &
  Dictionary["project-form"] &
  Dictionary["property-form"] &
  Dictionary["dialog"];

export function ProjectCreateButton({
  dic: { "project-create-button": c, ...dic },
  user,
  disabled,
  ...props
}: ProjectCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectCreateFormSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: { userId: user?.["id"] },
  });
  const { fields, remove, append } = useFieldArray({
    name: "types",
    control: form?.["control"],
  });

  async function onSubmit(data: z.infer<typeof projectCreateFormSchema>) {
    const base64 = data?.["pdf"]?.["file"]
      ? (await fileToBase64(data?.["pdf"]?.["file"]))!?.toString()
      : null;

    await clientAction(
      async () =>
        await createProject({
          ...data,
          pdf: {
            file: undefined,
            base64: base64 ?? null,
          },
        }),
      setLoading,
    );

    toast.success(c?.["created successfully."]);
    setOpen(false);
    form.reset();
    router.refresh();
  }

  // console.log(form.formState.errors);
  // console.log(form.getValues());
  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      disabled={loading}
      confirmButton={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button disabled={loading} className="w-full md:w-fit">
              {!disabled && loading && <Icons.spinner />}
              {c?.["submit"]}
            </Button>
          </form>
        </Form>
      }
      content={
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-2">
                <div className="flex flex-col items-center justify-center gap-4">
                  <ProjectForm.logo
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                  <ProjectForm.pdf
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                </div>
                <ProjectForm.title
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.description
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <div className="flex items-end gap-2">
                <ProjectForm.distinct
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.map
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ProjectForm.city
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.country
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <ProjectForm.spaces
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <ProjectForm.platforms
                dic={dic}
                form={form as any}
                loading={loading}
              />

              <div>
                <div className="flex items-center justify-between gap-4">
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
                      loading ||
                      fields?.["length"] === propertyTypes(lang)?.["length"]
                      // ||
                      // (limit ? fields?.["length"] == 4 : false)
                    }
                  >
                    <Icons.add />
                  </Button>
                </div>

                {form?.watch("types")?.map((field, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
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
                            // type="button"
                            size="icon"
                            onClick={() =>
                              // @ts-ignore
                              field?.properties?.push({
                                projectId: i.toString(),
                              })
                            }
                            disabled={loading}
                          >
                            <Icons.add />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    {form.watch(`types.${i}.properties`)?.["length"] ? (
                      <CardContent className="space-y-4">
                        {form
                          .getValues(`types.${i}.properties`)
                          ?.map((_, j) => (
                            <Card key={j} className="border-green-500">
                              <CardHeader>
                                <div className="flex items-center justify-between gap-4">
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
                                    disabled={loading}
                                  >
                                    <Icons.x />
                                  </Button>
                                </div>
                              </CardHeader>

                              <CardContent className="grid grid-cols-3 gap-4">
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

                                <PropertyForm.livingrooms
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
                            </Card>
                          ))}
                      </CardContent>
                    ) : null}
                  </Card>
                ))}
              </div>
            </form>
          </Form>
        </div>
      }
      title={c?.["create project"]}
      description={
        c?.[
          "by providing detailed information about your project, you'll be able to streamline your operations, track progress, and ensure that all stakeholders are informed about the development's key aspects and milestones."
        ]
      }
      {...props}
    />
  );
}
