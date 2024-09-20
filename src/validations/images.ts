import { z } from "@/lib/zod";

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
];

export const imageSchema = z.object({
  id: z.string("id"),
  src: z.string("src"),
  prompt: z.string("prompt"),

  deletedAt: z.date("deletedAt").nullable(),
});

export const imageCreateSchema = imageSchema.pick({
  src: true,
  prompt: true,
});

export const imageUpdateSchema = imageSchema;
export const imageUpdateFormSchema = imageSchema
  .pick({ src: true, prompt: true })
  .and(
    z.object({
      file: z
        .instanceof(File)
        .refine((file) => {
          return !file || file.size <= MAX_UPLOAD_SIZE;
        }, "File size must be less than 5MB")
        .refine((file) => {
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }, "File must be a PNG")
        .optional(),
      base64: z.string("base64").nullable().optional(),
    }),
  );
export const imageRegeneratePromptSchema = imageSchema.pick({
  prompt: true,
});
export const imageGenerateSchema = imageSchema.pick({
  prompt: true,
});
export const imageWatermarkSchema = imageSchema.pick({
  src: true,
});

export const imageDeleteSchema = imageSchema.pick({ id: true });
export const imageBinSchema = imageSchema.pick({
  id: true,
  deletedAt: true,
});
export const imageRestoreSchema = imageSchema.pick({
  id: true,
});
