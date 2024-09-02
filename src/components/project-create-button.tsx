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
  projectCreateFormSchema,
  projectCreateSchema,
} from "@/validations/projects";
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
import { Dictionary } from "@/types/locale";

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
  ...props
}: ProjectCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
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
    const toastId = toast.loading("Initializing case...");

    try {
      setLoading(true);

      // Create a POST request with the data
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const { id } = await response.json().catch((err) => {
        setLoading(false);
        throw err;
      });

      // Start the EventSource after getting the id from the POST request
      const eventSource = new EventSource(`/api/projects?id=${id}`);

      eventSource.addEventListener("status", (event) => {
        toast.loading(event.data?.replaceAll('"', ""), {
          id: toastId,
        });
      });

      eventSource.addEventListener("completed", (event) => {
        toast.dismiss(toastId);
        eventSource.close();
        toast.success(event.data?.replaceAll('"', ""));

        router.refresh();
        setOpen(false);
        form.reset();
        setLoading(false);
      });

      eventSource.addEventListener("error", (event) => {
        console.error("Error occurred:", event);
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });

      eventSource.addEventListener("close", () => {
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);

      toast.error(err?.message);
    }
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
                      fields?.["length"] === propertyTypes(lang)?.["length"]
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
                            // type="button"
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
