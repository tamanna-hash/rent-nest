import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { UserController } from "./user.controller";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);

router.patch(
  "/:id/status",
  auth(Role.ADMIN),
  UserController.updateUserStatus
);

export const UserRoutes = router;