"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { projectRestoreSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type ProjectRestoreButtonProps = {
  project: Pick<Project, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["project-restore-button"] &
  Dictionary["dialog"];

export function ProjectRestoreButton({
  dic: { "project-restore-button": c, ...dic },
  project,
  ...props
}: ProjectRestoreButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectRestoreSchema>>({
    resolver: zodResolver(projectRestoreSchema),
    defaultValues: {
      id: project?.["id"],
    },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof projectRestoreSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(`/api/projects/${id}`, {
        ...data,
        deletedAt: null,
      });

      toast.success(c?.["restored successfully."]);
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
