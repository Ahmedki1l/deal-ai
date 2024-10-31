"use client";

import { updateUser } from "@/actions/users";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { clientAction } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { userUpdateProfilePersonalSchema } from "@/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserForm } from "./user-form";

export type UserProfilePersonalFormProps = {
  user: User;
} & Dictionary["user-profile-personal-form"] &
  Dictionary["user-form"];

export function UserProfilePersonalForm({
  dic: { "user-profile-personal-form": c, ...dic },
  user,
}: UserProfilePersonalFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof userUpdateProfilePersonalSchema>>({
    resolver: zodResolver(userUpdateProfilePersonalSchema),
    defaultValues: {
      ...user,
    },
  });

  async function onSubmit(
    data: z.infer<typeof userUpdateProfilePersonalSchema>
  ) {
    await clientAction(async () => await updateUser(data), setLoading).then(
      () => {
        toast.success(c?.["updated successfully."]);
      }
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{c?.["personal information"]}</CardTitle>
              <CardDescription className="max-w-prose">
                {
                  c?.[
                    "this information will be used to create your public profile."
                  ]
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <UserForm.name dic={dic} form={form as any} loading={loading} />
                <UserForm.email dic={dic} form={form as any} loading={true} />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={
                  loading ||
                  JSON.stringify(user) == JSON.stringify(form.getValues())
                }
                onClick={() => form.reset()}
              >
                {c?.["discard"]}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={
                  loading ||
                  JSON.stringify(user) == JSON.stringify(form.getValues())
                }
              >
                {loading && <Icons.spinner />}
                {c?.["save changes"]}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
