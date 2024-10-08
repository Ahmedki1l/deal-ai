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
import { Image, Platform, Project, StudyCase } from "@prisma/client";
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

async function generateImg(prompt: { prompt: string }) {
  const r = await axios
    .post("https://shark-app-thdw4.ondigitalocean.app/api/generateImage", {
      prompt,
    })
    .then((r) => r?.["data"])
    .catch((err) => {
      console.error(
        "generate_image error: ",
        err?.["response"] ? err?.["response"]?.["data"] : err?.["message"],
      );
    });
  return r?.["data"]?.["data"]?.[0]?.url;
}

export async function createPost({
  project,
  caseStudy,
  ...data
}: z.infer<typeof postCreateSchema> & {
  project: Project & { platforms: Platform[] };
  caseStudy: StudyCase;
}) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const user = await getAuth();
    if (!user) return { error: c?.["this action needs you to be logged in."] };
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    let endpoint_language = "en";

    if (
      containsArabic(caseStudy?.["prompt"]) ||
      containsArabic(caseStudy?.["caseStudyResponse"])
    )
      endpoint_language = "ar";

    //defaults
    const domain = process.env.NEXT_PUBLIC_AI_API;

    let weeks = data.noOfWeeks ? parseInt(data.noOfWeeks, 10) : 0;
    let noOfPostsPerWeek =
      data.campaignType === "BRANDING_AWARENESS" ||
      data.campaignType === "ENGAGEMENT"
        ? 5
        : 3;

    let image_analyzer_response;

    if (caseStudy?.["refImages"]?.["length"] > 0) {
      const image_analyzer_endpoint = domain + `/en/image-analyzer`;
      const image_anaylzer_prompt = { input: caseStudy.refImages?.join(", ") };

      image_analyzer_response = await axios
        .post(image_analyzer_endpoint, image_anaylzer_prompt)
        .then((r) => r?.["data"])
        .catch((err) => {
          console.error(
            "image_analyzer_response error: ",
            err?.["response"] ? err?.["response"]?.["data"] : err?.["message"],
          );
        });
    }

    const prompt = {
      previousPrompt: caseStudy.prompt,
      history: caseStudy.caseStudyResponse,
      input: `create a social media content plan that consists of ${noOfPostsPerWeek * weeks} posts for each platform for a period of ${data.noOfWeeks} weeks, for the platforms ${project?.["platforms"]?.map((e) => e?.["value"])}. The content should be long and includes hashtags and emojis.`,
    };

    const social_media_endpoint =
      domain + `/${endpoint_language}/chat/socialmediaplan`;

    const social_media_response = await axios
      .post(social_media_endpoint, prompt)
      .then((r) => r?.["data"])
      .catch((err) => {
        console.error(
          "social_media_response error: ",
          err?.["response"] ? err?.["response"]?.["data"] : err?.["message"],
        );
      });

    const daysToPost = noOfPostsPerWeek === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];

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
        const prompt_generator_response = await axios
          .post(prompt_generator_endpoint, {
            input: accountPosts[i][`Post${i + 1}`],
          })
          .then((r) => r?.["data"])
          .catch((err) => {
            console.error(
              "prompt_generator_response error: ",
              err?.["response"]
                ? err?.["response"]?.["data"]
                : err?.["message"],
            );
          });

        const adjusted_image_response = await axios
          .post(prompt_generator_endpoint, {
            input: `you must adjust this prompt to be only 1000 characters long at max: ${[
              image_analyzer_response?.["prompt"],
              prompt_generator_response?.["prompt"],
            ].join(" ")}`,
          })
          .then((r) => r?.["data"])
          .catch((err) => {
            console.error(
              "prompt_generator_response error: ",
              err?.["response"]
                ? err?.["response"]?.["data"]
                : err?.["message"],
            );
          });

        const adjusted_image = { prompt: adjusted_image_response?.prompt };
        const fetchPromise = generateImg(adjusted_image.prompt).then(
          async (imageResponse) => {
            if (!imageResponse) return null;

            const fetchedImage = await fetchImage(imageResponse);
            // const framedImage = await applyFrame(fetchedImage, FRAMES_URL?.[0]);
            const bufferedImage = await Sharp(fetchedImage).toBuffer();
            const url = await uploadIntoSpace({
              name: "posts",
              body: bufferedImage,
            });

            if (!url || (url && typeof url === "object" && "error" in url))
              return null;

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
          currentDate.setDate(currentDate.getDate() + 1);

          // Adjust currentDate to the next valid posting day
          while (!daysToPost.includes(currentDate.getDay()))
            currentDate.setDate(currentDate.getDate() + 1);

          const randomHour = Math.floor(Math.random() * (20 - 11) + 11);
          currentDate.setHours(randomHour, 0, 0);

          allPostDetails.push({
            ...data,
            id: generateIdFromEntropySize(10),
            title: `Post${i + 1}`,
            content: accountPosts[i][`Post${i + 1}`],
            platform: acc,
            postAt: new Date(currentDate),
            imageId: imageData?.["id"] ?? null,
            // framedImageURL: null,
            deletedAt: null,
          });

          indicator++;
        });
      }
    }

    // sendEvent(controller, "status", c?.["adusting posts together..."]);
    await Promise.all(imageFetchPromises);

    if (!allPostDetails?.["length"]) {
      // sendEvent(controller, "completed", c?.["No posts to create."]);
      return;
    }

    // sendEvent(controller, "status", c?.["saving posts..."]);
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
        status: confirm ? "CONFIRMED" : "PENDING",
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
