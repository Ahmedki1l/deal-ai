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
import { projectCreateFormSchema } from "@/validations/projects";
import { createProject } from "@/actions/projects";
import { User } from "@/types/db";
import { ProjectForm } from "@/components/project-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";

import { PropertyForm } from "@/components/property-form";
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
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";
import { Dictionary } from "@/types/locale";

type ProjectCreateButtonProps = { user: User } & Omit<
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
  ...props
}: ProjectCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectCreateFormSchema>>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: { userId: user?.["id"] },
  });
  const { fields, remove, append } = useFieldArray({
    name: "types",
    control: form?.["control"],
  });

  async function onSubmit(data: z.infer<typeof projectCreateFormSchema>) {
    setLoading(true);
    toast.promise(createProject(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        console.log(data);
        form.reset();
        setOpen(false);
        return c?.["created successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      open={open}
      setOpen={setOpen}
      confirmButton={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button disabled={loading} className="w-full md:w-fit">
              {loading && <Icons.spinner />}
              {c?.["submit"]}
            </Button>
          </form>
        </Form>
      }
      content={
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
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
                <div className="grow bg-muted col-span-2">
                  <ProjectForm.map
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProjectForm.distinct
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />  
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
                <ProjectForm.spaces
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <ProjectForm.platforms
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label>{c?.["type of assets"]}</Label>
                  <Button
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
                            size="icon"
                            onClick={() =>
                              // @ts-ignore
                              field?.properties?.push({
                                projectId: i.toString(),
                              })
                            }
                          >
                            <Icons.add />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    {field?.["properties"]?.["length"] ? (
                      <CardContent className="space-y-4">
                        {field?.properties?.map((_, j) => (
                          <Card key={j} className="border-green-500">
                            <CardHeader>
                              <div className="flex items-center justify-between gap-4">
                                <CardTitle>
                                  {c?.["unit"]} {j + 1}
                                </CardTitle>
                                {/* <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    field.properties = field.properties.filter(
                                      (property, index) => {
                                        console.log("card ", property);
                                        console.log("card index ", j);
                                        console.log("item index ", index);
                                        return index !== j;
                                      },
                                    );
                                    console.log(field.properties);
                                  }}
                                >
                                  <Icons.x />
                                </Button> */}
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

                              <PropertyForm.recipients
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
              </div>
            </form>
          </Form>
        </div>
      }
      title={c?.["create project"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your project."
        ]
      }
      {...props}
    />
  );
}
