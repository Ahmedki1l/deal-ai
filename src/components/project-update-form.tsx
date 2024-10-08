"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { projectUpdateFormSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

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
  const locale = useLocale();
  const { user } = useSession();
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

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof projectUpdateFormSchema>) {
    await clientHttpRequest(async () => {
      await axios({ user, locale }).patch(`/api/projects/${id}`, {
        ...data,
        // platforms: data?.["platforms"].map((e) => e?.["value"]),
        propertyTypes: data?.["propertyTypes"].map((e) => e?.["value"]),
      });

      toast.success(c?.["updated successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
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
