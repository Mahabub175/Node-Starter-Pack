import { z } from "zod";

const createCategoryValidationSchema = z.object({
  name: z.string({
    required_error: "Category name is required",
    invalid_type_error: "Category name must be a string",
  }),
});

export const categoryValidationSchemas = {
  createCategoryValidationSchema,
};
