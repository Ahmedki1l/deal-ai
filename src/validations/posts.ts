import { z } from "@/lib/zod";
import {
  platformsArr,
  postCampaignArr,
  postContentLengthArr,
} from "@/db/enums";
import { imageSchema, imageUpdateFormSchema } from "./images";

export const postSchema = z.object({
  id: z.string("id"),
  caseStudyId: z.string("caseStudyId"),
  imageId: z.string("imageId"),
  framedImageURL: z.string("framed-image").optional().nullable(),
  title: z.string("title"),
  content: z.string("content"),
  noOfWeeks: z.string("no of weeks"),
  campaignType: z.enum(postCampaignArr),
  contentLength: z.enum(postContentLengthArr),
  platform: z.enum(platformsArr),
  postAt: z.date("post at"),
  deletedAt: z.date("deletedAt"),
  confirmedAt: z.date("confirmedAt"),

  // others
  image: imageSchema,
});

export const postCreateSchema = postSchema.omit({
  id: true,
  imageId: true,
  image: true,
  deletedAt: true,
  confirmedAt: true,
  postAt: true,
});

export const postUpdateSchema = postSchema
  .omit({
    caseStudyId: true,
    imageId: true,
    image: true,
    deletedAt: true,
    confirmedAt: true,
  })
  .and(
    z.object({
      confirm: z.boolean("confirm"),
      image: imageUpdateFormSchema,
    }),
  );

export const postUpdateContentSchema = postSchema.pick({
  id: true,
  content: true,
});
export const postUpdateImageSchema = postSchema.pick({
  id: true,
  imageId: true,
});
export const postUpdateScheduleSchema = postSchema.pick({
  id: true,
  postAt: true,
});

export const postDeleteSchema = postSchema.pick({ id: true });
export const postBinSchema = postSchema.pick({
  id: true,
  deletedAt: true,
});
export const postRestoreSchema = postSchema.pick({
  id: true,
});
