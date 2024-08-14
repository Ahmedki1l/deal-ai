"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import {
  RequiresAccessError,
  RequiresLoginError,
  ZodError,
} from "@/lib/exceptions";
import {
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
import { CaseStudy, Post, Project } from "@prisma/client";
import { platformsArr } from "@/db/enums";

// Function to check if a string contains Arabic characters
function containsArabic(text: string | null) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text ? text : "");
}

export async function createPost(
  data: z.infer<typeof postCreateSchema>,
  project: Project,
  caseStudy: CaseStudy,
) {
  try {
    console.log("starting to make posts");
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    let endpoint_language = "en";

    if (
      containsArabic(caseStudy.prompt) ||
      containsArabic(caseStudy.caseStudyResponse)
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

    if (caseStudy.refImages) {
      let image_anaylzer_prompt = { input: "" };

      caseStudy.refImages.forEach((url) => {
        image_anaylzer_prompt.input += url + ", ";
      });

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
      input: `create a social media content plan that consists of ${noOfPostsPerWeek * weeks} posts for each platform for a period of ${data.noOfWeeks} weeks, for the platforms ${project?.["platforms"]}. The content should be long and includes hashtags and emojis.`,
    };

    console.log(prompt);
    const social_media_endpoint =
      domain + `/${endpoint_language}/chat/socialmediaplan`;

    const social_midea_response = await fetch(social_media_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prompt),
    }).then((r) => r?.json());

    console.log(social_midea_response);
    const daysToPost = noOfPostsPerWeek === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];
    const imageApiEndpoint = domain + "/image";
    let imageFetchPromises = [];
    let allPostDetails: Post[] = [];

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
        const prompt_generator_endpoint = domain + `/en/prompt-generator`;

        const prompt_generator_prompt = {
          input: accountPosts[i][`Post${i + 1}`],
        };

        const prompt_generator_response = await fetch(
          prompt_generator_endpoint,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prompt_generator_prompt),
          },
        ).then((r) => r?.json());

        console.log("prompt generator ", prompt_generator_response);
        console.log("image analyzer", image_analyzer_response);

        const imagePrompt = {
          input:
            image_analyzer_response?.prompt +
            " " +
            prompt_generator_response?.prompt,
        };

        const adjusted_image_prompt = {
          input: `you must adjust this prompt to be only 1000 characters long at max: ${imagePrompt.input}`,
        };

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
            console.log("image prompt: ", adjusted_image);
            console.log("image response: ", imageResponse);
            return db.image.create({
              data: {
                id: generateIdFromEntropySize(10),
                src: imageResponse.url,
                prompt: adjusted_image.input,
              },
            });
          });

        imageFetchPromises.push(fetchPromise);

        fetchPromise.then((imageData) => {
          console.log("image Data: ", imageData);
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

          allPostDetails.push({
            ...data,
            id: generateIdFromEntropySize(10),
            title: `Post${i + 1}`,
            content: accountPosts[i][`Post${i + 1}`],
            platform: acc,
            postAt: new Date(currentDate),
            imageId: imageData.id,
          });
          indicator++;
        });
      }
    }

    await Promise.all(imageFetchPromises);

    if (allPostDetails.length > 0) {
      let createdPosts = await db.post.createMany({
        data: allPostDetails,
      });
      console.log("created Posts: ", createdPosts);
      revalidatePath("/", "layout");
    } else {
      console.log("No posts to create.");
    }
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your post was not deleted. Please try again.",
    );
  }
}

export async function updatePost({
  id,
  ...data
}: z.infer<typeof postUpdateSchema> & Pick<z.infer<typeof postSchema>, "id">) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.post.update({
      data: {
        ...data,
        image: {
          update: {
            ...data?.["image"],
          },
        },
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
