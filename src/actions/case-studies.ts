"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  caseStudyCreateSchema,
  caseStudyDeleteSchema,
  caseStudyUpdateSchema,
} from "@/validations/case-studies";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { Project } from "@prisma/client";

export async function createCaseStudy(
  data: z.infer<typeof caseStudyCreateSchema>,
  project: Project,
) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const actualProject = await db.project.findFirst({
      include: {
        caseStudy: { include: { posts: true } },
        properties: true,
      },
      where: {
        id: project.id,
      },
    });

    const prompt = {
      input: `create a casestudy about ${actualProject?.title} ${actualProject?.["propertyTypes"]} located in: ${actualProject?.distinct}, ${actualProject?.city}, ${actualProject?.country}, which has a land space of: ${actualProject?.spaces}, ${actualProject?.description}. Create the Hashtags for ${project?.["platforms"]}. `,
    };

    actualProject?.properties.forEach((property)=>{
      prompt.input += 'The availabel assets are: ' + property.units + ', assets type: ' + property.title + ' ' + property.type + ', space: ' + property.space + ', number of bedrooms: ' + property.rooms + ', number of bathrooms ' + property.bathrooms + ', number of Reception rooms: ' + property.recipients + ', finishing:  ' + property.finishing + ', floors: ' + property.floors;
      prompt.input += property.garden? ', includes number of gardens: ' + property.garden : '';
      prompt.input += property.pool? ', includes number of pools: ' + property.pool : '';
      prompt.input += property.view? ', the view of the assets is: ' + property.view : '';
    });

    console.log(prompt);

    const endpoint = process.env.NEXT_PUBLIC_AI_API + "/en/chat/casestudy";

    // Send data to the server
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    }).then((r) => r?.json());

    data.content = response["Case_Study"];
    data.targetAudience = response["Target_Audience"];
    data.pros = response["Pros"];
    data.cons = response["Cons"];
    data.prompt = prompt.input;
    data.caseStudyResponse = JSON.stringify(response);

    const id = generateIdFromEntropySize(10);
    await db.caseStudy.create({
      data: {
        id,
        ...data,
      },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your case study was not created. Please try again.",
    );
  }
}

export async function updateCaseStudy({
  id,
  ...data
}: z.infer<typeof caseStudyUpdateSchema>) {
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
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your case study was not updated. Please try again.",
    );
  }
}

export async function deleteCaseStudy({
  id,
}: z.infer<typeof caseStudyDeleteSchema>) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();

    await db.caseStudy.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ??
        "your case study was not deleted. Please try again.",
    );
  }
}
