"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { projectBinSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type ProjectBinButtonProps = {
  project: Pick<Project, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["project-bin-button"] &
  Dictionary["dialog"];

export function ProjectBinButton({
  dic: { "project-bin-button": c, ...dic },
  project,
  ...props
}: ProjectBinButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
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

  async function onSubmit({ id, ...data }: z.infer<typeof projectBinSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(`/api/projects/${id}`, {
        ...data,
        // @ts-ignore
        deletedAt: new Date(),
      });

      toast.success(c?.["deleted successfully."]);
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
          "once deleted, the project will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened."
        ]
      }
      {...props}
    />
  );
}
