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
import { projectBinSchema } from "@/validations/projects";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Project } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { updateProject } from "@/actions/projects";

type ProjectBinButtonProps = {
  project: Pick<Project, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["project-bin-button"] &
  Dictionary["dialog"];

export function ProjectBinButton({
  dic: { "project-bin-button": c, ...dic },
  project,
  ...props
}: ProjectBinButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectBinSchema>>({
    resolver: zodResolver(projectBinSchema),
    defaultValues: {
      id: project?.["id"],
      deletedAt: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof projectBinSchema>) {
    setLoading(true);
    toast.promise(updateProject({ ...data, deletedAt: new Date() }), {
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
      open={open}
      setOpen={setOpen}
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
      title={c?.["delete project"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your project."
        ]
      }
      {...props}
    />
  );
}
