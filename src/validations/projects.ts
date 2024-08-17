import { z } from "@/lib/zod";
import { platformsArr, propertyTypesArr } from "@/db/enums";
import { propertyCreateFormSchema } from "./properties";

export const projectSchema = z.object(
  // <Record<keyof Project, any>>
  {
    id: z.string("id"),
    userId: z.string("userId"),
    title: z.string("title"),
    description: z.string("description").optional(),

    distinct: z.string("distinct"),
    city: z.string("city"),
    country: z.string("country"),
    spaces: z.string("spaces"),

    propertyTypes: z.array(z.enum(propertyTypesArr)),
    platforms: z.array(z.enum(platformsArr)),

    deletedAt: z.date("deletedAt"),
  },
);

export const projectCreateSchema = projectSchema.omit({
  id: true,
  deletedAt: true,
});
export const projectCreateFormSchema = projectCreateSchema
  .omit({
    platforms: true,
    propertyTypes: true,
  })
  .and(
    z.object({
      platforms: z.array(
        z.object({
          value: z.enum(platformsArr),
        }),
      ),
      map: z.string("map").optional(),
    }),
  )
  .and(propertyCreateFormSchema);

export const projectUpdateSchema = projectSchema.omit({
  userId: true,
  deletedAt: true,
});
export const projectUpdateFormSchema = projectUpdateSchema
  .omit({ platforms: true, propertyTypes: true })
  .and(
    z.object({
      platforms: z.array(
        z.object({
          value: z.enum(platformsArr),
        }),
      ),
      propertyTypes: z.array(
        z.object({
          value: z.enum(propertyTypesArr),
        }),
      ),
    }),
  );
export const projectDeleteSchema = projectSchema.pick({ id: true });
export const projectBinSchema = projectSchema.pick({
  id: true,
  deletedAt: true,
});
export const projectRestoreSchema = projectSchema.pick({
  id: true,
});
