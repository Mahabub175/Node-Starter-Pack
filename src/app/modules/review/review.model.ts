import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Course",
      trim: true,
    },
    rating: { type: Number, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = model<TReview>("Review", reviewSchema);
