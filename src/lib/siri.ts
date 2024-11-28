import { platformsArr, propertyTypesArr } from "@/db/enums";
import ar from "@/dictionaries/ar";
import en from "@/dictionaries/en";
import axios from "@/lib/axios";
import { OpenAI } from "@/lib/openai";

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
            "The city where the project will take place (e.g., 'Riyadh').",
        },
        country: {
          type: "string",
          description:
            "The country where the project will take place (e.g., 'KSA').",
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
          { ...response },
        );

        // Refresh the page
        window.location.reload();

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
          (project: { userId: any }) => project.userId === args.user.id,
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
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
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

        // Refresh the page
        window.location.reload();

        return `Project '${response?.["projectName"]}' has been deleted successfully.`;
      } catch (error: any) {
        console.error("Error deleting project:", error.message);
        throw new Error("Failed to delete project.");
      }
    },
  },
  {
    name: "addPropertyTypes",
    description:
      "Adds some properties for a project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project to which the property belongs.",
        },
        type: {
          type: "string",
          enum: propertyTypesArr,
          description: "The property type of the properties being added.",
        },
        title: {
          type: "string",
          description: "The title of the property being added.",
        },
        units: {
          type: "integer",
          description: "The number of units for this specific property type.",
        },
        space: {
          type: "integer",
          description: "The area of the property in square meters.",
        },
        finishing: {
          type: "string",
          description: "The finishing standard of the property.",
        },
        floors: {
          type: "string",
          description: "The floors available for this property.",
        },
        rooms: {
          type: "integer",
          description: "The number of rooms in the property.",
        },
        bathrooms: {
          type: "integer",
          description: "The number of bathrooms in the property.",
        },
        price: {
          type: "integer",
          description: "The price of the property.",
        },
        livingrooms: {
          type: "integer",
          description: "The number of living rooms in the property.",
        },
        garden: {
          type: "integer",
          description:
            "Whether the property has a garden (1 for yes, 0 for no).",
        },
        pool: {
          type: "integer",
          description: "Whether the property has a pool (1 for yes, 0 for no).",
        },
        view: {
          type: "string",
          description: "The view from the property.",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if multiple projects share the same name.",
        },
      },
      required: [
        "projectName",
        "title",
        "type",
        "units",
        "space",
        "finishing",
        "floors",
        "rooms",
        "bathrooms",
        "price",
        "livingrooms",
        "garden",
        "pool",
        "view",
      ],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;

        // Fetch projects matching the given name
        let projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);

        // Filter projects by the current user's ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id,
        );

        if (!projects || projects?.length === 0)
          return `No projects found with the name '${response?.["projectName"]}'.`;

        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Ask user to specify a project if multiple projects are found
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
            )
            .join("\n");

          return `Multiple projects found with the name '${response?.["projectName"]}'. Please specify the project index:\n${projectOptions}`;
        }

        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;

        if (!projects?.[projectIndex]?.["id"])
          return `Invalid project selected.`;

        const projectId = projects[projectIndex].id;

        // Prepare property data to send to the backend
        const properties = [
          {
            type: response?.["type"],
            title: response?.["title"],
            units: response?.["units"]?.toString(), // Convert integer to string
            space: response?.["space"]?.toString(), // Convert integer to string
            finishing: response?.["finishing"],
            floors: response?.["floors"],
            rooms: response?.["rooms"]?.toString(), // Convert integer to string
            bathrooms: response?.["bathrooms"]?.toString(), // Convert integer to string
            price: response?.["price"]?.toString(), // Convert integer to string
            livingrooms: response?.["livingrooms"]?.toString(), // Convert integer to string
            garden: response?.["garden"]?.toString(), // Convert integer to string
            pool: response?.["pool"]?.toString(), // Convert integer to string
            view: response?.["view"],
            projectId, // Ensure this is valid
            deletedAt: null, // Defaulting to `null` as per Prisma schema
          },
        ];
        // Send property data to the backend
        await axios({
          locale: "en",
          user: args?.["user"],
        }).post(`/api/properties`, {
          properties: properties,
        });

        return `Property '${response?.["title"]}' added successfully to project '${projects[projectIndex].title}'.`;
      } catch (error: any) {
        console.error("Error adding property: ", error.message);
        throw new Error(
          error.message ?? "Error occurred while adding the property.",
        );
      }
    },
  },
  {
    name: "deleteProperty",
    description:
      "Deletes a property from a project on the server with specified parameters.",
    parameters: {
      type: "object",
      properties: {
        projectName: {
          type: "string",
          description: "The name of the project to which the property belongs.",
        },
        propertyTitle: {
          type: "string",
          description: "The title of the property to be deleted.",
        },
        projectIndex: {
          type: "integer",
          description:
            "The index of the project if multiple projects share the same name.",
        },
        propertyIndex: {
          type: "integer",
          description:
            "The index of the property if multiple properties share the same title.",
        },
      },
      required: ["projectName", "propertyTitle"],
      additionalProperties: false,
    },
    trigger: async (data: { args?: any; response?: any } | void) => {
      try {
        if (!data) throw new Error("No Passed Data");
        const { args, response } = data;
  
        // Step 1: Fetch projects matching the given name
        let projects = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/projects?title=${response?.["projectName"]}`)
          .then((r) => r?.["data"]);
  
        // Step 2: Filter projects by the current user's ID
        projects = projects.filter(
          (project: { userId: any }) => project.userId === args.user.id
        );
  
        if (!projects || projects.length === 0)
          return `No projects found with the name '${response?.["projectName"]}'.`;
  
        if (projects.length > 1 && !response?.["projectIndex"]) {
          // Ask user to specify a project if multiple projects are found
          const projectOptions = projects
            .map(
              (project: any, index: any) =>
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
            )
            .join("\n");

          return `Multiple projects found with the name '${response?.["projectName"]}'. Please specify the project index:\n${projectOptions}`;
        }
  
        const projectIndex =
          projects.length === 1 ? 0 : response?.["projectIndex"] - 1;
  
        if (!projects?.[projectIndex]?.["id"])
          return `Invalid project selected.`;
  
        const projectId = projects[projectIndex].id;
  
        // Step 3: Fetch properties for the selected project
        let properties = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/properties`)
          .then((r) =>
            r?.["data"]?.data?.filter(
              (property: any) =>
                property.projectId === projectId &&
                property.title === response?.["propertyTitle"]
            )
          );
  
        if (!properties || properties.length === 0)
          return `No properties found with the title '${response?.["propertyTitle"]}' in project '${projects[projectIndex].title}'.`;
  
        if (properties.length > 1 && !response?.["propertyIndex"]) {
          // Ask user to specify a property if multiple properties are found
          const propertyOptions = properties
            .map(
              (property: any, index: any) =>
                `index: ${index + 1}, Title: ${property.title}, Type: ${property.type}`
            )
            .join("\n");
  
          return `Multiple properties found with the title '${response?.["propertyTitle"]}'. Please specify the property index:\n${propertyOptions}`;
        }
  
        const propertyIndex =
          properties.length === 1 ? 0 : response?.["propertyIndex"] - 1;
  
        if (!properties?.[propertyIndex]?.["id"])
          return `Invalid property selected.`;
  
        const propertyId = properties[propertyIndex].id;
  
        // Step 4: Delete the selected property
        await axios({
          locale: "en",
          user: args?.["user"],
        }).delete(`/api/properties/${propertyId}`);
  
        return `Property '${properties[propertyIndex].title}' deleted successfully from project '${projects[projectIndex].title}'.`;
      } catch (error: any) {
        console.error("Error deleting property: ", error.message);
        throw new Error(
          error.message ?? "Error occurred while deleting the property."
        );
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
          (project: { userId: any }) => project.userId === args.user.id,
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
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
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
          },
        );

        // Refresh the page
        window.location.reload();

        return `study case created successfully with title ${response?.["title"]}`;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`,
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
          (project: { userId: any }) => project.userId === args.user.id,
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
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
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
            c.title === response?.["title"],
        );

        console.log("Case studies after filter: ", caseStudies);

        if (!response?.["caseStudyIndex"] && caseStudies.length > 1) {
          // Return list of case studites with more details to help user select
          const caseStudiesOptions = caseStudies
            .map(
              (c: any, index: any) => `index: ${index + 1}, Name: ${c.title}`,
            )
            .join("\n");

          return `Multiple case studies were found with the name '${response?.["title"]}':\n${caseStudiesOptions}\nPlease specify the case study index to delete.`;
        }

        const caseStudyIndex =
          caseStudies.length > 1 ? response?.["caseStudyIndex"] - 1 : 0;

        if (!caseStudies?.[caseStudyIndex]?.id) return `No valid case study.`;

        await axios({ locale: "en", user: args?.["user"] }).delete(
          `/api/study-cases/${caseStudies?.[caseStudyIndex]?.id}`,
        );

        // Refresh the page
        window.location.reload();

        return `study case with title ${response?.["title"]} deleted successfully `;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`,
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
          type: "string",
          description:
            "The number of weeks that is used to determine how much posts the user needs.",
        },
        contentLength: {
          type: "string",
          enum: ["SHORT", "MEDIUM", "LONG"],
          description: "Select the length of the content for the posts.",
        },
        campaignType: {
          type: "string",
          enum: ["BRANDING_AWARENESS", "ENGAGEMENT", "SALES_CONVERSION"],
          description: "Select the type of campaign for the posts.",
        },
      },
      required: [
        "projectName",
        "caseStudyTitle",
        "numberOfWeeks",
        "contentLength",
        "campaignType",
      ],
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
          (project: { userId: any }) => project.userId === args.user.id,
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
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
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
            c.title === response?.["caseStudyTitle"],
        );

        console.log("Case studies after filter: ", caseStudies);

        if (!response?.["caseStudyIndex"] && caseStudies.length > 1) {
          // Return list of case studites with more details to help user select
          const caseStudiesOptions = caseStudies
            .map(
              (c: any, index: any) => `index: ${index + 1}, Name: ${c.title}`,
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

        await axios({ locale: "en", user: args?.["user"] }).post(`/api/posts`, {
          project: targetedProject,
          caseStudy: targetedCaseStudy,
          noOfWeeks: noOfWeeks,
          campaignType: campaignType,
          contentLength: contentLength,
          caseStudyId: targetedCaseStudyId,
        });

        // Refresh the page
        window.location.reload();

        return `posts for the case study of title ${response?.["caseStudyTitle"]} created successfully `;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`,
        );
      }
    },
  },
  {
    name: "DeletePost",
    description:
      "Deletes a post for a study case of a project on the server with specified parameters.",
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
        postTitle: {
          type: "string",
          description: "The title of the post we want to delete.",
        },
        postIndex: {
          type: "integer",
          description:
            "the index of the post if there are multiple posts having the same title.",
        },
      },
      required: ["projectName", "caseStudyTitle", "postTitle"],
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
          (project: { userId: any }) => project.userId === args.user.id,
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
                `index: ${index + 1}, Name: ${project.title}, Created on: ${project.createdAt}`,
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
            c.title === response?.["caseStudyTitle"],
        );

        console.log("Case studies after filter: ", caseStudies);

        if (!response?.["caseStudyIndex"] && caseStudies.length > 1) {
          // Return list of case studites with more details to help user select
          const caseStudiesOptions = caseStudies
            .map(
              (c: any, index: any) => `index: ${index + 1}, Name: ${c.title}`,
            )
            .join("\n");

          return `Multiple case studies were found with the name '${response?.["caseStudyTitle"]}':\n${caseStudiesOptions}\nPlease specify the case study index to delete.`;
        }

        const caseStudyIndex =
          caseStudies.length > 1 ? response?.["caseStudyIndex"] - 1 : 0;

        if (!caseStudies?.[caseStudyIndex]?.id) return `No valid case study.`;

        let posts = await axios({
          locale: "en",
          user: args?.["user"],
        })
          .get(`/api/posts/caseStudyId`, {
            params: {
              caseStudyId: caseStudies?.[caseStudyIndex]?.id,
            },
          })
          .then((r) => r?.["data"]);

        posts = posts.data.filter(
          (p: { title: any }) => p.title === response?.["postTitle"],
        );

        if (!response?.["postIndex"] && posts.length > 1) {
          // Return list of case studites with more details to help user select
          const postsOptions = posts
            .map(
              (p: any, index: any) =>
                `index: ${index + 1}, Name: ${p.title}, Contnet: ${p.content}`,
            )
            .join("\n");

          return `Multiple posts were found with the name '${response?.["postTitle"]}':\n${postsOptions}\nPlease specify the case study index to delete.`;
        }

        let postIndex = posts.length > 1 ? response?.["postIndex"] - 1 : 0;

        if (!posts?.[postIndex]?.id) return `No valid Post.`;

        await axios({ locale: "en", user: args?.["user"] }).delete(
          `api/posts/${posts?.[postIndex]?.id}`,
        );

        // Refresh the page
        window.location.reload();

        return `post of title ${response?.["postTitle"]} deleted successfully `;
      } catch (error: any) {
        console.error("error in creating case: ", error?.["message"]);
        throw new Error(
          error?.["message"] ?? `error in creating the study case`,
        );
      }
    },
  },
];

export const { openai, ...AI } = OpenAI({
  configure: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true,
  },
  functions: tools,
});
