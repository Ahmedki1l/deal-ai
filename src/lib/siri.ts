import { platformsArr } from "@/db/enums";
import ar from "@/dictionaries/ar";
import en from "@/dictionaries/en";
import axios from "@/lib/axios";
import { Description } from "@radix-ui/react-dialog";
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
        const { actions: c } = args?.["locale"] === "ar" ? ar : en;

        await axios({ locale: args?.["locale"], user: args?.["user"] }).post(
          `/api/projects`,
          { ...response }
        );

        return `${c?.["project created successfully with title"]} ${response?.["title"]}`;
      } catch (error: any) {
        console.error("error in creating project: ", error?.["message"]);
        throw new Error(error?.["message"] ?? `error in creating the project`);
      }
    },
  },
  {
    name: "deleteProject",
    description:
      "Deletes a project on the server using the specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project you want to delete.",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if there are multiple projects having the same name.",
        },
      },
      required: ["projectName"],
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        // Step 1: Retrieve all projects with the specified name
        let projects = await axios({
          locale: args?.locale,
          user: args?.user,
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r.data);

        // Filter projects to only include those that match the user ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id
        );

        console.log("Projects: ", projects);

        if (projects.length === 0) {
          return `No project found with the name '${response?.["projectName"]}'.`;
        }

        // Step 2: Handle case where multiple projects are found
        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Return list of projects with more details to help user select
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`
            )
            .join("\n");

          return `Multiple projects were found with the name '${response?.["projectName"]}':\n${projectOptions}\nPlease specify the project index to delete.`;
        }

        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;

        // Step 3: If only one project found, proceed with deletion
        await axios({
          locale: args?.locale,
          user: args?.user,
        }).delete(`/api/projects/${projects[projectIndex].id}`);
        return `Project '${response?.["projectName"]}' has been deleted successfully.`;
      } catch (error: any) {
        console.error("Error deleting project:", error.message);
        throw new Error("Failed to delete project.");
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
          howToGetThisName: `To get the project name, you could scrape the whole /en/dashboard/projects page and let the user choose a project by name.
            If the user gives you a name that is not a name of one of the projects, then tell him that is not a correct name and then ask him if he mean a similar one from his own projects (you need to say the name of the project that is similar to what he provided).`,
        },
        title: {
          type: "string",
          description:
            "The title of the case study to be created (e.g., 'Increasing Traffic Case').",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if there are multiple projects having the same name.",
        },
      },
      required: ["projectName", "title"],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        let projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);

        // Filter projects to only include those that match the user ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id
        );

        console.log(projects);
        if (!projects || projects?.["length"] == 0)
          return `No such a project name, you don't even have a project with this name`;

        // Step 2: Handle case where multiple projects are found
        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Return list of projects with more details to help user select
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`
            )
            .join("\n");

          return `Multiple projects were found with the name '${response?.["projectName"]}':\n${projectOptions}\nPlease specify the project index to delete.`;
        }

        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;

        if (!projects?.[projectIndex]?.["id"]) return `No valid project.`;

        console.log({
          ...response,
          projectId: projects?.[projectIndex]?.["id"],
        });

        await axios({ locale: "en", user: args?.["user"] }).post(
          `/api/study-cases`,
          {
            title: response?.["title"],
            projectId: projects?.[projectIndex]?.["id"],
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
  {
    name: "deleteStudyCase",
    description:
      "Deletes a study case of a project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project I want to delete a case from",
          howToGetThisName: `To get the project name, you could scrape the whole /en/dashboard/projects page and let the user choose a project by name.
            If the user gives you a name that is not a name of one of the projects, then tell him that is not a correct name and then ask him if he mean a similar one from his own projects (you need to say the name of the project that is similar to what he provided).`,
        },
        title: {
          type: "string",
          description:
            "The title of the case study to be deleted (e.g., 'Increasing Traffic Case').",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if there are multiple projects having the same name.",
        },
        caseStudyIndex: {
          type: "integer",
          description:
            "The index of the case study if there are multiple cases having the same name.",
        },
      },
      required: ["projectName", "title"],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        let projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);

        // Filter projects to only include those that match the user ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id
        );

        console.log(projects);
        if (!projects || projects?.["length"] == 0)
          return `No such a project name, you don't even have a project with this name`;

        // Step 2: Handle case where multiple projects are found
        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Return list of projects with more details to help user select
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`
            )
            .join("\n");

          return `Multiple projects were found with the name '${response?.["projectName"]}':\n${projectOptions}\nPlease specify the project index to delete.`;
        }

        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;

        if (!projects?.[projectIndex]?.["id"]) return `No valid project.`;

        console.log({
          ...response,
          projectId: projects?.[projectIndex]?.["id"],
        });

        let caseStudies = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/study-cases`)
          .then((r) => r?.["data"]);

        caseStudies = caseStudies.data.filter(
          (c: any) =>
            c.projectId === projects?.[projectIndex]?.["id"] &&
            c.title === response?.["title"]
        );

        console.log("Case studies after filter: ", caseStudies);

        if (!response?.["caseStudyIndex"] && caseStudies.length > 1) {
          // Return list of case studites with more details to help user select
          const caseStudiesOptions = caseStudies
            .map(
              (c: any, index: any) => `index: ${index + 1}, Name: ${c.title}`
            )
            .join("\n");

          return `Multiple case studies were found with the name '${response?.["title"]}':\n${caseStudiesOptions}\nPlease specify the case study index to delete.`;
        }

        const caseStudyIndex =
          caseStudies.length > 1 ? response?.["caseStudyIndex"] - 1 : 0;

        if (!caseStudies?.[caseStudyIndex]?.id) return `No valid case study.`;

        await axios({ locale: "en", user: args?.["user"] }).delete(
          `/api/study-cases/${caseStudies?.[caseStudyIndex]?.id}`
        );

        return `study case with title ${response?.["title"]} deleted successfully `;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`
        );
      }
    },
  },
  {
    name: "createPosts",
    description:
      "Create posts for a study case of a project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project I want to delete a case from",
          howToGetThisName: `To get the project name, you could scrape the whole /en/dashboard/projects page and let the user choose a project by name.
            If the user gives you a name that is not a name of one of the projects, then tell him that is not a correct name and then ask him if he mean a similar one from his own projects (you need to say the name of the project that is similar to what he provided).`,
        },
        caseStudyTitle: {
          type: "string",
          description:
            "The title of the case study to be deleted (e.g., 'Increasing Traffic Case').",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if there are multiple projects having the same name.",
        },
        caseStudyIndex: {
          type: "integer",
          description:
            "The index of the case study if there are multiple cases having the same name.",
        },
        numberOfWeeks: {
          type: "integer",
          description: "The number of weeks that is used to determine how much posts the user needs."
        },
        contentLength: {
          type: "string",
          enum: ["SHORT", "MEDIUM", "LONG"],
          description: "Select the length of the content for the posts."
        },
        campaignType: {
          type: "string",
          enum: ["BRANDING_AWARENESS", "ENGAGEMENT", "SALES_CONVERSION"],
          description: "Select the type of campaign for the posts."
        }
      },
      required: ["projectName", "caseStudyTitle", "numberOfWeeks", "contentLength", "campaignType"],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        let projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);

        // Filter projects to only include those that match the user ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id
        );

        console.log(projects);
        if (!projects || projects?.["length"] == 0)
          return `No such a project name, you don't even have a project with this name`;

        // Step 2: Handle case where multiple projects are found
        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Return list of projects with more details to help user select
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`
            )
            .join("\n");

          return `Multiple projects were found with the name '${response?.["projectName"]}':\n${projectOptions}\nPlease specify the project index to delete.`;
        }

        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;

        if (!projects?.[projectIndex]?.["id"]) return `No valid project.`;

        console.log({
          ...response,
          projectId: projects?.[projectIndex]?.["id"],
        });

        let caseStudies = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/study-cases`)
          .then((r) => r?.["data"]);

        caseStudies = caseStudies.data.filter(
          (c: any) =>
            c.projectId === projects?.[projectIndex]?.["id"] &&
            c.title === response?.["caseStudyTitle"]
        );

        console.log("Case studies after filter: ", caseStudies);

        if (!response?.["caseStudyIndex"] && caseStudies.length > 1) {
          // Return list of case studites with more details to help user select
          const caseStudiesOptions = caseStudies
            .map(
              (c: any, index: any) => `index: ${index + 1}, Name: ${c.title}`
            )
            .join("\n");

          return `Multiple case studies were found with the name '${response?.["caseStudyTitle"]}':\n${caseStudiesOptions}\nPlease specify the case study index to delete.`;
        }

        const caseStudyIndex =
          caseStudies.length > 1 ? response?.["caseStudyIndex"] - 1 : 0;

        if (!caseStudies?.[caseStudyIndex]?.id) return `No valid case study.`;

        let noOfWeeks = response?.["numberOfWeeks"];
        let campaignType = response?.["campaignType"];
        let contentLength = response?.["contentLength"];
        let targetedCaseStudy = caseStudies?.[caseStudyIndex];
        let targetedCaseStudyId = caseStudies?.[caseStudyIndex]?.id;
        let targetedProject = projects?.[projectIndex];

        await axios({ locale: "en", user: args?.["user"] }).post(
          `/api/posts`,
          {
            project: targetedProject,
            caseStudy: targetedCaseStudy,
            noOfWeeks: noOfWeeks,
            campaignType: campaignType,
            contentLength: contentLength,
            caseStudyId: targetedCaseStudyId
          }
        );

        return `posts for the case study of title ${response?.["caseStudyTitle"]} created successfully `;
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
