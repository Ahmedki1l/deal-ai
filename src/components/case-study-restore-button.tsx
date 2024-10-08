"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { caseStudyRestoreSchema } from "@/validations/case-studies";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudyCase } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type CaseStudyRestoreButtonProps = {
  caseStudy: Pick<StudyCase, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-restore-button"] &
  Dictionary["dialog"];

export function CaseStudyRestoreButton({
  dic: { "case-study-restore-button": c, ...dic },
  caseStudy,
  ...props
}: CaseStudyRestoreButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyRestoreSchema>>({
    resolver: zodResolver(caseStudyRestoreSchema),
    defaultValues: {
      id: caseStudy?.["id"],
    },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof caseStudyRestoreSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(`/api/study-cases/${id}`, {
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
      title={c?.["restore study case"]}
      description={
        c?.[
          "restoring this study case will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off."
        ]
      }
      {...props}
    />
  );
}
