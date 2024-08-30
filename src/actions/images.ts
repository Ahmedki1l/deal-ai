"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import {
  RequiresAccessError,
  RequiresLoginError,
  ZodError,
} from "@/lib/exceptions";
import {
  imageBinSchema,
  imageCreateSchema,
  imageDeleteSchema,
  imageGenerateSchema,
  imageRegeneratePromptSchema,
  imageUpdateSchema,
  imageWatermarkSchema,
} from "@/validations/images";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import Sharp from "sharp";
import axios from "axios";

export async function createImage(data: z.infer<typeof imageCreateSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    const id = generateIdFromEntropySize(10);
    await db.image.create({
      data: { id, ...data, deletedAt: null },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your image was not deleted. Please try again.",
    );
  }
}

export async function updateImage({
  id,
  ...data
}: z.infer<typeof imageUpdateSchema | typeof imageBinSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.image.update({
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
      error?.["message"] ?? "your image was not updated. Please try again.",
    );
  }
}

export async function regenerateImagePrompt({
  ...data
}: z.infer<typeof imageRegeneratePromptSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    //defaults
    const domain = process.env.NEXT_PUBLIC_AI_API;

    const prompt_enhancer_endpoint = domain + `/en/prompt-enhancer`;

    const enhanced_prompt_response = await fetch(prompt_enhancer_endpoint, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ input: data.prompt }),
    }).then((r) => r?.json());

    console.log(enhanced_prompt_response);

    const adjusted_image_prompt = {
      input: `you must adjust this prompt to be only 1000 characters long at max: ${enhanced_prompt_response.prompt}`,
    };

    console.log("adjusted image request: ", adjusted_image_prompt);

    const prompt_generator_endpoint = domain + `/en/prompt-generator`;
    const adjusted_image_response = await fetch(prompt_generator_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adjusted_image_prompt),
    }).then((r) => r?.json());

    console.log("adjusted prompt: ", adjusted_image_response);

    return adjusted_image_response.prompt;
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) throw new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your image prompt was not updated. Please try again.",
    );
  }
}

export async function generateImage({
  ...data
}: z.infer<typeof imageGenerateSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    //defaults
    const domain = process.env.NEXT_PUBLIC_AI_API;

    const image_generator_endpoint = domain + `/image`;

    const image_generator_response = await fetch(image_generator_endpoint, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ input: data.prompt }),
    }).then((r) => r?.json());

    console.log(image_generator_response);

    return image_generator_response.url;
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) throw new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your image url was not generated. Please try again.",
    );
  }
}

// Function to fetch an image from a remote URL
async function fetchImage(url: string) {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data, "binary");
}

export async function watermarkImage({
  ...data
}: z.infer<typeof imageWatermarkSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    const image = await fetchImage(
      // data?.["src"]
      "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    );

    const watermark = await Sharp(image)
      .composite([
        {
          input: await readFile(resolve("./public/img-processing/logo.png")),
          left: 50,
          top: 50,
        },
      ])
      .png()
      .toBuffer();

    const watermarkImage = Sharp(watermark);
    const { width, height } = await watermarkImage.metadata();

    const frame = await watermarkImage
      .composite([
        {
          input: await Sharp(resolve("./public/img-processing/frame-1.png"))
            .resize(width, height)
            .toBuffer(),
          gravity: "center",
        },
      ])
      .png()
      .toBuffer();

    // TODO: store it remotly
    const fileName = `framed-${Date.now()}.png`;
    await writeFile(resolve(`./public/img-processing/${fileName}`), frame);

    // Return URL
    return `/uploads/${fileName}`;

    // return "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) throw new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your image url was not generated. Please try again.",
    );
  }
}

export async function deleteImage({ id }: z.infer<typeof imageDeleteSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.image.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your image was not deleted. Please try again.",
    );
  }
}
