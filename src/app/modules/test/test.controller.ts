import { NextFunction, Request, Response } from "express";
import { testServices } from "./test.service";
import { testValidationSchemas } from "./test.validation";
import { uploadService } from "../upload/upload";

const uploadMiddleware = uploadService.single("attachment");

const createTestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }

    try {
      const data = req.body;

      const filePath = req.file ? req.file.path : undefined;

      const formData = {
        ...data,
        attachment: filePath,
      };

      const parseResult =
        testValidationSchemas.createTestSchema.safeParse(formData);

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parseResult.error.errors,
        });
      }

      const result = await testServices.createTestService(parseResult.data);

      res.status(200).json({
        success: true,
        message: "Test Created Successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  });
};

const getAllTestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const pageSize = limit ? parseInt(limit as string, 10) : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "email", "number"];

    const result = await testServices.getAllTestService(
      pageNumber,
      pageSize,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "Tests Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single test data
const getSingleTestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.params;
    const result = await testServices.getSingleTestService(testId);
    res.status(200).json({
      success: true,
      message: "Single Test Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//Update single test controller
const updateSingleTestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }
    try {
      const { testId } = req.params;
      const data = req.body;
      const filePath = req.file ? req.file.path : undefined;

      const testData = {
        ...data,
        attachment: filePath,
      };

      const result = await testServices.updateSingleTestService(
        testId,
        testData
      );

      res.status(200).json({
        success: true,
        message: "Single Test Updated Successfully!",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  });
};

//Delete single test controller
const deleteSingleTestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.params;
    await testServices.deleteSingleTestService(testId);
    res.status(200).json({
      success: true,
      message: "Single User Deleted Successfully!",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

//Delete many test controller
const deleteManyTestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testIds } = req.body;

    if (!Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty test IDs array provided",
        data: null,
      });
    }

    const result = await testServices.deleteManyTestsService(testIds);

    res.status(200).json({
      success: true,
      message: `Bulk Test Delete Successful! Deleted ${result.deletedCount} Tests.`,
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const testControllers = {
  createTestController,
  getAllTestController,
  getSingleTestController,
  updateSingleTestController,
  deleteSingleTestController,
  deleteManyTestsController,
};
