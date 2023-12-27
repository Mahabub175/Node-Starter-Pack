import { z } from "zod";

const createReviewValidationSchema = z.object({
  courseId: z.string({
    required_error: "CourseId is required",
    invalid_type_error: "CourseId must be a string",
  }),
  rating: z.number({
    required_error: "Rating is required",
    invalid_type_error: "Rating must be a number",
  }),
  review: z.string({
    required_error: "Review is required",
    invalid_type_error: "Review must be a string",
  }),
});

export const reviewValidationSchemas = {
  createReviewValidationSchema,
};
