"use client";

import { CaseStudyForm } from "@/components/case-study-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { caseStudyUpdateSchema } from "@/validations/case-studies";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudyCase } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type CaseStudyUpdateButtonProps = {
  caseStudy: StudyCase;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-update-button"] &
  Dictionary["case-study-form"] &
  Dictionary["dialog"];

export function CaseStudyUpdateButton({
  dic: { "case-study-update-button": c, ...dic },
  caseStudy,
  disabled,
  ...props
}: CaseStudyUpdateButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyUpdateSchema>>({
    resolver: zodResolver(caseStudyUpdateSchema),
    defaultValues: {
      ...caseStudy,
      hashtags: caseStudy.hashtags ?? undefined,
    },
  });

  async function onSubmit({
    id,
    ...data
  }: z.infer<typeof caseStudyUpdateSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(`/api/study-cases/${id}`, {
        ...data,
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
      disabled={loading}
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
              <CaseStudyForm.title
                dic={dic}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["update study case"]}
      description={
        c?.[
          "updating a study case allows you to refine and enhance the details of your ongoing developments"
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
