import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ReviewServices } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewData = req.body;
    const result = await ReviewServices.createReviewIntoDB(reviewData);

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Review created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewControllers = {
  createReview,
};
