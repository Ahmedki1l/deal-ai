import { NavItem, SelectItem } from "@/types";
import { PROPERTY_TYPE } from "@prisma/client";

export default {
  site: {
    name: "Deal Ai",
    description:
      "Our platform offers advanced social media automation services using cutting-edge AI technology. We assist clients in executing fully integrated marketing campaigns tailored specifically for real estate projects. Through data analysis and market forecasting, we provide innovative solutions that enhance targeting, increase content engagement, and boost the performance of marketing campaigns. Our goal is to empower clients to reach their target audience more efficiently, increase real estate sales strategically, while reducing costs and accelerating the achievement of results.",
  },
  auth: {
    login: {
      "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.":
        "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.",
      "Alex Thompson, CEO of Thompson Real Estate":
        "Alex Thompson, CEO of Thompson Real Estate",
      "don't have an account? sign up now":
        "Don't have an account? Sign Up now",
      "or continue with": "or continue with",
      "sign in with email": "Sign In with Email",
      "sign in with google": "Sign In with Google",
      "sign in with facebook": "Sign In with Facebook",
      "forgot password": "Forgot Password?",
    },
    register: {
      "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.":
        "since collaborating with Deal Ai, our property sales have surged by 40%, and client satisfaction has reached new heights. their platform has optimized our operations, driving significant business growth.",
      "Alex Thompson, CEO of Thompson Real Estate":
        "Alex Thompson, CEO of Thompson Real Estate",
      "already have an account? sign in.": "Already have an account? Sign In.",
      "or continue with": "or continue with",
      "sign up with email": "Sign Up with Email",
      "sign up with google": "Sign Up with Google",
      "sign up with facebook": "Sign Up with Facebook",
    },
  },
  dashboard: {
    user: {
      "main-nav": {
        top: [
          [
            {
              segment: null,
              value: "/dashboard",
              label: "Dashboard",
              icon: "home",
            },
            {
              segment: ["projects"],
              value: "/dashboard/projects",
              label: "My Projects",
              icon: "analytics",
            },
            {
              segment: ["calender"],
              value: "/dashboard/calender",
              label: "Calender",
              icon: "calender",
            },
          ],
          [
            {
              segment: ["settings"],
              value: "/dashboard/settings",
              label: "Settings",
              icon: "settings",
            },
            {
              segment: ["bin"],
              value: "/dashboard/bin",
              label: "Bin",
              icon: "trash",
            },
          ],
        ] as NavItem[][],
      },
      dashboard: {
        dashboard: "Dashboard",
        "take a glance and manage your projects.":
          "Take a glance and manage your projects.",
        "create project": "Create Project",
        "latest projects": "Latest Projects",
      },
      calender: {
        calender: "Calender",
        "timeline of your posts schedule.": "timeline of your posts schedule.",
      },
      projects: {
        "oops, no projects.": "oops, no projects.",
        "you have not created you project yet.":
          "you have not created you project yet.",
        projects: "Projects",
        "create and manage projects.": "Create and manage posts.",
        "create project": "Create Project",
        table: {
          project: "Project",
          "study case": "Study Case",
          "target audience": "Target Audience",
          properties: "Properties",
          posts: "Posts",
          platforms: "Platforms",
          edit: "Edit",
          delete: "Delete",
          restore: "Restore",
          deletedAt: "Deleted At",
        },
        project: {
          "view pdf": "view pdf",
          "oops, no such project.": "oops, no such project.",
          "you have not created you project yet.":
            "you have not created you project yet.",
          projects: "projects",
          restore: "Restore",
          delete: "Delete",
          "back to all projects": "back to all projects",
          distinct: "Distinct",
          city: "city",
          "study cases": "Study Cases",
          country: "country",
          spaces: "spaces",
          "property types": "property types",
          platforms: "platforms",
          "created at": "created at",
          "here's a list of your study cases.":
            "Here's a list of your study cases.",
          "create study case": "Create Study Case",
          "here's a list of your properties.":
            "Here's a list of your properties.",
          "create properties": "Create Properties",

          cases: {
            case: {
              "back to": "back to",
              "market strategy": "market strategy",
              "error loading market strategy data.":
                "error loading market strategy data.",
              "no valid market strategy data available.":
                "no valid market strategy data available.",

              "performance metrics": "performance metrics",
              "error loading performance metrics data.":
                "error loading performance metrics data.",
              "no valid performance metrics data available.":
                "no valid performance metrics data available.",

              "ROI calculation": "ROI calculation",
              "error loading ROI calculation data.":
                "error loading ROI calculation data.",
              "no valid ROI calculation data available.":
                "no valid ROI calculation data available.",

              "strategic insights": "strategic insights",
              "error loading strategic insights data.":
                "error loading strategic insights data.",
              "no valid strategic insights data available.":
                "no valid strategic insights data available.",

              recommendations: "recommendations",
              "error loading recommendations data.":
                "error loading recommendations data.",
              "no valid recommendations data available.":
                "no valid recommendations data available.",

              "Post Frequency": "Post Frequency",
              "error loading Post Frequency data.":
                "error loading Post Frequency data.",
              "no valid Post Frequency data available.":
                "no valid Post Frequency data available.",

              "it's project is deleted, once you restore it all will be editable.":
                "it's project is deleted, once you restore it all will be editable.",
              "oops, no such study case.": "oops, no such study case.",
              "you have not created you study case yet.":
                "you have not created you study case yet.",
              projects: "projects",
              restore: "Restore",
              delete: "Delete",
              "warning!": "warning!",
              "oops, no posts.": "oops, no posts.",
              "you have not created you posts yet.":
                "you have not created you posts yet.",
              "study case content": "Study Case Content",
              "target audience": "Target Audience",
              pros: "Pros",
              cons: "Cons",
              "reference images": "Reference Images",
              "navigate to get what you want.":
                "Navigate to get what you want.",
              "create posts": "Create Posts",
              "campaign type": "Campaign Type",
              "content length": "Content Length",
              confirmed: "confirmed",
              "not confirmed": "not confirmed",
              posts: {
                posts: "Posts",
                "oops, no posts.": "oops, no posts.",
                "you have not created you posts yet.":
                  "you have not created you posts yet.",
                post: {
                  "back to": "back to",
                  "it's project or study case is deleted, once you restore it all will be editable.":
                    "it's project or study case is deleted, once you restore it all will be editable.",
                  "oops, no such post.": "oops, no such post.",
                  "you have not created you post yet.":
                    "you have not created you post yet.",
                  projects: "projects",
                  restore: "Restore",
                  delete: "Delete",
                  "warning!": "warning!",
                },
              },
            },
            table: {
              name: "Name",
              description: "Description",
              "study case": "Study Case",
              "target audience": "Target Audience",
              posts: "Posts",
              platforms: "Platforms",
              edit: "Edit",
              delete: "Delete",
              restore: "Restore",
              deletedAt: "Deleted At",
            },
          },
          properties: {
            "back to": "back to",
            properties: "Properties",
            "oops, no such property.": "oops, no such property.",
            "you have not created you property yet.":
              "you have not created you property yet.",
            projects: "projects",
            "it's project is deleted, once you restore it all will be editable.":
              "it's project is deleted, once you restore it all will be editable.",
            "warning!": "warning!",
            restore: "Restore",
            delete: "Delete",
            table: {
              name: "Name",
              units: "Units",
              type: "Type",
              space: "space",
              finishing: "finishing",
              floors: "floors",
              rooms: "rooms",
              bathrooms: "bathrooms",
              livingrooms: "Livingrooms",
              garden: "garden",
              price: "price",
              pool: "pool",
              view: "view",
              edit: "Edit",
              delete: "Delete",
              restore: "Restore",
              deletedAt: "Deleted At",
            },
          },
        },
      },
      bin: {
        "main-nav": [
          { value: "/dashboard/bin", label: "Projects" },
          { value: "/dashboard/bin/cases", label: "Study Cases" },
          { value: "/dashboard/bin/properties", label: "Properties" },
          { value: "/dashboard/bin/posts", label: "Posts" },
        ] as NavItem[],
        bin: "Bin",
        "below is a list of your deleted items. you can restore them within 30 days before they are permanently removed.":
          "Below is a list of your deleted items. You can restore them within 30 days before they are permanently removed.",

        projects: "Projects",
        cases: {
          "study cases": "Study Cases",
        },
        properties: {
          properties: "Properties",
        },
        posts: {
          posts: "Posts",
        },
      },
      settings: {
        "main-nav": [
          { value: "/dashboard/settings", label: "Profile" },
          { value: "/dashboard/settings/appearance", label: "Appearance" },
        ] as NavItem[],
        settings: "Settings",
        "manage your account details, privacy settings, and how others perceive you on the platform.":
          "manage your account details, privacy settings, and how others perceive you on the platform.",

        appearance: {
          appearance: "Appearance",
          "customize your appearance settings and preferences.":
            "Customize your appearance settings and preferences.",
        },
        profile: {
          profile: "Profile",
          "this is how others will see you on the site.":
            "this is how others will see you on the site.",
        },
      },
    },
  },
  editors: {
    images: {
      image: {
        "back to": "back to",
        "post of project": "post of project",
      },
    },
  },

  siri: {
    "Chat with OpenAI (Voice & Text)": "Chat with OpenAI (Voice & Text)",
    "clear history": "Clear History",
    hello: "Hello",
    send: "Send",
    say: "Say",
    "No Messages Yet": "No Messages Yet",
    Message: "Message",
    "Message AI...": "Message AI...",
    "Stop Listening": "Stop Speaking",
    "Start Listening": "Start Speaking",
  },
  "appearance-form": {
    theme: "Theme",
    "automatically switch between day and night themes.":
      "Automatically switch between day and night themes.",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    "automatically switch between languages.":
      "Automatically switch between languages.",
    "update preferences": "update preferences",
  },
  "back-button": { back: "back" },

  "case-study-bin-button": {
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete study case": "Delete Study Case",
    "once deleted, the study case will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "Once deleted, the study case will be moved to the bin. You can manually delete it or it will be automatically removed after 30 days. If restored, everything will be reinstated as if nothing happened.",
  },
  "case-study-create-button": {
    "initializing case...": "initializing case...",
    "created successfully.": "created successfully.",
    submit: "Submit",
    "create study case": "Create Study Case",
    "create a A well-structured study case for your real estate project that helps highlight the unique features, target audience, market strategy, and performance metrics of your project. once created, these study cases can be used to inform potential buyers, partners, and stakeholders, demonstrating the value and potential of your real estate developments.":
      "Create a A well-structured study case for your real estate project that helps highlight the unique features, target audience, market strategy, and performance metrics of your project. Once created, these study cases can be used to inform potential buyers, partners, and stakeholders, demonstrating the value and potential of your real estate developments.",
  },
  "case-study-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.",
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete study case": "delete study case",
  },
  "case-study-form": {
    title: { label: "Title", "health center": "Health Center" },
    description: {
      label: "Description",
      "describe your study case": "Describe your study case",
    },
    refImages: { label: "Reference Image" },
    content: {
      label: "Content",
      "describe your study case's content":
        "describe your study case's content",
    },
    targetAudience: {
      label: "Description",
      "describe your study case's target audience":
        "describe your study case's target audience",
    },
    pros: {
      label: "Pros",
      "describe your study case's pros": "describe your study case's pros",
    },
    cons: {
      label: "Cons",
      "describe your study case's cons": "describe your study case's cons",
    },
  },
  "case-study-restore-button": {
    "restoring this study case will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "Restoring this study case will bring back all its data and settings, making it appear as if it was never deleted. All related information will be fully reinstated, allowing you to pick up right where you left off.",
    "restored successfully.": "restored successfully.",
    restore: "Restore",
    "restore study case": "Restore Study Case",
  },
  "case-study-update-button": {
    "updated successfully.": "updated successfully.",
    submit: "Submit",
    "update study case": "Update Study Case",
    "updating a study case allows you to refine and enhance the details of your ongoing developments":
      "Updating a study case allows you to refine and enhance the details of your ongoing developments",
  },
  "case-study-update-form": {
    "updated successfully.": "updated successfully.",
    submit: "Submit",
    cancel: "Cancel",
    edit: "Edit",
  },
  "resizeable-layout": { logout: "Logout" },
  "dashboard-posts-bar-chart": {
    posts: "Posts",
    "showing total posts for the last 3 months.":
      "Showing total posts for the last 3 months.",
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    LINKEDIN: "LinkedIn",
    TWITTER: "Twitter",
    views: "Views",
    "project name": "Project Name",
  },

  "apartment-form": {
    apartments: "apartments",
    "no apartment": "no apartments",
    "new apartment": "new apartment",
    "create new apartment": "create new apartment",
  },
  "villa-form": {
    villas: "villas",
    "no villa": "no villas",
    "new villa": "new villa",
    "create new villa": "create new villa",
  },

  "data-table": {
    "no results.": "No Results.",
  },
  "data-table-column-header": {
    asc: "Asc",
    desc: "Desc",
    hide: "Hide",
  },
  "data-table-pagination": {
    of: "of",
    "row(s) selected.": "row(s) selected.",
    "rows per page": "rows per page",
    "go to first page": "Go to first page",
    "go to previous page": "Go to previous page",
    "go to next page": "Go to next page",
    "go to last page": "Go to last page",
    page: "page",
  },
  "data-table-row-actions": {
    actions: "Actions",
    "open menu": "Open menu",
  },
  "data-table-view-options": {
    view: "View",
    "toggle columns": "Toggle columns",
  },

  dialog: {
    "are you sure you want to proceed?": "Are you sure you want to proceed?",
    "please confirm that all the provided information is accurate. This action cannot be undone.":
      "Please confirm that all the provided information is accurate. This action cannot be undone.",
    cancel: "Cancel",
  },

  "image-editor": {
    "updated successfully.": "updated successfully.",
    dimensions: "dimensions",
    download: "download",
    "post will be with no image": "post will be with no image",
    clear: "clear",
    "save changes": "save changes",
    layers: "layers",
    "image size": "image size",
    recenter: "recenter",
    "recenter all layers": "recenter all layers",
    photo: "photo",
    width: "width",
    height: "height",
    "choose frame": "choose frame",
    "edit text": "edit text",
    "new text": "new text",
    color: "color",
    "font size": "font size",
  },
  "image-form": {
    "upload-file": { "upload image": "upload image" },
    "regenerate-image": {
      prompt: "Prompt",
      "enhance prompt": "enhance prompt",
      "generate image": "generate image",
      "enhanced successfully.": "enhanced successfully.",
      "generated successfully.": "generated successfully.",
      "generate image using AI": "إنشاء صورة باستخدام الذكاء الاصطناعي",
    },
    frame: {
      frame: "Frame",
      "add frame": "Add Frame",
      "applying frames...": "Applying Frames...",
      "no frames to be applied...": "No frames to be applied...",
    },
  },
  "add-field-with-type": {
    "add item": "Add Item",
    "field type": "Field Type",
    types: [
      { value: "string", label: "String" },
      { value: "number", label: "Number" },
      { value: "boolean", label: "Boolean" },
      { value: "object", label: "Object" },
      { value: "array", label: "Array" },
    ],
  },
  "locale-switcher": {
    "current locale of the website": "current locale of the website",
    en: "English (EN)",
    ar: "العربية (AR)",
    // fr: "French (FR)",
    // de: "Deautch (DE)",
    "change language": "change language",
  },
  "mode-toggle": {
    "toggle theme": "toggle theme",
    modes: [
      { value: "light", label: "Light", icon: "sun" },
      { value: "dark", label: "Dark", icon: "moon" },
      { value: "system", label: "System", icon: "laptop" },
    ] as SelectItem[],
  },

  "post-bin-button": {
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete post": "Delete Post",
    "once deleted, the post will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "Once deleted, the post will be moved to the bin. You can manually delete it or it will be automatically removed after 30 days. If restored, everything will be reinstated as if nothing happened.",
  },
  "post-create-button": {
    "initializing posts...": "initializing posts...",
    "created successfully.": "created successfully.",
    submit: "Submit",
    "create posts": "Create Posts",
    "streamline your marketing efforts by generating and scheduling posts across all your platforms using AI, and automatically publishes it at optimal times, maximizing reach and engagement.":
      "Streamline your marketing efforts by generating and scheduling posts across all your platforms using AI, and automatically publishes it at optimal times, maximizing reach and engagement.",
  },
  "post-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.",
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete post": "Delete Post",
  },
  "post-form": {
    title: { label: "Title", "health center": "Health Center" },
    confirmedAt: {
      label: "Confirm this post to be ready for publishing",
      "you can manage your posts in the": "You can manage your posts in the",
      calender: "Calender",
      page: "Page",
    },
    description: {
      label: "Description",
      "describe your post": "Describe your post",
    },
    content: {
      label: "Content",
      "describe your post's content": "Describe your post's content",
    },
    noOfWeeks: { label: "Number of Weeks" },
    campaignType: {
      label: "Campaign Type",
      "select your campaign": "Select your campaign",
    },
    contentLength: {
      label: "Content Length",
      "select your content length": "select your content length",
    },
    platform: {
      label: "Platform",
      "select your platform": "Select your platform",
    },
    postAt: {
      label: "Post At",
    },
  },
  "post-restore-button": {
    "restoring this post will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "Restoring this post will bring back all its data and settings, making it appear as if it was never deleted. All related information will be fully reinstated, allowing you to pick up right where you left off.",
    "restored successfully.": "restored successfully.",
    restore: "Restore",
    "restore post": "Restore Post",
  },
  "post-update-content-button": {
    "updating your post's content allows you to refine and enhance the details of your ongoing developments":
      "Updating your post's content allows you to refine and enhance the details of your ongoing developments",
    "content updated successfully.": "content updated successfully.",
    submit: "Submit",
    "update content": "Update Content",
  },
  "post-update-form": {
    "updated successfully.": "updated successfully.",
    submit: "Submit",
    "post details": "Post Details",
    "edit image": "edit image",
    discard: "Discard",
    "save changes": "Save Changes",
    "post information": "Post Information",
    "update image": "Update Image",
    "restore post": "Restore Post",
    "delete post": "Delete Post",
    "updating an image allows you to refine and enhance the details of your ongoing developments":
      "Updating an image allows you to refine and enhance the details of your ongoing developments",
    "choose file": "choose file",
    "generate using AI": "generate using AI",
    "apply frame": "Apply Frame",
    "project name": "Project Name",
  },
  "post-update-schedule-button": {
    "scheduled successfully.": "scheduled successfully.",
    submit: "Submit",
    "update schedule": "Update Schedule",
    "updating your post's scheule allows you to refine and enhance the details of your ongoing developments":
      "Updating your post's scheule allows you to refine and enhance the details of your ongoing developments",
  },

  "project-bin-button": {
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete project": "Delete Project",
    "once deleted, the project will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "Once deleted, the project will be moved to the bin. You can manually delete it or it will be automatically removed after 30 days. If restored, everything will be reinstated as if nothing happened.",
  },
  "project-create-button": {
    "initializing project...": "initializing project...",
    "created successfully.": "created successfully.",
    submit: "Submit",
    "type of assets": "Type of Assets",
    unit: "unit",
    "create project": "Create Project",
    "by providing detailed information about your project, you'll be able to streamline your operations, track progress, and ensure that all stakeholders are informed about the development's key aspects and milestones.":
      "By providing detailed information about your project, you'll be able to streamline your operations, track progress, and ensure that all stakeholders are informed about the development's key aspects and milestones.",
  },
  "project-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.",
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete project": "Delete Project",
  },
  "project-form": {
    title: { label: "Title", "health center": "health center" },
    logo: { label: "Logo" },
    pdf: {
      label: "PDF",
      "fill fields using ai": "Fill fields using AI",
      "after confirming a pdf, you can't choose another one.":
        "after confirming a pdf, you can't choose another one.",
      "fields are filled using AI.": "Fields are filled using AI.",
    },
    map: { label: "Map", "choose on map": "Choose on map" },
    description: {
      label: "Description",
      "describe your project": "describe your project",
    },
    distinct: { label: "Distinct", "nasr city": "Nasr City" },
    city: { label: "City", cairo: "Cairo" },
    country: { label: "Country", egypt: "Egypt" },
    spaces: { label: "Spaces" },
    platforms: {
      label: "Platforms",
      "select your platform": "Select your platform",
      "connected successfully.": "connected successfully.",
      connect: "connect",
      connected: "connected",
    },
  },
  "project-restore-button": {
    "restoring this project will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "Restoring this project will bring back all its data and settings, making it appear as if it was never deleted. All related information will be fully reinstated, allowing you to pick up right where you left off.",
    "restored successfully.": "restored successfully.",
    restore: "Restore",
    "restore project": "Restore Project",
  },
  "project-update-form": {
    "updated successfully.": "updated successfully.",
    submit: "Submit",
    "update project": "Update Project",
    "updating a project allows you to refine and enhance the details of your ongoing developments":
      "Updating a project allows you to refine and enhance the details of your ongoing developments",
  },

  "property-bin-button": {
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete property": "Delete Property",
    "once deleted, the property will be moved to the bin. you can manually delete it or it will be automatically removed after 30 days. if restored, everything will be reinstated as if nothing happened.":
      "Once deleted, the property will be moved to the bin. You can manually delete it or it will be automatically removed after 30 days. If restored, everything will be reinstated as if nothing happened.",
  },
  "property-create-button": {
    "initializing property...": "initializing property...",
    "created successfully.": "created successfully.",
    submit: "Submit",
    "type of assets": "Type of Assets",
    unit: "unit",
    "create property": "Create Property",
    "by detailing each property, including its features, layout, and amenities, you ensure that all relevant information is captured, enabling better organization and presentation to potential buyers or tenants.":
      "By detailing each property, including its features, layout, and amenities, you ensure that all relevant information is captured, enabling better organization and presentation to potential buyers or tenants.",
  },
  "property-delete-button": {
    "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.":
      "once deleted, this action cannot be undone. please be certain, as all relevant data will be permanently deleted.",
    "deleted successfully.": "deleted successfully.",
    delete: "Delete",
    "delete property": "Delete Property",
  },
  "property-form": {
    type: { "select your property type": "Select your property type" },
    title: { label: "Title", "health center": "health center" },
    units: {
      units: "Units",
      "no. of villas": "Number of Villas",
    },
    space: { label: "Space" },
    finishing: { label: "Finishing" },
    floors: { label: "Floors" },
    rooms: { label: "Rooms" },
    bathrooms: { label: "Bathrooms" },
    livingrooms: { "living rooms": "Living Rooms" },
    price: { label: "Price" },
    garden: { label: "Garden" },
    pool: { label: "Pool" },
    view: { label: "View" },
  },
  "property-restore-button": {
    "restoring this property will bring back all its data and settings, making it appear as if it was never deleted. all related information will be fully reinstated, allowing you to pick up right where you left off.":
      "Restoring this property will bring back all its data and settings, making it appear as if it was never deleted. All related information will be fully reinstated, allowing you to pick up right where you left off.",
    "restored successfully.": "restored successfully.",
    restore: "Restore",
    "restore property": "Restore Property",
  },
  scheduler: { today: "Today" },
  "user-form": {
    name: {
      label: "Full Name",
      placeholder: "Joe Doe",
    },
    email: {
      label: "Email",
    },
    password: {
      label: "Password",
    },
  },
  "user-profile-password-form": {
    "updated successfully.": "updated successfully.",
    "reset password": "Reset Password?",
    "new password": "New Password",
    "confirm new password": "Confirm New Password",
    discard: "Discard",
    submit: "Submit",
    "this will update your password and help keep your account secure.":
      "this will update your password and help keep your account secure.",
  },
  "user-profile-personal-form": {
    "updated successfully.": "updated successfully.",
    "personal information": "Personal Information",
    discard: "Discard",
    "save changes": "Save Changes",
    "this information will be used to create your public profile.":
      "this information will be used to create your public profile.",
  },
  constants: {
    days: [
      { value: "SUN", label: "SUN" },
      { value: "MON", label: "MON" },
      { value: "TUE", label: "TUE" },
      { value: "WED", label: "WED" },
      { value: "THU", label: "THU" },
      { value: "FRI", label: "FRI" },
      { value: "SAT", label: "SAT" },
    ] as SelectItem[],
    frames: {
      reservation: "Reservation",
    },
  },
  db: {
    platforms: [
      { value: "FACEBOOK", label: "Facebook" },
      { value: "LINKEDIN", label: "LinkedIn" },
      { value: "INSTAGRAM", label: "Instagram" },
      { value: "TWITTER", label: "Twitter" },
    ] as SelectItem[],
    propertyTypes: [
      { value: "APARTMENT", label: "Apartment" },
      { value: "VILLA", label: "Villa" },
    ] as (SelectItem & { value: PROPERTY_TYPE })[],
    campaignTypes: [
      { value: "BRANDING_AWARENESS", label: "Branding Awareness" },
      { value: "ENGAGEMENT", label: "Engagement" },
      { value: "SALES_CONVERSION", label: "Sales Conversion" },
    ] as SelectItem[],
    contentLength: [
      { value: "SHORT", label: "Short" },
      { value: "MEDIUM", label: "Medium" },
      { value: "LONG", label: "Long" },
    ] as SelectItem[],
  },

  actions: {
    // users: {
    "this email is already used.": "This email is already used.",
    "incorrect email address.": "Incorrect email address.",
    "incorrect password": "Incorrect password",
    "no password setting to that account, login using google.":
      "No password setting to that account, Login using Google.",
    "you are not logged in.": "You are not logged in.",
    "your user account was not logged in. please try again.":
      "your user account was not logged in. Please try again.",
    "your user account was not created. please try again.":
      "your user account was not created. Please try again.",
    "your user account was not updated. please try again.":
      "your user account was not updated. Please try again.",
    "your user account was not deleted. please try again.":
      "your user account was not deleted. Please try again.",

    // projects: {
    "your project was not created. please try again.":
      "your project was not created. Please try again.",
    "your project was not updated. please try again.":
      "your project was not updated. Please try again.",
    "your project was not deleted. please try again.":
      "your project was not deleted. Please try again.",
    "project created successfully with title":
      "project created successfully with title",

    // "study-case": {
    "your study case was not created. please try again.":
      "your study case was not created. Please try again.",
    "your study case was not deleted. please try again.":
      "your study case was not deleted. Please try again.",
    "your study case was not updated. please try again.":
      "your study case was not updated. Please try again.",

    // "properties": {
    "your property was not created. please try again.":
      "your property was not created. Please try again.",
    "your property was not deleted. please try again.":
      "your property was not deleted. Please try again.",
    "your property was not updated. please try again.":
      "your property was not updated. Please try again.",

    // posts: {
    "your post was not created. please try again.":
      "your post was not created. Please try again.",
    "your post was not updated. please try again.":
      "your post was not updated. Please try again.",
    "your post was not deleted. please try again.":
      "your post was not deleted. Please try again.",

    // images: {
    "your image was not created. please try again.":
      "your image was not created. Please try again.",
    "your image was not updated. please try again.":
      "your image was not updated. Please try again.",
    "your image was not deleted. please try again.":
      "your image was not deleted. Please try again.",
    "your image prompt was not updated. please try again.":
      "your image prompt was not updated. Please try again.",
    "your image url was not generated. please try again.":
      "your image url was not generated. Please try again.",
    "your image url was not uploaded. please try again.":
      "your image url was not uploaded. Please try again.",
    "your file was not uploaded. please try again.":
      "your file was not uploaded. please try again.",

    "this action needs you to be logged in.":
      "this action needs you to be logged in.",
    "you don't have access to do this action.":
      "you don't have access to do this action.",
  },
};
