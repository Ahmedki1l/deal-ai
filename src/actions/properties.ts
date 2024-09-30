"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { ID } from "@/lib/constants";
import { getDictionary } from "@/lib/dictionaries";
import { t } from "@/lib/locale";
import { ZodError } from "@/lib/zod";
import {
  propertyBinSchema,
  propertyCreateFormSchema,
  propertyDeleteSchema,
  propertyUpdateSchema,
} from "@/validations/properties";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLocale } from "./helpers";

export async function createProperty(
  data: z.infer<typeof propertyCreateFormSchema>,
) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const { user } = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const properties = data?.["properties"]?.map((p) => ({
      ...p,
      id: ID.generate(),
      deletedAt: null,
    }));

    if (properties?.["length"]) {
      const propertyTypes = Array.from(
        new Set(properties.map((e) => e?.["type"])),
      );

      await db.$transaction(async (tx) => {
        await tx.property.createMany({
          data: properties,
        });

        await tx.project.update({
          data: { propertyTypes: { push: [...propertyTypes] } },
          where: { id: properties?.[0]?.["projectId"] },
        });
      });
    }

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
        : c?.["your property was not created. please try again."],
    };
  }
}

export async function updateProperty({
  id,
  ...data
}: z.infer<typeof propertyUpdateSchema | typeof propertyBinSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();

    if (!user) return { error: c?.["this action needs you to be logged in."] };

    await db.property.update({
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
        : c?.["your property was not updated. please try again."],
    };
  }
}

export async function deleteProperty({
  id,
}: z.infer<typeof propertyDeleteSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();

    if (!user) return { error: c?.["this action needs you to be logged in."] };

    await db.property.delete({ where: { id } });

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
        : c?.["your property was not deleted. please try again."],
    };
  }
}
