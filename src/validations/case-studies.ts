import { z } from "@/lib/zod";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from "./images";

export const caseStudySchema = z.object(
  // <Record<keyof CaseStudy, any>>
  {
    id: z.string("id"),
    projectId: z.string("projectId"),
    title: z.string("title"),
    refImages: z.array(z.string("reference image")),
    content: z.string("content"),
    targetAudience: z.string("targetAudience"),
    pros: z.string("pros"),
    cons: z.string("cons"),
    hashtags: z.string("hashtags").optional(),
    Market_Strategy: z.string("hashtags"),
    Performance_Metrics: z.string("hashtags"),
    ROI_Calculation: z.string("hashtags"),
    Strategic_Insights: z.string("hashtags"),
    Recommendations: z.string("hashtags"),
    prompt: z.string("prompt").nullable().optional(),
    caseStudyResponse: z.string("caseStudyResponse").nullable().optional(),

    deletedAt: z.date("deletedAt").nullable(),
  },
);

export const caseStudyCreateSchema = caseStudySchema.pick({
  title: true,
  projectId: true,
  refImages: true,
});

export const caseStudyCreateFormSchema = caseStudyCreateSchema
  .omit({
    refImages: true,
  })
  .and(
    z.object({
      refImages: z.array(
        z.object({
          file: z
            .instanceof(File)
            .refine((file) => {
              return !file || file.size <= MAX_UPLOAD_SIZE;
            }, "File size must be less than 5MB")
            .refine((file) => {
              return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }, "File must be a PNG"),
          base64: z.string("base64"),
        }),
      ),
    }),
  );

export const caseStudyUpdateSchema = caseStudySchema.omit({
  projectId: true,
  deletedAt: true,
});
export const caseStudyUpdateFormSchema = caseStudyUpdateSchema
  .omit({ refImages: true })
  .and(
    z.object({
      refImages: z.array(
        z.object({
          file: z
            .instanceof(File)
            .refine((file) => {
              return !file || file.size <= MAX_UPLOAD_SIZE;
            }, "File size must be less than 5MB")
            .refine((file) => {
              return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }, "File must be a PNG"),
          base64: z.string("base64"),
        }),
      ),
    }),
  );

export const caseStudyDeleteSchema = caseStudySchema.pick({ id: true });
export const caseStudyBinSchema = caseStudySchema.pick({
  id: true,
  deletedAt: true,
});
export const caseStudyRestoreSchema = caseStudySchema.pick({
  id: true,
});
