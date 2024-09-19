"use server";

import { db } from "@/db";
import { platformsArr } from "@/db/enums";
import { getAuth } from "@/lib/auth";
// import { sendEvent } from "@/lib/stream";
import { getDictionary } from "@/lib/dictionaries";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import { sendEvent } from "@/lib/stream";
import { fetchImage } from "@/lib/uploader";
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
import { Image } from "@prisma/client";
import axios from "axios";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import Sharp from "sharp";
import { z } from "zod";
import { getCookie, getLocale } from "./helpers";
import { uploadIntoSpace } from "./images";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to check if a string contains Arabic characters
function containsArabic(text: string | null) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text ? text : "");
}

async function generateImg(prompt: { prompt: any }) {
  let request = {
    // prompt: Please a beautiful ${propertyType} view from "outside" at day time with beautiful detailed background and please create a realistic design with detailed background with properties at background and use floors data from "${5}" and build a ${propertyType} in ${landArea} square metre area with a detailed and beautiful background matching with city and a front view from outside thanks.,
    prompt: prompt,
    // input: please use this data to generate an image to be a background image for a presentation, it should be a building containing the number of floors in these data and put in a title in the bottom of the image with a margin bottom of 50px, data: ${JSON.stringify(data['تقرير_تحليل_الاستثمار']['معايير_التطوير'])},
  };
  let response = await fetch(
    "https://elsamalotyapis-production.up.railway.app/api/generateImage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );
  let imageObject = await response.json();
  console.log(imageObject.data.data[0].url);
  return imageObject.data.data[0].url;
}

export async function createPost(
  controller: ReadableStreamDefaultController<any>,
  key: string,
  // {
  //   project,
  //   caseStudy,
  //   ...data
  // }: z.infer<typeof postCreateSchema> & {
  //   project: Project & { platforms: Platform[] };
  //   caseStudy: CaseStudy;
  // },
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
    if (!caseStudyResponse) throw new Error("non existing poststudy case.");
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

    sendEvent(
      controller,
      "status",
      c?.["generating AI prompt for social media..."],
    );

    console.log("social_media_response prompt: ", prompt);

    const social_media_response = await axios
      .post(social_media_endpoint, prompt, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.data)
      .catch(async (error) => {
        if (error.response) {
          console.log("social_media_response: ", error.response.data);
        } else {
          console.log("Error: ", error.message);
        }
      });

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
        console.log("prompt_generator_prompt: ", prompt_generator_prompt);
        const prompt_generator_response = await axios
          .post(prompt_generator_endpoint, prompt_generator_prompt, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => response.data)
          .catch(async (error) => {
            if (error.response) {
              console.log("prompt_generator_prompt: ", error.response.data);
            } else {
              console.log("Error: ", error.message);
            }
          });

        const imagePrompt = {
          input:
            image_analyzer_response?.prompt +
            " " +
            prompt_generator_response?.prompt,
        };

        const adjusted_image_prompt = {
          input: `you must adjust this prompt to be only 1000 characters long at max: ${imagePrompt?.input}`,
        };

        sendEvent(controller, "status", c?.["generating AI images..."]);
        console.log("adjusted_image_prompt: ", adjusted_image_prompt);
        const adjusted_image_response = await fetch(prompt_generator_endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adjusted_image_prompt),
        }).then(async (r) => {
          try {
            return await r?.json();
          } catch {
            console.log("adjusted_image_response: ", await r?.text());
          }
        });
        console.log("adjusted_image_response: ", adjusted_image_response);

        let imageResponse;

        const adjusted_image = { prompt: adjusted_image_response?.prompt };

        console.log("adjusted_image: ", adjusted_image);
        const fetchPromise = generateImg(adjusted_image.prompt).then(
          async (imageResponse) => {
            // console.log("image prompt: ", adjusted_image);
            console.log("imageResponse: ", imageResponse);

            if (!imageResponse) return null;

            const fetchedImage = await fetchImage(imageResponse);
            // const framedImage = await applyFrame(fetchedImage, FRAMES_URL?.[0]);
            const bufferedImage = await Sharp(fetchedImage).toBuffer();
            const url = await uploadIntoSpace(
              `post-${Date.now()}.png`,
              bufferedImage,
            );
            console.log("url: ", url);

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
          // console.log("image Data: ", imageData);
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
            // framedImageURL: null,
            deletedAt: null,
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
    console.error(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? c?.["your post was not created. please try again."],
    );
  } finally {
    controller.close();
  }
}

export async function updatePost(stringData: string) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();
    const { id, confirm, frame, ...data } = JSON.parse(stringData) as z.infer<
      typeof postUpdateSchema
    >;
    let url = null;
    console.log(!!frame);

    if (frame) {
      const sharpFramedImage = await Sharp(Buffer.from(frame, "base64"))
        .resize({ width: 800 }) // Resize to a more manageable size if necessary
        .png({ quality: 85 }) // Compress the PNG to 80% quality
        .toBuffer();

      console.log("uploading...");
      url = await uploadIntoSpace(`post-${Date.now()}.png`, sharpFramedImage);
      console.log("framed url: ", url);
    }

    await db.post.update({
      data: {
        ...data,
        image: {
          update: {
            src: data?.["image"]?.["src"],
            prompt: data?.["image"]?.["prompt"],
          },
        },
        confirmedAt: confirm ? new Date() : null,
        framedImageURL: url,
      },
      where: { id },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.error(error?.["message"]);
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
    console.error(error?.["message"]);
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
    console.error(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your post was not deleted. Please try again.",
    );
  }
}
