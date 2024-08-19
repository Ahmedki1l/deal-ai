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
import { caseStudyUpdateSchema } from "@/validations/case-studies";
import { updateCaseStudy } from "@/actions/case-studies";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { CaseStudyForm } from "@/components/case-study-form";
import { CaseStudy } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type CaseStudyUpdateFormProps = {
  caseStudy: CaseStudy;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-update-form"] &
  Dictionary["case-study-form"] &
  Dictionary["dialog"];

export function CaseStudyUpdateForm({
  dic: { "case-study-update-form": c, ...dic },
  caseStudy,
  disabled,
  ...props
}: CaseStudyUpdateFormProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyUpdateSchema>>({
    resolver: zodResolver(caseStudyUpdateSchema),
    defaultValues: {
      ...caseStudy,
    },
  });

  function onSubmit(data: z.infer<typeof caseStudyUpdateSchema>) {
    setLoading(true);
    toast.promise(updateCaseStudy(data), {
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
    });
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
      title={c?.["update case study"]}
      description={
        c?.[
          "updating a case study allows you to refine and enhance the details of your ongoing developments"
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
