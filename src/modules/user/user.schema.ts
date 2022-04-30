import { object, string, TypeOf } from "zod";

/**
 * User Schema
 *  Username
 *  Email
 *  Password
 *  ConfirmPassword
 */

export const registerUserSchema = {
  body: object({
    username: string({
      required_error: "username is required",
    }),
    email: string({
      required_error: "username is required",
    }).email("must be a valid email"),
    password: string({
      required_error: "username is required",
    })
      .min(6, "Password must be at least 6 characters long")
      .max(128, "Password is longer than 128 characters"),
    confirmPassword: string({
      required_error: "username is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};

export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>;
