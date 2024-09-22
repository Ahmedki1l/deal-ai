"use server";

import { db } from "@/db";
import { platformsArr } from "@/db/enums";
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { t } from "@/lib/locale";
import { fetchImage } from "@/lib/uploader";
import { ZodError } from "@/lib/zod";
import {
  postBinSchema,
  postCreateSchema,
  postDeleteSchema,
  postSchema,
  postUpdateContentSchema,
  postUpdateImageSchema,
  postUpdateScheduleSchema,
  postUpdateSchema,
} from "@/validations/posts";
import { CaseStudy, Image, Platform, Project } from "@prisma/client";
import axios from "axios";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import Sharp from "sharp";
import { z } from "zod";
import { getLocale } from "./helpers";
import { uploadIntoSpace } from "./images";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to check if a string contains Arabic characters
function containsArabic(text: string | null) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text ? text : "");
}

async function generateImg(prompt: string) {
  const request = { prompt: prompt };
  const { data: imageObject }: { data: { data: { data: { url: string }[] } } } =
    await axios.post(
      "https://elsamalotyapis-production.up.railway.app/api/generateImage",
      request,
    );

  return imageObject.data.data[0].url;
}

export async function createPost({
  project,
  caseStudy,
  ...data
}: z.infer<typeof postCreateSchema> & {
  project: Project & { platforms: Platform[] };
  caseStudy: CaseStudy;
}) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    let endpoint_language = "en";
    if (
      containsArabic(caseStudy?.["prompt"]) ||
      containsArabic(caseStudy?.["caseStudyResponse"])
    )
      endpoint_language = "ar";

    //defaults
    const domain = process.env.NEXT_PUBLIC_AI_API;

    let weeks = data?.["noOfWeeks"] ? parseInt(data?.["noOfWeeks"], 10) : 0;
    let noOfPostsPerWeek =
      data?.["campaignType"] === "BRANDING_AWARENESS" ||
      data?.["campaignType"] === "ENGAGEMENT"
        ? 5
        : 3;

    let image_analyzer_response;

    if (caseStudy?.refImages?.length > 0) {
      let image_anaylzer_prompt = { input: "" };

      caseStudy?.refImages?.forEach((url) => {
        image_anaylzer_prompt.input += url + ", ";
      });

      const image_analyzer_endpoint = domain + `/en/image-analyzer`;

      console.log("image_anaylzer_prompt: ", image_anaylzer_prompt);
      image_analyzer_response = await fetch(image_analyzer_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image_anaylzer_prompt),
      }).then(async (r) => {
        try {
          return await r?.json();
        } catch {
          console.log("image_analyzer_response: ", await r?.text());
        }
      });
      console.log("image_analyzer_response: ", image_analyzer_response);
    }

    const prompt = {
      previousPrompt: caseStudy.prompt,
      history: caseStudy.caseStudyResponse,
      input: `create a social media content plan that consists of ${noOfPostsPerWeek * weeks} posts for each platform for a period of ${data.noOfWeeks} weeks, for the platforms ${project?.["platforms"]?.map((e) => e?.["value"])}. The content should be long and includes hashtags and emojis.`,
    };

    const social_media_endpoint =
      domain + `/${endpoint_language}/chat/socialmediaplan`;

    console.log("social_media_response prompt: ", prompt);

    const { data: social_media_response } = await axios.post(
      social_media_endpoint,
      prompt,
    );

    const daysToPost = noOfPostsPerWeek === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];
    const imageApiEndpoint =
      "https://elsamalotyapis-production.up.railway.app/api/generateImage";

    let imageFetchPromises = [];
    let allPostDetails: any[] = [];
    // uppercasing key, to match platform
    const responseData = Object.keys(social_media_response).reduce(
      (acc, key) => {
        acc[key.toUpperCase()] = social_media_response?.[key];
        return acc;
      },
      {} as { [key: string]: { [key: string]: string }[] },
    );

    let indicator = 1;

    for (const acc of platformsArr) {
      const accountPosts = responseData?.[acc];

      if (!accountPosts?.["length"]) continue;

      // Calculate the starting date for each account to ensure unique dates
      let currentDate = new Date();

      for (let i = 0; i < accountPosts.length; i++) {
        if (i % 6 === 0 && i !== 0) await delay(60000); // Wait for 60 seconds after every 6 images

        const prompt_generator_endpoint = domain + `/en/prompt-generator`;

        const prompt_generator_prompt = {
          input: accountPosts[i][`Post${i + 1}`],
        };

        console.log("prompt_generator_prompt: ", prompt_generator_prompt);
        const {
          data: prompt_generator_response,
        }: { data: { prompt: string } } = await axios.post(
          prompt_generator_endpoint,
          prompt_generator_prompt,
        );
        const imagePrompt = {
          input:
            image_analyzer_response?.prompt +
            " " +
            prompt_generator_response?.prompt,
        };

        const adjusted_image_prompt = {
          input: `you must adjust this prompt to be only 1000 characters long at max: ${imagePrompt?.input}`,
        };

        console.log("adjusted_image_prompt: ", adjusted_image_prompt);
        const { data: adjusted_image_response }: { data: { prompt: string } } =
          await axios.post(prompt_generator_endpoint, adjusted_image_prompt);

        const adjusted_image = { prompt: adjusted_image_response?.prompt };

        console.log("adjusted_image: ", adjusted_image);
        const fetchPromise = generateImg(adjusted_image?.["prompt"]!).then(
          async (imageResponse) => {
            console.log("imageResponse: ", imageResponse);

            if (!imageResponse) return null;

            const fetchedImage = await fetchImage(imageResponse);
            const bufferedImage = await Sharp(fetchedImage).toBuffer();
            const url = await uploadIntoSpace(
              `post-${Date.now()}.png`,
              bufferedImage,
            );

            if (!url) return null;

            return db.image.create({
              data: {
                id: generateIdFromEntropySize(10),
                src: url,
                prompt: adjusted_image.prompt,
                deletedAt: null,
              } as Image,
            });
          },
        );

        imageFetchPromises.push(fetchPromise);

        fetchPromise.then((imageData) => {
          console.log(currentDate.getDay());
          currentDate.setDate(currentDate.getDate() + 1);
          console.log(currentDate.getDay());
          // Adjust currentDate to the next valid posting day
          while (!daysToPost.includes(currentDate.getDay())) {
            currentDate.setDate(currentDate.getDate() + 1);
          }

          console.log(currentDate.getDay());

          const randomHour = Math.floor(Math.random() * (20 - 11) + 11);
          currentDate.setHours(randomHour, 0, 0);

          console.log(`post ${i + 1}`);

          allPostDetails.push({
            ...data,
            id: generateIdFromEntropySize(10),
            title: `Post${i + 1}`,
            content: accountPosts[i][`Post${i + 1}`],
            platform: acc,
            postAt: new Date(currentDate),
            imageId: imageData?.["id"] ?? null,
            framedImageURL: null,
            deletedAt: null,
          });
          indicator++;
        });
      }
    }

    await Promise.all(imageFetchPromises);

    await db.post.createMany({
      data: allPostDetails,
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
        : c?.["your post was not created. please try again."],
    };
  }
}

export async function updatePost({
  id,
  confirm,
  ...data
}: z.infer<typeof postUpdateSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.post.update({
      data: {
        ...data,
        confirmedAt: confirm ? new Date() : null,
      },
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
        : c?.["your post was not updated. please try again."],
    };
  }
}

export async function updatePostFeature({
  id,
  ...data
}: z.infer<
  | typeof postUpdateContentSchema
  | typeof postUpdateImageSchema
  | typeof postUpdateScheduleSchema
  | typeof postBinSchema
> &
  Pick<z.infer<typeof postSchema>, "id">) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.post.update({
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
        : c?.["your post was not updated. please try again."],
    };
  }
}

export async function deletePost({ id }: z.infer<typeof postDeleteSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.post.delete({ where: { id } });

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
        : c?.["your post was not deleted. please try again."],
    };
  }
}
