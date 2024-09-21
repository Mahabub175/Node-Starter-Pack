import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchemas } from "./user.validation";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/auth/register/",
  validateRequest(userValidationSchemas.createUserValidationSchema),
  userControllers.createUserController
);

router.post(
  "/auth/login/",
  validateRequest(userValidationSchemas.userLoginValidationSchema),
  userControllers.loginUserController
);

router.post(
  "/auth/change-password/",
  auth("user", "admin"),
  validateRequest(userValidationSchemas.changePasswordValidationSchema),
  userControllers.changeUserPasswordController
);

router.post(
  "/auth/forgot-password/",
  validateRequest(userValidationSchemas.forgetPasswordValidationSchema),
  userControllers.forgetPasswordController
);

router.post(
  "/auth/reset-password/",
  validateRequest(userValidationSchemas.resetPasswordValidationSchema),
  userControllers.resetPasswordController
);

router.get("/auth/user/", userControllers.getAllUserController);

router.get("/auth/user/:userId/", userControllers.getSingleUserController);

router.patch(
  "/auth/user/status/:userId/",
  userControllers.updateUserStatusController
);

router.patch("/auth/user/:userId/", userControllers.updateSingleUserController);

export const userRoutes = router;
