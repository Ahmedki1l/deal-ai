import { z } from "@/lib/zod";
import Konva from "konva";

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

export const imageUpdateSchema = imageSchema.pick({
  id: true,
  src: true,
  prompt: true,
});
export const imageUpdateFormSchema = imageUpdateSchema.and(
  z.object({
    dimensios: z.object({
      width: z.string("width").min(1, "set height").max(4, "too long"),
      height: z.string("height").min(1, "set height").max(4, "too long"),
    }),
    filledFrame: z.string("filledFrame")?.nullable()?.default(null),
    editor: z.object({
      photo: z.instanceof(Konva.Image).nullable().default(null),
      frame: z.instanceof(Konva.Image).nullable().default(null),
      textNodes: z.array(z.instanceof(Konva.Text)).default([]),
    }),
  }),
);
// .and(
//   z.object({
//     file: z
//       .instanceof(File)
//       .refine((file) => {
//         return !file || file.size <= MAX_UPLOAD_SIZE;
//       }, "File size must be less than 5MB")
//       .refine((file) => {
//         return ACCEPTED_IMAGE_TYPES.includes(file.type);
//       }, "File must be a PNG")
//       .optional(),
//     base64: z.string("base64").nullable().optional(),
//   }),
// );
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
