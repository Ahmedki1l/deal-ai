import type { Metadata } from "next";

import { Suspense } from "react";
import { Icons } from "@/components/icons";
import { UserAuthRegisterForm } from "@/components/user-auth-register-form";
import { Link } from "@/components/link";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import takaml from "../../../../../public/images/Takaml.png";
import { Image } from "@/components/image";

type RegisterProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Register" };
export default async function Register({ params: { lang } }: RegisterProps) {
  const { site: c, ...dic } = await getDictionary(lang);

  return (
    <div className="grid min-h-[700px] flex-1 items-center justify-center overflow-auto lg:grid-cols-2">
      {/* <BackButton variant="ghost" className="absolute right-4 top-4 gap-2" /> */}

      <section className="container relative hidden h-full flex-col bg-[url('https://unsplash.com/photos/a-couple-of-tall-buildings-sitting-next-to-each-other-g5d5J8hStio')] p-10 text-primary-foreground dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary/30" />
        <p className="z-20 flex items-center gap-2 text-lg font-medium">
          <Icons.logo /> {c?.["name"]}
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

      {/* <section className="bg-muted container relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="bg-primary absolute inset-0" />
        <p className="z-20 flex items-center text-lg font-medium">
          <Icons.logo />
          Acme Inc
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
      </section> */}

      <section className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-10">
            <Image
              src={takaml?.["src"]}
              alt=""
              className="border-none bg-transparent"
            />
          </div>
          {/* 
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back! 🎉
          </h1> */}
          {/* <p className="text-sm text-muted-foreground">
            Join our community and unlock amazing features to streamline your
            work and boost your productivity.
          </p> */}
        </div>
        {/* <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account! 🎉
          </h1>
          <p className="text-sm text-muted-foreground">
            Join our community and unlock amazing features to streamline your
            work and boost your productivity.
          </p>
        </div> */}
        <div className="grid gap-6">
          <Suspense>
            <UserAuthRegisterForm dic={dic} />
          </Suspense>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          {/* <p className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p> */}
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              {
                dic?.["auth"]?.["register"]?.[
                  "already have an account? sign in."
                ]
              }
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
