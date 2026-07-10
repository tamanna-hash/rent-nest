import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = Router();

// All admin routes require ADMIN role
router.use(auth(Role.ADMIN));

// ── Users ──────────────────────────────────────────
router.get("/users", AdminController.getAllUsers);

router.patch("/users/:id", AdminController.updateUserStatus);

// ── Properties ─────────────────────────────────────
router.get("/properties", AdminController.getAllProperties);

// ── Rental Requests ────────────────────────────────
router.get("/rentals", AdminController.getAllRentalRequests);

router.get("/payments", AdminController.getAllPayments);

export const AdminRoutes = router;
