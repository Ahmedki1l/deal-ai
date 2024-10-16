"use server";

import { platformsArr } from "@/db/enums";
import { getAuth } from "@/lib/auth";
import axios from "@/lib/axios";
import { openai } from "@/lib/openai";
import { SiriMessage } from "@/types";
import { projectSchema } from "@/validations/projects";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectCreateSchema = projectSchema.pick({
  title: true,
  description: true,
  distinct: true,
  city: true,
  country: true,
  spaces: true,
  platforms: true,
});

const createProject = async (data: z.infer<typeof projectCreateSchema>) => {
  try {
    const { user } = await getAuth();
    await axios({ locale: "ar", user }).post(`/api/projects`, {
      ...data,
    });

    revalidatePath("/", "layout");
    return `project created successfully with title ${data?.["title"]}`;
  } catch (error: any) {
    console.error("error in creating project: ", error?.["message"]);
    return `error in creating the project of title = ${data?.["title"]}`;
  }
};

const CUSTOMIED_FUNCTION = [
  {
    name: "createProject",
    description:
      "Creates a new project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "The title of the project to be created (e.g., 'Community Park Development').",
        },
        description: {
          type: "string",
          description:
            "A detailed description of the project outlining its goals and objectives.",
        },
        distinct: {
          type: "string",
          description:
            "The specific area or district where the project is located within the city.",
        },
        city: {
          type: "string",
          description:
            "The city where the project will take place (e.g., 'New York').",
        },
        country: {
          type: "string",
          description:
            "The country where the project will take place (e.g., 'USA').",
        },
        spaces: {
          type: "string",
          description:
            "The total land or area (in square meters or hectares) dedicated to the project.",
        },
        platforms: {
          type: "array",
          description:
            "An array of advertising platforms for the project, each represented by an object with a 'value'. Example values: 'FACEBOOK', 'TWITTER', 'LINKEDIN'.",
          items: {
            type: "object",
            properties: {
              value: {
                type: "string",
                enum: platformsArr,
                description:
                  "The platform on which the project will be advertised.",
              },
            },
            required: ["value"],
          },
        },
      },
      required: [
        "title",
        "description",
        "distinct",
        "city",
        "country",
        "spaces",
        "platforms",
      ],
    },
  },
];

// Main function to handle OpenAI requests with functions
export async function callChatGPTWithFunctions(
  userMessage: string,
  existingMessages: SiriMessage[],
): Promise<SiriMessage[]> {
  try {
    // Step 1: Append the user's message to the existing conversation history
    const messages: SiriMessage[] = [
      ...existingMessages,
      { role: "user", content: userMessage },
    ];

    // Step 2: Call OpenAI to generate a response based on the full conversation history
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Determine what the user needs to do. If the user is only questioning, answer simply. If the user wants to perform an action & its function is provided, do it. Otherwise, tell them that you as an AI can't do the specific action they want but guide them.",
        },
        ...messages,
      ] as unknown as any,
      functions: CUSTOMIED_FUNCTION,
      function_call: "auto",
    });

    // Step 3: Determine whether ChatGPT wants to use a function
    const wantsToUseFunction =
      chat.choices[0].finish_reason === "function_call";
    let assistantMessage: SiriMessage = { role: "assistant", content: "" };

    // Step 4: Handle function calls if necessary
    if (wantsToUseFunction) {
      const functionCall = chat.choices[0].message?.function_call;

      if (functionCall?.name === "createProject") {
        const args = JSON.parse(functionCall.arguments);
        const content = await createProject(args);

        assistantMessage = {
          role: "function",
          name: functionCall?.name,
          content: content,
        };
      }
    } else {
      assistantMessage = {
        role: "assistant",
        content: chat.choices[0].message?.content ?? "No response",
      };
    }

    // Step 5: Append the assistant's response to the conversation history
    const updatedMessages = [...messages, assistantMessage];
    return updatedMessages;
  } catch (error) {
    console.error("Error calling ChatGPT:", error);
    throw new Error("Something went wrong with the API request.");
  }
}
