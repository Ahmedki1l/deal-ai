"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import {
  RequiresAccessError,
  RequiresLoginError,
  ZodError,
} from "@/lib/exceptions";
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
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { CaseStudy, Image, Platform, Post, Project } from "@prisma/client";
import { platformsArr } from "@/db/enums";
import { sendEvent } from "@/lib/stream";
import { getCookie, getLocale } from "./helpers";
import { getDictionary } from "@/lib/dictionaries";
import { applyFrame, uploadIntoSpace } from "./images";
import { fetchImage } from "@/lib/uploader";
import sharp from "sharp";
import { FRAMES_URL } from "@/lib/constants";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to check if a string contains Arabic characters
function containsArabic(text: string | null) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text ? text : "");
}

export async function createPost(
  controller: ReadableStreamDefaultController<any>,
  key: string,
) {
  const { actions: c } = await getDictionary(await getLocale());

  try {
    sendEvent(controller, "status", c?.["getting info..."]);

    const user = await getAuth();
    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const body = await getCookie<z.infer<typeof postCreateSchema>>(key);
    if (!body) throw Error("No body Data.");

    const parsedData = postCreateSchema.safeParse(body);
    if (!parsedData.success) throw new Error("Invalid data");

    const data = parsedData?.["data"];
    const caseStudyResponse = await db.caseStudy.findFirst({
      include: { project: { include: { platforms: true } } },
      where: { id: data?.["caseStudyId"] },
    });
    if (!caseStudyResponse) throw new Error("non existing study case.");
    const { project, ...caseStudy } = caseStudyResponse;

    let endpoint_language = "en";

    if (
      containsArabic(caseStudy?.["prompt"]) ||
      containsArabic(caseStudy?.["caseStudyResponse"])
    ) {
      endpoint_language = "ar";
    }

    //defaults
    const domain = process.env.NEXT_PUBLIC_AI_API;

    let weeks = data.noOfWeeks ? parseInt(data.noOfWeeks, 10) : 0;
    let noOfPostsPerWeek =
      data.campaignType === "BRANDING_AWARENESS" ||
      data.campaignType === "ENGAGEMENT"
        ? 5
        : 3;

    let image_analyzer_response;

    if (caseStudy.refImages.length > 0) {
      let image_anaylzer_prompt = { input: "" };

      caseStudy.refImages.forEach((url) => {
        image_anaylzer_prompt.input += url + ", ";
      });

      sendEvent(controller, "status", c?.["generating images..."]);
      const image_analyzer_endpoint = domain + `/en/image-analyzer`;
      image_analyzer_response = await fetch(image_analyzer_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image_anaylzer_prompt),
      }).then((r) => r?.json());
    }

    const prompt = {
      previousPrompt: caseStudy.prompt,
      history: caseStudy.caseStudyResponse,
      input: `create a social media content plan that consists of ${noOfPostsPerWeek * weeks} posts for each platform for a period of ${data.noOfWeeks} weeks, for the platforms ${project?.["platforms"]?.map((e) => e?.["value"])}. The content should be long and includes hashtags and emojis.`,
    };

    const social_media_endpoint =
      domain + `/${endpoint_language}/chat/socialmediaplan`;

    sendEvent(
      controller,
      "status",
      c?.["generating AI prompt for social media..."],
    );
    const social_midea_response = await fetch(social_media_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prompt),
    }).then((r) => r?.json());

    const daysToPost = noOfPostsPerWeek === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];
    const imageApiEndpoint = domain + "/image2";
    let imageFetchPromises = [];
    let allPostDetails: Omit<Post, "createdAt">[] = [];

    // uppercasing key, to match platform
    const responseData = Object.keys(social_midea_response).reduce(
      (acc, key) => {
        acc[key.toUpperCase()] = social_midea_response?.[key];
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
        if (i % 6 === 0 && i !== 0) {
          await delay(60000); // Wait for 60 seconds after every 6 images
        }
        const prompt_generator_endpoint = domain + `/en/prompt-generator`;

        const prompt_generator_prompt = {
          input: accountPosts[i][`Post${i + 1}`],
        };

        sendEvent(
          controller,
          "status",
          c?.["generating social media content..."],
        );
        const prompt_generator_response = await fetch(
          prompt_generator_endpoint,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prompt_generator_prompt),
          },
        ).then((r) => r?.json());

        const imagePrompt = {
          input:
            image_analyzer_response?.prompt +
            " " +
            prompt_generator_response?.prompt,
        };

        const adjusted_image_prompt = {
          input: `you must adjust this prompt to be only 1000 characters long at max: ${imagePrompt.input}`,
        };

        sendEvent(controller, "status", c?.["generating AI images..."]);
        const adjusted_image_response = await fetch(prompt_generator_endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adjusted_image_prompt),
        }).then((r) => r?.json());

        let imageResponse;

        const adjusted_image = { input: adjusted_image_response?.prompt };

        const fetchPromise = fetch(imageApiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adjusted_image),
        })
          .then(async (res) => {
            imageResponse = await res.json();
            return imageResponse;
          })

          .then((imageResponse) => {
            // console.log("image prompt: ", adjusted_image);
            console.log("image response: ", imageResponse);
            if (!imageResponse?.["image_url"]) return null;

            // const fetcedImage = await fetchImage(imageResponse?.["image_url"]);
            // const bufferedImage = await sharp(fetcedImage).toBuffer();
            // const url = await uploadIntoSpace(
            //   `post-${Date.now()}.png`,
            //   bufferedImage,
            // );
            // console.log("url: ", url);

            // if (!url) return null;

            return db.image.create({
              data: {
                id: generateIdFromEntropySize(10),
                src: imageResponse?.["image_url"],
                // url,
                prompt: adjusted_image.input,
                deletedAt: null,
              } as Image,
            });
          });

        imageFetchPromises.push(fetchPromise);

        fetchPromise.then((imageData) => {
          // console.log("image Data: ", imageData);
          // console.log(currentDate.getDay());
          currentDate.setDate(currentDate.getDate() + 1);
          // console.log(currentDate.getDay());
          // Adjust currentDate to the next valid posting day
          while (!daysToPost.includes(currentDate.getDay())) {
            currentDate.setDate(currentDate.getDate() + 1);
          }

          // console.log(currentDate.getDay());

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
            deletedAt: null,
            confirmedAt: null,
          });
          indicator++;
        });
      }
    }

    sendEvent(controller, "status", c?.["adusting posts together..."]);
    await Promise.all(imageFetchPromises);

    if (!allPostDetails?.["length"]) {
      sendEvent(controller, "completed", c?.["No posts to create."]);
      return;
    }

    sendEvent(controller, "status", c?.["saving posts..."]);
    await db.post.createMany({
      data: allPostDetails,
    });

    sendEvent(
      controller,
      "completed",
      `${allPostDetails?.["length"]} ${c?.["posts were created."]}`,
    );
    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        c?.["your study case was not created. please try again."],
    );
  } finally {
    controller.close();
  }
}

export async function updatePost({
  id,
  confirm,
  frame = 1,
  ...data
}: z.infer<typeof postUpdateSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    let src = data?.["image"]?.["src"] ?? null;

    if (frame) {
      // if (!data?.["image"]?.["src"])
      //   throw Error("first select an image to apply frame on.");

      const image = await fetchImage(
        "https://plus.unsplash.com/premium_photo-1680281937048-735543c5c0f7?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      );

      src = await applyFrame(image, FRAMES_URL?.[frame]).then(
        (r) => `data:image/png;base64,${r.toString("base64")}`,
      );
    }

    await db.post.update({
      data: {
        ...data,
        image: {
          update: {
            ...data?.["image"],
            src,
          },
        },
        confirmedAt: confirm ? new Date() : null,
      },
      where: {
        id,
      },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your post was not updated. Please try again.",
    );
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
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.post.update({
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
      error?.["message"] ?? "your post was not updated. Please try again.",
    );
  }
}

export async function deletePost({ id }: z.infer<typeof postDeleteSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.post.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your post was not deleted. Please try again.",
    );
  }
}
