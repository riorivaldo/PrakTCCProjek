import express from "express";
import {
  getGoalsByUser,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controller/goalController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Proteksi semua route goals
router.use(verifyToken);

router.get("/:userId", getGoalsByUser);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
