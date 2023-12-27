import { z } from "zod";

const createCourseValidationSchema = z.object({
  title: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  instructor: z.string({
    required_error: "Instructor is required",
    invalid_type_error: "Instructor must be a string",
  }),
  categoryId: z.string({
    required_error: "CategoryId is required",
    invalid_type_error: "CategoryId must be a string",
  }),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  tags: z.array(
    z.object({
      name: z.string({
        required_error: "Tag name is required",
        invalid_type_error: "Tag name must be a string",
      }),
      isDeleted: z.boolean().default(false),
    })
  ),
  startDate: z.string({ required_error: "Star Date is required" }),
  endDate: z.string({ required_error: "End is required" }),
  language: z.string({ required_error: "Language is required" }),
  provider: z.string({ required_error: "Provider is required" }),
  details: z.object({
    level: z.string({ required_error: "Details name is required" }),
    description: z.string({
      required_error: "Details description is required",
    }),
  }),
});

const updateCourseValidationSchema = z.object({
  title: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .optional(),
  instructor: z
    .string({
      required_error: "Instructor is required",
      invalid_type_error: "Instructor must be a string",
    })
    .optional(),
  categoryId: z
    .string({
      required_error: "CategoryId is required",
      invalid_type_error: "CategoryId must be a string",
    })
    .optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .optional(),
  tags: z
    .array(
      z
        .object({
          name: z.string({
            required_error: "Tag name is required",
            invalid_type_error: "Tag name must be a string",
          }),
          isDeleted: z.boolean().default(false),
        })
        .optional()
    )
    .optional(),
  startDate: z.string({ required_error: "Star Date is required" }).optional(),
  endDate: z.string({ required_error: "End is required" }).optional(),
  language: z.string({ required_error: "Language is required" }).optional(),
  provider: z.string({ required_error: "Provider is required" }).optional(),
  details: z
    .object({
      level: z
        .string({ required_error: "Details name is required" })
        .optional(),
      description: z
        .string({
          required_error: "Details description is required",
        })
        .optional(),
    })
    .optional(),
});

export const courseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
