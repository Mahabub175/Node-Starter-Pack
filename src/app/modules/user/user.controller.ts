import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import httpStatus from "http-status";
import { upload } from "../upload/upload";

const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    const result = await userServices.createUserService(userData);

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User registered successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    const result = await userServices.loginUserService(userData);

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successful!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    const { userId } = req.user;
    const result = await userServices.changeUserPasswordService(
      userId,
      userData
    );

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page
      ? parseInt(req.query.page as string, 10)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;

    const searchText = req.query.searchText as string | undefined;

    const searchFields = ["name", "email"];

    const result = await userServices.getAllUserService(
      page,
      limit,
      searchText,
      searchFields
    );

    res.status(200).json({
      success: true,
      message: "All Users Fetched Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single test data
const getSingleUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const result = await userServices.getSingleUserService(userId);

    res.status(200).json({
      success: true,
      message: "Single User Fetched Successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUserStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const categoryData = {
      status,
    };

    const result = await userServices.updateUserStatusService(userId, status);

    res.status(200).json({
      success: true,
      message: "User Status Updated Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateSingleUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("profile_image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }

    try {
      const { userId } = req.params;
      const data = req.body;

      const filePath = req.file ? req.file.path : undefined;

      const userData = {
        ...data,
        profile_image: filePath,
      };

      const result = await userServices.updateSingleUserService(
        userId,
        userData
      );

      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  });
};

export const userControllers = {
  createUserController,
  loginUserController,
  changeUserPasswordController,
  getAllUserController,
  getSingleUserController,
  updateUserStatusController,
  updateSingleUserController,
};
