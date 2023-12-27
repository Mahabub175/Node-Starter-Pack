import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchemas } from "./user.validation";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/auth/register",
  validateRequest(userValidationSchemas.createUserValidationSchema),
  userControllers.createUser
);

export const UserRoutes = router;
