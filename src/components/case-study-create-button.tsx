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
import { caseStudyCreateFormSchema } from "@/validations/case-studies";
import { createCaseStudy } from "@/actions/case-studies";
import { CaseStudyForm } from "@/components/case-study-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Platform, Project } from "@prisma/client";
import { convertBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type CaseStudyCreateButtonProps = {
  project: Project & { platforms: Platform[] };
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-create-button"] &
  Dictionary["case-study-form"] &
  Dictionary["dialog"];

export function CaseStudyCreateButton({
  dic: { "case-study-create-button": c, ...dic },
  project,
  disabled,
  ...props
}: CaseStudyCreateButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyCreateFormSchema>>({
    resolver: zodResolver(caseStudyCreateFormSchema),
    defaultValues: {
      projectId: project?.["id"],
      content: "x",
      targetAudience: "x",
      pros: "x",
      cons: "x",
      hashtags: "x",
      Market_Strategy: "x",
      Performance_Metrics: "x",
      ROI_Calculation: "x",
      Strategic_Insights: "x",
      Recommendations: "x",
    },
  });

  console.log("in the create case study button")

  async function onSubmit(data: z.infer<typeof caseStudyCreateFormSchema>) {
    setLoading(true);

    console.log("creating case study");

    toast.promise(
      createCaseStudy(
        {
          ...data,
          refImages: data?.refImages?.map((e) => e?.base64),
        },
        project,
      ),
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
          return c?.["created successfully."];
        },
      },
    );
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
                {!disabled && loading && <Icons.spinner />}
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
              <CaseStudyForm.refImages
                dic={dic}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["create case study"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your case study."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
