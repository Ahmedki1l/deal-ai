"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Avatar } from "@/components/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { z as Z } from "@/lib/zod";
import { User } from "lucia";
import { userUpdateProfilePasswordFormSchema } from "@/validations/users";
import { updatePassword, updateUser } from "@/actions/users";
import { UserForm } from "./user-form";
import { Dictionary } from "@/types/locale";

type UserProfilePasswordProps = {
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

  function onSubmit(data: z.infer<typeof userUpdateProfilePasswordFormSchema>) {
    if (data?.["newPassword"] != data?.["confirmNewPassword"]) {
      form.setError("confirmNewPassword", {
        message: "confirm password doesn't match.",
      });
      return;
    }

    setLoading(true);
    toast.promise(
      updatePassword({ id: data?.["id"], password: data?.["newPassword"] }),
      {
        finally: () => setLoading(false),
        error: (err) => err?.["message"],
        success: () => c?.["updated successfully."],
      },
    );
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
                    "this information will be used to create your public profile and facilitate communication with patients and colleagues."
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
