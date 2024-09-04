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

  deletedAt: z.date("deletedAt").optional().nullable(),
});

export const imageCreateSchema = imageSchema.omit({
  id: true,
  deletedAt: true,
});
export const imageUpdateSchema = imageSchema;
export const imageUpdateFormSchema = z
  .object({
    file: z
      .instanceof(File)
      .refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, "File size must be less than 5MB")
      .refine((file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, "File must be a PNG"),
    base64: z.string("base64").min(0),
  })
  .or(
    z.object({
      prompt: z.string("prompt").min(0),
      src: z.string("src").min(0),
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
