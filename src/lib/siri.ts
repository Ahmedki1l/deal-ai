import { platformsArr } from "@/db/enums";
import axios from "@/lib/axios";
import { OpenAI } from "voicegpt-assistant";

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
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        await axios({ locale: "ar", user: args?.["user"] }).post(
          `/api/projects`,
          { ...response },
        );

        return `project created successfully with title ${response?.["title"]}`;
      } catch (error: any) {
        console.error("error in creating project: ", error?.["message"]);
        throw new Error(error?.["message"] ?? `error in creating the project`);
      }
    },
  },
];

export const { openai, ...AI } = OpenAI({
  configure: {
    // organization: "org-yourorg", // replace with your organization
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true,
  },
  functions: CUSTOMIED_FUNCTION,
});
