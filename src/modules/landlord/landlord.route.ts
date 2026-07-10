import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { LandlordController } from "./landlord.controller";

const router = Router();

// All landlord routes require LANDLORD role
router.use(auth(Role.LANDLORD));

// ── Properties ─────────────────────────────────────────────────────────────
router.post("/properties", LandlordController.createProperty);

router.get("/properties", LandlordController.getMyProperties);

router.put("/properties/:id", LandlordController.updateProperty);

router.delete("/properties/:id", LandlordController.deleteProperty);

// ── Rental Requests ─────────────────────────────────────────────────────────
router.get("/requests", LandlordController.getMyRequests);

router.patch("/requests/:id/approve", LandlordController.approveRequest);

router.patch("/requests/:id/reject", LandlordController.rejectRequest);

export const LandlordRoutes = router;
