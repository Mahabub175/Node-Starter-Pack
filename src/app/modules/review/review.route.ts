import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidationSchemas } from "./review.validation";
import { reviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/reviews",
  auth("user"),
  validateRequest(reviewValidationSchemas.createReviewValidationSchema),
  reviewControllers.createReview
);

export const ReviewRoutes = router;
