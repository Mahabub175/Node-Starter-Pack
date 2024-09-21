import { Router } from "express";
import { testRoutes } from "../modules/test/test.route";
import { uploadRoutes } from "../modules/upload/upload.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

const routes = [testRoutes, uploadRoutes, userRoutes];

routes.forEach((route) => {
  router.use(route);
});

export default router;
