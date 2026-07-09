import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalRequestController } from "./rental.controller";


const router = Router();

// Tenant Routes
router.post(
  "/",
  auth(Role.TENANT),
  RentalRequestController.createRentalRequest
);

router.get(
  "/",
  auth(Role.ADMIN),
  RentalRequestController.getAllRentalRequests
);

router.get(
  "/my",
  auth(Role.TENANT),
  RentalRequestController.getMyRentalRequests
);

router.delete(
  "/:id",
  auth(Role.TENANT),
  RentalRequestController.cancelRentalRequest
);

// Landlord Routes
router.get(
  "/landlord",
  auth(Role.LANDLORD),
  RentalRequestController.getRentalRequestsForLandlord
);

router.patch(
  "/:id/approve",
  auth(Role.LANDLORD),
  RentalRequestController.approveRentalRequest
);

router.patch(
  "/:id/reject",
  auth(Role.LANDLORD),
  RentalRequestController.rejectRentalRequest
);

export const RentalRequestRoutes = router;