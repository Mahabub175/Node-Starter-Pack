import { z } from "zod";
import { userRole } from "./user.constants";

const createUserValidationSchema = z.object({
  username: z
    .string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    })
    .min(1, { message: "User name cannot be empty" })
    .refine((value) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(value), {
      message:
        "User name must start with a letter and can contain only letters and numbers",
    }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .min(1, { message: "User name cannot be empty" })
    .refine((value) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(value), {
      message: "User name must contain at least one letter",
    }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password be a string",
  }),
  role: z.enum(userRole as [string, ...string[]]).optional(),
});

const userLoginValidationSchema = z.object({
  usernameOrEmail: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password be a string",
  }),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string({
    required_error: "Current password is required",
    invalid_type_error: "Current password be a string",
  }),
  newPassword: z.string({
    required_error: "New password is required",
    invalid_type_error: "New password be a string",
  }),
});

export const userValidationSchemas = {
  createUserValidationSchema,
  userLoginValidationSchema,
  changePasswordValidationSchema,
};
