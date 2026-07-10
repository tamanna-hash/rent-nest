import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalRequestController } from "./rental.controller";

const router = Router();

// ── Tenant Routes ─────────────────────────────────────────────────────────────

// Submit a new rental request
router.post("/", auth(Role.TENANT), RentalRequestController.createRentalRequest);

// View own rental history
router.get("/my", auth(Role.TENANT), RentalRequestController.getMyRentalRequests);

// Cancel a pending request
router.delete("/:id", auth(Role.TENANT), RentalRequestController.cancelRentalRequest);

// ── Admin Routes ──────────────────────────────────────────────────────────────

// View all rental requests (landlord management moved to /api/landlord/requests)
router.get("/", auth(Role.ADMIN), RentalRequestController.getAllRentalRequests);

export const RentalRequestRoutes = router;
