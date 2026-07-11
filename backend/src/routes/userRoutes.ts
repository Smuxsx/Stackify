import { Router } from "express";
import { syncUser } from "../controllers/userController.ts";
import { requireAuth } from "@clerk/express";

 
const router = Router();

// /Api/users/sync - POST => sync the clerk user to DB (Protected)
router.post("/sync", requireAuth() ,syncUser)

export default router;
