"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  projectBinSchema,
  projectCreateFormSchema,
  projectDeleteSchema,
  projectUpdateSchema,
} from "@/validations/projects";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { endOfDay } from "date-fns";

export async function createProject({
  types,
  platforms: plattformArr,
  map,
  ...data
}: z.infer<typeof projectCreateFormSchema>) {
  try {
    const { user } = await getAuth();

    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    const properties = types
      .map((t) =>
        t.properties.map(({ projectId, ...p }) => ({
          ...p,
          id: generateIdFromEntropySize(10),
          type: t?.["value"],
          deletedAt: null,
        })),
      )
      .flat();

    const platforms = plattformArr
      .map((t) => ({
        ...t,
        id: generateIdFromEntropySize(10),
        urn: t?.["urn"] ?? null,
        clientId: t?.["clientId"] ?? null,
      }))

      .flat();

    const id = generateIdFromEntropySize(10);
    const project = {
      ...data,
      id,
      userId: user?.["id"],
      // platforms: platforms.map((e) => e?.["value"]),
      propertyTypes: types?.map((e) => e?.["value"]),

      // Google Map
      distinct: map ?? data?.["distinct"],
      city: map ?? data?.["city"],
      country: map ?? data?.["country"],
      deletedAt: null,
      platforms: {
        createMany: {
          data: platforms,
        },
      },
    };

    await db.project.create({
      data: properties?.["length"]
        ? {
            ...project,
            properties: {
              createMany: {
                data: properties,
              },
            },
          }
        : {
            ...project,
          },
    });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not created. Please try again.",
    );
  }
}

export async function updateProject({
  id,

  ...data
}: z.infer<typeof projectUpdateSchema | typeof projectBinSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.project.update({
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
      error?.["message"] ?? "your project was not updated. Please try again.",
    );
  }
}

export async function deleteProject({
  id,
}: z.infer<typeof projectDeleteSchema>) {
  try {
    const user = await getAuth();
    if (!user) throw new RequiresLoginError();

    await db.project.delete({ where: { id } });

    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not deleted. Please try again.",
    );
  }
}

// export async function connectSocialAccount(platform) {
//   try {
//     const user = await getAuth();
//     if (!user) throw new RequiresLoginError();
//     console.log("attempting to connect social media");

//     //defaults
//     const domain = process.env.NEXT_PUBLIC_AI_API;

//     console.log(platform);

//     if(platform.value == "TWITTER"){
//       console.log("Opening Twitter sign-in in a new window");

//       const width = 600;
//       const height = 700;
//       const left = window.screen.width / 2 - width / 2;
//       const top = window.screen.height / 2 - height / 2;

//       // Open the Twitter login page in a new window
//       const authWindow = window.open(
//         `${domain}/twitter-login`,
//         'Twitter Login',
//         `width=${width},height=${height},top=${top},left=${left}`
//       );

//       // Polling or listening to the message from the new window
//       const receiveMessage = (event) => {
//         if (event.origin !== domain) return; // Ensure the message comes from your domain
//         if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
//           console.log("Twitter access token: ", event.data.accessToken);

//           // You can now use the access token or store it as needed

//           // Close the window after successful authentication
//           authWindow.close();
//         }
//       };

//       window.addEventListener('message', receiveMessage, false);

//       return; // Prevent the function from proceeding further

//     }

//     return { clientId: "1" };
//   } catch (error: any) {
//     console.log(error?.["message"]);
//     if (error instanceof z.ZodError) new ZodError(error);
//     throw Error(
//       error?.["message"] ?? "your project was not updated. Please try again.",
//     );
//   }
// }
