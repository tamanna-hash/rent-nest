import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { RentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { RentalRequestValidation } from "./rentalRequest.validation";

const router = Router();

// Tenant
router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(RentalRequestValidation.createRentalRequestValidationSchema),
  RentalRequestController.createRentalRequest
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

// Landlord
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