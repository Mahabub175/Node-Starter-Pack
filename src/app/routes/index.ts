import { Router } from "express";
import { CourseRoutes } from "../modules/course/course.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

router.use(CourseRoutes);
router.use(CategoryRoutes);
router.use(ReviewRoutes);
router.use(UserRoutes);

export default router;
