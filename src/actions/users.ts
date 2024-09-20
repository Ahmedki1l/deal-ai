"use server";

import { getLocale, hash, verify } from "@/actions/helpers";
import { db } from "@/db";
import { getAuth, google, lucia } from "@/lib/auth";
import { getDictionary, t } from "@/lib/locale";
import { ZodError } from "@/lib/zod";
import {
  userAuthLoginSchema,
  userAuthRegisterSchema,
  userUpdateProfilePasswordSchema,
  userUpdateProfilePersonalSchema,
} from "@/validations/users";
import { generateCodeVerifier, generateState } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

export async function signUpWithPassword(
  credentials: z.infer<typeof userAuthRegisterSchema>,
) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const { name, email, password } = userAuthRegisterSchema.parse(credentials);
    const passwordHash = await hash(password);

    const existingEmail = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) return { error: c?.["this email is already used."] };

    const userId = generateIdFromEntropySize(10);
    await db.user.create({
      data: {
        id: userId,
        name,
        email,
        password: passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error: any) {
    return {
      error: error?.["message"]
        ? await t(error?.["message"], { from: "en", to: locale })
        : c?.["your user account was not created. please try again."],
    };
  }
}

export async function signInWithPassword(
  credentials: z.infer<typeof userAuthLoginSchema>,
) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const { email, password } = userAuthLoginSchema.parse(credentials);
    const existingUser = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser) return { error: c?.["incorrect email address."] };
    if (!existingUser?.["password"])
      return {
        error: c?.["no password setting to that account, login using google."],
      };

    const validPassword = await verify(existingUser?.["password"], password);
    if (!validPassword) return { error: c?.["incorrect password"] };

    const session = await lucia.createSession(existingUser?.["id"], {});
    const sessionCookie = lucia.createSessionCookie(session?.["id"]);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error: any) {
    return {
      error: error?.["message"]
        ? await t(error?.["message"], { from: "en", to: locale })
        : c?.["your user account was not logged in. please try again."],
    };
  }
}

export async function signInWithGoogle() {
  const locale = await getLocale();

  // try {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  cookies().set("locale", locale);
  cookies().set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  redirect(url.toString());

  // return url.toString()
  // } catch (error: any) {
  //   if (isRedirectError(error))
  //     return { error: await t(error?.["message"], { from: "en", to: locale }) };
  //   return {
  //     error: await t(error?.["message"] ?? "an error occured, try again.", {
  //       from: "en",
  //       to: locale,
  //     }),
  //   };
  // }
}

export async function logout() {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  const { session } = await getAuth();

  if (!session) return { error: c?.["you are not logged in."] };

  await lucia.invalidateSession(session?.["id"]);
  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect(`/${locale}/login`);
}

export async function updateUser({
  id,
  ...data
}: z.infer<
  | typeof userUpdateProfilePersonalSchema
  | typeof userUpdateProfilePasswordSchema
>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.user.update({
      data,
      where: {
        id,
      },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError)
      return {
        error: await t(new ZodError(error)?.["message"], {
          from: "en",
          to: locale,
        }),
      };
    return {
      error: error?.["message"]
        ? await t(error?.["message"], { from: "en", to: locale })
        : c?.["your user account was not updated. please try again."],
    };
  }
}

export async function updatePassword({
  id,
  ...data
}: z.infer<typeof userUpdateProfilePasswordSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    const password = await hash(data?.["password"]);
    console.log(password);
    await db.user.update({
      data: { password },
      where: { id },
    });

    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session?.["id"]);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError)
      return {
        error: await t(new ZodError(error)?.["message"], {
          from: "en",
          to: locale,
        }),
      };
    return {
      error: error?.["message"]
        ? await t(error?.["message"], { from: "en", to: locale })
        : c?.["your user account was not updated. please try again."],
    };
  }
}
