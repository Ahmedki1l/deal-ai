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
import { userUpdateProfilePersonalSchema } from "@/validations/users";
import { updateUser } from "@/actions/users";
import { UserForm } from "./user-form";
import { Dictionary } from "@/types/locale";

type UserProfilePersonalFormProps = {
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

  function onSubmit(data: z.infer<typeof userUpdateProfilePersonalSchema>) {
    setLoading(true);
    toast.promise(updateUser(data), {
      finally: () => setLoading(false),
      error: (err) => err?.["message"],
      success: () => c?.["updated successfully."],
    });
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
                <UserForm.name dic={dic} form={form} loading={loading} />
                <UserForm.email dic={dic} form={form} loading={true} />
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
