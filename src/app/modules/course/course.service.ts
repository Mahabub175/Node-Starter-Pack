import mongoose, { Types } from "mongoose";
import { CategoryModel } from "../category/category.model";
import { ReviewModel } from "../review/review.model";
import { TCourse } from "./course.interface";
import { CourseModel } from "./course.model";
import { calculateWeeks } from "../../utils/calculateWeeks";

const createCourseIntoDB = async (courseData: TCourse) => {
  const categoryExists = await CategoryModel.findById({
    _id: courseData.categoryId,
  });
  if (categoryExists) {
    if ((courseData?.startDate, courseData?.endDate)) {
      const durationInWeeks = calculateWeeks(
        courseData?.startDate,
        courseData?.endDate
      );
      const newData = { ...courseData, durationInWeeks };
      const result = await CourseModel.create(newData);
      return result;
    }
  } else {
    throw new Error("Invalid CategoryId");
  }
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  let queryObj = { ...query };

  const deleteFieldFromQuery = ["limit", "page", "sortBy", "sortOrder"];
  deleteFieldFromQuery.forEach((item) => delete queryObj[item]);

  if (queryObj?.level) {
    queryObj["details.level"] = queryObj["level"];
    delete queryObj["level"];
  }
  if (queryObj?.tags) {
    queryObj["tags"] = {
      $elemMatch: {
        name: queryObj["tags"],
      },
    };
  }

  if (queryObj?.startDate && queryObj?.endDate) {
    queryObj.startDate = { $gte: queryObj.startDate };
    queryObj.endDate = { $lte: queryObj.endDate };
  }

  if (queryObj?.maxPrice && queryObj?.minPrice) {
    const bothValue = {
      $and: [
        {
          price: { $gte: queryObj.minPrice },
        },
        {
          price: { $lte: queryObj.maxPrice },
        },
      ],
    };
    delete queryObj["minPrice"];
    delete queryObj["maxPrice"];
    queryObj = { ...bothValue };
  } else if (queryObj?.minPrice) {
    queryObj["price"] = { $gte: queryObj.minPrice };
    delete queryObj["minPrice"];
  } else if (queryObj?.maxPrice) {
    queryObj["price"] = { $lte: queryObj.maxPrice };
    delete queryObj["maxPrice"];
  }

  const result = CourseModel.find(queryObj).populate("categoryId");

  let limit = 10;
  let page = 1;

  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
  }
  const skip = (page - 1) * limit;
  let paginateData = result.skip(skip).limit(limit);

  if (query.sortBy) {
    const sortBy = query.sortBy as string;
    let sortOrder = "asc";
    if (query.sortOrder) {
      sortOrder = query.sortOrder as string;
    }
    const sortOption: { [key: string]: string } = {};
    sortOption[sortBy] = sortOrder;
    paginateData = paginateData.sort(sortOption as { $meta: any });
  }

  const total = await CourseModel.countDocuments(queryObj);

  const meta = {
    page,
    limit,
    total,
  };

  return {
    data: await paginateData,
    meta,
  };
};

const getSingleCourseWithReviewFromDB = async (courseId: string) => {
  const singleCourse = await CourseModel.findById(courseId);
  if (singleCourse) {
    const validCourseId = new Types.ObjectId(courseId);
    const reviews = await ReviewModel.aggregate([
      { $match: { courseId: validCourseId } },
      {
        $project: {
          _id: 0,
          courseId: 1,
          rating: 1,
          review: 1,
        },
      },
    ]);
    const result = { singleCourse, reviews };
    return result;
  } else {
    throw new Error("Invalid CourseId");
  }
};

const updateCourseIntoDB = async (
  courseId: string,
  courseData: Partial<TCourse>
) => {
  const {
    details,
    tags,
    startDate,
    endDate,
    durationInWeeks,
    ...remainingData
  } = courseData;

  const courseExists = await CourseModel.findById(courseId);

  if (courseExists) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (durationInWeeks) {
        throw new Error("You cannot change course duration manually!");
      }

      const modifiedUpdatedData: Record<string, unknown> = { ...remainingData };

      if (details && Object.keys(details).length) {
        for (const [key, value] of Object.entries(details)) {
          modifiedUpdatedData[`details.${key}`] = value;
        }
      }

      if (startDate || endDate) {
        if (startDate && endDate) {
          const durationInWeeks = calculateWeeks(startDate, endDate);

          const updateCourseDuration = await CourseModel.findByIdAndUpdate(
            courseId,
            { durationInWeeks, startDate, endDate },
            {
              new: true,
              runValidators: true,
              session,
            }
          );
          if (!updateCourseDuration) {
            throw new Error("Failed to update");
          }
        } else if (startDate) {
          const getNonUpdatedCourse = await CourseModel.findById(courseId);
          if (!getNonUpdatedCourse) {
            throw new Error("This course does not exist!");
          }

          const durationInWeeks = calculateWeeks(
            startDate,
            getNonUpdatedCourse.endDate
          );

          const updateCourseDuration = await CourseModel.findByIdAndUpdate(
            courseId,
            { durationInWeeks, startDate },
            {
              new: true,
              runValidators: true,
              session,
            }
          );
          if (!updateCourseDuration) {
            throw new Error("Failed to update");
          }
        } else if (endDate) {
          const getCourseBeforeUpdated = await CourseModel.findById(courseId);
          if (!getCourseBeforeUpdated) {
            throw new Error("This course does not exist!");
          }

          const durationInWeeks = calculateWeeks(
            getCourseBeforeUpdated.startDate,
            endDate
          );

          const updateCourseDuration = await CourseModel.findByIdAndUpdate(
            courseId,
            { durationInWeeks, endDate },
            {
              new: true,
              runValidators: true,
              session,
            }
          );
          if (!updateCourseDuration) {
            throw new Error("Failed to update");
          }
        }
      }

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        modifiedUpdatedData,
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!updatedCourse) {
        throw new Error("Failed to update course!");
      }

      if (tags && tags.length > 0) {
        const updatedTags = tags.filter((tag) => tag.name && !tag.isDeleted);

        const updateTags = await CourseModel.findByIdAndUpdate(
          courseId,
          {
            $set: { tags: updatedTags },
          },
          {
            new: true,
            runValidators: true,
            session,
          }
        );

        if (!updateTags) {
          throw new Error("Failed to update tags in the course!");
        }
      }

      await session.commitTransaction();
      await session.endSession();

      const result = await CourseModel.findById(courseId);

      return result;
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(error);
    }
  } else {
    throw new Error("Course not found!");
  }
};

const getBestCourseFromDB = async () => {
  const bestCourse = await ReviewModel.aggregate([
    {
      $group: {
        _id: "$courseId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
  ]);

  const result = bestCourse.map((item) => {
    return {
      course: item.course[0],
      averageRating: parseFloat(item.averageRating.toFixed(1)),
      reviewCount: item.reviewCount,
    };
  });

  return result[0];
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getSingleCourseWithReviewFromDB,
  getBestCourseFromDB,
  updateCourseIntoDB,
};
