import { Schema, model } from "mongoose";
import { TCourse } from "./course.interface";

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Category",
      trim: true,
    },
    price: { type: Number, required: true, trim: true },
    tags: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        isDeleted: {
          type: Boolean,
          default: false,
          trim: true,
        },
      },
    ],
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    durationInWeeks: { type: Number },
    details: {
      level: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const CourseModel = model<TCourse>("Course", courseSchema);
