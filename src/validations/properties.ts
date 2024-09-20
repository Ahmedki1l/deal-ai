import { propertyTypesArr } from "@/db/enums";
import { z } from "@/lib/zod";

export const propertySchema = z.object(
  // <Record<keyof Property, any>>
  {
    id: z.string("id"),
    projectId: z.string("projectId"),
    title: z.string("title"),

    type: z.enum(propertyTypesArr),
    units: z.string("units"),
    space: z.string("space"),
    finishing: z.string("finishing"),
    floors: z.string("floors"),
    rooms: z.string("rooms"),
    bathrooms: z.string("bathrooms"),
    receptions: z.string("receptions").optional(),
    garden: z.string("garden").optional(),
    pool: z.string("hashtags").optional(),
    view: z.string("view").optional(),

    deletedAt: z.date("deletedAt").nullable(),
  },
);

export const propertyCreateSchema = propertySchema.pick({
  projectId: true,
  title: true,
  type: true,
  units: true,
  space: true,
  finishing: true,
  floors: true,
  rooms: true,
  bathrooms: true,
  receptions: true,
  garden: true,
  pool: true,
  view: true,
});

export const propertyCreateFormSchema = z.object({
  types: z.array(
    z.object({
      value: z.enum(propertyTypesArr),
      properties: z.array(propertyCreateSchema.omit({ type: true })),
    }),
  ),
});

export const propertyUpdateSchema = propertySchema.omit({
  projectId: true,
  deletedAt: true,
});
export const propertyDeleteSchema = propertySchema.pick({ id: true });
export const propertyBinSchema = propertySchema.pick({
  id: true,
  deletedAt: true,
});
export const propertyRestoreSchema = propertySchema.pick({
  id: true,
});
