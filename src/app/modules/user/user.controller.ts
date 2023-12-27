import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await userServices.createUserIntoDb(userData);

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

export const userControllers = {
  createUser,
};
