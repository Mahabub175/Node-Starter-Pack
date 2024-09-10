import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { testValidationSchemas } from "./test.validation";
import { testControllers } from "./test.controller";

const router = express.Router();

router.post("/test/", testControllers.createTestController);

router.get("/test/", testControllers.getAllTestController);

router.get("/test/:testId/", testControllers.getSingleTestController);

router.patch("/test/:testId/", testControllers.updateSingleTestController);

router.delete("/test/:testId/", testControllers.deleteSingleTestController);

router.post("/test/bulk-delete/", testControllers.deleteManyTestsController);

export const testRoutes = router;
