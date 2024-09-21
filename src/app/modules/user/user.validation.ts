import { z } from "zod";
import { userRole } from "./user.constants";

const createUserValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
  role: z.enum(userRole as [string, ...string[]]).optional(),
});

const userLoginValidationSchema = z.object({
  email: z.string({
    required_error: "email is required",
    invalid_type_error: "email must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password mus be a string",
  }),
});

const changePasswordValidationSchema = z.object({
  current_password: z
    .string({
      required_error: "Current password is required",
      invalid_type_error: "Current password must be a string",
    })
    .min(6, {
      message: "Current password must be at least 6 characters long",
    }),
  new_password: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a string",
    })
    .min(6, {
      message: "New password must be at least 6 characters long",
    }),
});

export const userValidationSchemas = {
  createUserValidationSchema,
  userLoginValidationSchema,
  changePasswordValidationSchema,
};
