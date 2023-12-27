import { CourseModel } from "../course/course.model";
import { TReview } from "./review.interface";
import { ReviewModel } from "./review.model";

const createReviewIntoDB = async (reviewData: TReview) => {
  const courseExist = await CourseModel.findById(reviewData.courseId);

  if (courseExist) {
    const data = await ReviewModel.create(reviewData);
    const result = {
      _id: data._id,
      courseId: data.courseId,
      rating: data.rating,
      review: data.review,
    };
    return result;
  } else {
    throw new Error("Invalid CourseId");
  }
};

export const ReviewServices = {
  createReviewIntoDB,
};
