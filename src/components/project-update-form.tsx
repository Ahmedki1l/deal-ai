"use client";

import { updateProject } from "@/actions/projects";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";
import { Dictionary } from "@/types/locale";
import { projectUpdateFormSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type ProjectUpdateFormProps = {
  project: Project;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["project-update-form"] &
  Dictionary["project-form"] &
  Dictionary["dialog"];

export function ProjectUpdateForm({
  dic: { "project-update-form": c, ...dic },
  project,
  ...props
}: ProjectUpdateFormProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectUpdateFormSchema>>({
    resolver: zodResolver(projectUpdateFormSchema),
    defaultValues: {
      ...project,
      description: project?.["description"] ?? undefined,
      // platforms: project?.["platforms"]
      //   ? project?.["platforms"]?.map((p) => ({
      //       value: p,
      //     }))
      //   : [],
      propertyTypes: project?.["propertyTypes"]
        ? project?.["propertyTypes"]?.map((p) => ({
            value: p,
          }))
        : [],
    },
  });

  function onSubmit(data: z.infer<typeof projectUpdateFormSchema>) {
    setLoading(true);
    toast.promise(
      updateProject({
        ...data,
        // platforms: data?.["platforms"].map((e) => e?.["value"]),
        propertyTypes: data?.["propertyTypes"].map((e) => e?.["value"]),
      }),
      {
        finally: () => setLoading(false),
        error: async (err) => {
          const msg = await t(err?.["message"], lang);
          return msg;
        },
        success: () => {
          router.refresh();
          form.reset();
          setOpen(false);
          return c?.["updated successfully."];
        },
      },
    );
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
              {/* <ProjectForm.platforms
                dic={dic}
                form={form as any}
                loading={loading}
              /> */}
            </form>
          </Form>
        </>
      }
      title={c?.["update project"]}
      description={
        c?.[
          "updating a project allows you to refine and enhance the details of your ongoing developments"
        ]
      }
      {...props}
    />
  );
}
