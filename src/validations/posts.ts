import { z } from "@/lib/zod";
import {
  platformsArr,
  postCampaignArr,
  postContentLengthArr,
} from "@/db/enums";

export const postSchema = z.object({
  id: z.string("id"),
  caseStudyId: z.string("caseStudyId"),
  imageId: z.string("imageId"),
  title: z.string("title"),
  content: z.string("content"),
  noOfWeeks: z.string("no of weeks"),
  campaignType: z.enum(postCampaignArr),
  contentLength: z.enum(postContentLengthArr),
  platform: z.enum(platformsArr),
  postAt: z.date("post at"),
});

export const postCreateSchema = postSchema.omit({
  id: true,
  imageId: true,
});
export const postUpdateSchema = postSchema.omit({
  caseStudyId: true,
});

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
