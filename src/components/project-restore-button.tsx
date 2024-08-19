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
import { projectRestoreSchema } from "@/validations/projects";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Project } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { deleteProject, updateProject } from "@/actions/projects";

type ProjectRestoreButtonProps = {
  project: Pick<Project, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["project-restore-button"] &
  Dictionary["dialog"];

export function ProjectRestoreButton({
  dic: { "project-restore-button": c, ...dic },
  project,
  ...props
}: ProjectRestoreButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectRestoreSchema>>({
    resolver: zodResolver(projectRestoreSchema),
    defaultValues: {
      id: project?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof projectRestoreSchema>) {
    setLoading(true);
    // @ts-ignore
    toast.promise(updateProject({ ...data, deletedAt: null }), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["restored successfully."];
      },
    });
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
              <Button
                variant="secondary"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["restore"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["restore project"]}
      description={
        c?.[
          "restoring this project will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off."
        ]
      }
      {...props}
    />
  );
}
