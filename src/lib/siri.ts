import { platformsArr } from "@/db/enums";
import axios from "@/lib/axios";
import { OpenAI } from "voicegpt-assistant";

const tools = [
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
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        await axios({ locale: args?.["locale"], user: args?.["user"] }).post(
          `/api/projects`,
          { ...response }
        );

        return `project created successfully with title ${response?.["title"]}`;
      } catch (error: any) {
        console.error("error in creating project: ", error?.["message"]);
        throw new Error(error?.["message"] ?? `error in creating the project`);
      }
    },
  },
  {
    name: "createStudyCase",
    description:
      "Creates a new study case of a project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project I want to create a case to",
          howToGetThisName:
            "To get the project name, you could scrape the whole /en/dashboard/projects page and let the user choose a project by name",
        },
        title: {
          type: "string",
          description:
            "The title of the case study to be created (e.g., 'Increasing Traffic Case').",
        },
      },
      required: ["projectName", "title"],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        const projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);

        console.log(projects);
        if (!projects || projects?.["length"] == 0)
          return `No such a project name, you don't even have a project with this name`;
        if (projects?.["length"] > 1)
          return `You have multiple projects with the same name, weither delete the copies or do it yourself.`;
        if (!projects?.[0]?.["id"]) return `No valid project.`;

        console.log({
          ...response,
          projectId: projects?.[0]?.["id"],
        });

        await axios({ locale: "en", user: args?.["user"] }).post(
          `/api/study-cases`,
          {
            ...response,
            projectId: projects?.[0]?.["id"],
          }
        );

        return `study case created successfully with title ${response?.["title"]}`;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`
        );
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
  functions: tools,
});
