import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { CategoryController } from "./category.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  CategoryController.createCategory
);

router.get(
  "/",
  CategoryController.getAllCategories
);

router.get(
  "/:id",
  CategoryController.getSingleCategory
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;