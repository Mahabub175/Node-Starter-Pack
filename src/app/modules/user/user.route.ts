import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchemas } from "./user.validation";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/auth/register",
  validateRequest(userValidationSchemas.createUserValidationSchema),
  userControllers.createUser
);

router.post(
  "/auth/login",
  validateRequest(userValidationSchemas.userLoginValidationSchema),
  userControllers.loginUser
);

router.post(
  "/auth/change-password",
  auth("user", "admin"),
  validateRequest(userValidationSchemas.changePasswordValidationSchema),
  userControllers.changeUserPassword
);

export const UserRoutes = router;
