import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { authController } from "./auth.controller";


const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.get(
    "/me",
    auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
    authController.getMyProfile
);

router.patch(
    "/me",
    auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
    authController.updateMyProfile
);
export const authRoutes = router;