"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  propertyBinSchema,
  propertyCreateFormSchema,
  propertyCreateSchema,
  propertyDeleteSchema,
  propertyUpdateSchema,
} from "@/validations/properties";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { sendEvent } from "@/lib/stream";
import { getLocale } from "./helpers";
import { getDictionary } from "@/lib/dictionaries";

export async function createProperty(
  controller: ReadableStreamDefaultController<any>,
  data: z.infer<typeof propertyCreateFormSchema>,
) {
  const { actions: c } = await getDictionary(await getLocale());
  try {
    const { user } = await getAuth();
    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    sendEvent(controller, "status", c?.["creating properties..."]);
    const properties = data.types
      .map((t) =>
        t.properties.map((p) => ({
          ...p,
          id: generateIdFromEntropySize(10),
          type: t?.["value"],
          deletedAt: null,
        })),
      )
      .flat();

    await db.property.createMany({
      data: properties,
    });
    sendEvent(
      controller,
      "completed",
      properties?.["length"] === 1
        ? c?.["one property was created."]
        : `${properties?.["length"]} ${c?.["properties were created."]}`,
    );

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your case study was not created. Please try again.",
    );
  } finally {
    controller.close();
  }
}

export async function updateProperty({
  id,
  ...data
}: z.infer<typeof propertyUpdateSchema | typeof propertyBinSchema>) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();

    await db.property.update({
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
      error?.["message"] ??
        "your case study was not updated. Please try again.",
    );
  }
}

export async function deleteProperty({
  id,
}: z.infer<typeof propertyDeleteSchema>) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();

    await db.property.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your case study was not deleted. Please try again.",
    );
  }
}
