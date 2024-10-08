import { z } from "@/lib/zod";

export const userSchema = z.object(
  // <
  //   Record<keyof Omit<User, "googleId" | "createdAt">, any>
  // >
  {
    id: z.string("id"),
    name: z.string("name"),
    image: z.string("image"),
    email: z.string("email").email("invalid email."),
    password: z
      .string("password")
      .min(6, "strong password can't be less than 6 characters.")
      .max(20, "ooh, 20 characters. make it less."),
  },
);

export const userAuthLoginSchema = userSchema.pick({
  email: true,
  password: true,
});

export const userAuthRegisterSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const userUpdateProfilePersonalSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
});
export const userUpdateProfilePasswordSchema = userSchema.pick({
  id: true,
  password: true,
});

export const userUpdateProfilePasswordFormSchema =
  userUpdateProfilePasswordSchema.omit({ password: true }).and(
    z.object({
      newPassword: z.string("new password"),
      confirmNewPassword: z.string("confirm new password"),
    }),
  );
