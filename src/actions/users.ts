"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import * as z from "zod";

import { google } from "@/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";

import {
  userAuthRegisterSchema,
  userAuthLoginSchema,
  userUpdateProfilePersonalSchema,
  userUpdateProfilePasswordSchema,
} from "@/validations/users";
import { lucia, getAuth } from "@/lib/auth";
import { db } from "@/db";
import { getLocale, hash, verify } from "./helpers";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import { revalidatePath } from "next/cache";

export async function signUpWithPassword(
  credentials: z.infer<typeof userAuthRegisterSchema>,
) {
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

    if (existingEmail) return { error: "This email is already used." };

    const userId = generateIdFromEntropySize(10);
    await db.user.create({
      data: {
        id: userId,
        email,
        name,
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

    const locale = await getLocale();
    return redirect(`/${locale}/login`);
  } catch (error: any) {
    if (isRedirectError(error)) throw error;
    throw Error(error?.["message"] ?? "an error occured, try again.");
  }
}

export async function signInWithPassword(
  credentials: z.infer<typeof userAuthLoginSchema>,
) {
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
    if (!existingUser) return { error: "No such a user." };
    if (!existingUser?.["password"]) return { error: "Incorrect password." };

    const validPassword = await verify(existingUser?.["password"], password);
    if (!validPassword)
      return {
        error: "Incorrect email or password",
      };

    const session = await lucia.createSession(existingUser?.["id"], {});
    const sessionCookie = lucia.createSessionCookie(session?.["id"]);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    const locale = await getLocale();
    return redirect(`/${locale}/dashboard`);
  } catch (error: any) {
    if (isRedirectError(error)) throw error;
    throw Error(error?.["message"] ?? "an error occured, try again.");
  }
}

export async function signInWithGoogle() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

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

  return redirect(url.toString());
}

export async function logout() {
  const { session } = await getAuth();
  if (!session) throw new Error("You are not logged in.");

  await lucia.invalidateSession(session?.["id"]);
  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  const locale = await getLocale();
  return redirect(`/${locale}/login`);
}

export async function updateUser({
  id,
  ...data
}: z.infer<
  | typeof userUpdateProfilePersonalSchema
  | typeof userUpdateProfilePasswordSchema
>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.user.update({
      data,
      where: {
        id,
      },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your user was not updated. Please try again.",
    );
  }
}

export async function updatePassword({
  id,
  ...data
}: z.infer<typeof userUpdateProfilePasswordSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

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
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your user was not updated. Please try again.",
    );
  }
}
