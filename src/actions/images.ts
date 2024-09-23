"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { getDictionary, t } from "@/lib/locale";
import { s3Client } from "@/lib/uploader";
import { ZodError } from "@/lib/zod";
import {
  imageCreateSchema,
  imageDeleteSchema,
  imageGenerateSchema,
  imageRegeneratePromptSchema,
  imageUpdateSchema,
} from "@/validations/images";
import S3, { Body, ObjectKey } from "aws-sdk/clients/s3";
import axios from "axios";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { getLocale } from "./helpers";

export async function createImage(data: z.infer<typeof imageCreateSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

    const id = generateIdFromEntropySize(10);
    await db.image.create({
      data: { id, ...data, deletedAt: null },
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
        : c?.["your image was not created. please try again."],
    };
  }
}

export async function updateImage({
  id,
  ...data
}: z.infer<typeof imageUpdateSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

    if (data?.["src"] && data?.["src"]?.includes(",")) {
      const r = await uploadIntoSpace({
        body: await base64ToBuffer(data?.["src"]),
      });

      if (typeof r == "object" && "error" in r) return { error: r?.["error"] };
      data.src = r;
    }
    await db.image.update({
      data,
      where: { id },
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
        : c?.["your image was not updated. please try again."],
    };
  }
}

export async function deleteImage({ id }: z.infer<typeof imageDeleteSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

    await db.image.delete({ where: { id } });

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
        : c?.["your image was not deleted. please try again."],
    };
  }
}

export async function base64ToBuffer(str: string) {
  const base64 = str?.split(",")?.pop();
  if (!base64) throw Error("NO BASE64");

  return sharp(Buffer.from(base64, "base64"))
    .resize({ width: 800 })
    .png({ quality: 80 })
    .toBuffer();
}

export async function regenerateImagePrompt({
  ...data
}: z.infer<typeof imageRegeneratePromptSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

    const domain = process.env.NEXT_PUBLIC_AI_API;
    const prompt_enhancer_endpoint = domain + `/en/prompt-enhancer`;

    const {
      data: enhanced_prompt_response,
    }: {
      data: { prompt: string };
    } = await axios.post(prompt_enhancer_endpoint, { input: data.prompt });

    const adjusted_image_prompt = {
      input: `you must adjust this prompt to be only 1000 characters long at max: ${enhanced_prompt_response?.["prompt"]}`,
    };

    const prompt_generator_endpoint = domain + `/en/prompt-generator`;
    const {
      data: adjusted_image_response,
    }: {
      data: { prompt: string };
    } = await axios.post(prompt_generator_endpoint, adjusted_image_prompt);

    return adjusted_image_response?.["prompt"];
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
        : c?.["your image prompt was not updated. please try again."],
    };
  }
}

export async function generateImage({
  ...data
}: z.infer<typeof imageGenerateSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };

    const image_generator_endpoint = process.env.NEXT_PUBLIC_AI_API + `/image`;
    const { data: image_generator_response }: { data: { url: string } } =
      await axios.post(image_generator_endpoint, { input: data.prompt });

    return image_generator_response?.["url"];
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
        : c?.["your image url was not generated. please try again."],
    };
  }
}

export async function uploadIntoSpace({
  body,
  name,
  type = "img",
}: {
  body: Body;
  name?: ObjectKey;
  type?: "img" | "pdf";
}) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);
  try {
    const imgProps = {
      Key: `imgs/${Date.now()}${name ? `_${name}` : null}`, // Unique key for the file
      ContentType: "image/png", // or 'image/jpeg', depending on the file type
    };
    const pdfProps = {
      Key: `pdfs/${Date.now()}${name ? `_${name}` : null}`,
      ContentType: "application/pdf",
    };

    // Set up S3 upload parameters
    const params: S3.PutObjectRequest = {
      ...{
        Bucket: process.env.DO_SPACE_BUCKET!,
        Body: body,
        // ContentEncoding: "base64", // Required when uploading Base64 data
        ACL: "public-read", // Make the file publicly accessible
      },
      ...(type === "pdf" ? pdfProps : imgProps),
    };

    await s3Client.upload(params).promise();

    // Return the uploaded file URL
    return `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_URL!.split("//")[1]}/${params.Key}`;
  } catch (error: any) {
    console.log(error?.["message"]);
    return {
      error: error?.["message"]
        ? await t(error?.["message"], { from: "en", to: locale })
        : type === "pdf"
          ? c?.["your file was not uploaded. please try again."]
          : c?.["your image url was not uploaded. please try again."],
    };
  }
}
