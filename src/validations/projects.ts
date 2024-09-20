import { platformsArr, propertyTypesArr } from "@/db/enums";
import { z } from "@/lib/zod";
import { propertyCreateFormSchema } from "./properties";

export const projectSchema = z.object(
  // <Record<keyof Project, any>>
  {
    id: z.string("id"),
    userId: z.string("userId"),
    title: z.string("title"),
    logo: z.string("logo").nullable().optional(),
    description: z.string("description").optional(),

    distinct: z.string("distinct"),
    city: z.string("city"),
    country: z.string("country"),
    spaces: z.string("spaces"),

    propertyTypes: z.array(z.enum(propertyTypesArr)),
    platforms: z
      .array(
        z.object({
          value: z.enum(platformsArr),
          clientId: z.string("client id").optional(),
          urn: z.string("urn").optional(),
        }),
      )
      .min(1, "choose one platform at least."),

    deletedAt: z.date("deletedAt"),
  },
);

export const projectCreateSchema = projectSchema.pick({
  userId: true,

  logo: true,

  title: true,
  description: true,

  distinct: true,
  city: true,
  country: true,
  spaces: true,

  platforms: true,
});
export const projectCreateFormSchema = projectCreateSchema
  .and(
    z.object({
      map: z.string("map").optional(),
    }),
  )
  .and(propertyCreateFormSchema);

export const projectUpdateSchema = projectSchema.omit({
  userId: true,
  platforms: true,
  deletedAt: true,
});
export const projectUpdateFormSchema = projectUpdateSchema
  .omit({ propertyTypes: true })
  .and(
    z.object({
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
