"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import { t } from "@/lib/locale";
import { fetcher } from "@/lib/utils";
import {
  caseStudyBinSchema,
  caseStudyCreateSchema,
  caseStudyDeleteSchema,
  caseStudyUpdateSchema,
} from "@/validations/case-studies";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { getLocale } from "./helpers";
import { uploadIntoSpace } from "./images";

// Function to check if a string contains Arabic characters
function containsArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export async function createCaseStudy(
  // controller: ReadableStreamDefaultController<any>,
  // key: string,
  { refImages, ...data }: z.infer<typeof caseStudyCreateSchema>,
) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    // const body = await getCookie<z.infer<typeof caseStudyCreateSchema>>(key);
    // if (body) {
    //   const parsedData = caseStudyCreateSchema.safeParse(body);
    //   if (!parsedData.success) throw new Error("Invalid data");

    //   const data = parsedData?.["data"];

    // sendEvent(controller, "status", c?.["getting info..."]);
    const actualProject = await db.project.findFirst({
      include: {
        caseStudy: { include: { posts: true } },
        properties: true,
        platforms: true,
      },
      where: {
        id: data?.["projectId"],
      },
    });

    let endpoint_language = "en";

    const prompt = {
      input: `create a casestudy about ${actualProject?.["title"]} ${actualProject?.["propertyTypes"]} located in: ${actualProject?.["distinct"]}, ${actualProject?.["city"]}, ${actualProject?.["country"]}, which has a land space of: ${actualProject?.["spaces"]}, ${actualProject?.["description"]}. Create the Hashtags for ${actualProject?.["platforms"]?.map((e) => e?.["value"])}. `,
    };

    if (containsArabic(prompt.input)) endpoint_language = "ar";

    actualProject?.properties.forEach((property) => {
      prompt.input +=
        "The availabel assets are: " +
        property?.units +
        ", assets type: " +
        property?.title +
        " " +
        property?.type +
        ", property spaces: " +
        property?.space +
        ", number of bedrooms: " +
        property?.rooms +
        ", number of bathrooms " +
        property?.bathrooms +
        ", number of Reception rooms: " +
        property?.receptions +
        ", finishing:  " +
        property?.finishing +
        ", floors: " +
        property?.floors;
      prompt.input += property?.garden
        ? ", includes number of gardens: " + property?.garden
        : "";
      prompt.input += property?.pool
        ? ", includes number of pools: " + property?.pool
        : "";
      prompt.input += property?.view
        ? ", the view of the assets is: " + property?.view
        : "";
    });

    const endpoint =
      process.env.NEXT_PUBLIC_AI_API + `/${endpoint_language}/chat/casestudy`;

    // sendEvent(controller, "status", c?.["generating using AI..."]);
    // Send data to the server
    const response = await fetcher<{
      Case_Study: string;
      Target_Audience: any;
      Pros: any;
      Cons: any;
      Market_Strategy: any;
      Performance_Metrics: any;
      ROI_Calculation: any;
      Strategic_Insights: any;
      Recommendations: any;
    }>(endpoint, {
      method: "POST",
      body: JSON.stringify(prompt),
    });

    // sendEvent(controller, "status", c?.["saving study case..."]);
    const id = generateIdFromEntropySize(10);
    await db.$transaction(async (tx) => {
      await tx.caseStudy.create({
        data: {
          id,
          ...data,
          content: response["Case_Study"],
          targetAudience: JSON.stringify(response["Target_Audience"]),
          pros: JSON.stringify(response["Pros"]),
          cons: JSON.stringify(response["Cons"]),
          Market_Strategy: JSON.stringify(response["Market_Strategy"]),
          Performance_Metrics: JSON.stringify(response["Performance_Metrics"]),
          ROI_Calculation: JSON.stringify(response["ROI_Calculation"]),
          Strategic_Insights: JSON.stringify(response["Strategic_Insights"]),
          Recommendations: JSON.stringify(response["Recommendations"]),
          caseStudyResponse: JSON.stringify(response),
          prompt: prompt.input,
          deletedAt: null,
        },
      });
      console.log(refImages?.["length"]);
      if (refImages?.["length"]) {
        const imgs = await Promise.all(
          refImages
            ?.map((e) =>
              sharp(Buffer.from(e, "base64"))
                .resize({ width: 800 }) // Resize to a more manageable size if necessary
                .png({ quality: 85 }) // Compress the PNG to 80% quality
                .toBuffer(),
            )
            .map((e) => uploadIntoSpace(`case-${Date.now()}.png`, e)),
        );

        await tx.caseStudy.update({
          data: { refImages: imgs },
          where: { id },
        });
      }
    });

    // sendEvent(controller, "completed", c?.["created study case..."]);
    revalidatePath("/", "layout");
    // }
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError)
      return { error: await t(new ZodError(error)?.["message"], locale) };
    return {
      error: error?.["message"]
        ? await t(error?.["message"], locale)
        : c?.["your study case was not created. please try again."],
    };
  }
  // finally {
  //   controller.close();
  // }
}

export async function updateCaseStudy({
  id,
  ...data
}: z.infer<typeof caseStudyUpdateSchema | typeof caseStudyBinSchema>) {
  const { actions: c } = await getDictionary(await getLocale());

  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();

    await db.caseStudy.update({
      data,
      where: {
        id,
      },
    });

    revalidatePath("/", "layout");

    return c?.["updated successfully."];
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        c?.["your study case was not updated. please try again."],
    );
  }
}

export async function deleteCaseStudy({
  id,
}: z.infer<typeof caseStudyDeleteSchema>) {
  const { actions: c } = await getDictionary(await getLocale());
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();

    await db.caseStudy.delete({ where: { id } });

    revalidatePath("/", "layout");
    return c?.["deleted successfully."];
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        c?.["your study case was not deleted. please try again."],
    );
  }
}
