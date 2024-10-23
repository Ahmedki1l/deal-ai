"use client";

import { useState } from "react";
import { JsonEditor } from "./json-editor";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudyCase } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

const jsonEditorSchema = z.any();

type CaseStudyUpdateButtonProps = {
  studyCase: Pick<StudyCase, "id">;
  keyName: string;
  name?: string;
  jsonContent: any;
};

const renderKeyValuePairs = (data: Record<string, any>) => (
  <ul className="list-decimal ltr:pl-5 rtl:pr-5">
    {Object.entries(data).map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        // Directly render string and number values
        return (
          <li key={key} className="mb-1">
            <strong>{key.split("_").join(" ")}:</strong> {value}
          </li>
        );
      } else if (Array.isArray(value)) {
        // Render array items without indices
        return (
          <li key={key}>
            <strong>{key.split("_").join(" ")}:</strong>
            <ul className="list-inside list-disc">
              {value.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </li>
        );
      } else {
        // Recursively handle objects
        return (
          <li key={key}>
            <strong>{key.split("_").join(" ")}:</strong>
            {renderKeyValuePairs(value)}
          </li>
        );
      }
    })}
  </ul>
);

export function CaseStudyUpdateButton({
  studyCase,
  keyName,
  name,
  jsonContent,
}: CaseStudyUpdateButtonProps) {
  console.log(keyName);
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

      toast.success("updated successfully.");
      setEditable(false);
      form.reset({ ...data });
    }, setLoading);
  }

  if (!editable)
    try {
      if (
        !form.getValues() ||
        typeof form.getValues() !== "object" ||
        !!Array.isArray(form.getValues())
      )
        return <p> No valid {name} data available.</p>;

      return (
        <div>
          <Button onClick={(_) => setEditable((pre) => !pre)}>
            {editable ? "close" : "start"}
          </Button>

          {renderKeyValuePairs(form.getValues())}
        </div>
      );
    } catch (e) {
      console.error("Failed to parse Market_Strategy JSON", e);
      return <p>error loading {name} data.</p>;
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <JsonEditor form={form} data={form.getValues()} />

        <Button disabled={loading}>
          {loading && <Icons.spinner />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
