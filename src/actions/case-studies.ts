"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  caseStudyBinSchema,
  caseStudyCreateSchema,
  caseStudyDeleteSchema,
  caseStudyUpdateSchema,
} from "@/validations/case-studies";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { Platform, Project } from "@prisma/client";
import { sendEvent } from "@/lib/stream";
import { getCookie, getLocale } from "./helpers";
import { getDictionary } from "@/lib/dictionaries";

// Function to check if a string contains Arabic characters
function containsArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export async function createCaseStudy(
  controller: ReadableStreamDefaultController<any>,
  key: string,
) {
  const { actions: c } = await getDictionary(await getLocale());

  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const body = await getCookie<z.infer<typeof caseStudyCreateSchema>>(key);
    if (body) {
      const parsedData = caseStudyCreateSchema.safeParse(body);
      if (!parsedData.success) throw new Error("Invalid data");

      const data = parsedData?.["data"];

      sendEvent(controller, "status", c?.["getting info..."]);
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
        input: `create a casestudy about ${actualProject?.title} ${actualProject?.["propertyTypes"]} located in: ${actualProject?.distinct}, ${actualProject?.city}, ${actualProject?.country}, which has a land space of: ${actualProject?.spaces}, ${actualProject?.description}. Create the Hashtags for ${actualProject?.["platforms"]?.map((e) => e?.["value"])}. `,
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

      sendEvent(controller, "status", c?.["generating using AI..."]);
      // Send data to the server
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt),
      }).then((r) => r?.json());

      data.content = response["Case_Study"];
      data.targetAudience = JSON.stringify(response["Target_Audience"]);
      data.pros = JSON.stringify(response["Pros"]);
      data.cons = JSON.stringify(response["Cons"]);
      data.Market_Strategy = JSON.stringify(response["Market_Strategy"]);
      data.Performance_Metrics = JSON.stringify(
        response["Performance_Metrics"],
      );
      data.ROI_Calculation = JSON.stringify(response["ROI_Calculation"]);
      data.Strategic_Insights = JSON.stringify(response["Strategic_Insights"]);
      data.Recommendations = JSON.stringify(response["Recommendations"]);
      data.prompt = prompt.input;
      data.caseStudyResponse = JSON.stringify(response);

      sendEvent(controller, "status", c?.["saving study case..."]);
      const id = generateIdFromEntropySize(10);
      await db.caseStudy.create({
        data: {
          id,
          ...data,
          deletedAt: null,
        },
      });

      sendEvent(controller, "completed", c?.["created study case..."]);
      revalidatePath("/", "layout");
    }
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
