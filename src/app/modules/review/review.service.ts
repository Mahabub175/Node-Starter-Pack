import { JwtPayload } from "jsonwebtoken";
import { CourseModel } from "../course/course.model";
import { TReview } from "./review.interface";
import { ReviewModel } from "./review.model";
import { userModel } from "../user/user.model";

const createReviewIntoDB = async (
  reviewData: TReview,
  userData: JwtPayload
) => {
  const userInfo = await userModel.findById(userData?.userId);
  const courseExist = await CourseModel.findById(reviewData.courseId);

  if (courseExist) {
    const updatedData = {
      ...reviewData,
      createdBy: userInfo?._id,
    };
    const data = await ReviewModel.create(updatedData);
    const result = {
      _id: data._id,
      courseId: data.courseId,
      rating: data.rating,
      review: data.review,
      createdBy: {
        userId: userInfo?._id,
        username: userInfo?.username,
        email: userInfo?.email,
        role: userInfo?.role,
      },
    };
    return result;
  } else {
    throw new Error("Invalid CourseId");
  }
};

export const ReviewServices = {
  createReviewIntoDB,
};
