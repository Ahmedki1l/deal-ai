import { z } from "@/lib/zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = ["image/png"];

export const caseStudySchema = z.object(
  // <Record<keyof CaseStudy, any>>
  {
    id: z.string("id"),
    projectId: z.string("projectId"),
    title: z.string("title"),
    description: z.string("description").optional(),
    refImages: z.array(z.string("reference image")),
    content: z.string("content"),
    targetAudience: z.string("targetAudience"),
    pros: z.string("pros"),
    cons: z.string("cons"),
    hashtags: z.string("hashtags"),
  },
);

export const caseStudyCreateSchema = caseStudySchema.omit({ id: true });
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
              return ACCEPTED_FILE_TYPES.includes(file.type);
            }, "File must be a PNG"),
          base64: z.string("base64"),
        }),
      ),
    }),
  );

export const caseStudyUpdateSchema = caseStudySchema.omit({ projectId: true });
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
              return ACCEPTED_FILE_TYPES.includes(file.type);
            }, "File must be a PNG"),
          base64: z.string("base64"),
        }),
      ),
    }),
  );

export const caseStudyDeleteSchema = caseStudySchema.pick({ id: true });
