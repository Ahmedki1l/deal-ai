"use client";

import { signInWithGoogle, signInWithPassword } from "@/actions/users";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserForm } from "@/components/user-form";
import { useLocale } from "@/hooks/use-locale";
import { clientAction } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { userAuthLoginSchema } from "@/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type UserAuthLoginFormProps = {} & Dictionary["auth"] &
  Dictionary["user-form"];

export function UserAuthLoginForm({
  dic: {
    auth: { login: c },
    ...dic
  },
}: UserAuthLoginFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userAuthLoginSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(userAuthLoginSchema),
  });

  async function onSubmit(data: z.infer<typeof userAuthLoginSchema>) {
    await clientAction(async () => await signInWithPassword(data), setLoading);
    router.push(`/${locale}/dashboard`);
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
          {/* <Button
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
          </Button> */}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              await clientAction(
                async () => await signInWithGoogle(),
                setIsGoogleLoading,
              ).then(() => setIsGoogleLoading(true));
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
