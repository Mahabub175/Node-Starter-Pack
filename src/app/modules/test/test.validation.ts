import { z } from "zod";

const createTestValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  number: z.union(
    [
      z.string().min(11, { message: "Number must have 11 characters" }),
      z.number().min(11, { message: "Number must have 11 characters" }),
    ],
    {
      required_error: "Number is required",
      invalid_type_error: "Number must be a string or a number",
    }
  ),
  attachment: z.string().optional(),
});

export const testValidationSchemas = {
  createTestSchema: createTestValidationSchema,
};
