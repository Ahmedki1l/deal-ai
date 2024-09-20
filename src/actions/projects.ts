"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { ID } from "@/lib/constants";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import { getDictionary, t } from "@/lib/locale";
import {
  projectBinSchema,
  projectCreateFormSchema,
  projectDeleteSchema,
  projectUpdateSchema,
} from "@/validations/projects";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import Sharp from "sharp";
import { z } from "zod";
import { getLocale } from "./helpers";
import { uploadIntoSpace } from "./images";

export async function createProject({
  logo,
  types,
  platforms: plattformArr,
  map,
  ...data
}: z.infer<typeof projectCreateFormSchema>) {
  const locale = await getLocale();
  const {
    actions: { projects: c },
  } = await getDictionary(locale);

  try {
    const { user } = await getAuth();
    if (!user) throw new RequiresLoginError();

    const id = ID.generate();
    const properties = types
      .map((t) =>
        t.properties.map(({ projectId, ...p }) => ({
          ...p,
          projectId: id,
          id: generateIdFromEntropySize(10),
          type: t?.["value"],
          deletedAt: null,
        })),
      )
      .flat();

    const platforms = plattformArr
      .map((t) => ({
        ...t,
        projectId: id,
        id: generateIdFromEntropySize(10),
        urn: t?.["urn"] ?? null,
        clientId: t?.["clientId"] ?? null,
      }))

      .flat();
    const project = {
      ...data,
      id,
      userId: user?.["id"],
      propertyTypes: types?.map((e) => e?.["value"]),

      deletedAt: null,
    };

    let url: string | null = null;

    if (logo) {
      const img = await Sharp(Buffer.from(logo, "base64"))
        .resize({ width: 800 }) // Resize to a more manageable size if necessary
        .png({ quality: 85 }) // Compress the PNG to 80% quality
        .toBuffer();

      console.log("uploading...");
      url = await uploadIntoSpace(`project-logo-${Date.now()}.png`, img);
      console.log("framed url: ", url);
    }

    await db.$transaction(async (tx) => {
      if (properties?.["length"]) {
        await tx.property.createMany({
          data: properties,
        });
      }

      if (platforms?.["length"]) {
        await tx.platform.createMany({
          data: platforms,
        });
      }

      await tx.project.create({ data: { ...project, logo: url } });
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
        : c?.["your project was not created. please try again."],
    };
  }
}

export async function updateProject({
  id,
  ...data
}: z.infer<typeof projectUpdateSchema | typeof projectBinSchema>) {
  const locale = await getLocale();
  const {
    actions: { projects: c },
  } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.project.update({
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
        : c?.["your project was not updated. please try again."],
    };
  }
}

export async function deleteProject({
  id,
}: z.infer<typeof projectDeleteSchema>) {
  const locale = await getLocale();
  const {
    actions: { projects: c },
  } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.project.delete({ where: { id } });

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
        : c?.["your project was not updated. please try again."],
    };
  }
}
