"use client";

import { updatePassword } from "@/actions/users";
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
import { userUpdateProfilePasswordFormSchema } from "@/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserForm } from "./user-form";

export type UserProfilePasswordProps = {
  user: User;
} & Dictionary["user-profile-password-form"] &
  Dictionary["user-form"];

export function UserProfilePasswordForm({
  dic: { "user-profile-password-form": c, ...dic },
  user,
}: UserProfilePasswordProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof userUpdateProfilePasswordFormSchema>>({
    resolver: zodResolver(userUpdateProfilePasswordFormSchema),
    defaultValues: {
      ...user,
    },
  });

  async function onSubmit(
    data: z.infer<typeof userUpdateProfilePasswordFormSchema>,
  ) {
    if (data?.["newPassword"] != data?.["confirmNewPassword"]) {
      form.setError("confirmNewPassword", {
        message: "confirm password doesn't match.",
      });
      return;
    }

    await clientAction(
      async () =>
        await updatePassword({
          id: data?.["id"],
          password: data?.["newPassword"],
        }),
      setLoading,
    );

    toast.success(c?.["updated successfully."]);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{c?.["reset password"]}</CardTitle>
              <CardDescription className="max-w-prose">
                {
                  c?.[
                    "this will update your password and help keep your account secure."
                  ]
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <UserForm.password
                  field="newPassword"
                  label={c?.["new password"]}
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <UserForm.password
                  field="confirmNewPassword"
                  label={c?.["confirm new password"]}
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => form.reset()}
              >
                {c?.["discard"]}
              </Button>
              <Button variant="secondary" size="sm" disabled={loading}>
                {loading && <Icons.spinner />}
                {c?.["submit"]}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
