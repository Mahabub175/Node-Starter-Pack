import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidationSchemas } from "./review.validation";
import { reviewControllers } from "./review.controller";

const router = express.Router();

router.post(
  "/reviews",
  validateRequest(reviewValidationSchemas.createReviewValidationSchema),
  reviewControllers.createReview
);

export const ReviewRoutes = router;
