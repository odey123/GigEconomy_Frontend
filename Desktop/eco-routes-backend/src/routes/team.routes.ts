import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { validateCreateTeamUser } from "../middleware/validate.middleware";
import * as teamController from "../controllers/team.controller";

const router = Router();

router.use(protect, restrictTo("admin", "super_admin"));

router.get("/users", teamController.getAllTeamUsers);
router.post("/users", validateCreateTeamUser, teamController.createTeamUser);
router.get("/users/:id", teamController.getTeamUserById);
router.put("/users/:id", teamController.updateTeamUser);
router.patch("/users/:id/toggle-status", teamController.toggleUserStatus);
router.delete("/users/:id", restrictTo("super_admin"), teamController.deleteTeamUser);

export default router;
