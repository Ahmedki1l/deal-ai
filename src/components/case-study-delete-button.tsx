"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { caseStudyDeleteSchema } from "@/validations/case-studies";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudyCase } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type CaseStudyDeleteButtonProps = {
  caseStudy: Pick<StudyCase, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-delete-button"] &
  Dictionary["dialog"];

export function CaseStudyDeleteButton({
  dic: { "case-study-delete-button": c, ...dic },
  caseStudy,
  ...props
}: CaseStudyDeleteButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyDeleteSchema>>({
    resolver: zodResolver(caseStudyDeleteSchema),
    defaultValues: {
      id: caseStudy?.["id"],
    },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof caseStudyDeleteSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).delete(`/api/study-cases/${id}`);

      toast.success(c?.["deleted successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
  }

  return (
    <DialogResponsive
      dic={dic}
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
      title={c?.["delete study case"]}
      description={
        c?.[
          "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
