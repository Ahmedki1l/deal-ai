"use client";

import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { userAuthLoginSchema } from "@/validations/users";
import { UserForm } from "@/components/user-form";
import { signInWithGoogle, signInWithPassword } from "@/actions/users";
import { Link } from "@/components/link";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";

type UserAuthLoginFormProps = {} & Dictionary["auth"] & Dictionary["user-form"];

export function UserAuthLoginForm({
  dic: {
    auth: { login: c },
    ...dic
  },
}: UserAuthLoginFormProps) {
  const lang = useLocale();
  const [loading, setLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userAuthLoginSchema>>({
    resolver: zodResolver(userAuthLoginSchema),
  });

  async function onSubmit(data: z.infer<typeof userAuthLoginSchema>) {
    try {
      setLoading(true);
      const res = await signInWithPassword(data);

      if (res?.["error"]) {
        const msg = await t(res?.["error"], lang);
        toast.error(msg);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserForm.email
              dic={dic}
              form={form as any}
              loading={loading || isGoogleLoading || isFacebookLoading}
            />
            <UserForm.password
              dic={dic}
              form={form as any}
              loading={loading || isGoogleLoading || isFacebookLoading}
            />

            {/* <p className="text-end text-xs text-muted-foreground">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4 hover:text-primary"
              >
                {c?.["forgot password"]}
              </Link>
            </p> */}

            <Button
              className="w-full"
              disabled={loading || isGoogleLoading || isFacebookLoading}
            >
              {loading && <Icons.spinner />}
              {c?.["sign in with email"]}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {c?.["or continue with"]}
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
            onClick={async () => {
              setIsFacebookLoading(true);
              toast.promise(async () => {}, {
                error: async (err) => {
                  const msg = await t(err?.["message"], lang);
                  return msg;
                },
              });
            }}
            disabled={loading || isGoogleLoading || isFacebookLoading}
          >
            {isFacebookLoading ? <Icons.spinner /> : <Icons.facebook />}
            {c?.["sign in with facebook"]}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              setIsGoogleLoading(true);
              toast.promise(signInWithGoogle(), {
                error: async (err) => {
                  const msg = await t(err?.["message"], lang);
                  return msg;
                },
              });
            }}
            disabled={loading || isGoogleLoading || isFacebookLoading}
          >
            {isGoogleLoading ? <Icons.spinner /> : <Icons.google />}
            {c?.["sign in with google"]}
          </Button>
        </div>
      </div>
    </>
  );
}
