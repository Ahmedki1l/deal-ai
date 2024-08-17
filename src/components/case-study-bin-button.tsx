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
import { caseStudyBinSchema } from "@/validations/case-studies";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { CaseStudy } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { updateCaseStudy } from "@/actions/case-studies";

type CaseStudyBinButtonProps = {
  caseStudy: Pick<CaseStudy, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-bin-button"] &
  Dictionary["dialog"];

export function CaseStudyBinButton({
  dic: { "case-study-bin-button": c, ...dic },
  caseStudy,
  ...props
}: CaseStudyBinButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyBinSchema>>({
    resolver: zodResolver(caseStudyBinSchema),
    defaultValues: {
      id: caseStudy?.["id"],
      deletedAt: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof caseStudyBinSchema>) {
    setLoading(true);
    toast.promise(updateCaseStudy({ ...data, deletedAt: new Date() }), {
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
      title={c?.["delete case study"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your case study."
        ]
      }
      {...props}
    />
  );
}
