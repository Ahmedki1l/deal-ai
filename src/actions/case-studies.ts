"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { t } from "@/lib/locale";
import { ZodError } from "@/lib/zod";
import {
  caseStudyBinSchema,
  caseStudyCreateSchema,
  caseStudyDeleteSchema,
  caseStudyUpdateSchema,
} from "@/validations/case-studies";
import axios from "axios";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLocale } from "./helpers";
import { base64ToBuffer, uploadIntoSpace } from "./images";

// Function to check if a string contains Arabic characters
function containsArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export async function createCaseStudy({
  refImages,
  ...data
}: z.infer<typeof caseStudyCreateSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();
    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    const actualProject = await db.project.findFirst({
      include: {
        caseStudy: { include: { posts: true } },
        properties: true,
        platforms: true,
      },
      where: { id: data?.["projectId"] },
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

    // Send data to the server
    const {
      data: response,
    }: {
      data: {
        Case_Study: string;
        Target_Audience: any;
        Pros: any;
        Cons: any;
        Market_Strategy: any;
        Performance_Metrics: any;
        ROI_Calculation: any;
        Strategic_Insights: any;
        Recommendations: any;
        Post_Frequency: any;
      };
    } = await axios.post(endpoint, prompt);

    const id = generateIdFromEntropySize(10);
    const imgs = refImages?.["length"]
      ? (
          await Promise.all(
            refImages?.map(async (e) => {
              const buffer = await base64ToBuffer(e);
              const r = await uploadIntoSpace(`case-${Date.now()}.png`, buffer);
              // TODO: handle errors of uploading failled
              if (typeof r === "object" && "error" in r) {
                console.log(r?.["error"]);
                return null;
              }
              return r;
            }),
          )
        )?.filter((r) => r != null)
      : [];

    await db.caseStudy.create({
      data: {
        id,
        ...data,
        refImages: imgs,
        content: response["Case_Study"],
        targetAudience: JSON.stringify(response["Target_Audience"]),
        pros: JSON.stringify(response["Pros"]),
        cons: JSON.stringify(response["Cons"]),
        Market_Strategy: JSON.stringify(response["Market_Strategy"]),
        Performance_Metrics: JSON.stringify(response["Performance_Metrics"]),
        ROI_Calculation: JSON.stringify(response["ROI_Calculation"]),
        Strategic_Insights: JSON.stringify(response["Strategic_Insights"]),
        Recommendations: JSON.stringify(response["Recommendations"]),
        Post_Frequency: JSON.stringify(response["Post_Frequency"]),
        caseStudyResponse: JSON.stringify(response),
        prompt: prompt.input,
        deletedAt: null,
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
        : c?.["your study case was not created. please try again."],
    };
  }
}

export async function updateCaseStudy({
  id,
  ...data
}: z.infer<typeof caseStudyUpdateSchema | typeof caseStudyBinSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();

    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.caseStudy.update({
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
        : c?.["your study case was not updated. please try again."],
    };
  }
}

export async function deleteCaseStudy({
  id,
}: z.infer<typeof caseStudyDeleteSchema>) {
  const locale = await getLocale();
  const { actions: c } = await getDictionary(locale);

  try {
    const { user } = await getAuth();

    if (!user)
      return {
        error: c?.["this action needs you to be logged in."],
      };

    await db.caseStudy.delete({ where: { id } });

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
        : c?.["your study case was not deleted. please try again."],
    };
  }
}
