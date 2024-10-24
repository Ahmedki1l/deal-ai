"use client";

import { useState } from "react";

import { Icons } from "@/components/icons";
import { JsonEditor, JsonEditorProps } from "@/components/json-editor";
import { useSession } from "@/components/session-provider";
import { Tooltip } from "@/components/tooltip";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudyCase } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const jsonEditorSchema = z.any();

type CaseStudyUpdateFormProps = {
  studyCase: Pick<StudyCase, "id">;
  keyName: string;
  label: string;
  name?: string;
  jsonContent: any;
} & Dictionary["case-study-update-form"] &
  Pick<JsonEditorProps, "dic">;

export function CaseStudyUpdateForm({
  dic: { "case-study-update-form": c, ...dic },
  label,
  studyCase,
  keyName,
  name,
  jsonContent,
}: CaseStudyUpdateFormProps) {
  const locale = useLocale();
  const { user } = useSession();
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof jsonEditorSchema>>({
    mode: "onChange",
    resolver: zodResolver(jsonEditorSchema),
    defaultValues: jsonContent,
  });
  async function onSubmit(data: z.infer<typeof jsonEditorSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).patch(
        `/api/study-cases/${studyCase?.["id"]}`,
        { [keyName]: JSON.stringify(data) }
      );

      toast.success(c?.["updated successfully."]);
      form.reset({ ...data });
      setEditable(false);
    }, setLoading);
  }

  return (
    <AccordionItem value={keyName}>
      <div className="flex items-center gap-2">
        <AccordionTrigger>{label}</AccordionTrigger>

        <Tooltip text={editable ? c?.["cancel"] : c?.["edit"]}>
          <div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={(_) => {
                if (editable) form.reset({ ...jsonContent });
                setEditable((pre) => !pre);
              }}
            >
              {editable ? <Icons.x /> : <Icons.edit />}
            </Button>
          </div>
        </Tooltip>
      </div>

      {editable ? (
        <AccordionContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="space-y-6"
            >
              <JsonEditor dic={dic} form={form} data={form.getValues()} />

              <Button disabled={loading}>
                {loading && <Icons.spinner />}
                {c?.["submit"]}
              </Button>
            </form>
          </Form>
        </AccordionContent>
      ) : (
        <AccordionContent>
          {(() => {
            try {
              if (
                !form.getValues() ||
                typeof form.getValues() !== "object" ||
                !!Array.isArray(form.getValues())
              )
                return <p>No valid {name} data available.</p>;

              return renderKeyValuePairs(form.getValues());
            } catch (e) {
              console.error(`Failed to parse ${name} JSON`, e);
              return <p>error loading {name} data.</p>;
            }
          })()}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

const renderKeyValuePairs = (data: Record<string, any>) => (
  <ul className="flex flex-col gap-2 text-start ltr:border-l-2 ltr:pl-2 rtl:border-r-2 rtl:pr-2">
    {Object.entries(data).map(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        // Recursively handle objects
        return (
          <li key={key} className="p-3">
            <div className="mb-2 font-semibold text-foreground">
              {key.split("_").join(" ")}:
            </div>
            <div>{renderKeyValuePairs(value)}</div>
          </li>
        );
      }

      if (Array.isArray(value)) {
        // Render array items without indices
        return (
          <li key={key} className="rounded-md bg-muted p-2 shadow-sm">
            <div className="mb-2 font-semibold text-foreground">
              {key.split("_").join(" ")}:
            </div>
            <ul className="list-inside list-disc space-y-1 px-4">
              {value.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {typeof item === "object" ? renderKeyValuePairs(item) : item}
                </li>
              ))}
            </ul>
          </li>
        );
      }

      // Render primitive values (string, number, boolean)
      return (
        <li
          key={key}
          className="flex items-start gap-2 rounded-md bg-muted p-2 shadow-sm"
        >
          <span className="font-semibold text-foreground">
            {key.split("_").join(" ")}:
          </span>
          <span className="text-gray-600">{value}</span>
        </li>
      );
    })}
  </ul>
);
