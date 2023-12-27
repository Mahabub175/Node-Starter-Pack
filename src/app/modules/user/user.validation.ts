import { z } from "zod";
import { userRole } from "./user.constants";

const createUserValidationSchema = z.object({
  username: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name must be a string",
  }),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password be a string",
  }),
  role: z.enum(userRole as [string, ...string[]]).optional(),
});

const userLoginValidationSchema = z.object({
  username: z.string({
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
