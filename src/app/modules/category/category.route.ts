import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryControllers } from "./category.controller";
import { categoryValidationSchemas } from "./category.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/categories",
  auth("admin"),
  validateRequest(categoryValidationSchemas.createCategoryValidationSchema),
  categoryControllers.createCategory
);
router.get("/categories", categoryControllers.getAllCategory);

export const CategoryRoutes = router;
