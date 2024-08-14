import { z } from "@/lib/zod";

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const imageSchema = z.object({
  id: z.string("id"),
  src: z.string("src"),
  prompt: z.string("prompt"),
});

export const imageCreateSchema = imageSchema.omit({
  id: true,
});
export const imageUpdateSchema = imageSchema;
export const imageUpdateFormSchema = imageUpdateSchema
  .omit({
    src: true,
  })
  .and(
    z.object({
      src: z.object({
        file: z
          .instanceof(File)
          .refine((file) => {
            return !file || file.size <= MAX_UPLOAD_SIZE;
          }, "File size must be less than 5MB")
          .refine((file) => {
            return ACCEPTED_IMAGE_TYPES.includes(file.type);
          }, "File must be a PNG"),
        base64: z.string("base64").min(0),
        url: z.string("url"),
      }),
    }),
  );
export const imageRegeneratePromptSchema = imageSchema.pick({
  prompt: true,
});
export const imageGenerateSchema = imageSchema.pick({
  prompt: true,
});

export const imageDeleteSchema = imageSchema.pick({ id: true });