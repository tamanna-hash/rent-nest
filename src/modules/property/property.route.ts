import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { PropertyController } from "./property.controller";

const router = Router();

// Public routes
router.get("/", PropertyController.getAllProperties);

router.get("/:id", PropertyController.getSingleProperty);

// Admin-only management (landlord management moved to /api/landlord/*)
router.patch(
  "/:id",
  auth(Role.ADMIN),
  PropertyController.updateProperty
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  PropertyController.deleteProperty
);

export const PropertyRoutes = router;
