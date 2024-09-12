"use server";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { ID } from "@/lib/constants";
import { RequiresLoginError, ZodError } from "@/lib/exceptions";
import {
  projectBinSchema,
  projectCreateFormSchema,
  projectDeleteSchema,
  projectUpdateSchema,
} from "@/validations/projects";
import { generateIdFromEntropySize } from "lucia";
import { revalidatePath } from "next/cache";
import Sharp from "sharp";
import { z } from "zod";
import { uploadIntoSpace } from "./images";

export async function createProject(
  // controller: ReadableStreamDefaultController<any>,
  // key: string,
  {
    types,
    platforms: plattformArr,
    map,
    logo,
    ...data
  }: z.infer<typeof projectCreateFormSchema>,
) {
  // const { actions: c } = await getDictionary(await getLocale());
  try {
    const { user } = await getAuth();
    if (!user) throw new RequiresLoginError();
    // if (user?.["id"] != data?.["userId"]) throw new RequiresAccessError();

    // const body = await getCookie<z.infer<typeof projectCreateFormSchema>>(key);
    // if (body) {
    //   const parsedData = projectCreateFormSchema.safeParse(body);
    //   if (!parsedData.success) throw new Error("Invalid data");

    //   const {
    // types,
    // platforms: plattformArr,
    // map,
    // logo,
    // ...data
    //   } = parsedData?.["data"];

    const id = ID.generate();
    const properties = types
      .map((t) =>
        t.properties.map(({ projectId, ...p }) => ({
          ...p,
          projectId: id,
          id: generateIdFromEntropySize(10),
          type: t?.["value"],
          deletedAt: null,
        })),
      )
      .flat();

    const platforms = plattformArr
      .map((t) => ({
        ...t,
        projectId: id,
        id: generateIdFromEntropySize(10),
        urn: t?.["urn"] ?? null,
        clientId: t?.["clientId"] ?? null,
      }))

      .flat();
    const project = {
      ...data,
      id,
      userId: user?.["id"],
      propertyTypes: types?.map((e) => e?.["value"]),

      deletedAt: null,
    };

    let url: string | null = null;

    if (logo) {
      const img = await Sharp(Buffer.from(logo, "base64"))
        .resize({ width: 800 }) // Resize to a more manageable size if necessary
        .png({ quality: 85 }) // Compress the PNG to 80% quality
        .toBuffer();

      console.log("uploading...");
      url = await uploadIntoSpace(`project-logo-${Date.now()}.png`, img);
      console.log("framed url: ", url);
    }

    await db.$transaction(async (tx) => {
      if (properties?.["length"]) {
        console.log(properties);
        // sendEvent(controller, "status", c?.["creating properties..."]);
        await tx.property.createMany({
          data: properties,
        });
      }

      if (platforms?.["length"]) {
        // sendEvent(controller, "status", c?.["creating platforms..."]);
        await tx.platform.createMany({
          data: platforms,
        });
      }

      // sendEvent(controller, "status", c?.["creating project..."]);
      await tx.project.create({ data: { ...project, logo: url } });
    });

    // sendEvent(controller, "completed", c?.["created successfully."]);
    revalidatePath("/", "layout");
    // }
  } catch (error: any) {
    console.log(error?.["message"]);
    if (error instanceof z.ZodError) return new ZodError(error);
    throw Error(
      error?.["message"] ?? "your project was not created. Please try again.",
    );
  }
  // finally {
  //   controller.close();
  // }
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
