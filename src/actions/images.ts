"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
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
import { promise, z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { resolve } from "path";
import Sharp from "sharp";
import { fetchImage, s3Client } from "@/lib/uploader"; // Ensure s3Client is properly set up
import { Body, ObjectKey } from "aws-sdk/clients/s3";
import { writeFile, writeFileSync } from "fs";
import { createCanvas, loadImage, registerFont } from "canvas";
import { FRAMES_URL } from "@/lib/constants";

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
    console.error(error?.["message"]);
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
    console.error(error?.["message"]);
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

    const adjusted_image_prompt = {
      input: `you must adjust this prompt to be only 1000 characters long at max: ${enhanced_prompt_response.prompt}`,
    };

    const prompt_generator_endpoint = domain + `/en/prompt-generator`;
    const adjusted_image_response = await fetch(prompt_generator_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adjusted_image_prompt),
    }).then((r) => r?.json());

    return adjusted_image_response.prompt;
  } catch (error: any) {
    console.error(error?.["message"]);
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

    return image_generator_response.url;
  } catch (error: any) {
    console.error(error?.["message"]);
    if (error instanceof z.ZodError) throw new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your image url was not generated. Please try again.",
    );
  }
}

export async function uploadIntoSpace(name: ObjectKey, body: Body) {
  try {
    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.DO_SPACE_BUCKET!,
      Key: name, // Unique key for the file
      Body: body,
      ACL: "public-read", // Make the file publicly accessible
    };

    // Uploading files to the bucket using a promise
    await s3Client.upload(params).promise();

    // Return the uploaded file URL
    return `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_URL!.split("//")[1]}/${params.Key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function applyFrame(
  image: Buffer,
  frameURL: string,
  title: string,
) {
  try {
    if (FRAMES_URL?.[0] == frameURL) {
      const maxTextWidth = 250; // Maximum width for the text
      const normalFontSize = 30; // Font size for normal text
      const lineSpacing = 20; // Line spacing between words

      // Load the frame from the PNG file
      const frame = await Sharp(resolve(frameURL))
        .ensureAlpha() // Ensure the frame has an alpha channel
        .toBuffer();

      const { width, height } = await Sharp(frame).metadata();

      // Create a canvas to draw the text
      const canvas = createCanvas(width!, height!);
      const context = canvas.getContext("2d");

      // Split the title into words
      const words = title.split(" "); // Example: ["مشروع", "مكين", "003"]

      // Function to adjust font size to fit a word within maxTextWidth
      const fitTextToWidth = (
        text: string,
        maxWidth: number,
        initialFontSize: number,
      ) => {
        let fontSize = initialFontSize;
        do {
          fontSize -= 1;
          context.font = `bold ${fontSize}px Arial`;
        } while (context.measureText(text).width > maxWidth && fontSize > 0);
        return fontSize;
      };

      // Set the font size for the second word to fit within the maxTextWidth
      const secondWordFontSize = fitTextToWidth(words[1], maxTextWidth, 50);

      // Calculate total height of the text
      let totalHeight = normalFontSize * 2 + lineSpacing + secondWordFontSize; // 2 normal words + bold word + spacing
      const startY = height! - totalHeight - 200; // Start position vertically (10px padding from bottom)

      // Render first word: normal, black, and small
      context.font = `bold ${normalFontSize}px Arial`;
      context.fillStyle = "#000000"; // Black color
      context.textAlign = "center";
      context.fillText(words?.[0], maxTextWidth / 2, startY);

      // Render second word: yellow, bold, and larger
      context.font = `bold ${secondWordFontSize}px Arial`; // Using Arial font for the second word
      context.fillStyle = "#FFD700"; // Yellow color
      context.fillText(
        words?.[1],
        maxTextWidth / 2,
        startY + normalFontSize + lineSpacing,
      );

      // Render third word: normal, black, and small, with wrapping if necessary
      const remainingWords = words.slice(2)?.join(" ");
      context.font = `bold ${normalFontSize}px Arial`;
      context.fillStyle = "#000000"; // Black color
      context.textAlign = "center";

      // Wrap remaining words if necessary
      let currentLine = "";
      let lines = [];
      remainingWords.split(" ").forEach((word) => {
        const testLine = currentLine + word + " ";
        const testWidth = context.measureText(testLine).width;
        if (testWidth > maxTextWidth && currentLine !== "") {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine.trim());

      // Draw each line of the remaining words
      lines.forEach((line) => {
        context.fillText(
          line,
          maxTextWidth / 2,
          startY +
            normalFontSize +
            lineSpacing +
            secondWordFontSize +
            lines.indexOf(line) * (normalFontSize + lineSpacing),
        );
      });

      // Convert the canvas with text to a buffer
      const textImageBuffer = canvas.toBuffer();

      // Create the final image by combining the frame, fetched image, and the title text
      return await Sharp(image)
        .resize(width!, height!) // Resize the image to match the frame size if necessary
        .composite([
          {
            input: frame, // Use the frame as a composite input
            blend: "over", // Overlay the frame over the image
          },
          {
            input: textImageBuffer, // Add the title text as an overlay
            blend: "over", // Overlay the text on the image
          },
        ])
        .png() // Output as PNG to maintain transparency
        .toBuffer();
    }

    const frame = await Sharp(resolve(frameURL))
      .ensureAlpha() // Ensure the frame has an alpha channel
      .toBuffer();

    const { width, height } = await Sharp(frame).metadata();

    return await Sharp(image)
      .resize(width!, height!) // Resize the image to match the frame size if necessary
      .composite([
        {
          input: frame, // Use the frame as a composite input
          blend: "over", // Overlay the frame over the image
          gravity: "center",
        },
      ])
      .png() // Output as PNG to maintain transparency
      .toBuffer();
  } catch (error) {
    console.error("Error applying frame:", error);
    throw error;
  }
}

// export async function applyFrame(image: Buffer, frameURL: string) {
//   try {
//     const title = "مشروع مكين 003"; // The title to be styled
//     const maxTextWidth = 100; // Maximum width for the text
//     const normalFontSize = 18; // Font size for normal text
//     const lineSpacing = 10; // Line spacing between words
//     const startX = maxTextWidth / 2 + 15; // Center horizontally

//     // Load the frame from the PNG file
//     const frame = await Sharp(resolve(frameURL))
//       .ensureAlpha() // Ensure the frame has an alpha channel
//       .toBuffer();

//     const { width, height } = await Sharp(frame).metadata();

//     // Create a canvas to draw the text
//     const canvas = createCanvas(width!, height!);
//     const context = canvas.getContext("2d");

//     // Split the title into words
//     const words = title.split(" "); // Example: ["مشروع", "مكين", "003"]

//     // Function to adjust font size to fit a word within maxTextWidth
//     const fitTextToWidth = (
//       text: string,
//       maxWidth: number,
//       initialFontSize: number,
//       isBold: boolean = false,
//       font: string = "Arial",
//     ) => {
//       let fontSize = initialFontSize;
//       do {
//         fontSize -= 1;
//         context.font = `bold ${fontSize}px ${font}`;
//       } while (context.measureText(text).width > maxWidth && fontSize > 0);
//       return fontSize;
//     };

//     // Set the font size for the second word to fit within the maxTextWidth
//     const secondWordFontSize = fitTextToWidth(words[1], maxTextWidth, 30, true);

//     // Render the words: first and third words are normal, second is bold and yellow
//     let startY = height! - 20; // Start position vertically

//     // Render first word: normal, black, and small
//     context.font = `${normalFontSize}px Arial`;
//     context.fillStyle = "#000000"; // Black color
//     context.textAlign = "center";
//     context.fillText(words[0], startX, startY);

//     // Render second word: yellow, bold, and larger
//     startY += normalFontSize + lineSpacing;
//     context.font = `bold ${secondWordFontSize}px Arial`; // Using Arial font for the second word
//     context.fillStyle = "#FFD700"; // Yellow color
//     context.fillText(words[1], startX, startY);

//     // Render third word: normal, black, and small, with wrapping if necessary
//     const remainingWords = words.slice(2).join(" ");
//     context.font = `${normalFontSize}px Arial`;
//     context.fillStyle = "#000000"; // Black color
//     context.textAlign = "center";

//     // Wrap remaining words if necessary
//     let currentLine = "";
//     let lines = [];
//     remainingWords.split(" ").forEach((word) => {
//       const testLine = currentLine + word + " ";
//       const testWidth = context.measureText(testLine).width;
//       if (testWidth > maxTextWidth && currentLine !== "") {
//         lines.push(currentLine.trim());
//         currentLine = word + " ";
//       } else {
//         currentLine = testLine;
//       }
//     });
//     lines.push(currentLine.trim());

//     // Draw each line of the remaining words
//     lines.forEach((line) => {
//       startY += normalFontSize + lineSpacing;
//       context.fillText(line, startX, startY);
//     });

//     // Convert the canvas with text to a buffer
//     const textImageBuffer = canvas.toBuffer();

//     // Create the final image by combining the frame, fetched image, and the title text
//     return await Sharp(image)
//       .resize(width!, height!) // Resize the image to match the frame size if necessary
//       .composite([
//         {
//           input: frame, // Use the frame as a composite input
//           blend: "over", // Overlay the frame over the image
//         },
//         {
//           input: textImageBuffer, // Add the title text as an overlay
//           blend: "over", // Overlay the text on the image
//         },
//       ])
//       .png() // Output as PNG to maintain transparency
//       .toBuffer();
//   } catch (error) {
//     console.error("Error applying frame:", error);
//     throw error;
//   }
// }

// export async function watermarkImage(src: string) {
//   try {
//     const user = await getAuth();
//     if (!user) throw new RequiresLoginError();

//     // Fetch the image
//     const image = await fetchImage(src);

//     const framedImage = await applyFrame(image, FRAMES_URL?.[0]);
//     //  Store it remotely
//     return await uploadIntoSpace(`frame-${Date.now()}.png`, framedImage);
//   } catch (error: any) {
//     console.error(error?.["message"]);
//     if (error instanceof z.ZodError) throw new ZodError(error);
//     throw Error(
//       error?.["message"] ??
//         "Your image URL was not generated. Please try again.",
//     );
//   }
// }

export async function applyAllFrames(src: string, title: string) {
  try {
    const image = await fetchImage(src);

    const promiseFrames = FRAMES_URL?.map((f) =>
      applyFrame(image, f, title).then((r) => r?.toString("base64")),
    );
    return await Promise.all(promiseFrames);
  } catch (error) {
    console.error("Error applying frames:", error);
    throw error;
  }
}
// export async function applyFrameWithTitle(image: Buffer, title: string) {
//   try {
//     // Load the frame from the PSD file or PNG file
//     const frame = await Sharp(resolve("./public/img-processing/frame.png"))
//       .ensureAlpha() // Ensure the frame has an alpha channel
//       .toBuffer();

//     const { width, height } = await Sharp(frame).metadata();

//     // Create a canvas to draw the title on the frame
//     const canvas = createCanvas(width!, height!);
//     const ctx = canvas.getContext("2d");

//     // Load the frame image
//     const frameImage = await loadImage(frame);
//     ctx.drawImage(frameImage, 0, 0);

//     // Set font and style for the title
//     ctx.font = "bold 36px Arial";
//     ctx.fillStyle = "white";
//     ctx.textAlign = "center";

//     // Calculate the position to center the title on the frame
//     const x = width! / 2;
//     const y = height! - 50; // Adjust this value to position the title properly

//     // Draw the title onto the frame
//     ctx.fillText(title, x, y);

//     // Convert the canvas back to a buffer
//     const frameWithTextBuffer = canvas.toBuffer();

//     // Composite the original image with the frame that now includes the title
//     const framedImage = await Sharp(image)
//       .resize(width, height) // Resize the image to match the frame size if necessary
//       .composite([
//         {
//           input: frameWithTextBuffer, // Use the frame with the title as a composite input
//           blend: "over", // Overlay the frame with title over the image
//         },
//       ])
//       .png() // Output as PNG to maintain transparency
//       .toBuffer();
//     const fileName = `framed-${Date.now()}.png`;
//     writeFileSync(resolve(`./public/uploads/${fileName}`), framedImage);

//     // Return URL
//     return `/uploads/${fileName}`;
//   } catch (error) {
//     console.error("Error applying frame with title:", error);
//     throw error;
//   }
// }

// export async function watermarkImage({
//   ...data
// }: z.infer<typeof imageWatermarkSchema>) {
//   try {
//     const user = await getAuth();
//     if (!user) throw new RequiresLoginError();

//     const image = await fetchImage(
//       // data?.["src"]
//       "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     );

//     const watermark = await Sharp(image)
//       .composite([
//         {
//           input: await readFile(resolve("./public/img-processing/logo.png")),
//           left: 50,
//           top: 50,
//         },
//       ])
//       .png()
//       .toBuffer();

//     const watermarkImage = Sharp(watermark);
//     const { width, height } = await watermarkImage.metadata();

//     const frame = await watermarkImage
//       .composite([
//         {
//           input: await Sharp(resolve("./public/img-processing/frame-1.png"))
//             .resize(width, height)
//             .toBuffer(),
//           gravity: "center",
//         },
//       ])
//       .png()
//       .toBuffer();

//     // TODO: store it remotly
// const fileName = `framed-${Date.now()}.png`;
// await writeFile(resolve(`./public/img-processing/${fileName}`), frame);

// // Return URL
// return `/uploads/${fileName}`;

//     // return "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
//   } catch (error: any) {
//     console.error(error?.["message"]);
//     if (error instanceof z.ZodError) throw new ZodError(error);
//     throw Error(
//       error?.["message"] ??
//         "your image url was not generated. Please try again.",
//     );
//   }
// }

export async function deleteImage({ id }: z.infer<typeof imageDeleteSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.image.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.error(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your image was not deleted. Please try again.",
    );
  }
}
