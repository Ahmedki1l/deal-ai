import type { Metadata } from "next";

import { Icons } from "@/components/icons";
import { Suspense } from "react";
import { UserAuthLoginForm } from "@/components/user-auth-login-form";
import { Link } from "@/components/link";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import takaml from "../../../../../public/images/Takaml.png";
import { Image } from "@/components/image";

type LoginProps = Readonly<{
  params: LocaleProps;
}>;

export const metadata: Metadata = { title: "Login" };
export default async function Login({ params: { lang } }: LoginProps) {
  const dic = await getDictionary(lang);

  return (
    <div className="grid min-h-[700px] flex-1 items-center justify-center overflow-auto lg:grid-cols-2">
      {/* <BackButton variant="ghost" className="absolute right-4 top-4 gap-2" /> */}

      <section className="container relative hidden h-full flex-col bg-[url('/images/login.png')] p-10 text-primary-foreground dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary/30" />
        <p className="z-20 flex items-center text-lg font-medium">
          <Icons.logo />
          Deal AI
        </p>

        <div className="z-20 mt-auto">
          <blockquote className="space-y-2 italic">
            <p className="text-lg">
              &ldquo;Since partnering with Acme Inc, our sales have increased by
              40% and customer satisfaction has skyrocketed. Their platform has
              streamlined our operations and boosted our business growth.&rdquo;
            </p>
            <footer className="text-sm">
              Alex Thompson, CEO of Thompson Enterprises
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="container mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-10">
            <Image src={takaml?.["src"]} alt="" />
          </div>
          {/* <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back! 🎉
          </h1> */}
          {/* <p className="text-sm text-muted-foreground">
            Join our community and unlock amazing features to streamline your
            work and boost your productivity.
          </p> */}
        </div>
        <div className="grid gap-6">
          <Suspense>
            <UserAuthLoginForm dic={dic} />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              {dic?.["auth"]?.["login"]?.["don't have an account? sign up now"]}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
