import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

//*profile routes
router.get("/profile", authMiddleware, ProfileController.index); //Private route
router.put("/profile/:id", authMiddleware, ProfileController.update);//update profile route

export default router;
