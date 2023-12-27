import { NextFunction, Request, Response, query } from "express";
import { CourseServices } from "./course.service";
import httpStatus from "http-status";

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseData = req.body;
    const result = await CourseServices.createCourseIntoDB(courseData);

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Course created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req;
    const result = await CourseServices.getAllCourseFromDB(query);

    const { data, meta } = result;

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully!",
      meta,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleCourseWithReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const result = await CourseServices.getSingleCourseWithReviewFromDB(
      courseId
    );

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Course and Reviews retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const courseData = req.body;
    const result = await CourseServices.updateCourseIntoDB(
      courseId,
      courseData
    );
    res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getBestCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CourseServices.getBestCourseFromDB();
    res.status(200).json({
      success: true,
      message: "Best course retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const courseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourseWithReviews,
  getBestCourse,
  updateCourse,
};
