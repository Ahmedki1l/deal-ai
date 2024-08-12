"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  projectCreateFormSchema,
  projectDeleteSchema,
  projectUpdateSchema,
} from "@/validations/projects";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";

export async function createProject({
  types,
  platforms,
  ...data
}: z.infer<typeof projectCreateFormSchema>) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const properties = types
      .map((t) =>
        t.properties.map(({ projectId, ...p }) => ({
          ...p,
          id: generateIdFromEntropySize(10),
          type: t?.["value"],
        })),
      )
      .flat();

    const id = generateIdFromEntropySize(10);
    await db.project.create({
      data: {
        ...data,
        id,
        userId: user?.["id"],
        platforms: platforms.map((e) => e?.["value"]),
        propertyTypes: types?.map((e) => e?.["value"]),
        properties: {
          createMany: {
            data: properties,
          },
        },
      },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not created. Please try again.",
    );
  }
}

export async function updateProject({
  id,
  ...data
}: z.infer<typeof projectUpdateSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    // await db.project.update({
    //   data,
    //   where: {
    //     id,
    //   },
    // });

    // revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not updated. Please try again.",
    );
  }
}

export async function deleteProject({
  id,
}: z.infer<typeof projectDeleteSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.project.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not deleted. Please try again.",
    );
  }
}
