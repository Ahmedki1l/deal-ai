"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { ID } from "@/lib/constants";
import { getDictionary, t } from "@/lib/locale";
import { ZodError } from "@/lib/zod";
import {
  projectBinSchema,
  projectCreateFormSchema,
  projectDeleteSchema,
  projectUpdateSchema,
} from "@/validations/projects";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLocale } from "./helpers";
import { base64ToBuffer, uploadIntoSpace } from "./images";

export async function createProject({
  logo,
  pdf,
  types,
  platforms: plattformArr,
  map,
  ...data
}: z.infer<typeof projectCreateFormSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

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
    let pdfUrl: string | null = null;

    if (logo) {
      console.log("uploading...");
      const img = await base64ToBuffer({ base64: logo });
      const r = await uploadIntoSpace({
        name: "projects",
        body: img,
      });
      if (!(typeof r === "string")) return { error: r?.["error"] };
      if (!(typeof r === undefined)) url = r;
      console.log("logo url: ", url);
    }

    // if (pdf?.["base64"]) {
    //   const pdfBuffer = await base64ToBuffer({
    //     type: "pdf",
    //     base64: pdf?.["base64"],
    //   });
    //   const r = await uploadIntoSpace({
    //     type: "pdf",
    //     name: "projects",
    //     body: pdfBuffer,
    //   });

    //   if (!(typeof r === "string")) return { error: r?.["error"] };
    //   if (!(typeof r === undefined)) pdfUrl = r;
    //   console.log("pdf url: ", pdfUrl);
    // }

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

      await tx.project.create({
        data: {
          ...project,
          logo: url,
          //  pdf: pdfUrl
        },
      });
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
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

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
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

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
        : c?.["your project was not deleted. please try again."],
    };
  }
}
