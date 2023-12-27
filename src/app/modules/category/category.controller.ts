import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryServices } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryData = req.body;
    const result = await CategoryServices.createCategoryIntoDB(categoryData);
    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Category created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryServices.getAllCategoryFromDB();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryControllers = {
  createCategory,
  getAllCategory,
};
